// Relative path with an explicit extension rather than `@/lib/format`: the
// `@/*` alias is a bundler/tsconfig convenience and does not resolve when these
// modules are loaded by plain Node (`node --test`).
import { formatNumber } from './format.ts';

export type SavePrimitive = string | number | boolean | null;

export type SaveData = Record<string, unknown>;
export type PathSegment = string | number;

export type SelectOption = {
	label: string;
	value: string | number;
};

export type FieldKind = 'text' | 'number' | 'checkbox' | 'select';

export type ValueUpdate = {
	path: PathSegment[];
	value: unknown;
};

/**
 * Re-exported so the long-standing `@/lib/save-utils` import path keeps working
 * for the components that use it. `lib/format` owns the implementation (and the
 * single `Intl.NumberFormat` instance).
 */
export { formatNumber };

export function parseNumberish(value: string) {
	const parsedValue = Number.parseFloat(String(value).replaceAll(',', ''));
	return Number.isFinite(parsedValue) ? parsedValue : 0;
}

export function sanitizeNumberInput(value: string, allowDecimal = true) {
	let cleaned = value.replace(allowDecimal ? /[^0-9eE+\-.]/g : /[^0-9\-]/g, '');

	if (!allowDecimal) {
		const minusIndex = cleaned.indexOf('-');
		if (minusIndex > 0) {
			cleaned = `-${cleaned.replaceAll('-', '')}`;
		} else if (minusIndex === -1) {
			cleaned = cleaned.replaceAll('-', '');
		} else {
			cleaned = `-${cleaned.slice(1).replaceAll('-', '')}`;
		}

		return cleaned;
	}

	const exponentParts = cleaned.split(/e/i);
	if (exponentParts.length > 2) {
		cleaned = `${exponentParts[0]}e${exponentParts.slice(1).join('')}`;
	}

	const [mantissa, exponent] = cleaned.split(/e/i);
	const normalizedMantissa = sanitizeMantissa(mantissa);

	if (exponent === undefined) {
		return normalizedMantissa;
	}

	const sanitizedExponent = exponent.replace(/[^0-9+\-]/g, '');
	const leadingExponentSign =
		sanitizedExponent.startsWith('-') || sanitizedExponent.startsWith('+') ? sanitizedExponent[0] : '';
	const exponentDigits = sanitizedExponent
		.slice(leadingExponentSign ? 1 : 0)
		.replaceAll('-', '')
		.replaceAll('+', '');

	return `${normalizedMantissa}e${leadingExponentSign}${exponentDigits}`;
}

function sanitizeMantissa(value: string) {
	let normalizedValue = value.replace(/[^0-9+\-.]/g, '');
	const leadingSign =
		normalizedValue.startsWith('-') || normalizedValue.startsWith('+') ? normalizedValue[0] : '';
	normalizedValue = `${leadingSign}${normalizedValue
		.slice(leadingSign ? 1 : 0)
		.replaceAll('-', '')
		.replaceAll('+', '')}`;

	const dotIndex = normalizedValue.indexOf('.');
	if (dotIndex === -1) {
		return normalizedValue;
	}

	return `${normalizedValue.slice(0, dotIndex + 1)}${normalizedValue.slice(dotIndex + 1).replaceAll('.', '')}`;
}

export function isPrimitive(value: unknown): value is SavePrimitive {
	return value == null || ['string', 'number', 'boolean'].includes(typeof value);
}

export function listPrimitiveKeys(data: SaveData | null) {
	if (!data) {
		return [];
	}

	return Object.keys(data).filter((key) => isPrimitive(data[key]));
}

export function getValueAtPath<T = unknown>(source: unknown, path: PathSegment[]): T | undefined {
	let current: unknown = source;

	for (const segment of path) {
		if (current == null || typeof current !== 'object') {
			return undefined;
		}

		current = (current as Record<string, unknown>)[String(segment)];
	}

	return current as T | undefined;
}

export function hasPath(source: unknown, path: PathSegment[]) {
	if (path.length === 0) {
		return true;
	}

	let current: unknown = source;

	for (const segment of path) {
		if (current == null || typeof current !== 'object') {
			return false;
		}

		if (!(String(segment) in (current as Record<string, unknown>))) {
			return false;
		}

		current = (current as Record<string, unknown>)[String(segment)];
	}

	return true;
}

function nextContainer(segment: PathSegment | undefined) {
	return segment != null && (typeof segment === 'number' || /^\d+$/.test(String(segment))) ? [] : {};
}

function shallowCopy(value: object) {
	return Array.isArray(value) ? value.slice() : { ...(value as Record<string, unknown>) };
}

/**
 * Copies only the containers along `path` and writes `value` at the end, so the
 * untouched parts of the save are shared with `source` instead of being deep
 * copied. `source` (and every object reachable from it) is left untouched, so
 * callers keep the same immutability guarantee a full `structuredClone` gave
 * them, at O(path length) instead of O(save size) per edit.
 *
 * `copied` lets a batch reuse containers it has already copied in this pass; it
 * must only ever contain objects created by this pass.
 */
function writeValueAtPath(
	source: SaveData,
	path: PathSegment[],
	value: unknown,
	copied: WeakSet<object>
): SaveData {
	const root = copyOnce(source, copied) as SaveData;
	let current = root as Record<string, unknown>;

	for (let index = 0; index < path.length - 1; index += 1) {
		const key = String(path[index]);
		const child = current[key];
		const nextNode =
			child != null && typeof child === 'object'
				? copyOnce(child, copied)
				: // A numeric next segment means the missing container is an array
					// index, so create an array rather than an object.
					nextContainer(path[index + 1]);

		current[key] = nextNode;
		current = nextNode as Record<string, unknown>;
	}

	current[String(path[path.length - 1])] = value;
	return root;
}

function copyOnce<T extends object>(value: T, copied: WeakSet<object>) {
	if (copied.has(value)) {
		return value;
	}

	const copy = shallowCopy(value) as T;
	copied.add(copy);
	return copy;
}

export function setValueAtPath<T extends SaveData>(source: T, path: PathSegment[], value: unknown): T {
	if (path.length === 0) {
		return source;
	}

	return writeValueAtPath(source, path, value, new WeakSet()) as T;
}

/**
 * `setValueAtPath` for many paths in a single pass: each container is copied at
 * most once no matter how many of the updates run through it. Later updates win
 * when two paths collide.
 */
export function setValuesAtPaths<T extends SaveData>(source: T, updates: ValueUpdate[]): T {
	const copied = new WeakSet<object>();
	let result: SaveData = source;

	for (const { path, value } of updates) {
		if (path.length === 0) {
			continue;
		}

		result = writeValueAtPath(result, path, value, copied);
	}

	return result as T;
}

/**
 * Deletes the key at `path`, copying only the containers along the way. Returns
 * `source` untouched when the path is not present, so a no-op removal does not
 * churn object identities.
 */
export function removeValueAtPath<T extends SaveData>(source: T, path: PathSegment[]): T {
	if (path.length === 0 || !hasPath(source, path)) {
		return source;
	}

	const copied = new WeakSet<object>();
	const root = copyOnce(source, copied) as T;
	let current = root as Record<string, unknown>;

	for (let index = 0; index < path.length - 1; index += 1) {
		const key = String(path[index]);
		// `hasPath` already proved every container on the way is an object.
		const nextNode = copyOnce(current[key] as object, copied);
		current[key] = nextNode;
		current = nextNode as Record<string, unknown>;
	}

	delete current[String(path[path.length - 1])];
	return root;
}

export function toSelectValue(value: string | number | undefined) {
	return value == null ? '' : String(value);
}
