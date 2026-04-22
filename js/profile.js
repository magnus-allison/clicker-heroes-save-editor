const shopItems = [
		{ name: 'Rubies', image: 'profile/ruby_gem.webp', dataKey: 'rubies', inputType: 'number', ssf: true },
		{
			name: 'Autoclickers Count',
			image: 'autoclickers/Autoclicker_default.webp',
			dataKey: 'autoclickers',
			inputType: 'number',
			ssf: true
		},
		{
			name: 'Spiked Nog Count',
			image: 'profile/spiked_nog.webp',
			dataKey: 'spikedNog',
			inputType: 'number',
			ssf: true,
			helpTitle: 'Spiked Nog',
			helpText:
				'Consuming a Spiked Nog grants +1 CPS per Auto Clicker on the monster for 1 hour. This effect stacks both in effect and duration.'
		},
		{
			name: '2x Damage Multiplier',
			image: 'profile/damage_multiplier.webp',
			dataKey: 'paidForRubyMultiplier',
			inputType: 'checkbox',
			ssf: true
		}
	],
	AutoclickerSkins = {
		1: ['Auto Clicker (Default)', 'autoclickers/Autoclicker_default.webp'],
		2: ['Zombie Auto Clicker', 'autoclickers/Autoclicker_zombie.webp'],
		3: ['Turkey Auto Clicker', 'autoclickers/Autoclicker_turkey.webp'],
		4: ['Snowman Auto Clicker', 'autoclickers/Autoclicker_snowman.webp'],
		5: ['Red-Nosed Clickdeer', 'autoclickers/Autoclicker_reindeer.webp'],
		6: ['Boxy & Bloop Clicker', 'autoclickers/Autoclicker_boxynbloop.webp'],
		7: ['Unicorn Auto Clicker', 'autoclickers/Autoclicker_unicorn.webp'],
		8: ['Whelping Auto Clicker', 'autoclickers/Autoclicker_welping.webp']
	};
