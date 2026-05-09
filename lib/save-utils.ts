export type SavePrimitive = string | number | boolean | null;
export type SaveValue =
	| SavePrimitive
	| SaveValue[]
	| {
			[key: string]: SaveValue;
	  };

export type SaveData = Record<string, unknown>;
export type PathSegment = string | number;

export type SelectOption = {
	label: string;
	value: string | number;
};

export type FieldKind = "text" | "number" | "checkbox" | "select";

const formatter = new Intl.NumberFormat("en-US");

export function formatNumber(value: unknown) {
	const numericValue =
		typeof value === "number" ? value : typeof value === "string" ? Number.parseFloat(value) : Number.NaN;

	if (!Number.isFinite(numericValue)) {
		return String(value ?? "");
	}

	return formatter.format(numericValue);
}

export function parseNumberish(value: string) {
	const parsedValue = Number.parseFloat(String(value).replaceAll(",", ""));
	return Number.isFinite(parsedValue) ? parsedValue : 0;
}

export function sanitizeNumberInput(value: string, allowDecimal = true) {
	let cleaned = value.replace(allowDecimal ? /[^0-9eE+\-.]/g : /[^0-9\-]/g, "");

	if (!allowDecimal) {
		const minusIndex = cleaned.indexOf("-");
		if (minusIndex > 0) {
			cleaned = `-${cleaned.replaceAll("-", "")}`;
		} else if (minusIndex === -1) {
			cleaned = cleaned.replaceAll("-", "");
		} else {
			cleaned = `-${cleaned.slice(1).replaceAll("-", "")}`;
		}

		return cleaned;
	}

	const exponentParts = cleaned.split(/e/i);
	if (exponentParts.length > 2) {
		cleaned = `${exponentParts[0]}e${exponentParts.slice(1).join("")}`;
	}

	const [mantissa, exponent] = cleaned.split(/e/i);
	const normalizedMantissa = sanitizeMantissa(mantissa);

	if (exponent === undefined) {
		return normalizedMantissa;
	}

	const sanitizedExponent = exponent.replace(/[^0-9+\-]/g, "");
	const leadingExponentSign =
		sanitizedExponent.startsWith("-") || sanitizedExponent.startsWith("+")
			? sanitizedExponent[0]
			: "";
	const exponentDigits = sanitizedExponent
		.slice(leadingExponentSign ? 1 : 0)
		.replaceAll("-", "")
		.replaceAll("+", "");

	return `${normalizedMantissa}e${leadingExponentSign}${exponentDigits}`;
}

function sanitizeMantissa(value: string) {
	let normalizedValue = value.replace(/[^0-9+\-.]/g, "");
	const leadingSign =
		normalizedValue.startsWith("-") || normalizedValue.startsWith("+") ? normalizedValue[0] : "";
	normalizedValue = `${leadingSign}${normalizedValue
		.slice(leadingSign ? 1 : 0)
		.replaceAll("-", "")
		.replaceAll("+", "")}`;

	const dotIndex = normalizedValue.indexOf(".");
	if (dotIndex === -1) {
		return normalizedValue;
	}

	return `${normalizedValue.slice(0, dotIndex + 1)}${normalizedValue.slice(dotIndex + 1).replaceAll(".", "")}`;
}

export function isPrimitive(value: unknown): value is SavePrimitive {
	return value == null || ["string", "number", "boolean"].includes(typeof value);
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
		if (current == null || typeof current !== "object") {
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
		if (current == null || typeof current !== "object") {
			return false;
		}

		if (!(String(segment) in (current as Record<string, unknown>))) {
			return false;
		}

		current = (current as Record<string, unknown>)[String(segment)];
	}

	return true;
}

function nextContainer(segment: PathSegment) {
	return typeof segment === "number" || /^\d+$/.test(String(segment)) ? [] : {};
}

export function setValueAtPath<T extends SaveData>(source: T, path: PathSegment[], value: unknown): T {
	const clone = structuredClone(source) as T;

	if (path.length === 0) {
		return clone;
	}

	let current: unknown = clone;

	for (let index = 0; index < path.length - 1; index += 1) {
		const key = String(path[index]);
		const record = current as Record<string, unknown>;
		const nextValue = record[key];

		if (nextValue == null || typeof nextValue !== "object") {
			record[key] = nextContainer(path[index + 1]);
		}

		current = record[key];
	}

	(current as Record<string, unknown>)[String(path[path.length - 1])] = value;
	return clone;
}

export function removeValueAtPath<T extends SaveData>(source: T, path: PathSegment[]): T {
	const clone = structuredClone(source) as T;

	if (path.length === 0) {
		return clone;
	}

	let current: unknown = clone;

	for (let index = 0; index < path.length - 1; index += 1) {
		if (current == null || typeof current !== "object") {
			return clone;
		}

		current = (current as Record<string, unknown>)[String(path[index])];
	}

	if (current && typeof current === "object") {
		delete (current as Record<string, unknown>)[String(path[path.length - 1])];
	}

	return clone;
}

export function joinClasses(...values: Array<string | false | null | undefined>) {
	return values.filter(Boolean).join(" ");
}

export function toSelectValue(value: string | number | undefined) {
	return value == null ? "" : String(value);
}