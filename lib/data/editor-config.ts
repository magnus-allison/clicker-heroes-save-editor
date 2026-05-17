import type { FieldKind, PathSegment, SelectOption } from '@/lib/save-utils';

const REMOTE_IMAGE_ROOT = 'https://static.wikia.nocookie.net/clickerheroes/images';

export type SimpleFieldConfig = {
	label: string;
	path: PathSegment[];
	kind: FieldKind;
	imageSrc?: string;
	allowMissing?: boolean;
	help?: {
		title: string;
		body: string;
	};
	options?: SelectOption[];
	inputClassName?: string;
};

export type OutsiderConfig = {
	id: number;
	name: string;
	imageSrc: string;
	description: string;
	capDescription?: string;
	bonusLabel: string;
	capLabel?: string;
	levelPath: PathSegment[];
	spentPath: PathSegment[];
};

export type ExternalLinkCard = {
	href: string;
	title: string;
	description: string;
	iconSrc: string;
	invertIcon?: boolean;
};

export const saveHelpContent = [
	{
		title: 'Windows',
		iconPaths: ['/assets/icons/windows.svg'],
		path: String.raw`C:\Users\[USERNAME]\AppData\Roaming\ClickerHeroes2\Local Store\saves`,
		note: 'Two files: .save and .backup. Both the Steam and stand-alone use the same path.'
	},
	{
		title: 'Mac - Steam',
		iconPaths: ['/assets/icons/apple.svg', '/assets/icons/steam.svg'],
		path: '~/Library/Application Support/Steam/userdata/[USERID]/363970/remote/'
	},
	{
		title: 'Mac - Stand-alone',
		iconPaths: ['/assets/icons/apple.svg'],
		path: '~/Library/Application Support/com.playsaurus.clickerheroes/'
	}
];

export const autoClickerSkins = [
	{ id: 1, name: 'Auto Clicker (Default)', imageSrc: '/assets/autoclickers/Autoclicker_default.webp' },
	{ id: 2, name: 'Zombie Auto Clicker', imageSrc: '/assets/autoclickers/Autoclicker_zombie.webp' },
	{ id: 3, name: 'Turkey Auto Clicker', imageSrc: '/assets/autoclickers/Autoclicker_turkey.webp' },
	{ id: 4, name: 'Snowman Auto Clicker', imageSrc: '/assets/autoclickers/Autoclicker_snowman.webp' },
	{ id: 5, name: 'Red-Nosed Clickdeer', imageSrc: '/assets/autoclickers/Autoclicker_reindeer.webp' },
	{ id: 6, name: 'Boxy & Bloop Clicker', imageSrc: '/assets/autoclickers/Autoclicker_boxynbloop.webp' },
	{ id: 7, name: 'Unicorn Auto Clicker', imageSrc: '/assets/autoclickers/Autoclicker_unicorn.webp' },
	{ id: 8, name: 'Whelping Auto Clicker', imageSrc: '/assets/autoclickers/Autoclicker_welping.webp' }
] as const;

export const raidClassOptions: SelectOption[] = [
	{ label: 'None', value: 0 },
	{ label: 'Rogue', value: 1 },
	{ label: 'Mage', value: 2 },
	{ label: 'Priest', value: 3 }
];

export const clanFields: SimpleFieldConfig[] = [
	{
		label: 'Clan Raid Class',
		path: ['newClanRaidClassId'],
		kind: 'select',
		options: raidClassOptions
	},
	{
		label: 'Clan Raid Class Level',
		path: ['newClanRaidClassLevel'],
		kind: 'number'
	},
	{
		label: 'Immortal Souls',
		path: ['immortalSouls'],
		kind: 'number'
	},
	{
		label: 'Titan Damage',
		path: ['titanDamage'],
		kind: 'number'
	}
];

