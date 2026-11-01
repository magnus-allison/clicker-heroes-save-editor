import { achievementEntries, getAchievementImage } from '@/lib/data/achievements';
import {
	autoClickerSkins,
	mercenarySlots,
	mercenarySummaryFields,
	ancientSoulFields,
	clanFields,
	outsiderFields,
	type SimpleFieldConfig
} from '@/lib/data/editor-config';
import { orderedHeroes } from '@/lib/data/heroes';
import { seasonalItemFields } from '@/lib/data/seasonalItems';
import { shopItemFields } from '@/lib/data/shopItems';
import { zoneItemFields } from '@/lib/data/zoneItems';
import { formatLargeNumber } from '@/lib/format';
import { countEntries, type SaveChange } from '@/lib/save-diff';
import type { PathSegment, SelectOption } from '@/lib/save-utils';

/**
 * A piece of user-facing text: the English `text`, plus the `editor` message
 * key (and its ICU values) the UI translates it with. Without a key, or when
 * the locale has no such message, `text` is shown as is — raw save keys and
 * game names are the same in every language.
 */
export type ChangeText = {
	text: string;
	key?: string;
	values?: Record<string, string | number>;
};

export type DescribedChange = {
	/** Stable list key: the dotted save path. */
	key: string;
	label: ChangeText;
	imageSrc?: string;
	from: ChangeText;
	to: ChangeText;
};

type PathDescriptor = {
	label: ChangeText;
	imageSrc?: string;
	options?: readonly SelectOption[];
	/** Message prefix for option labels: `${optionsKey}.${value}`. */
	optionsKey?: string;
};

const pathKey = (path: PathSegment[]) => path.join('.');

/**
 * Every field the editor exposes through a `SimpleFieldConfig` already carries
 * the label and icon the diff wants, so the two stay in sync by construction:
 * add a field to a section and it shows up here named correctly.
 */
const simpleFieldGroups: SimpleFieldConfig[][] = [
	shopItemFields,
	seasonalItemFields,
	zoneItemFields,
	clanFields,
	mercenarySummaryFields,
	ancientSoulFields
];

const staticDescriptors = new Map<string, PathDescriptor>();

for (const group of simpleFieldGroups) {
	for (const field of group) {
		const key = pathKey(field.path);
		staticDescriptors.set(key, {
			label: { text: field.label, key: `fields.${key}` },
			imageSrc: field.imageSrc,
			options: field.options,
			optionsKey: field.options ? `fieldOptions.${key}` : undefined
		});
	}
}

for (const outsider of outsiderFields) {
	staticDescriptors.set(pathKey(outsider.levelPath), {
		label: {
			text: `${outsider.name} · Level`,
			key: 'changes.labels.outsiderLevel',
			values: { name: outsider.name }
		},
		imageSrc: outsider.imageSrc
	});
	staticDescriptors.set(pathKey(outsider.spentPath), {
		label: {
			text: `${outsider.name} · Ancient Souls Spent`,
			key: 'changes.labels.outsiderSpent',
			values: { name: outsider.name }
		},
		imageSrc: outsider.imageSrc
	});
}

const mercenaryFieldLabels = {
	namePath: { suffix: 'Name', key: 'changes.labels.mercenaryName' },
	levelPath: { suffix: 'Level', key: 'changes.labels.mercenaryLevel' },
	timeToDiePath: { suffix: 'Time To Die', key: 'changes.labels.mercenaryTimeToDie' },
	bonusLivesPath: { suffix: 'Bonus Lives', key: 'changes.labels.mercenaryBonusLives' }
} as const;

for (const slot of mercenarySlots) {
	for (const [field, { key, suffix }] of Object.entries(mercenaryFieldLabels)) {
		staticDescriptors.set(pathKey(slot[field as keyof typeof mercenaryFieldLabels]), {
			label: { text: `Mercenary ${slot.id + 1} · ${suffix}`, key, values: { number: slot.id + 1 } }
		});
	}
}

const heroesById = new Map(orderedHeroes.map((hero) => [String(hero.heroId), hero]));
const achievementsById = new Map(achievementEntries.map((entry) => [String(entry.id), entry.achievement]));
const skinsById = new Map(autoClickerSkins.map((skin) => [String(skin.id), skin]));
const skinOptions: SelectOption[] = autoClickerSkins.map((skin) => ({
	label: skin.name,
	value: skin.id
}));

