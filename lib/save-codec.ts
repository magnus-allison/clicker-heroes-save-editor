import pako from "pako";

import type { SaveData } from "@/lib/save-utils";

const ANTI_CHEAT_CODE = "Fe12NAfA3R6z4k0z";
const ZLIB_PREFIX = "7a990d405d2c6fb93aa8fbb0ec1a3b23";
const DEFLATE_PREFIX = "7e8bb5a89f2842ac4af01b3b7e228592";

export type SaveEncodingFormat = "zlib" | "deflate" | "legacy";
export type SaveDevice = "pc" | "mobile";

export type DecodeResult = {
	data: SaveData;
	format: SaveEncodingFormat;
};

function normalizeBase64(value: string) {
	const normalized = value.replace(/\s/g, "").replace(/-/g, "+").replace(/_/g, "/");
	const paddingLength = (4 - (normalized.length % 4)) % 4;

	return `${normalized}${"=".repeat(paddingLength)}`;
}

function base64ToBinaryString(value: string, format: SaveEncodingFormat) {
	try {
		return atob(normalizeBase64(value));
	} catch {
		throw new Error(`The ${format} save payload is not valid base64. Check that the whole save string was copied.`);
	}
}

function base64ToBytes(value: string, format: SaveEncodingFormat) {
	const binary = base64ToBinaryString(value, format);
	return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function bytesToBase64(bytes: Uint8Array) {
	let binary = "";
	for (const byte of bytes) {
		binary += String.fromCharCode(byte);
	}

	return btoa(binary);
}

function parseSaveJson(json: string) {
	const parsed = JSON.parse(json);

	if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
		throw new Error("Decoded save data is not a valid object.");
	}

	return parsed as SaveData;
}

export function decodeSaveString(input: string): DecodeResult {
	const trimmed = input.trim();

	if (!trimmed) {
		throw new Error("Paste a save string or load a save file first.");
	}

	if (trimmed.startsWith(ZLIB_PREFIX)) {
		const payload = trimmed.slice(ZLIB_PREFIX.length);
		const inflated = pako.inflate(base64ToBytes(payload, "zlib"), { to: "string" });
		return { data: parseSaveJson(inflated), format: "zlib" };
	}

	if (trimmed.startsWith(DEFLATE_PREFIX)) {
		const payload = trimmed.slice(DEFLATE_PREFIX.length);
		const inflated = pako.inflateRaw(base64ToBytes(payload, "deflate"), { to: "string" });
		return { data: parseSaveJson(inflated), format: "deflate" };
	}

	if (trimmed.includes(ANTI_CHEAT_CODE)) {
		const [encoded] = trimmed.split(ANTI_CHEAT_CODE);
		let decoded = "";

		for (let index = 0; index < encoded.length; index += 2) {
			decoded += encoded[index] ?? "";
		}

		return { data: parseSaveJson(base64ToBinaryString(decoded, "legacy")), format: "legacy" };
	}

	throw new Error("That string does not look like a supported Clicker Heroes save.");
}

export function getSaveDeviceFromFormat(format: SaveEncodingFormat): SaveDevice | null {
	if (format === "deflate") {
		return "pc";
	}

	if (format === "zlib") {
		return "mobile";
	}

	return null;
}

export function encodeSaveData(data: SaveData, device: SaveDevice = "mobile") {
	const json = JSON.stringify(data);

	if (device === "pc") {
		return `${DEFLATE_PREFIX}${bytesToBase64(pako.deflateRaw(json))}`;
	}

	return `${ZLIB_PREFIX}${bytesToBase64(pako.deflate(json))}`;
}
