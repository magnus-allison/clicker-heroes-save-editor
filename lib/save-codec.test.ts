import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { deflate, deflateRaw } from 'pako';

import { decodeSaveString, encodeSaveData, getSaveDeviceFromFormat, type SaveDevice } from './save-codec.ts';
import type { SaveData } from './save-utils.ts';

const ZLIB_PREFIX = '7a990d405d2c6fb93aa8fbb0ec1a3b23';
const DEFLATE_PREFIX = '7e8bb5a89f2842ac4af01b3b7e228592';
const ANTI_CHEAT_CODE = 'Fe12NAfA3R6z4k0z';

const sampleSave = (): SaveData => ({
	clickerHeroesVersion: '1.0e11',
	rubies: 1234,
	heroCollection: {
		heroes: {
			'1': { level: 100, epicLevel: 0 },
			'2': { level: 25, epicLevel: 3 }
		}
	},
	achievements: { '1': true, '2': true },
	autoclickerSkins: [true, false, false],
	primalSouls: '1e250',
	account: null,
	loginValidated: 'false'
});

const toBase64 = (bytes: Uint8Array) => Buffer.from(bytes).toString('base64');

/** A mobile/zlib save string wrapping arbitrary (possibly invalid) content. */
const zlibSaveFrom = (content: string) => `${ZLIB_PREFIX}${toBase64(deflate(content))}`;

/** A PC/raw-deflate save string wrapping arbitrary content. */
const deflateSaveFrom = (content: string) => `${DEFLATE_PREFIX}${toBase64(deflateRaw(content))}`;

/**
 * The legacy anti-cheat format is `btoa(json)` with a junk character inserted
 * after every real character, then the anti-cheat code, then a hash the editor
 * ignores. Built programmatically instead of pasting a real save so the fixture
 * stays inspectable — `decodeSaveString` only reads the even-indexed characters
 * of the part before the anti-cheat code.
 */
const legacySaveFrom = (
	content: string,
	{ filler = 'JUNK', trailer = ANTI_CHEAT_CODE + 'd41d8cd98f00b204e9800998ecf8427e' } = {}
) => {
	const base64 = Buffer.from(content, 'binary').toString('base64');
	const interleaved = [...base64]
		.map((character, index) => `${character}${filler[index % filler.length]}`)
		.join('');

	return `${interleaved}${trailer}`;
};

describe('encodeSaveData / decodeSaveString round trips', () => {
	const devices: SaveDevice[] = ['mobile', 'pc'];

	for (const device of devices) {
		test(`${device} saves survive an encode/decode round trip`, () => {
			const data = sampleSave();
			const encoded = encodeSaveData(data, device);
			const decoded = decodeSaveString(encoded);

			assert.deepEqual(decoded.data, data);
			assert.equal(decoded.format, device === 'pc' ? 'deflate' : 'zlib');
			assert.equal(getSaveDeviceFromFormat(decoded.format), device);
			// Re-encoding the decoded data reproduces the same string.
			assert.equal(encodeSaveData(decoded.data, device), encoded);
		});
	}

	test('mobile is the default device', () => {
		const data = sampleSave();
		assert.equal(encodeSaveData(data), encodeSaveData(data, 'mobile'));
		assert.ok(encodeSaveData(data).startsWith(ZLIB_PREFIX));
		assert.ok(encodeSaveData(data, 'pc').startsWith(DEFLATE_PREFIX));
	});

	test('converts between devices without losing data', () => {
		const data = sampleSave();
		const fromPc = decodeSaveString(encodeSaveData(data, 'pc'));
		const asMobile = encodeSaveData(fromPc.data, 'mobile');
		const backAgain = decodeSaveString(asMobile);

		assert.equal(backAgain.format, 'zlib');
		assert.deepEqual(backAgain.data, data);
	});

	test('legacy saves decode and can be re-encoded for either device', () => {
		const data = sampleSave();
		const decoded = decodeSaveString(legacySaveFrom(JSON.stringify(data)));

		assert.equal(decoded.format, 'legacy');
		// The legacy format predates the PC/mobile split, so it maps to neither.
		assert.equal(getSaveDeviceFromFormat('legacy'), null);
		assert.deepEqual(decoded.data, data);

		for (const device of devices) {
			assert.deepEqual(decodeSaveString(encodeSaveData(decoded.data, device)).data, data);
		}
	});

	test('tolerates surrounding whitespace and line breaks inside the payload', () => {
		const data = sampleSave();
		const encoded = encodeSaveData(data, 'pc');
		const payload = encoded.slice(DEFLATE_PREFIX.length);
		const wrapped = payload.replace(/(.{16})/g, '$1\n');

		assert.deepEqual(decodeSaveString(`\n  ${DEFLATE_PREFIX}${wrapped}  \n`).data, data);
	});

	test('accepts url-safe base64 payloads', () => {
		const data = sampleSave();
		const encoded = encodeSaveData(data, 'pc');
		const payload = encoded.slice(DEFLATE_PREFIX.length);

		assert.match(payload, /[+/]/, 'fixture should exercise the + and / replacements');
		const urlSafe = payload.replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');

		assert.deepEqual(decodeSaveString(`${DEFLATE_PREFIX}${urlSafe}`).data, data);
	});
});