export const mercenarySummaryFields: SimpleFieldConfig[] = [
	{ label: 'Total Mercenaries Revived', path: ['totalMercenariesRevived'], kind: 'number' },
	{ label: 'Total Mercenaries Buried', path: ['totalMercenariesBuried'], kind: 'number' },
	{ label: 'Total 5-Minute Quests', path: ['total5MinuteQuests'], kind: 'number' },
	{ label: 'Hero Soul Quests Completed', path: ['heroSoulQuestsCompleted'], kind: 'number' },
	{ label: 'Gold Quests Completed', path: ['goldQuestsCompleted'], kind: 'number' },
	{ label: 'Ruby Quests Completed', path: ['rubyQuestsCompleted'], kind: 'number' },
	{ label: 'Relic Quests Completed', path: ['relicQuestsCompleted'], kind: 'number' },
	{ label: 'Skill Quests Completed', path: ['skillQuestsCompleted'], kind: 'number' }
];

export const ancientSoulFields: SimpleFieldConfig[] = [
	{ label: 'Ancient Souls', path: ['ancientSouls'], kind: 'number' },
	{ label: 'Ancient Souls Total', path: ['ancientSoulsTotal'], kind: 'number' },
	{ label: 'Hero Souls Sacrificed', path: ['heroSoulsSacrificed'], kind: 'number' }
];

export const mercenarySlots = Array.from({ length: 5 }, (_, index) => ({
	id: index,
	namePath: ['mercenaries', 'mercenaries', index, 'name'] satisfies PathSegment[],
	levelPath: ['mercenaries', 'mercenaries', index, 'level'] satisfies PathSegment[],
	timeToDiePath: ['mercenaries', 'mercenaries', index, 'timeToDie'] satisfies PathSegment[],
	bonusLivesPath: ['mercenaries', 'mercenaries', index, 'bonusLives'] satisfies PathSegment[]
}));

export const outsiderFields: OutsiderConfig[] = [
	{
		id: 1,
		name: 'Xyliqil',
		imageSrc: `${REMOTE_IMAGE_ROOT}/4/49/Outsider_xyl.png`,
		description: 'effectiveness of all idle bonuses',
		bonusLabel: '+',
		levelPath: ['outsiders', 'outsiders', 1, 'level'],
		spentPath: ['outsiders', 'outsiders', 1, 'spentAncientSouls']
	},
	{
		id: 2,
		name: "Chor'gorloth",
		imageSrc: `${REMOTE_IMAGE_ROOT}/b/b5/Outsider_chor.png`,
		description: 'Ancient cost',
		bonusLabel: '-',
		levelPath: ['outsiders', 'outsiders', 2, 'level'],
		spentPath: ['outsiders', 'outsiders', 2, 'spentAncientSouls']
	},
	{
		id: 3,
		name: 'Phandoryss',
		imageSrc: `${REMOTE_IMAGE_ROOT}/0/06/Outsider_phan.png`,
		description: 'DPS',
		bonusLabel: '+',
		levelPath: ['outsiders', 'outsiders', 3, 'level'],
		spentPath: ['outsiders', 'outsiders', 3, 'spentAncientSouls']
	},
	{
		id: 5,
		name: 'Ponyboy',
		imageSrc: `${REMOTE_IMAGE_ROOT}/2/2d/Outsider_ponyboy.png`,
		description: 'Primal Hero Souls',
		bonusLabel: '+',
		levelPath: ['outsiders', 'outsiders', 5, 'level'],
		spentPath: ['outsiders', 'outsiders', 5, 'spentAncientSouls']
	},
	{
		id: 6,
		name: 'Borb',
		imageSrc: `${REMOTE_IMAGE_ROOT}/b/bd/Outsider_borb.png`,
		description: 'effectiveness of Kumawakamaru (+12.5% per level)',
		capDescription: 'monsters on level (min: 2)',
		bonusLabel: '+',
		capLabel: '-',
		levelPath: ['outsiders', 'outsiders', 6, 'level'],
		spentPath: ['outsiders', 'outsiders', 6, 'spentAncientSouls']
	},
	{
		id: 7,
		name: 'Rhageist',
		imageSrc: `${REMOTE_IMAGE_ROOT}/3/3c/Outsider_rhageist.png`,
		description: 'effectiveness of Atman (+25% per level)',
		capDescription: 'chance of Primal Boss (min: 5%)',
		bonusLabel: '+',
		capLabel: '+',
		levelPath: ['outsiders', 'outsiders', 7, 'level'],
		spentPath: ['outsiders', 'outsiders', 7, 'spentAncientSouls']
	},
	{
		id: 8,
		name: "K'Ariqua",
		imageSrc: `${REMOTE_IMAGE_ROOT}/1/1d/Outsider_k%27ariqua.png`,
		description: 'effectiveness of Bubos (+50% per level)',
		capDescription: 'multiplier of Boss HP (min: 5)',
		bonusLabel: '+',
		capLabel: '-',
		levelPath: ['outsiders', 'outsiders', 8, 'level'],
		spentPath: ['outsiders', 'outsiders', 8, 'spentAncientSouls']
	},
	{
		id: 9,
		name: 'Orphalas',
		imageSrc: `${REMOTE_IMAGE_ROOT}/4/49/Outsider_orphalas.png`,
		description: 'effectiveness of Chronos (+75% per level)',
		capDescription: 'seconds on Boss Fight (min: 2 sec)',
		bonusLabel: '+',
		capLabel: '+',
		levelPath: ['outsiders', 'outsiders', 9, 'level'],
		spentPath: ['outsiders', 'outsiders', 9, 'spentAncientSouls']
	},
	{
		id: 10,
		name: 'Sen-Akhan',
		imageSrc: `${REMOTE_IMAGE_ROOT}/0/0b/Outsider_sen-akhan.png`,
		description: 'effectiveness of Dora (+100% per level)',
		capDescription: 'chance of chest (min: 1%)',
		bonusLabel: '+',
		capLabel: '',
		levelPath: ['outsiders', 'outsiders', 10, 'level'],
		spentPath: ['outsiders', 'outsiders', 10, 'spentAncientSouls']
	}
];

