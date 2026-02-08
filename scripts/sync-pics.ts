#!/usr/bin/env bun
/**
 * sync-pics.ts
 *
 * Processes images from src/content/images/, generates responsive variants
 * (webp + jpeg at 800/1200/2000px + original-res jpeg), extracts EXIF
 * metadata (never GPS), uploads to R2 via wrangler, and writes a manifest
 * .ts file that the /pics page imports directly.
 *
 * Idempotent: skips images whose SHA-256 hash matches the manifest.
 * Pass --force to re-upload everything (useful if R2 bucket was cleared).
 *
 * Usage:
 *   bun run scripts/sync-pics.ts
 *   bun run scripts/sync-pics.ts --force
 *
 * Requires: wrangler authenticated (wrangler login)
 * Config: R2_BUCKET env var (default: nyx-pics), R2_PUBLIC_URL env var
 */

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import * as exifr from 'exifr';

// ── Config ──────────────────────────────────────────────────────────

const IMAGES_DIR = join(import.meta.dir, '..', 'src', 'content', 'images');
const MANIFEST_PATH = join(IMAGES_DIR, 'manifest.ts');
const SUPPORTED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.tiff', '.webp', '.heif', '.avif']);
const WIDTHS = [2000, 1200, 800] as const;
const FORMATS = ['webp', 'jpeg'] as const;
const R2_BUCKET = process.env.R2_BUCKET ?? 'nyx-pics';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL ?? 'https://assets.jsn.cam';
const FORCE = process.argv.includes('--force');
const CONCURRENCY = 4;

// ── Types ───────────────────────────────────────────────────────────

interface ExifData {
	camera: string | null;
	aperture: number | null;
	shutterSpeed: string | null;
	iso: number | null;
	focalLength: number | null;
	dateTaken: string | null;
}

interface ImageVariant {
	width: number;
	format: 'webp' | 'jpeg';
	url: string;
	size?: number;
}

interface ManifestEntry {
	id: string;
	hash: string;
	originalWidth: number;
	originalHeight: number;
	alt: string;
	exif: ExifData;
	variants: ImageVariant[];
}

interface Manifest {
	version: 1;
	r2BaseUrl: string;
	images: ManifestEntry[];
}

// ── Helpers ─────────────────────────────────────────────────────────

function sha256(buffer: Buffer): string {
	return 'sha256:' + createHash('sha256').update(buffer).digest('hex');
}

function hashHex(hash: string): string {
	return hash.startsWith('sha256:') ? hash.slice(7) : hash;
}

/** Convert ExposureTime (e.g. 0.004) to a fraction string (e.g. "1/250") */
function formatShutterSpeed(exposure: number | undefined): string | null {
	if (exposure === undefined || exposure === null) return null;
	if (exposure >= 1) return `${exposure}`;
	const denominator = Math.round(1 / exposure);
	return `1/${denominator}`;
}

/** Combine Make + Model, dedup when Model already includes Make */
function formatCamera(make: string | undefined, model: string | undefined): string | null {
	if (!make && !model) return null;
	if (!make) return model!.trim();
	if (!model) return make.trim();
	const trimmedMake = make.trim();
	const trimmedModel = model.trim();
	if (trimmedModel.toLowerCase().startsWith(trimmedMake.toLowerCase())) {
		return trimmedModel;
	}
	return `${trimmedMake} ${trimmedModel}`;
}

async function extractExif(buffer: Buffer): Promise<ExifData> {
	try {
		const parsed = await exifr.parse(buffer, {
			pick: ['Make', 'Model', 'FNumber', 'ExposureTime', 'ISO', 'FocalLength', 'DateTimeOriginal'],
			gps: false
		});

		if (!parsed) {
			return {
				camera: null,
				aperture: null,
				shutterSpeed: null,
				iso: null,
				focalLength: null,
				dateTaken: null
			};
		}

		return {
			camera: formatCamera(parsed.Make, parsed.Model),
			aperture: parsed.FNumber ?? null,
			shutterSpeed: formatShutterSpeed(parsed.ExposureTime),
			iso: parsed.ISO ?? null,
			focalLength: parsed.FocalLength ?? null,
			dateTaken: parsed.DateTimeOriginal
				? new Date(parsed.DateTimeOriginal).toISOString().slice(0, 10)
				: null
		};
	} catch {
		return {
			camera: null,
			aperture: null,
			shutterSpeed: null,
			iso: null,
			focalLength: null,
			dateTaken: null
		};
	}
}

