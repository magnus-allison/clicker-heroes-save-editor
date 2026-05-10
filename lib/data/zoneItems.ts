import { SimpleFieldConfig } from './editor-config';

const REMOTE_IMAGE_ROOT = 'https://static.wikia.nocookie.net/clickerheroes/images';

export const zoneItemFields: SimpleFieldConfig[] = [
	{
		label: 'Gold',
		imageSrc: `/assets/zoneItems/gold.webp`,
		path: ['gold'],
		kind: 'number'
	},
	{
		label: 'Highest Zone Number',
		imageSrc: `/assets/zoneItems/zone_explorer.webp`,
		path: ['highestFinishedZone'],
		kind: 'number'
	},
	{
		label: 'Current Zone Number',
		imageSrc: `/assets/zoneItems/zone_lord.webp`,
		path: ['currentZoneHeight'],
		kind: 'number'
	},
	{
		label: 'Hero Souls',
		imageSrc: `/assets/zoneItems/hero_soul.webp`,
		path: ['heroSouls'],
		kind: 'number'
	},
	{
		label: 'Transcendent Hero Souls',
		imageSrc: `/assets/zoneItems/hero_soul.webp`,
		path: ['primalSouls'],
		kind: 'number'
	}
];