describe('decodeSaveString error paths', () => {
	test('rejects empty and whitespace-only input', () => {
		for (const input of ['', '   ', '\n\t']) {
			assert.throws(() => decodeSaveString(input), {
				message: 'Paste a save string or load a save file first.'
			});
		}
	});

	test('rejects a string with no recognised prefix or anti-cheat code', () => {
		assert.throws(() => decodeSaveString('just some text'), {
			message: 'That string does not look like a supported Clicker Heroes save.'
		});
		// A valid base64 blob on its own is still not a save.
		assert.throws(() => decodeSaveString(toBase64(deflate('{"a":1}'))), {
			message: 'That string does not look like a supported Clicker Heroes save.'
		});
	});

	test('rejects a payload that is not base64, naming the format', () => {
		assert.throws(() => decodeSaveString(`${ZLIB_PREFIX}$$$$`), {
			message: 'The zlib save payload is not valid base64. Check that the whole save string was copied.'
		});
		assert.throws(() => decodeSaveString(`${DEFLATE_PREFIX}****`), {
			message: 'The deflate save payload is not valid base64. Check that the whole save string was copied.'
		});
		assert.throws(() => decodeSaveString(`!!!!${ANTI_CHEAT_CODE}hash`), {
			message: 'The legacy save payload is not valid base64. Check that the whole save string was copied.'
		});
	});

	test('rejects a corrupt compressed payload with a real Error', () => {
		const truncated = encodeSaveData(sampleSave(), 'mobile').slice(0, ZLIB_PREFIX.length + 20);

		for (const input of [
			truncated,
			// Valid base64 that is not a zlib stream at all.
			`${ZLIB_PREFIX}${toBase64(new TextEncoder().encode('definitely not compressed'))}`,
			// Empty payload.
			ZLIB_PREFIX,
			// zlib-wrapped bytes handed to the raw-inflate path.
			`${DEFLATE_PREFIX}${toBase64(deflate('{"a":1}'))}`
		]) {
			assert.throws(
				() => decodeSaveString(input),
				(error: unknown) => {
					// pako signals failure by throwing its bare message string; the codec
					// has to turn that into an Error or the UI shows nothing useful.
					assert.ok(error instanceof Error, `expected an Error, got ${typeof error}`);
					assert.match(error.message, /could not be decompressed/);
					assert.match(error.message, /Check that the whole save string was copied\./);
					return true;
				}
			);
		}
	});

	test('rejects valid base64 that does not contain JSON', () => {
		assert.throws(() => decodeSaveString(zlibSaveFrom('not json at all')), SyntaxError);
		assert.throws(() => decodeSaveString(deflateSaveFrom('{"unclosed": ')), SyntaxError);
		assert.throws(() => decodeSaveString(legacySaveFrom('not json at all')), SyntaxError);
	});

	test('rejects JSON that is not an object', () => {
		for (const json of ['[1,2,3]', 'null', '42', '"a string"', 'true']) {
			assert.throws(() => decodeSaveString(zlibSaveFrom(json)), {
				message: 'Decoded save data is not a valid object.'
			});
			assert.throws(() => decodeSaveString(legacySaveFrom(json)), {
				message: 'Decoded save data is not a valid object.'
			});
		}
	});
});

