import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

/*
 * Every locale must mirror English exactly: the same keys, the same array
 * lengths, and the same `{placeholders}` and `<rich>` tags in each string.
 * A missing key renders the key name on the page; a renamed placeholder
 * renders literally.
 */

const messagesDir = join(import.meta.dirname, '..', 'messages');
const sourceLocale = 'en';
const locales = readdirSync(messagesDir, { withFileTypes: true })
	.filter((entry) => entry.isDirectory() && entry.name !== sourceLocale)
	.map((entry) => entry.name);
const namespaces = readdirSync(join(messagesDir, sourceLocale)).filter((file) => file.endsWith('.json'));

const load = (locale: string, file: string): unknown =>
	JSON.parse(readFileSync(join(messagesDir, locale, file), 'utf8'));

/** ICU arguments (`{count}`, `{count, plural, …}`) and rich-text tags (`<link>`). */
const tokens = (text: string) =>
	[
		...[...text.matchAll(/\{\s*(\w+)\s*[,}]/g)].map((match) => `{${match[1]}}`),
		...[...text.matchAll(/<\/?(\w+)>/g)].map((match) => match[0])
	].sort();

const compare = (source: unknown, target: unknown, path: string, problems: string[]) => {
	if (typeof source === 'string') {
		if (typeof target !== 'string') {
			problems.push(`${path}: expected a string`);
		} else if (tokens(source).join() !== tokens(target).join()) {
			problems.push(`${path}: placeholders differ (${tokens(source).join(' ')} vs ${tokens(target).join(' ')})`);
		}

		return;
	}

	if (Array.isArray(source)) {
		if (!Array.isArray(target) || target.length !== source.length) {
			problems.push(`${path}: expected an array of ${source.length}`);
			return;
		}

		source.forEach((item, index) => compare(item, target[index], `${path}[${index}]`, problems));
		return;
	}

	if (source && typeof source === 'object') {
		if (!target || typeof target !== 'object' || Array.isArray(target)) {
			problems.push(`${path}: expected an object`);
			return;
		}

		const sourceRecord = source as Record<string, unknown>;
		const targetRecord = target as Record<string, unknown>;

		for (const key of Object.keys(sourceRecord)) {
			if (!(key in targetRecord)) problems.push(`${path}.${key}: missing`);
			else compare(sourceRecord[key], targetRecord[key], `${path}.${key}`, problems);
		}

		for (const key of Object.keys(targetRecord)) {
			if (!(key in sourceRecord)) problems.push(`${path}.${key}: not in ${sourceLocale}`);
		}
	}
};

describe('translations', () => {
	for (const locale of locales) {
		for (const file of namespaces) {
			it(`${locale}/${file} mirrors ${sourceLocale}/${file}`, () => {
				const problems: string[] = [];

				compare(load(sourceLocale, file), load(locale, file), file.replace('.json', ''), problems);
				assert.deepEqual(problems, []);
			});
		}
	}
});
