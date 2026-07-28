/**
 * Canonical value formatters.
 *
 * These were previously reimplemented in four places (`save-utils`,
 * `TranscensionViewer`, `InstakillCalculator`, `OutsidersSection`) with subtly
 * different rounding and thresholds. Everything formats through here now.
 */

const groupedNumber = new Intl.NumberFormat('en-US');
const oneDecimal = new Intl.NumberFormat('en-US', {
	minimumFractionDigits: 1,
	maximumFractionDigits: 1
});

const MINUTES_PER_DAY = 1440;
const MINUTES_PER_HOUR = 60;

/** Coerce an unknown save value to a finite number, or `null` if impossible. */
export function toFiniteNumber(value: unknown): number | null {
	if (typeof value === 'number') {
		return Number.isFinite(value) ? value : null;
	}

	if (typeof value === 'string') {
		const trimmed = value.trim().replaceAll(',', '');
		if (!trimmed) {
			return null;
		}
		const parsed = Number(trimmed);
		return Number.isFinite(parsed) ? parsed : null;
	}

	return null;
}

/**
 * Thousands-separated integer. Falls back to the original stringified value
 * when it is not numeric, so unexpected save contents stay visible.
 */
export function formatNumber(value: unknown): string {
	const numericValue = toFiniteNumber(value);
	return numericValue === null ? String(value ?? '') : groupedNumber.format(numericValue);
}

/**
 * Like `formatNumber`, but switches to scientific notation for the very large
 * values idle-game saves contain.
 */
export function formatLargeNumber(value: unknown, exponentialAbove = 1_000_000): string {
	const numericValue = toFiniteNumber(value);

	if (numericValue === null) {
		return String(value ?? '');
	}

	if (Math.abs(numericValue) >= exponentialAbove) {
		return numericValue.toExponential(4).replace('e+', 'e');
	}

	return groupedNumber.format(numericValue);
}

/** One-decimal number, for multipliers and percentages. */
export function formatDecimal(value: unknown): string {
	const numericValue = toFiniteNumber(value);
	return numericValue === null ? String(value ?? '') : oneDecimal.format(numericValue);
}

/**
 * `1d 2h 3m`, dropping zero units but always emitting at least `0m`.
 */
export function formatDurationMinutes(totalMinutes: number): string {
	if (!Number.isFinite(totalMinutes) || totalMinutes <= 0) {
		return '0m';
	}

	const wholeMinutes = Math.floor(totalMinutes);
	const days = Math.floor(wholeMinutes / MINUTES_PER_DAY);
	const hours = Math.floor((wholeMinutes % MINUTES_PER_DAY) / MINUTES_PER_HOUR);
	const minutes = wholeMinutes % MINUTES_PER_HOUR;

	const parts = [
		days > 0 ? `${days}d` : null,
		hours > 0 ? `${hours}h` : null,
		minutes > 0 || (days === 0 && hours === 0) ? `${minutes}m` : null
	];

	return parts.filter(Boolean).join(' ');
}

/** `formatDurationMinutes` for a value expressed in seconds. */
export function formatDurationSeconds(totalSeconds: number): string {
	if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
		return '0m';
	}

	return formatDurationMinutes(totalSeconds / 60);
}

/**
 * Base-10 logarithm of an arbitrarily large save value, including values that
 * exceed `Number.MAX_VALUE` and are therefore stored as digit strings.
 * Returns `null` for non-positive or unparseable input.
 */
export function log10OfSaveValue(value: unknown): number | null {
	if (typeof value === 'number') {
		return value > 0 && Number.isFinite(value) ? Math.log10(value) : null;
	}

	const rawValue = String(value ?? '')
		.trim()
		.replaceAll(',', '');

	if (!rawValue || rawValue.startsWith('-')) {
		return null;
	}

	const scientificMatch = rawValue.match(/^(\d+(?:\.\d+)?|\.\d+)[eE]([+-]?\d+)$/);
	if (scientificMatch) {
		const mantissa = Number(scientificMatch[1]);
		const exponent = Number(scientificMatch[2]);
		return mantissa > 0 && Number.isFinite(exponent) ? Math.log10(mantissa) + exponent : null;
	}

	const [integerPartRaw = '', decimalPartRaw = ''] = rawValue.split('.');
	const integerPart = integerPartRaw.replace(/^0+/, '');

	// Only the leading 16 digits fit in a double; the rest is accounted for by
	// the digit count.
	if (integerPart.length > 0) {
		const leadingDigits = integerPart.slice(0, 16);
		const leading = Number(leadingDigits);
		if (!Number.isFinite(leading) || leading <= 0) {
			return null;
		}
		return Math.log10(leading) + integerPart.length - leadingDigits.length;
	}

	const firstSignificant = decimalPartRaw.search(/[1-9]/);
	if (firstSignificant === -1) {
		return null;
	}

	const leadingDecimalDigits = decimalPartRaw.slice(firstSignificant, firstSignificant + 16);
	const leading = Number(leadingDecimalDigits);
	if (!Number.isFinite(leading) || leading <= 0) {
		return null;
	}

	return Math.log10(leading) - firstSignificant - leadingDecimalDigits.length;
}