describe('decodeSaveString legacy anti-cheat branch', () => {
	test('reads only the characters before the anti-cheat code', () => {
		const data = sampleSave();
		const json = JSON.stringify(data);

		// Trailing hash length and content are irrelevant.
		assert.deepEqual(decodeSaveString(legacySaveFrom(json, { trailer: ANTI_CHEAT_CODE })).data, data);
		assert.deepEqual(
			decodeSaveString(legacySaveFrom(json, { trailer: `${ANTI_CHEAT_CODE}${'0'.repeat(64)}` })).data,
			data
		);
		// A second copy of the anti-cheat code later in the string is ignored,
		// because only the first split segment is decoded.
		assert.deepEqual(
			decodeSaveString(legacySaveFrom(json, { trailer: `${ANTI_CHEAT_CODE}abc${ANTI_CHEAT_CODE}def` })).data,
			data
		);
	});

	test('is unaffected by the junk characters it discards', () => {
		const json = JSON.stringify({ rubies: 7 });
		const withLetters = decodeSaveString(legacySaveFrom(json, { filler: 'abc' })).data;
		const withDigits = decodeSaveString(legacySaveFrom(json, { filler: '123' })).data;
		const withSymbols = decodeSaveString(legacySaveFrom(json, { filler: '=+/' })).data;

		assert.deepEqual(withLetters, { rubies: 7 });
		assert.deepEqual(withDigits, withLetters);
		assert.deepEqual(withSymbols, withLetters);
	});

	test('a dropped trailing junk character still decodes', () => {
		// Odd-length payload: the last real character sits at an even index, so it
		// survives the every-other-character read.
		const json = JSON.stringify({ rubies: 7 });
		const full = legacySaveFrom(json, { trailer: '' });
		const oddLength = full.slice(0, -1);

		assert.equal(oddLength.length % 2, 1);
		assert.deepEqual(
			decodeSaveString(`${oddLength}${ANTI_CHEAT_CODE}hash`).data,
			JSON.parse(json) as SaveData
		);
	});

	test('fails cleanly on a garbage payload of odd length', () => {
		// 'abc' -> even indices 'ac' -> padded to 'ac==' -> one junk byte -> no JSON.
		assert.throws(() => decodeSaveString(`abc${ANTI_CHEAT_CODE}hash`), SyntaxError);
		// A single character cannot be padded into a valid base64 quantum.
		assert.throws(() => decodeSaveString(`a${ANTI_CHEAT_CODE}hash`), {
			message: 'The legacy save payload is not valid base64. Check that the whole save string was copied.'
		});
		// Nothing at all before the anti-cheat code: empty base64, empty JSON.
		assert.throws(() => decodeSaveString(`${ANTI_CHEAT_CODE}hash`), SyntaxError);
	});
});

describe('getSaveDeviceFromFormat', () => {
	test('maps the compressed formats to their device and legacy to null', () => {
		assert.equal(getSaveDeviceFromFormat('deflate'), 'pc');
		assert.equal(getSaveDeviceFromFormat('zlib'), 'mobile');
		assert.equal(getSaveDeviceFromFormat('legacy'), null);
	});
});
