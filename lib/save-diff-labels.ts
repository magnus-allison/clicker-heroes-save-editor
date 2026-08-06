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

export type DescribedChange = {
	/** Stable list key: the dotted save path. */
	key: string;
	label: string;
	imageSrc?: string;
	from: string;
	to: string;
};

type PathDescriptor = {
	label: string;
	imageSrc?: string;
	options?: readonly SelectOption[];
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
		staticDescriptors.set(pathKey(field.path), {
			label: field.label,
			imageSrc: field.imageSrc,
			options: field.options
		});
	}
}

for (const outsider of outsiderFields) {
	staticDescriptors.set(pathKey(outsider.levelPath), {
		label: `${outsider.name} · Level`,
		imageSrc: outsider.imageSrc
	});
	staticDescriptors.set(pathKey(outsider.spentPath), {
		label: `${outsider.name} · Ancient Souls Spent`,
		imageSrc: outsider.imageSrc
	});
}

const mercenaryFieldLabels = {
	namePath: 'Name',
	levelPath: 'Level',
	timeToDiePath: 'Time To Die',
	bonusLivesPath: 'Bonus Lives'
} as const;

for (const slot of mercenarySlots) {
	for (const [field, suffix] of Object.entries(mercenaryFieldLabels)) {
		staticDescriptors.set(pathKey(slot[field as keyof typeof mercenaryFieldLabels]), {
			label: `Mercenary ${slot.id + 1} · ${suffix}`
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
	label: 'Current Auto Clicker Skin',
	options: skinOptions
});
staticDescriptors.set('stats.transcensions', { label: 'Transcension History' });

const heroSuffixes: Record<string, string> = {
	level: 'Level',
	epicLevel: 'Gilded Level'
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
			return {
				label: `${hero.name} · ${heroSuffixes[String(fourth)] ?? prettifySegment(fourth)}`,
				imageSrc: (isGilded ? hero.gildedImage : hero.image) ?? hero.image
			};
		}
	}

	if (root === 'achievements' && path.length === 2) {
		const achievement = achievementsById.get(String(second));

		if (achievement) {
			return {
				label: `Achievement · ${achievement[0]}`,
				imageSrc: getAchievementImage(achievement[4])
			};
		}
	}

	if (root === 'autoclickerSkins' && path.length === 2) {
		const skin = skinsById.get(String(second));

		if (skin) {
			return { label: `${skin.name} · Unlocked`, imageSrc: skin.imageSrc };
		}
	}

	// Anything the editor does not have a config for — a raw JSON edit, or a
	// key added by a newer game version — still gets a readable name.
	return { label: path.map(prettifySegment).join(' › ') || 'Save' };
}

export function formatChangeValue(value: unknown, options?: readonly SelectOption[]): string {
	if (value === undefined) {
		return '—';
	}

	if (value === null) {
		return 'none';
	}

	if (typeof value === 'boolean') {
		return value ? 'Yes' : 'No';
	}

	if (options) {
		const match = options.find((option) => String(option.value) === String(value));
		if (match) {
			return match.label;
		}
	}

	if (typeof value === 'number') {
		return formatLargeNumber(value);
	}

	if (typeof value === 'string') {
		return value.trim() === '' ? '—' : value;
	}

	// A whole container was swapped out (clearing transcension history, say).
	// Its contents are not worth printing; its size is.
	const entries = countEntries(value);
	return entries === 0 ? 'empty' : `${entries} ${entries === 1 ? 'entry' : 'entries'}`;
}

export function describeChange(change: SaveChange): DescribedChange {
	const { imageSrc, label, options } = describePath(change.path);

	return {
		key: pathKey(change.path),
		label,
		imageSrc,
		from: formatChangeValue(change.from, options),
		to: formatChangeValue(change.to, options)
	};
}