export function getOutsiderStats(id: number, level: number) {
	let primary = 0;
	let secondary: number | undefined;
	const spent = id === 3 ? level : (level * (level + 1)) / 2;

	switch (id) {
		case 1:
			primary = (Math.pow(1.5, level) - 1) * 100;
			break;
		case 2:
			primary = 100 - Math.pow(0.95, Math.max(level - 1, 0)) * 100;
			break;
		case 3:
			primary = level * 100;
			break;
		case 5:
			primary = Math.pow(level, 2) * 1000;
			break;
		case 6:
			primary = 12.5 * level;
			secondary = 8 + level;
			break;
		case 7:
			primary = 25 * level;
			secondary = 75 + 18.75 * level;
			break;
		case 8:
			primary = 50 * level;
			secondary = 5 + 2.5 * level;
			break;
		case 9:
			primary = 75 * level;
			secondary = 30 + 22.5 * level;
			break;
		case 10:
			primary = 100 * level;
			secondary = 1 + 99 * (level + 1);
			break;
		default:
			primary = 0;
	}

	return {
		primary,
		secondary,
		spent
	};
}

export const additionalLinkGroups: ExternalLinkCard[][] = [
	[
		{
			href: 'https://github.com/magnus-allison/clicker-heroes-save-editor',
			title: 'GitHub Repository',
			description: 'magnus-allison/clicker-heroes-save-editor',
			iconSrc: '/assets/icons/github.svg'
		},
		{
			href: 'https://buymeacoffee.com/magnus.allison',
			title: 'Buy Me a Coffee',
			description: 'Help keep the editor free and updated',
			iconSrc: '/assets/icons/buymeacoffee.svg'
		}
	],
	[
		{
			href: 'https://clickerheroes.com/',
			title: 'Clicker Heroes',
			description: 'Official game website',
			iconSrc: '/assets/icons/clicker-heroes.png',
			invertIcon: false
		},
		{
			href: 'https://store.steampowered.com/app/363970/Clicker_Heroes/',
			title: 'Clicker Heroes on Steam',
			description: 'Official Steam listing',
			iconSrc: '/assets/icons/steam.svg'
		}
	]
];

export const additionalDisclaimer =
	'This is an independent project and is not affiliated with, endorsed by, or associated with the creators of Clicker Heroes.';