/** Upload a buffer to R2 via wrangler CLI (uses existing OAuth auth) */
async function uploadToR2(
	buffer: Buffer,
	r2Path: string,
	contentType: string,
	retries = 3
): Promise<void> {
	for (let attempt = 1; attempt <= retries; attempt++) {
		const proc = Bun.spawn(
			[
				'wrangler',
				'r2',
				'object',
				'put',
				`${R2_BUCKET}/${r2Path}`,
				'--pipe',
				'--content-type',
				contentType,
				'--remote'
			],
			{ stdin: buffer, stdout: 'ignore', stderr: 'pipe' }
		);

		const exitCode = await proc.exited;
		if (exitCode === 0) return;

		const stderr = await new Response(proc.stderr).text();
		if (attempt < retries) {
			console.warn(`  Retry ${attempt}/${retries} for ${r2Path}: ${stderr.trim()}`);
			await Bun.sleep(1000 * attempt);
		} else {
			throw new Error(`wrangler upload failed for ${r2Path} after ${retries} attempts: ${stderr}`);
		}
	}
}

async function saveManifest(manifest: Manifest): Promise<void> {
	const json = JSON.stringify(manifest, null, '\t');
	const ts = `// Generated by sync-pics.ts — do not edit manually

interface ExifData {
	camera: string | null;
	aperture: number | null;
	shutterSpeed: string | null;
	iso: number | null;
	focalLength: number | null;
	dateTaken: string | null;
}

interface ImageVariant {
	width: number;
	format: 'webp' | 'jpeg';
	url: string;
	size?: number;
}

interface ManifestEntry {
	id: string;
	hash: string;
	originalWidth: number;
	originalHeight: number;
	alt: string;
	exif: ExifData;
	variants: ImageVariant[];
}

interface Manifest {
	version: number;
	r2BaseUrl: string;
	images: ManifestEntry[];
}

const manifest: Manifest = ${json};

export default manifest;
`;
	await writeFile(MANIFEST_PATH, ts);
}

/** Process a single image: resize, extract EXIF, upload variants */
async function processImage(
	filename: string,
	existingById: Map<string, ManifestEntry>
): Promise<ManifestEntry | null> {
	const filepath = join(IMAGES_DIR, filename);
	const id = basename(filename, extname(filename));
	const buffer = Buffer.from(await readFile(filepath));
	const hash = sha256(buffer);

	const existing = existingById.get(id);
	if (!FORCE && existing && existing.hash === hash) {
		return null; // signal: skipped
	}

	console.log(`Processing: ${filename}`);

	const metadata = await sharp(buffer).metadata();
	const originalWidth = metadata.width ?? 0;
	const originalHeight = metadata.height ?? 0;
	const exifData = await extractExif(buffer);

	// Preserve manually edited alt text from previous entry (non-empty = edited)
	const previousEntry = existingById.get(id);
	const alt = previousEntry && previousEntry.alt !== '' ? previousEntry.alt : '';

	const hex = hashHex(hash);
	const hashPrefix = hex.slice(0, 8);
	const variants: ImageVariant[] = [];
	const uploadPromises: Promise<void>[] = [];

	for (const width of WIDTHS) {
		if (width > originalWidth) continue;

		const resized = sharp(buffer).resize(width);

		for (const format of FORMATS) {
			const ext = format === 'jpeg' ? 'jpg' : format;
			const r2Path = `pics/${hashPrefix}/${width}.${ext}`;
			const contentType = format === 'webp' ? 'image/webp' : 'image/jpeg';

			let outputBuffer: Buffer;
			if (format === 'webp') {
				outputBuffer = await resized.clone().webp({ quality: 80 }).toBuffer();
			} else {
				outputBuffer = await resized.clone().jpeg({ quality: 80 }).toBuffer();
			}

			uploadPromises.push(uploadToR2(outputBuffer, r2Path, contentType));
			variants.push({ width, format, url: `/${r2Path}` });
		}
	}

	// Original-resolution JPEG variant with file size
	const originalJpeg = await sharp(buffer).jpeg({ quality: 85 }).toBuffer();
	const originalR2Path = `pics/${hashPrefix}/${originalWidth}.jpg`;
	uploadPromises.push(uploadToR2(originalJpeg, originalR2Path, 'image/jpeg'));
	variants.push({
		width: originalWidth,
		format: 'jpeg',
		url: `/${originalR2Path}`,
		size: originalJpeg.length
	});

	await Promise.all(uploadPromises);

	console.log(`  Uploaded ${variants.length} variants (${exifData.camera ?? 'unknown camera'})`);

	return { id, hash, originalWidth, originalHeight, alt, exif: exifData, variants };
}

