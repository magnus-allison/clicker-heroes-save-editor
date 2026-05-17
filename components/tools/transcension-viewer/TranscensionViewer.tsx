'use client';

import { useMemo, useState } from 'react';

import { EditorTable, EditorTableBody, EditorTableHead } from '@/components/ui/EditorTable';
import { PageHeading } from '@/components/ui/PageHeading';
import { PanelSection } from '@/components/ui/PanelSection';
import { StepTitle } from '@/components/ui/StepTitle';
import { SaveDataPanel } from '@/components/editor/SaveDataPanel';
import { cn } from '@/lib/cn';
import { useSaveStore } from '@/lib/save-store';
import { getValueAtPath } from '@/lib/save-utils';
import { transcensionExamples } from '@/lib/data/example-saves';

type SaveRecord = Record<string, unknown>;

type HistoryEntry = {
	index: number;
	data: SaveRecord;
};

type FieldMatch = {
	key: string;
	value: unknown;
};

const numberFormat = new Intl.NumberFormat('en-US', {
	maximumFractionDigits: 0
});

const fieldAliases = {
	duration: ['duration', 'time', 'timePlayed', 'seconds', 'elapsedSeconds', 'durationSeconds'],
	highestZone: ['highestZone', 'highestZoneEver', 'highestZoneThisTranscension', 'hze', 'zone'],
	heroSouls: ['heroSouls', 'heroSoulsSacrificed', 'heroSoulsGained', 'hs', 'souls'],
	ancientSouls: [
		'ancientSouls',
		'ancientSoulsGained',
		'ancientSoulsTotal',
		'ancientSoulsEarned',
		'ancientSoulsAfterTranscension',
		'totalAncientSouls',
		'as'
	],
	ascensionCount: ['numAscensions', 'ascensionCount'],
	ascensionHistory: ['ascensions', 'ascensionLog', 'ascensionHistory']
} as const;

const normalizeKey = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

const getFirstMatch = (entry: SaveRecord, aliases: readonly string[]): FieldMatch | undefined => {
	const normalizedAliases = aliases.map(normalizeKey);
	const entries = Object.entries(entry);
	const exactMatch = normalizedAliases
		.map((alias) => entries.find(([key, value]) => value !== undefined && normalizeKey(key) === alias))
		.find((match) => match !== undefined);

	if (exactMatch) {
		return { key: exactMatch[0], value: exactMatch[1] };
	}

	return entries
		.filter(([, value]) => value !== undefined)
		.map(([key, value]) => ({ key, normalizedKey: normalizeKey(key), value }))
		.find(({ normalizedKey }) =>
			normalizedAliases.some(
				(alias) =>
					alias.length > 2 && (normalizedKey.includes(alias) || alias.includes(normalizedKey))
			)
		);
};

const getFirstValue = (entry: SaveRecord, aliases: readonly string[]) => getFirstMatch(entry, aliases)?.value;

const getHistoryValue = (entry: SaveRecord, aliases: readonly string[]) => {
	const normalizedAliases = aliases.map(normalizeKey);

	return normalizedAliases
		.map((alias) =>
			Object.entries(entry).find(
				([key, value]) =>
					value !== undefined &&
					(Array.isArray(value) || isRecord(value)) &&
					normalizeKey(key) === alias
			)
		)
		.find((match) => match !== undefined)?.[1];
};

const isRecord = (value: unknown): value is SaveRecord =>
	Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const toHistoryEntries = (value: unknown): HistoryEntry[] => {
	if (Array.isArray(value)) {
		return value
			.map((entry, index) => (isRecord(entry) ? { index, data: entry } : null))
			.filter((entry): entry is HistoryEntry => Boolean(entry));
	}

	if (!isRecord(value)) {
		return [];
	}

	return Object.entries(value)
		.map(([key, entry], fallbackIndex) => {
			if (!isRecord(entry)) {
				return null;
			}

			const numericIndex = Number(key);
			return {
				index: Number.isFinite(numericIndex) ? numericIndex : fallbackIndex,
				data: entry
			};
		})
		.filter((entry): entry is HistoryEntry => Boolean(entry))
		.sort((left, right) => left.index - right.index);
};

const formatDuration = (match: FieldMatch | undefined) => {
	const value = match?.value;

	if (typeof value === 'string' && value.trim()) {
		const numericValue = Number(value);
		if (!Number.isFinite(numericValue)) {
			return value;
		}
	}

	const numericValue = typeof value === 'number' ? value : Number(value ?? 0);
	if (!Number.isFinite(numericValue) || numericValue <= 0) {
		return '0m';
	}

	const key = normalizeKey(match?.key ?? '');
	const totalMinutes =
		key.includes('second') || key === 'seconds'
			? Math.floor(numericValue / 60)
			: Math.floor(numericValue);
	const days = Math.floor(totalMinutes / 1440);
	const hours = Math.floor((totalMinutes % 1440) / 60);
	const minutes = totalMinutes % 60;
	const parts = [
		days > 0 ? `${days}d` : null,
		hours > 0 ? `${hours}h` : null,
		minutes > 0 || (days === 0 && hours === 0) ? `${minutes}m` : null
	];

	return parts.filter(Boolean).join(' ');
};

