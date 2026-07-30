import { SimpleFieldConfig } from './editor-config';

export const seasonalItemFields: SimpleFieldConfig[] = [
	{
		label: 'Clickmas Presents',
		imageSrc: '/assets/seasonalItems/clickmas_present.webp',
		path: ['unopenedClickmasPresents'],
		kind: 'number'
	},
	{
		label: 'Spiked Nog',
		imageSrc: '/assets/shopItems/spiked_nog.webp',
		path: ['spikedNog'],
		kind: 'number',
		help: {
			title: 'Spiked Nog',
			body: 'Consuming a Spiked Nog grants +1 CPS per Auto Clicker on the monster for 1 hour. This effect stacks both in effect and duration.'
		}
	},
	{
		label: 'Candy Canes',
		imageSrc: '/assets/seasonalItems/candy_cane.webp',
		path: ['candyCanes'],
		kind: 'number',
		help: {
			title: 'Candy Cane',
			body: 'These can be used to resurrect fallen mercenaries.'
		}
	},
	{
		label: 'Label Makers',
		imageSrc: '/assets/seasonalItems/label_maker.webp',
		path: ['labelMakers'],
		kind: 'number',
		help: {
			title: 'Label Maker',
			body: 'These can be used to rename mercenaries.'
		}
	},
	{
		label: 'Forge Coals',
		imageSrc: '/assets/seasonalItems/forge_coal.webp',
		path: ['forgeCoals'],
		kind: 'number',
		help: {
			title: 'Forge Coal',
			body: 'A useless item found in Clickmas Presents.'
		}
	}
];
