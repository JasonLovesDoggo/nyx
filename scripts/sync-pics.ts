#!/usr/bin/env bun
/**
 * sync-pics.ts
 *
 * Processes images from src/content/images/, generates responsive variants
 * (webp + jpeg at 800/1200/2000px), extracts EXIF metadata (never GPS),
 * uploads to R2 via wrangler, and writes a manifest JSON that the /pics page consumes.
 *
 * Idempotent: skips images whose SHA-256 hash matches the manifest.
 *
 * Usage: bun run scripts/sync-pics.ts
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
const MANIFEST_PATH = join(IMAGES_DIR, 'manifest.json');
const SUPPORTED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.tiff', '.webp', '.heif', '.avif']);
const WIDTHS = [2000, 1200, 800] as const;
const FORMATS = ['webp', 'jpeg'] as const;
const R2_BUCKET = process.env.R2_BUCKET ?? 'nyx-pics';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL ?? 'https://pcdn.jsn.cam';

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
	return createHash('sha256').update(buffer).digest('hex');
}

function autoAlt(filename: string): string {
	return filename.replace(/[-_]/g, ' ');
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
				contentType
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
	await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, '\t') + '\n');
}

// ── Main ────────────────────────────────────────────────────────────

async function main() {
	// Load existing manifest
	let manifest: Manifest;
	try {
		const raw = await readFile(MANIFEST_PATH, 'utf-8');
		manifest = JSON.parse(raw);
	} catch {
		manifest = { version: 1, r2BaseUrl: R2_PUBLIC_URL, images: [] };
	}

	// Always update the base URL from env
	manifest.r2BaseUrl = R2_PUBLIC_URL;

	const existingById = new Map<string, ManifestEntry>();
	for (const entry of manifest.images) {
		existingById.set(entry.id, entry);
	}

	// Discover images on disk
	const files = await readdir(IMAGES_DIR);
	const imageFiles = files.filter((f) => {
		const ext = extname(f).toLowerCase();
		return SUPPORTED_EXTENSIONS.has(ext);
	});

	console.log(`Found ${imageFiles.length} images in ${IMAGES_DIR}`);

	const updatedEntries: ManifestEntry[] = [];
	let uploaded = 0;
	let skipped = 0;

	// Process sequentially to keep sharp memory under control
	for (const filename of imageFiles) {
		const filepath = join(IMAGES_DIR, filename);
		const id = basename(filename, extname(filename));
		const buffer = Buffer.from(await readFile(filepath));
		const hash = sha256(buffer);

		// Check if this exact content is already processed
		const existing = existingById.get(id);
		if (existing && existing.hash === hash) {
			skipped++;
			updatedEntries.push(existing);
			continue;
		}

		console.log(`Processing: ${filename}`);

		// Get original dimensions
		const metadata = await sharp(buffer).metadata();
		const originalWidth = metadata.width ?? 0;
		const originalHeight = metadata.height ?? 0;

		// Extract EXIF
		const exifData = await extractExif(buffer);

		// Preserve manually edited alt text if the image ID existed before
		const previousEntry = existingById.get(id);
		let alt: string;
		if (previousEntry && previousEntry.alt !== autoAlt(previousEntry.id)) {
			alt = previousEntry.alt;
		} else {
			alt = autoAlt(id);
		}

		const hashPrefix = hash.slice(0, 8);
		const variants: ImageVariant[] = [];
		const uploadPromises: Promise<void>[] = [];

		for (const width of WIDTHS) {
			// Skip sizes larger than the original
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

		// Upload all variants for this image in parallel
		await Promise.all(uploadPromises);
		uploaded++;

		updatedEntries.push({
			id,
			hash,
			originalWidth,
			originalHeight,
			alt,
			exif: exifData,
			variants
		});

		console.log(`  Uploaded ${variants.length} variants (${exifData.camera ?? 'unknown camera'})`);

		// Save progress after each image so crashes don't lose work
		manifest.images = [...updatedEntries];
		await saveManifest(manifest);
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

	// Final manifest write (includes removals)
	manifest.images = updatedEntries;
	await saveManifest(manifest);

	console.log(`\nDone. ${uploaded} uploaded, ${skipped} skipped, ${removed.length} removed.`);
	console.log(`Manifest written to ${MANIFEST_PATH}`);
}

main().catch((err) => {
	console.error('Fatal error:', err);
	process.exit(1);
});