const formatDurationMinutes = (totalMinutes: number) => {
	if (!Number.isFinite(totalMinutes) || totalMinutes <= 0) {
		return '0m';
	}

	const minutesValue = Math.floor(totalMinutes);
	const days = Math.floor(minutesValue / 1440);
	const hours = Math.floor((minutesValue % 1440) / 60);
	const minutes = minutesValue % 60;
	const parts = [
		days > 0 ? `${days}d` : null,
		hours > 0 ? `${hours}h` : null,
		minutes > 0 || (days === 0 && hours === 0) ? `${minutes}m` : null
	];

	return parts.filter(Boolean).join(' ');
};

const getDurationLabel = (entry: SaveRecord) => {
	const startTime = Number(entry.startTime);
	const endTime = Number(entry.endTime);

	if (Number.isFinite(startTime) && Number.isFinite(endTime)) {
		return formatDurationMinutes((endTime - startTime) / 60000);
	}

	return formatDuration(getFirstMatch(entry, fieldAliases.duration));
};

const getLog10 = (value: unknown) => {
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

	const [integerPartRaw, decimalPartRaw = ''] = rawValue.split('.');
	const integerPart = integerPartRaw.replace(/^0+/, '');

	if (integerPart.length > 0) {
		const leadingDigits = integerPart.slice(0, 16);
		return Math.log10(Number(leadingDigits)) + integerPart.length - leadingDigits.length;
	}

	const firstDecimalDigit = decimalPartRaw.search(/[1-9]/);
	if (firstDecimalDigit === -1) {
		return null;
	}

	const leadingDecimalDigits = decimalPartRaw.slice(firstDecimalDigit, firstDecimalDigit + 16);
	return Math.log10(Number(leadingDecimalDigits)) - firstDecimalDigit - leadingDecimalDigits.length;
};

const getAncientSoulsLabel = (entry: SaveRecord) => {
	const heroSoulsGained = getFirstValue(entry, fieldAliases.heroSouls);
	const log10HeroSouls = getLog10(heroSoulsGained);

	if (log10HeroSouls == null) {
		return formatNumberValue(getFirstValue(entry, fieldAliases.ancientSouls));
	}

	return numberFormat.format(Math.floor(log10HeroSouls * 5));
};

const formatNumberValue = (value: unknown) => {
	if (typeof value === 'string' && value.trim()) {
		const numericValue = Number(value);
		if (!Number.isFinite(numericValue)) {
			return value;
		}
		return formatNumberValue(numericValue);
	}

	const numericValue = typeof value === 'number' ? value : Number(value ?? 0);
	if (!Number.isFinite(numericValue)) {
		return String(value ?? 0);
	}

	if (Math.abs(numericValue) >= 1_000_000) {
		return numericValue.toExponential(4).replace('e+', 'e');
	}

	return numberFormat.format(numericValue);
};

const getAscensions = (transcension: SaveRecord) =>
	toHistoryEntries(getHistoryValue(transcension, fieldAliases.ascensionHistory));

const getAscensionCount = (transcension: SaveRecord) => {
	const ascensionValue = getFirstValue(transcension, fieldAliases.ascensionCount);
	if (typeof ascensionValue === 'number' || typeof ascensionValue === 'string') {
		return formatNumberValue(ascensionValue);
	}

	return numberFormat.format(getAscensions(transcension).length);
};

const getEntryNumberLabel = (entry: HistoryEntry) => {
	const id = entry.data.id;
	return typeof id === 'number' || typeof id === 'string' ? String(id) : String(entry.index);
};

