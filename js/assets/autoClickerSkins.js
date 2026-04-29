const autoClickerSkins = [
	{ id: 1, name: 'Auto Clicker (Default)', image: 'Autoclicker_default.webp' },
	{ id: 2, name: 'Zombie Auto Clicker', image: 'Autoclicker_zombie.webp' },
	{ id: 3, name: 'Turkey Auto Clicker', image: 'Autoclicker_turkey.webp' },
	{ id: 4, name: 'Snowman Auto Clicker', image: 'Autoclicker_snowman.webp' },
	{ id: 5, name: 'Red-Nosed Clickdeer', image: 'Autoclicker_reindeer.webp' },
	{ id: 6, name: 'Boxy & Bloop Clicker', image: 'Autoclicker_boxynbloop.webp' },
	{ id: 7, name: 'Unicorn Auto Clicker', image: 'Autoclicker_unicorn.webp' },
	{ id: 8, name: 'Whelping Auto Clicker', image: 'Autoclicker_welping.webp' }
];

const currentTemplate = `
		<td>Current Autoclicker Skin</td>
		<td>
			<input type="hidden" id="currentSkinValue" -ssf -sdv="currentAutoclickerSkin">
			<div class="skin-selector">
				${autoClickerSkins
					.map(skin => `
					<div
						data-skin-id="${skin.id}"
						class="skin-option"
						title="${skin.name}"
						onclick="updateCurrentSkinSelection(${skin.id}, this)"
					>
						<img src="assets/autoclickers/${skin.image}" alt="${skin.name}">
					</div>
				`).join('')}
			</div>
		</td>
	</tr>`;

const skinTableTemplate = autoClickerSkins
	.map((skin) => `
		<tr>
			<td><img src="assets/autoclickers/${skin.image}" alt="${skin.name}"></td>
			<td>${skin.name}</td>
			<td><input type="checkbox" -sdv="autoclickerSkins-${skin.id}" -sf-ae></td>
		</tr>
`).join('');

const renderAutoClickerSkins = () => {
	currentTable = document.getElementById('current-skin-table');
	skinTable = document.getElementById('autoclicker-skins-table');

	currentTable.innerHTML += currentTemplate;
	skinTable.innerHTML += skinTableTemplate;
};

const updateCurrentSkinSelection = (skinId, element) => {
	let hiddenInput = document.getElementById('currentSkinValue');
	hiddenInput.value = skinId;
	hiddenInput.dispatchEvent(new Event('blur'));
	updateSkinSelector(skinId);
};

const updateSkinSelector = (currentSkin) => {
	document.querySelectorAll('.skin-option').forEach(el => {
		el.classList.remove('selected');

		if (parseInt(el.getAttribute('data-skin-id')) === parseInt(currentSkin)) {
			el.classList.add('selected');
		}
	});
};