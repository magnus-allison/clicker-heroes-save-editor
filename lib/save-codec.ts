// Named imports, not `import pako from 'pako'`: pako's ESM build exposes no
// default export, so the default import only resolves through bundler interop
// and throws outright under plain Node (which is what the tests run on).
import { deflate, deflateRaw, inflate, inflateRaw } from 'pako';

import type { SaveData } from '@/lib/save-utils';

const ANTI_CHEAT_CODE = 'Fe12NAfA3R6z4k0z';
const ZLIB_PREFIX = '7a990d405d2c6fb93aa8fbb0ec1a3b23';
const DEFLATE_PREFIX = '7e8bb5a89f2842ac4af01b3b7e228592';

export type SaveEncodingFormat = 'zlib' | 'deflate' | 'legacy';
export type SaveDevice = 'pc' | 'mobile';

export type DecodeResult = {
	data: SaveData;
	format: SaveEncodingFormat;
};

function normalizeBase64(value: string) {
	const normalized = value.replace(/\s/g, '').replace(/-/g, '+').replace(/_/g, '/');
	const paddingLength = (4 - (normalized.length % 4)) % 4;

	return `${normalized}${'='.repeat(paddingLength)}`;
}

function base64ToBinaryString(value: string, format: SaveEncodingFormat) {
	try {
		return atob(normalizeBase64(value));
	} catch {
		throw new Error(
			`The ${format} save payload is not valid base64. Check that the whole save string was copied.`
		);
	}
}

function base64ToBytes(value: string, format: SaveEncodingFormat) {
	const binary = base64ToBinaryString(value, format);
	return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function bytesToBase64(bytes: Uint8Array) {
	let binary = '';
	for (const byte of bytes) {
		binary += String.fromCharCode(byte);
	}

	return btoa(binary);
}

// pako 3 dropped the `{ to: "string" }` option and always returns bytes, so
// inflated output is decoded here instead.
function bytesToString(bytes: Uint8Array) {
	return new TextDecoder().decode(bytes);
}

/**
 * Inflates a base64 payload. pako signals failure by throwing its bare `msg`
 * string rather than an `Error`, which every caller renders as a generic
 * "Failed to decode save data." toast, so a truncated save gets rewrapped into
 * a real `Error` with an actionable message.
 */
function inflatePayload(payload: string, format: 'zlib' | 'deflate') {
	const bytes = base64ToBytes(payload, format);

	try {
		return bytesToString(format === 'deflate' ? inflateRaw(bytes) : inflate(bytes));
	} catch (error) {
		const reason = error instanceof Error ? error.message : String(error);
		throw new Error(
			`The ${format} save payload could not be decompressed (${reason}). Check that the whole save string was copied.`
		);
	}
}

function parseSaveJson(json: string) {
	const parsed = JSON.parse(json);

	if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
		throw new Error('Decoded save data is not a valid object.');
	}

	return parsed as SaveData;
}

export function decodeSaveString(input: string): DecodeResult {
	const trimmed = input.trim();

	if (!trimmed) {
		throw new Error('Paste a save string or load a save file first.');
	}

	if (trimmed.startsWith(ZLIB_PREFIX)) {
		const inflated = inflatePayload(trimmed.slice(ZLIB_PREFIX.length), 'zlib');
		return { data: parseSaveJson(inflated), format: 'zlib' };
	}

	if (trimmed.startsWith(DEFLATE_PREFIX)) {
		const inflated = inflatePayload(trimmed.slice(DEFLATE_PREFIX.length), 'deflate');
		return { data: parseSaveJson(inflated), format: 'deflate' };
	}

	if (trimmed.includes(ANTI_CHEAT_CODE)) {
		const [encoded] = trimmed.split(ANTI_CHEAT_CODE);
		let decoded = '';

		for (let index = 0; index < encoded.length; index += 2) {
			decoded += encoded[index] ?? '';
		}

		return { data: parseSaveJson(base64ToBinaryString(decoded, 'legacy')), format: 'legacy' };
	}

	throw new Error('That string does not look like a supported Clicker Heroes save.');
}

export function getSaveDeviceFromFormat(format: SaveEncodingFormat): SaveDevice | null {
	if (format === 'deflate') {
		return 'pc';
	}

	if (format === 'zlib') {
		return 'mobile';
	}

	return null;
}

export function encodeSaveData(data: SaveData, device: SaveDevice = 'mobile') {
	const json = JSON.stringify(data);

	if (device === 'pc') {
		return `${DEFLATE_PREFIX}${bytesToBase64(deflateRaw(json))}`;
	}

	return `${ZLIB_PREFIX}${bytesToBase64(deflate(json))}`;
}
