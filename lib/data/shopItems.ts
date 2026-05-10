import { SimpleFieldConfig } from './editor-config';

export const shopItemFields: SimpleFieldConfig[] = [
	{
		label: 'Rubies',
		imageSrc: '/assets/profile/ruby_gem.webp',
		path: ['rubies'],
		kind: 'number'
	},
	{
		label: 'Autoclickers Count',
		imageSrc: '/assets/autoclickers/Autoclicker_default.webp',
		path: ['autoclickers'],
		kind: 'number'
	},
	{
		label: 'Spiked Nog Count',
		imageSrc: '/assets/shopItems/spiked_nog.webp',
		path: ['spikedNog'],
		kind: 'number',
		help: {
			title: 'Spiked Nog',
			body: 'Consuming a Spiked Nog grants +1 CPS per Auto Clicker on the monster for 1 hour. This effect stacks both in effect and duration.'
		}
	},
	{
		label: '2x Damage Multiplier',
		imageSrc: '/assets/shopItems/damage_multiplier.webp',
		path: ['paidForRubyMultiplier'],
		kind: 'checkbox'
	}
];