export const TranscensionViewer = () => {
	const saveData = useSaveStore((state) => state.saveData);
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
	const transcensions = useMemo(
		() => toHistoryEntries(getValueAtPath(saveData, ['stats', 'transcensions'])),
		[saveData]
	);
	const selectedTranscension =
		transcensions.find((transcension) => transcension.index === selectedIndex) ?? transcensions[0];
	const selectedAscensions = selectedTranscension ? getAscensions(selectedTranscension.data) : [];

	return (
		<div className='flex min-h-screen w-full justify-center overflow-x-hidden p-5 sm:p-10'>
			<main className='flex w-full max-w-6xl flex-col gap-3'>
				<PageHeading
					title='Clicker Heroes Transcension Viewer'
					subtitle='Import a save to inspect every transcension and drill into the ascensions inside it.'
				/>

				<SaveDataPanel examples={transcensionExamples} />

				<div className='ml-2'>
					<StepTitle step={2} title='Transcensions' />
				</div>
				<PanelSection>
					<div className='grid gap-4 p-4'>
						<EditorTable
							className='border-(--color-border-subtle)'
							tableClassName='w-full table-fixed'
						>
							<colgroup>
								<col className='w-16' />
								<col className='w-32' />
								<col className='w-28' />
								<col className='w-24' />
								<col className='w-32' />
								<col className='w-24' />
							</colgroup>
							<EditorTableHead>
								<tr>
									<th className='px-3 py-3 sm:px-4'>No.</th>
									<th className='px-3 py-3 sm:px-4'>Duration</th>
									<th className='px-3 py-3 text-right sm:px-4'>Ascensions</th>
									<th className='px-3 py-3 text-right sm:px-4'>HZE</th>
									<th className='px-3 py-3 text-right sm:px-4'>HS</th>
									<th className='px-3 py-3 text-right sm:px-4'>AS</th>
								</tr>
							</EditorTableHead>
							<EditorTableBody>
								{transcensions.length > 0 ? (
									transcensions.map((transcension) => {
										const isSelected = transcension.index === selectedTranscension?.index;

										return (
											<tr
												className={cn(
													'cursor-pointer border-t border-(--color-border-soft) transition hover:bg-(--color-bg-hover)',
													isSelected &&
														'bg-(--color-primary-dim) text-(--color-text)'
												)}
												key={transcension.index}
												onClick={() => setSelectedIndex(transcension.index)}
											>
												<td className='px-3 py-3 font-mono text-(--color-text) sm:px-4'>
													{getEntryNumberLabel(transcension)}
												</td>
												<td className='px-3 py-3 sm:px-4'>
													{getDurationLabel(transcension.data)}
												</td>
												<td className='px-3 py-3 text-right tabular-nums sm:px-4'>
													{getAscensionCount(transcension.data)}
												</td>
												<td className='px-3 py-3 text-right tabular-nums sm:px-4'>
													{formatNumberValue(
														getFirstValue(
															transcension.data,
															fieldAliases.highestZone
														)
													)}
												</td>
												<td className='px-3 py-3 text-right tabular-nums sm:px-4'>
													{formatNumberValue(
														getFirstValue(
															transcension.data,
															fieldAliases.heroSouls
														)
													)}
												</td>
												<td className='px-3 py-3 text-right tabular-nums sm:px-4'>
													{getAncientSoulsLabel(transcension.data)}
												</td>
											</tr>
										);
									})
								) : (
									<tr>
										<td
											className='px-3 py-6 text-center text-(--color-text-muted) sm:px-4'
											colSpan={6}
										>
											Load a save with transcension history to see it here.
										</td>
									</tr>
								)}
							</EditorTableBody>
						</EditorTable>
					</div>
				</PanelSection>

				<div className='ml-2'>
					<StepTitle
						step={3}
						title={
							selectedTranscension
								? `Ascensions in Transcension #${getEntryNumberLabel(selectedTranscension)}`
								: 'Ascensions in Transcension'
						}
					/>
				</div>
				<PanelSection>
					<div className='grid gap-4 p-4'>
						<EditorTable
							className='border-(--color-border-subtle)'
							tableClassName='w-full table-fixed'
						>
							<colgroup>
								<col className='w-16' />
								<col className='w-32' />
								<col className='w-24' />
								<col className='w-32' />
							</colgroup>
							<EditorTableHead>
								<tr>
									<th className='px-3 py-3 sm:px-4'>No.</th>
									<th className='px-3 py-3 sm:px-4'>Duration</th>
									<th className='px-3 py-3 text-right sm:px-4'>HZE</th>
									<th className='px-3 py-3 text-right sm:px-4'>HS</th>
								</tr>
							</EditorTableHead>
							<EditorTableBody>
								{selectedAscensions.length > 0 ? (
									selectedAscensions.map((ascension) => (
										<tr
											className='border-t border-(--color-border-soft)'
											key={ascension.index}
										>
											<td className='px-3 py-3 font-mono text-(--color-text) sm:px-4'>
												{getEntryNumberLabel(ascension)}
											</td>
											<td className='px-3 py-3 sm:px-4'>
												{getDurationLabel(ascension.data)}
											</td>
											<td className='px-3 py-3 text-right tabular-nums sm:px-4'>
												{formatNumberValue(
													getFirstValue(ascension.data, fieldAliases.highestZone)
												)}
											</td>
											<td className='px-3 py-3 text-right tabular-nums sm:px-4'>
												{formatNumberValue(
													getFirstValue(ascension.data, fieldAliases.heroSouls)
												)}
											</td>
										</tr>
									))
								) : (
									<tr>
										<td
											className='px-3 py-6 text-center text-(--color-text-muted) sm:px-4'
											colSpan={4}
										>
											Select a transcension with ascension history to see its ascensions
											here.
										</td>
									</tr>
								)}
							</EditorTableBody>
						</EditorTable>
					</div>
				</PanelSection>
			</main>
		</div>
	);
};
