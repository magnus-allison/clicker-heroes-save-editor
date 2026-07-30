import { SimpleFieldConfig } from './editor-config';

export const shopItemFields: SimpleFieldConfig[] = [
	{
		label: 'Rubies',
		imageSrc: '/assets/profile/ruby_gem.webp',
		path: ['rubies'],
		kind: 'number'
	},
	{
		label: 'Autoclickers',
		imageSrc: '/assets/autoclickers/Autoclicker_default.webp',
		path: ['autoclickers'],
		kind: 'number'
	},
	{
		label: '2x Damage Multiplier',
		imageSrc: '/assets/shopItems/damage_multiplier.webp',
		path: ['paidForRubyMultiplier'],
		kind: 'checkbox'
	}
];
