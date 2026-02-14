#!/usr/bin/env bun
/**
 * sanitize-exif.ts
 *
 * Reduces GPS precision in JPEG images to ~7 miles / ~11km (city-level)
 * while preserving all other EXIF metadata. Prevents exact location
 * tracking while keeping a general sense of where the photo was taken.
 *
 * Usage:
 *   bun run scripts/sanitize-exif.ts <file1.jpg> [file2.jpg] ...
 *   bun run scripts/sanitize-exif.ts --staged   (processes git-staged images)
 *
 * Runs as a pre-commit hook to prevent precise GPS data from ever
 * entering the repository.
 */

import piexif from 'piexifjs';
import { readFile, writeFile } from 'node:fs/promises';
import { extname } from 'node:path';

const JPEG_EXTENSIONS = new Set(['.jpg', '.jpeg']);

// 1 decimal place ≈ 0.1 degrees ≈ 7 miles / 11km
const GPS_PRECISION = 1;

function isJpeg(filepath: string): boolean {
	return JPEG_EXTENSIONS.has(extname(filepath).toLowerCase());
}

/**
 * GPS coordinates in EXIF are stored as rational numbers: [[deg,1],[min,1],[sec,100]]
 * This converts a decimal degree (e.g. 43.7) to that rational format.
 */
function decimalToExifGps(decimal: number): Array<[number, number]> {
	const abs = Math.abs(decimal);
	const deg = Math.floor(abs);
	const minFloat = (abs - deg) * 60;
	const min = Math.floor(minFloat);
	const sec = Math.round((minFloat - min) * 60 * 100);
	return [
		[deg, 1],
		[min, 1],
		[sec, 100]
	];
}

/**
 * Converts EXIF GPS rational format [[deg,1],[min,1],[sec,100]] to decimal degrees.
 */
function exifGpsToDecimal(coords: Array<[number, number]>, ref: string): number {
	const deg = coords[0][0] / coords[0][1];
	const min = coords[1][0] / coords[1][1];
	const sec = coords[2][0] / coords[2][1];
	const decimal = deg + min / 60 + sec / 3600;
	return ref === 'S' || ref === 'W' ? -decimal : decimal;
}

function roundDecimal(value: number, precision: number): number {
	const factor = Math.pow(10, precision);
	return Math.round(value * factor) / factor;
}

async function fuzzGps(filepath: string): Promise<boolean> {
	const buffer = await readFile(filepath);
	const binary = buffer.toString('binary');

	let exifObj: ReturnType<typeof piexif.load>;
	try {
		exifObj = piexif.load(binary);
	} catch {
		return false;
	}

	const gps = exifObj.GPS;
	if (!gps || Object.keys(gps).length === 0) {
		return false;
	}

	const latTag = piexif.GPSIFD.GPSLatitude;
	const latRefTag = piexif.GPSIFD.GPSLatitudeRef;
	const lonTag = piexif.GPSIFD.GPSLongitude;
	const lonRefTag = piexif.GPSIFD.GPSLongitudeRef;

	if (!gps[latTag] || !gps[lonTag]) {
		return false;
	}

	const lat = exifGpsToDecimal(gps[latTag], gps[latRefTag]);
	const lon = exifGpsToDecimal(gps[lonTag], gps[lonRefTag]);

	const fuzzedLat = roundDecimal(lat, GPS_PRECISION);
	const fuzzedLon = roundDecimal(lon, GPS_PRECISION);

	// If already at reduced precision, skip
	if (lat === fuzzedLat && lon === fuzzedLon) {
		return false;
	}

	// Write fuzzed coordinates back
	gps[latTag] = decimalToExifGps(Math.abs(fuzzedLat));
	gps[latRefTag] = fuzzedLat >= 0 ? 'N' : 'S';
	gps[lonTag] = decimalToExifGps(Math.abs(fuzzedLon));
	gps[lonRefTag] = fuzzedLon >= 0 ? 'E' : 'W';

	// Remove precise GPS fields (altitude, timestamp, direction, etc.)
	const keepTags = new Set([piexif.GPSIFD.GPSVersionID, latTag, latRefTag, lonTag, lonRefTag]);
	for (const key of Object.keys(gps)) {
		if (!keepTags.has(Number(key))) {
			delete gps[Number(key)];
		}
	}

	const newExifBytes = piexif.dump(exifObj);
	const result = piexif.insert(newExifBytes, binary);
	await writeFile(filepath, Buffer.from(result, 'binary'));
	return true;
}

async function getStagedImages(): Promise<string[]> {
	const proc = Bun.spawn(['git', 'diff', '--cached', '--name-only', '--diff-filter=ACMR'], {
		stdout: 'pipe',
		stderr: 'ignore'
	});
	const output = await new Response(proc.stdout).text();
	await proc.exited;

	return output
		.split('\n')
		.map((f) => f.trim())
		.filter((f) => f && isJpeg(f));
}

async function main() {
	const args = process.argv.slice(2);

	let files: string[];
	if (args.includes('--staged')) {
		files = await getStagedImages();
	} else {
		files = args.filter(isJpeg);
	}

	if (files.length === 0) {
		return;
	}

	let fuzzed = 0;
	for (const file of files) {
		try {
			const changed = await fuzzGps(file);
			if (changed) {
				fuzzed++;
				console.log(`Fuzzed GPS: ${file}`);
			}
		} catch (err) {
			console.error(`Failed to process ${file}:`, err);
		}
	}

	if (fuzzed > 0) {
		if (args.includes('--staged')) {
			const proc = Bun.spawn(['git', 'add', ...files.filter(isJpeg)], {
				stdout: 'ignore',
				stderr: 'ignore'
			});
			await proc.exited;
		}
		console.log(
			`Sanitized GPS to ~${Math.pow(10, -GPS_PRECISION) * 69}mi precision on ${fuzzed} image(s)`
		);
	}
}

main().catch((err) => {
	console.error('sanitize-exif error:', err);
	process.exit(1);
});
