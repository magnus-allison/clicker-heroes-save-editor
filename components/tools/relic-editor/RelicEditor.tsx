'use client';

import { useMemo, useRef, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { SaveDataPanel } from '@/components/editor/SaveDataPanel';
import { Breadcrumb } from '@/components/home/Breadcrumb';
import { RelicIcon, relicNameClassName } from '@/components/tools/relic-viewer/RelicRarity';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { CardTitle } from '@/components/ui/LinkCard';
import { NumberInput } from '@/components/ui/NumberInput';
import { PanelSection } from '@/components/ui/PanelSection';
import { Pill } from '@/components/ui/Pill';
import { useToast } from '@/components/ui/ToastProvider';
import { cn } from 'cn';
import { relicExamples } from '@/lib/data/example-saves';
import { getRelicRarity, relicBonusAncients, relicRarities } from '@/lib/data/relic-bonuses';
import { formatNumber, toFiniteNumber } from '@/lib/format';
import {
	addRelic,
	getEquipmentSlots,
	getJunkPileSlot,
	getRelicBonusLines,
	getRelicContainer,
	moveRelicToSlot,
	relicImageEntries,
	relicTypes,
	removeRelic,
	setRelicBonus,
	setRelicImage,
	setRelicRarity,
	toRelicEntries,
	updateRelic,
	type RelicEntry,
	type RelicType
} from '@/lib/relics';
import { useSaveFlowStep } from '@/lib/save-flow';
import { useSaveStore } from '@/lib/save-store';
import type { SelectOption } from '@/lib/save-utils';

/** `Dropdown` values are strings; this one means "in no slot". */
const NO_SLOT = 'none';

/** Confirmed bonuses, alphabetical so an ancient is easy to find. */
const confirmedBonusOptions = Object.entries(relicBonusAncients)
	.map(([type, ancient]) => ({ value: Number(type), label: ancient }))
	.sort((left, right) => left.label.localeCompare(right.label));

export const RelicEditor = () => {
	const t = useTranslations('tools.relicEditor');
	const tRelic = useTranslations('tools.relic');
	const tCommon = useTranslations('common.ui');
	const { showToast } = useToast();
	const saveData = useSaveStore((state) => state.saveData);
	const updateSave = useSaveStore((state) => state.updateSave);
	const updateValue = useSaveStore((state) => state.updateValue);
	const activeStep = useSaveFlowStep({ hasEditStep: true });
	const step2Ref = useRef<HTMLDivElement>(null);
	const [newRelicType, setNewRelicType] = useState<RelicType>(relicTypes[0]);

	const container = getRelicContainer(saveData);
	const relics = useMemo(() => toRelicEntries(saveData), [saveData]);
	const hasSave = saveData !== null;
	const equipmentSlots = getEquipmentSlots(container);
	const junkPileSlot = getJunkPileSlot(container);

	const slotOptions: SelectOption[] = [
		...Array.from({ length: equipmentSlots }, (_, index) => ({
			value: String(index + 1),
			label: t('slots.equipped', { number: index + 1 })
		})),
		{ value: String(junkPileSlot), label: tRelic('junkPile') },
		{ value: NO_SLOT, label: t('slots.none') }
	];

	const typeOptions: SelectOption[] = relicTypes.map((type) => ({
		value: type,
		label: tRelic(`types.${type}`)
	}));

	const handleAdd = () => {
		if (!saveData) {
			return;
		}

		const { save } = addRelic(saveData, newRelicType);
		updateSave(() => save);
		showToast(t('add.added'));
	};

	const handleRemove = (entry: RelicEntry) => {
		updateSave((current) => removeRelic(current, entry.uid));
		showToast(t('relic.removed'));
	};

	return (
		<>
			<Breadcrumb page='relicEditor' title='tools' />

			<SaveDataPanel
				examples={relicExamples}
				hasEditStep
				onLoadSuccess={() => step2Ref.current?.scrollIntoView({ behavior: 'smooth' })}
			/>

			<div className={cn(!hasSave && 'pointer-events-none opacity-40 select-none')} inert={!hasSave}>
				<div ref={step2Ref} className='mt-5 mb-6 flex scroll-mt-8 flex-row items-center gap-3'>
					<Pill isShining={activeStep === 2}>{tCommon('step', { number: 2 })}</Pill>
					<CardTitle className='pt-1' title={t('editTitle')} />
				</div>

				<PanelSection>
					<div className='grid gap-6 p-4'>
						<ul className='grid list-disc gap-1 pl-5 text-sm text-(--color-fg-muted)'>
							<li>{t('notes.names')}</li>
							<li>{t('notes.levels')}</li>
							<li>{t('notes.bonuses')}</li>
							<li>{t('notes.slots')}</li>
						</ul>

						<div className='flex flex-wrap items-end gap-6'>
							<label className='grid gap-1.5 text-[11px] uppercase tracking-[0.08em] text-(--color-fg-dim)'>
								{t('forgeCores')}
								<NumberInput
									allowDecimal={false}
									ariaLabel={t('forgeCores')}
									onCommit={(value) =>
										updateValue(['items', 'salvagePoints'], Math.max(0, Math.floor(value)))
									}
									selectOnFocus
									value={toFiniteNumber(container?.salvagePoints) ?? 0}
								/>
							</label>

							<div className='grid gap-1.5'>
								<span className='text-[11px] uppercase tracking-[0.08em] text-(--color-fg-dim)'>
									{t('add.label')}
								</span>
								<div className='flex items-center gap-2'>
									<div className='w-36'>
										<Dropdown
											aria-label={t('add.typeAria')}
											onChange={(event) => setNewRelicType(event.target.value as RelicType)}
											options={typeOptions}
											value={newRelicType}
										/>
									</div>
									<Button onClick={handleAdd} type='button' variant='primary'>
										<Plus aria-hidden='true' className='size-3.5' />
										{t('add.action')}
									</Button>
								</div>
							</div>
						</div>

						{relics.length === 0 ? (
							<p className='py-6 text-center text-sm text-(--color-fg-muted)'>
								{hasSave ? t('emptySave') : t('noSave')}
							</p>
						) : (
							<div className='grid gap-4 lg:grid-cols-2'>
								{relics.map((entry) => (
									<RelicCard
										entry={entry}
										key={entry.uid}
										onRemove={() => handleRemove(entry)}
										slotOptions={slotOptions}
									/>
								))}
							</div>
						)}
					</div>
				</PanelSection>
			</div>
		</>
	);
};

type RelicCardProps = {
	entry: RelicEntry;
	slotOptions: SelectOption[];
	onRemove: () => void;
};

const RelicCard = ({ entry, slotOptions, onRemove }: RelicCardProps) => {
	const t = useTranslations('tools.relicEditor');
	const tRelic = useTranslations('tools.relic');
	const updateSave = useSaveStore((state) => state.updateSave);

	const rarityNumber = toFiniteNumber(entry.data.rarity);
	const rarity = getRelicRarity(rarityNumber);
	const lines = getRelicBonusLines(entry.data);
	const name = typeof entry.data.name === 'string' && entry.data.name.trim() ? entry.data.name : '—';
	const typeKey = relicTypes.find((type) => type === entry.data.type);
	const imageId = toFiniteNumber(entry.data.imageId);

	// Every look, grouped by type in the game's order; an id the site lacks stays selectable.
	const lookOptions: SelectOption[] = [
		...relicTypes.flatMap((type) =>
			relicImageEntries
				.filter(([, image]) => image.type === type)
				.map(([id, image]) => ({ value: String(id), label: `${tRelic(`types.${type}`)} · ${image.name}` }))
		),
		...(imageId !== null && !relicImageEntries.some(([id]) => id === imageId)
			? [{ value: String(imageId), label: `#${imageId}` }]
			: [])
	];

	const rarityOptions: SelectOption[] = [
		...relicRarities.map((key, index) => ({ value: String(index + 1), label: tRelic(`rarities.${key}`) })),
		// Keep a rarity the site cannot name yet, rather than silently changing it.
		...(rarityNumber !== null && !rarity ? [{ value: String(rarityNumber), label: `#${rarityNumber}` }] : [])
	];

	const editRelic = (edit: Parameters<typeof updateRelic>[2]) =>
		updateSave((current) => updateRelic(current, entry.uid, edit));

	return (
		<article
			aria-label={name}
			className='grid gap-4 rounded-(--radius-card) border border-(--color-line-subtle) bg-(--color-surface-sunken) p-4'
		>
			<header className='flex items-center gap-3'>
				<RelicIcon imageId={entry.data.imageId} rarity={rarity} />
				<div className='min-w-0 flex-1'>
					<h3 className={cn('truncate text-sm font-semibold text-(--color-fg)', relicNameClassName(rarity))}>
						{name}
					</h3>
					<p className='text-xs text-(--color-fg-muted)'>
						{typeKey ? tRelic(`types.${typeKey}`) : String(entry.data.type ?? '—')}
						{' · '}
						{t('relic.level', { level: formatNumber(entry.data.level ?? 0) })}
					</p>
				</div>
				<Button
					aria-label={t('relic.removeAria', { name })}
					onClick={onRemove}
					size='sm'
					type='button'
					variant='ghost'
				>
					<Trash2 aria-hidden='true' className='size-3.5' />
					{t('relic.remove')}
				</Button>
			</header>

			<div className='grid gap-3 sm:grid-cols-2'>
				<label className='grid gap-1.5 text-[11px] uppercase tracking-[0.08em] text-(--color-fg-dim) sm:col-span-2'>
					{t('relic.look')}
					<Dropdown
						aria-label={t('relic.lookAria', { name })}
						onChange={(event) => editRelic((relic) => setRelicImage(relic, Number(event.target.value)))}
						options={lookOptions}
						value={imageId === null ? '' : String(imageId)}
					/>
				</label>
				<label className='grid gap-1.5 text-[11px] uppercase tracking-[0.08em] text-(--color-fg-dim)'>
					{t('relic.slot')}
					<Dropdown
						aria-label={t('relic.slotAria', { name })}
						onChange={(event) => {
							const value = event.target.value;
							updateSave((current) =>
								moveRelicToSlot(current, entry.uid, value === NO_SLOT ? null : Number(value))
							);
						}}
						options={slotOptions}
						value={entry.slot === null ? NO_SLOT : String(entry.slot)}
					/>
				</label>
				<label className='grid gap-1.5 text-[11px] uppercase tracking-[0.08em] text-(--color-fg-dim)'>
					{t('relic.rarity')}
					<Dropdown
						aria-label={t('relic.rarityAria', { name })}
						onChange={(event) => editRelic((relic) => setRelicRarity(relic, Number(event.target.value)))}
						options={rarityOptions}
						value={rarityNumber === null ? '' : String(rarityNumber)}
					/>
				</label>
			</div>

			<div className='grid gap-2'>
				{lines.map((bonus) => {
					const usedElsewhere = new Set(
						lines.filter((other) => other.line !== bonus.line && other.type > 0).map((other) => other.type)
					);
					const bonusOptions: SelectOption[] = [
						{ value: 0, label: t('bonus.none') },
						...confirmedBonusOptions.filter((option) => !usedElsewhere.has(option.value)),
						// An unconfirmed type already in the save stays selectable so it is not lost.
						...(bonus.type > 0 && !bonus.ancient
							? [{ value: bonus.type, label: t('bonus.unconfirmed', { type: bonus.type }) }]
							: [])
					];

					return (
						<div className='grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2' key={bonus.line}>
							<Dropdown
								aria-label={t('bonus.typeAria', { line: bonus.line })}
								onChange={(event) =>
									editRelic((relic) =>
										setRelicBonus(relic, bonus.line, Number(event.target.value), bonus.points || 1)
									)
								}
								options={bonusOptions}
								value={bonus.type}
							/>
							<NumberInput
								allowDecimal={false}
								ariaLabel={t('bonus.pointsAria', { line: bonus.line })}
								compact
								disabled={bonus.type === 0}
								increments={[]}
								onCommit={(value) =>
									editRelic((relic) => setRelicBonus(relic, bonus.line, bonus.type, value))
								}
								selectOnFocus
								value={bonus.points}
							/>
						</div>
					);
				})}
			</div>
		</article>
	);
};