staticDescriptors.set('currentAutoclickerSkin', {
	label: { text: 'Current Auto Clicker Skin', key: 'changes.labels.currentSkin' },
	options: skinOptions
});
staticDescriptors.set('stats.transcensions', {
	label: { text: 'Transcension History', key: 'changes.labels.transcensionHistory' }
});

const heroSuffixes: Record<string, { suffix: string; key: string }> = {
	level: { suffix: 'Level', key: 'changes.labels.heroLevel' },
	epicLevel: { suffix: 'Gilded Level', key: 'changes.labels.heroGildedLevel' }
};

/** `transcendentHighestFinishedZone` → `Transcendent Highest Finished Zone`. */
function prettifySegment(segment: PathSegment) {
	const spaced = String(segment)
		.replace(/[_-]+/g, ' ')
		.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
		.trim();

	return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function describePath(path: PathSegment[]): PathDescriptor {
	const key = pathKey(path);
	const staticMatch = staticDescriptors.get(key);

	if (staticMatch) {
		return staticMatch;
	}

	const [root, second, third, fourth] = path;

	if (root === 'heroCollection' && second === 'heroes' && path.length === 4) {
		const hero = heroesById.get(String(third));

		if (hero) {
			const isGilded = String(fourth) === 'epicLevel';
			const suffix = heroSuffixes[String(fourth)];
			return {
				label: suffix
					? { text: `${hero.name} · ${suffix.suffix}`, key: suffix.key, values: { name: hero.name } }
					: { text: `${hero.name} · ${prettifySegment(fourth)}` },
				imageSrc: (isGilded ? hero.gildedImage : hero.image) ?? hero.image
			};
		}
	}

	if (root === 'achievements' && path.length === 2) {
		const achievement = achievementsById.get(String(second));

		if (achievement) {
			return {
				label: {
					text: `Achievement · ${achievement[0]}`,
					key: 'changes.labels.achievement',
					values: { name: achievement[0] }
				},
				imageSrc: getAchievementImage(achievement[4])
			};
		}
	}

	if (root === 'autoclickerSkins' && path.length === 2) {
		const skin = skinsById.get(String(second));

		if (skin) {
			return {
				label: {
					text: `${skin.name} · Unlocked`,
					key: 'changes.labels.skinUnlocked',
					values: { name: skin.name }
				},
				imageSrc: skin.imageSrc
			};
		}
	}

	// Anything the editor does not have a config for — a raw JSON edit, or a
	// key added by a newer game version — still gets a readable name.
	return { label: { text: path.map(prettifySegment).join(' › ') || 'Save' } };
}

export function formatChangeValue(
	value: unknown,
	options?: readonly SelectOption[],
	optionsKey?: string
): ChangeText {
	if (value === undefined) {
		return { text: '—' };
	}

	if (value === null) {
		return { text: 'none', key: 'changes.values.none' };
	}

	if (typeof value === 'boolean') {
		return value ? { text: 'Yes', key: 'changes.values.yes' } : { text: 'No', key: 'changes.values.no' };
	}

	if (options) {
		const match = options.find((option) => String(option.value) === String(value));
		if (match) {
			return { text: match.label, key: optionsKey ? `${optionsKey}.${String(match.value)}` : undefined };
		}
	}

	if (typeof value === 'number') {
		return { text: formatLargeNumber(value) };
	}

	if (typeof value === 'string') {
		return { text: value.trim() === '' ? '—' : value };
	}

	// A whole container was swapped out (clearing transcension history, say).
	// Its contents are not worth printing; its size is.
	const entries = countEntries(value);
	return entries === 0
		? { text: 'empty', key: 'changes.values.empty' }
		: {
				text: `${entries} ${entries === 1 ? 'entry' : 'entries'}`,
				key: 'changes.values.entries',
				values: { count: entries }
			};
}

export function describeChange(change: SaveChange): DescribedChange {
	const { imageSrc, label, options, optionsKey } = describePath(change.path);

	return {
		key: pathKey(change.path),
		label,
		imageSrc,
		from: formatChangeValue(change.from, options, optionsKey),
		to: formatChangeValue(change.to, options, optionsKey)
	};
}