/** Run async tasks with bounded concurrency */
async function parallelMap<T, R>(
	items: T[],
	concurrency: number,
	fn: (item: T) => Promise<R>
): Promise<R[]> {
	const results: R[] = new Array(items.length);
	let next = 0;

	async function worker() {
		while (next < items.length) {
			const idx = next++;
			results[idx] = await fn(items[idx]);
		}
	}

	await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
	return results;
}

// ── Main ────────────────────────────────────────────────────────────

async function main() {
	if (FORCE) console.log('--force: re-uploading all images regardless of manifest state\n');

	let manifest: Manifest;
	try {
		const mod = await import(MANIFEST_PATH);
		manifest = { ...mod.default };
		manifest.images = [...manifest.images];
	} catch {
		manifest = { version: 1, r2BaseUrl: R2_PUBLIC_URL, images: [] };
	}

	manifest.r2BaseUrl = R2_PUBLIC_URL;

	const existingById = new Map<string, ManifestEntry>();
	for (const entry of manifest.images) {
		existingById.set(entry.id, entry);
	}

	const files = await readdir(IMAGES_DIR);
	const imageFiles = files.filter((f) => SUPPORTED_EXTENSIONS.has(extname(f).toLowerCase()));

	console.log(`Found ${imageFiles.length} images in ${IMAGES_DIR}`);
	console.log(`Processing with concurrency ${CONCURRENCY}\n`);

	const results = await parallelMap(imageFiles, CONCURRENCY, (filename) =>
		processImage(filename, existingById)
	);

	// Build updated entries preserving disk order
	const updatedEntries: ManifestEntry[] = [];
	let uploaded = 0;
	let skipped = 0;

	for (let i = 0; i < imageFiles.length; i++) {
		const result = results[i];
		if (result === null) {
			// Skipped, keep existing
			const id = basename(imageFiles[i], extname(imageFiles[i]));
			updatedEntries.push(existingById.get(id)!);
			skipped++;
		} else {
			updatedEntries.push(result);
			uploaded++;
		}
	}

	// Check for removed images
	const currentIds = new Set(imageFiles.map((f) => basename(f, extname(f))));
	const removed = manifest.images.filter((entry) => !currentIds.has(entry.id));
	if (removed.length > 0) {
		console.log(`\nRemoved ${removed.length} images no longer on disk:`);
		for (const entry of removed) {
			console.log(`  - ${entry.id}`);
		}
	}

	manifest.images = updatedEntries;
	await saveManifest(manifest);

	console.log(`\nDone. ${uploaded} uploaded, ${skipped} skipped, ${removed.length} removed.`);
	console.log(`Manifest written to ${MANIFEST_PATH}`);
}

main().catch((err) => {
	console.error('Fatal error:', err);
	process.exit(1);
});
