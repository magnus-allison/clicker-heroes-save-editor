var ANTI_CHEAT_CODE = 'Fe12NAfA3R6z4k0z',
	zlib = '7a990d405d2c6fb93aa8fbb0ec1a3b23',
	deflate = '7e8bb5a89f2842ac4af01b3b7e228592',
	dataJSON;

function readSaveFile(event) {
	let file = event.target.files[0];
	if (!file) return;
	let reader = new FileReader();
	reader.onload = function (event) {
		decodeFieldElement.value = event.target.result;
		decodeSaveFromField();
	};
	reader.readAsText(file);
}

function decodeSaveFromField() {
	let dataInput = decodeFieldElement.value;
	if (
		dataInput.indexOf(ANTI_CHEAT_CODE) > -1 ||
		dataInput.substring(0, 32) == zlib ||
		dataInput.substring(0, 32) == deflate
	) {
		if (dataInput.substring(0, 32) == zlib) {
			let pako = window.pako;
			dataJSON = JSON.parse(pako.inflate(atob(dataInput.substring(32)), { to: 'string' }));
		} else if (dataInput.substring(0, 32) == deflate) {
			let pako = window.pako;
			dataJSON = JSON.parse(pako.inflateRaw(atob(dataInput.substring(32)), { to: 'string' }));
		} else {
			let result = dataInput.split(ANTI_CHEAT_CODE);
			dataInput = '';
			for (let i = 0; i < result[0].length; i += 2) dataInput += result[0][i];
			dataJSON = JSON.parse(atob(dataInput));
		}
		//console.log( JSON.stringify( dataJSON ) )
		PutDataToPage();
		if (typeof showToast === 'function') showToast('Save data loaded');
	} else if (dataInput) {
		document.getElementById('alive').innerHTML = 'Not a valid save, try again.';
	}
}

function encodeSaveLaunch() {
	if (dataJSON != undefined) {
		let pako = window.pako,
			dataOutput = btoa(pako.deflate(JSON.stringify(dataJSON), { to: 'string' }));
		encodeFieldElement.value = zlib + dataOutput;
	}
}

function encodeButtonClick() {
	encodeSaveLaunch();
	copyButtonClick();
}

function fillExampleButtonEvent() {
	decodeFieldElement.value = exampleSave;
	decodeSaveFromField();
}

function showCopyTooltip(button) {
	const tooltip = button.querySelector('.file-copy-popup');
	if (!tooltip) return;
	tooltip.classList.add('is-visible');
	clearTimeout(button._copyTooltipTimer);
	button._copyTooltipTimer = setTimeout(() => {
		tooltip.classList.remove('is-visible');
	}, 1200);
}

function legacyCopyFromField(fieldElement) {
	fieldElement.focus();
	if (typeof fieldElement.select === 'function') fieldElement.select();
	if (typeof fieldElement.setSelectionRange === 'function') {
		fieldElement.setSelectionRange(0, String(fieldElement.value).length);
	}
	try {
		return document.execCommand('copy');
	} catch {
		return false;
	}
}

function copyFieldValue(fieldElement, options) {
	options = options || {};
	if (!fieldElement) return;
	if (options.ensureEncoded && fieldElement.value == '') encodeSaveLaunch();

	const value = String(fieldElement.value || '');
	if (!value) {
		if (typeof showToast === 'function') showToast('Nothing to copy');
		if (typeof options.onFailure === 'function') options.onFailure();
		return;
	}

	const onSuccess = () => {
		if (typeof showToast === 'function') showToast(options.successMessage || 'Copied to clipboard');
		if (typeof options.onSuccess === 'function') options.onSuccess();
	};

	const onFailure = () => {
		if (typeof showToast === 'function') showToast('Copy failed');
		if (typeof options.onFailure === 'function') options.onFailure();
	};

	if (navigator.clipboard && window.isSecureContext) {
		navigator.clipboard
			.writeText(value)
			.then(onSuccess)
			.catch(() => {
				if (legacyCopyFromField(fieldElement)) onSuccess();
				else onFailure();
			});
		return;
	}

	if (legacyCopyFromField(fieldElement)) onSuccess();
	else onFailure();
}

function initializeCopyButtons() {
	document.querySelectorAll('.file-copy-btn[data-copy-target]').forEach((button) => {
		button.addEventListener('click', function (event) {
			const trigger = event.currentTarget;
			if (!(trigger instanceof HTMLElement)) return;
			const targetId = trigger.getAttribute('data-copy-target');
			if (!targetId) return;
			const field = document.getElementById(targetId);
			const isEncodeField = targetId === 'encodeField';
			copyFieldValue(field, {
				ensureEncoded: isEncodeField,
				successMessage: isEncodeField ? 'Encoded save copied' : 'Text copied',
				onSuccess: () => showCopyTooltip(trigger),
				onFailure: () => showCopyTooltip(trigger)
			});
		});
	});
}

function copyButtonClick() {
	copyFieldValue(encodeFieldElement, {
		ensureEncoded: true,
		successMessage: 'Encoded save copied'
	});
}

function SelectAll(event) {
	event.target.setSelectionRange(0, 99999);
}

var decodeFieldElement,
	encodeFieldElement,
	customFieldSelectorElement,
	customFieldListElement,
	customFieldNameElement,
	customFieldValueElement,
	outsidersLabels,
	AchievementsTBodyElement,
	AchievementsTablesElement,
	outJSONobj,
	inJSONobj;

document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('file-input').addEventListener('change', readSaveFile, false);
	decodeFieldElement = document.getElementById('decodeField');
	encodeFieldElement = document.getElementById('encodeField');
	initializeCopyButtons();

	let profileValuesTable = document.getElementById('ProfileValuesTable');
	profileValuesTable.innerHTML += shopItems
		.map(
			(item) => `<tr>
		<td><img src="assets/${item.image}"></td>
		<td>${
			item.helpText
				? `<div class="profile-item-with-help">${item.name}
					<button class="file-help-btn profile-help-btn" type="button" aria-label="${item.helpTitle}">
						<img src="./assets/icons/circle-question-mark.svg" alt="">
						<div class="file-help-tooltip profile-help-tooltip" role="tooltip">
							<p class="file-help-tooltip-title">${item.helpTitle}</p>
							<p>${item.helpText}</p>
						</div>
					</button>
				</div>`
				: item.name
		}</td>
		<td><input type="${item.inputType}" ${item.ssf ? '-ssf' : ''} -sdv="${item.dataKey}"></td>
	</tr>`
		)
		.join('');

	let currentAscensionTable = document.getElementById('CurrentAscensionTable');
	currentAscensionTable.innerHTML += CurrentAscensionItems.map(
		(item) => `<tr>
		<td><img src="${imagesURL}${item.image}"></td>
		<td>${item.name}</td>
		<td><input type="${item.inputType}" ${item.ssf ? '-ssf' : ''} -sdv="${item.dataKey}"></td>
	</tr>`
	).join('');

	renderAutoClickerSkins();

	AchievementsTablesElement = document.getElementById('AchievementsTables');
	let AchievementSorted = Array.from(
			Object.values(AchievementType).map((k) => [
				k,
				Object.keys(AchievementsList).filter(
					(achievementID) => AchievementsList[achievementID][5] == k
				)
			])
		).sort((a, b) => b[1].length - a[1].length),
		AchievementTypes = Object.keys(AchievementType);

	AchievementsTablesElement.innerHTML = AchievementSorted.map((_AchievementType) => {
		let achievements = _AchievementType[1].sort((a, b) => {
			if (AchievementsList[a][6] == undefined || AchievementsList[b][6] == undefined)
				return AchievementsList[a][6] == undefined ? 1 : AchievementsList[b][6] == undefined ? -1 : 0;
			else return AchievementsList[a][6].type - AchievementsList[b][6].type;
		});
		//console.log( achievements )
		return `<table class="table-border">
		<tr><th colspan="3">${AchievementTypes[_AchievementType[0]]}-related achievements</th></tr>
		<tr>
			<th>Image</th>
			<th>Description</th>
			<th>Unlocked</th>
		</tr>
		${achievements
			.map(
				(achievement) => `<tr>
				<td><img src="${imagesURL}${AchievementsList[achievement][4]}"></td>
				<td>
					<p><b>${AchievementsList[achievement][0]}</b></p>
					<p>${AchievementsList[achievement][1]}</p>
					${AchievementsList[achievement][2] != undefined ? `<p><i>${AchievementsList[achievement][2]}</i></p>` : ''}
					${AchievementsList[achievement][3] != undefined ? `<p><u>Reward: ${AchievementsList[achievement][3]}</u></p>` : ''}
				</td>
				<td><input type="checkbox" -sdv="achievements-${achievement}" -svt="1" -sf-ae></td>
				</tr>`
			)
			.join('')}
		</table>`;
	}).join('');

	customFieldListElement = document.getElementById('customFieldList');
	customFieldNameElement = document.getElementById('customFieldName');
	customFieldValueElement = document.getElementById('customFieldValue');
	customFieldValueElement.addEventListener('blur', SaveFieldValue1);
	customFieldSelectorElement = document.getElementById('customFieldSelector');
	customFieldSelectorElement.addEventListener('input', onSelectCustomFieldName);

	outJSONobj = document.getElementById('outJSON');
	inJSONobj = document.getElementById('inJSON');

	InspectElement();
	let unlockAllSkinsButton = document.getElementById('unlock-all-skins-btn');
	if (unlockAllSkinsButton) {
		unlockAllSkinsButton.addEventListener('click', unlockAllSkins);
	}
	document.getElementById('autoclicker-skins-table').addEventListener('change', function (event) {
		if (event.target && event.target.matches('input[type="checkbox"]')) {
			updateUnlockAllSkinsButton();
		}
	});
	renderHeroesTable();
});

var typeChanger = { text: 'text', number: 'number', boolean: 'checkbox' },
	simpleKeysList,
	listOfEditableFields;

const _numFormatter = new Intl.NumberFormat('en-US');

function formatNum(v) {
	const n = typeof v === 'string' ? parseFloat(v.replace(/,/g, '')) : v;
	if (typeof n !== 'number' || isNaN(n)) return String(v);
	return _numFormatter.format(n);
}

function parseNum(s) {
	return parseFloat(String(s).replace(/,/g, ''));
}

function InspectElement() {
	listOfEditableFields = Array.from(document.querySelectorAll('[-sdv]'));
	listOfEditableFields.forEach((element) =>
		element.addEventListener('blur', element.hasAttribute('-ssf') ? SaveFieldValue0 : SaveValue)
	);
	outsidersLabels = Array(11)
		.fill()
		.map((x) => []);
	Array.from(document.querySelectorAll('[-sol]')).forEach((element) => {
		outsidersLabels[parseInt(element.getAttribute('-sol'))][parseInt(element.getAttribute('-slid'))] =
			element;
	});
	Array.from(document.querySelectorAll('[-sa]')).forEach((x) => x.addEventListener('focus', SelectAll));
	// Strip number formatting on focus so users can type raw values
	document.addEventListener('focusin', function (e) {
		if (e.target.hasAttribute('data-numeric') && e.target.hasAttribute('-sdv')) {
			e.target.value = String(parseNum(e.target.value));
		}
	});
	// Restrict input to digits/minus/dot and blur on Enter for numeric fields
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Enter' && e.target.hasAttribute('data-numeric')) {
			e.target.blur();
		}
	});
	document.addEventListener('input', function (e) {
		if (e.target.hasAttribute('data-numeric')) {
			const el = e.target;
			const pos = el.selectionStart;
			const cleaned = el.value.replace(/[^0-9.\-]/g, '');
			if (cleaned !== el.value) {
				const diff = el.value.length - cleaned.length;
				el.value = cleaned;
				el.setSelectionRange(pos - diff, pos - diff);
			}
		}
	});
}

function PutDataToPage() {
	console.log('Putting data to page...');
	//console.log( dataJSON )
	simpleKeysList = Object.keys(dataJSON).filter((x) => typeof dataJSON[x] != 'object');
	customFieldListElement.innerHTML = simpleKeysList.map((x) => '<option value="' + x + '">').join('');
	listOfEditableFields.forEach((element) => {
		let path = element.getAttribute('-sdv').split('-'),
			l = path.length - 1,
			obj = dataJSON;
		for (let i = 0; i < l; i++) obj = obj[path[i]];

		if (
			(obj != undefined && obj.hasOwnProperty(path[l])) ||
			(element.hasAttribute('-sf-ae') && obj != undefined && !obj.hasOwnProperty(path[l]))
		) {
			element.disabled = false;
			if (obj.hasOwnProperty(path[l])) {
				const val = obj[path[l]];
				const valType = typeof val;
				// Don't change type for hidden inputs
				if (element.getAttribute('type') !== 'hidden') {
					if (valType === 'number') {
						element.setAttribute('type', 'text');
						element.setAttribute('data-numeric', 'true');
					} else {
						element.setAttribute('type', typeChanger[valType]);
						element.removeAttribute('data-numeric');
					}
				}
				element.title = val;
				if (valType === 'boolean') {
					element.checked = val;
				} else if (valType === 'number') {
					element.value = formatNum(val);
				} else {
					element.value = val;
				}
				if (element.hasAttribute('-svt')) {
					switch (parseInt(element.getAttribute('-svt'))) {
						case 0:
							ChangeOutsiderLevel(path[l - 1], obj[path[l]]);
							break;
					}
				}
			} else {
				if (element.getAttribute('type') == 'checkbox') {
					element.checked = false;
				}
			}
		} else {
			element.disabled = true;
		}
	});

	updateSkinSelector(dataJSON.currentAutoclickerSkin);
	let unlockAllSkinsButton = document.getElementById('unlock-all-skins-btn');
	if (unlockAllSkinsButton) unlockAllSkinsButton.disabled = false;
	updateUnlockAllSkinsButton();

	renderHeroesTable(dataJSON);

	SelectCustomFieldName(customFieldSelectorElement.value);
}

function getGildedMultiplierText(epicLevel) {
	if (epicLevel <= 0) {
		return '';
	}
	const bonus = epicLevel * 50;
	return `${epicLevel}x Gilded (+${bonus}%)`;
}

function renderHeroesTable(saveData) {
	let heroesTableBody = document.getElementById('HeroesTable');
	let heroRows = heroesTableBody.querySelector('tr');
	heroesTableBody.innerHTML = heroRows.outerHTML;

	let saveHeroes =
		saveData && saveData.heroCollection && saveData.heroCollection.heroes
			? saveData.heroCollection.heroes
			: null;

	Object.keys(Heroes).forEach((heroId) => {
		let heroInfo = Heroes[heroId];
		if (!heroInfo) return;

		let heroLevel = saveHeroes && saveHeroes[heroId] ? saveHeroes[heroId].level : 0;
		let heroEpicLevel = saveHeroes && saveHeroes[heroId] ? saveHeroes[heroId].epicLevel : 0;
		let heroImage = heroEpicLevel >= 1 && heroInfo[2] ? heroInfo[2] : heroInfo[1];
		let row = document.createElement('tr');

		// Add gilded class if epicLevel is at least 1
		if (heroEpicLevel >= 1) {
			row.classList.add('hero-gilded');
		}

		row.innerHTML = `
			<td><img src="assets/${heroImage}"></td>
			<td>
				<div class="hero-name-cell">
					<div class="hero-name-text">${heroInfo[0]}</div>
					<span class="hero-multiplier-text${heroEpicLevel >= 1 ? ' is-visible' : ''}">${getGildedMultiplierText(heroEpicLevel)}</span>
				</div>
			</td>
			<td><input type="text" value="${formatNum(heroLevel)}" data-hero-id="${heroId}" data-type="level"></td>
			<td><input type="text" value="${formatNum(heroEpicLevel)}" data-hero-id="${heroId}" data-type="epic"></td>
		`;

		let inputs = row.querySelectorAll('input');
		inputs.forEach((input) => {
			input.disabled = !saveHeroes;
			if (saveHeroes) {
				input.addEventListener('focus', function () {
					this.value = String(parseInt(parseNum(this.value)) || 0);
				});
				input.addEventListener('keydown', function (e) {
					if (e.key === 'Enter') this.blur();
				});
				input.addEventListener('input', function () {
					const pos = this.selectionStart;
					const cleaned = this.value.replace(/[^0-9]/g, '');
					if (cleaned !== this.value) {
						const diff = this.value.length - cleaned.length;
						this.value = cleaned;
						this.setSelectionRange(pos - diff, pos - diff);
					}
				});
				input.addEventListener('blur', function () {
					const inputType = this.getAttribute('data-type');
					const value = parseInt(parseNum(this.value)) || 0;

					if (inputType === 'level') {
						saveData.heroCollection.heroes[heroId].level = value;
					} else if (inputType === 'epic') {
						saveData.heroCollection.heroes[heroId].epicLevel = value;
						// Update row styling and multiplier text based on new epicLevel
						if (value >= 1) {
							row.classList.add('hero-gilded');
						} else {
							row.classList.remove('hero-gilded');
						}
						const imageElement = row.querySelector('img');
						if (imageElement) {
							imageElement.src = `assets/${value >= 1 && heroInfo[2] ? heroInfo[2] : heroInfo[1]}`;
						}
						const multiplierSpan = row.querySelector('.hero-multiplier-text');
						if (multiplierSpan) {
							multiplierSpan.textContent = getGildedMultiplierText(value);
							multiplierSpan.classList.toggle('is-visible', value >= 1);
						}
					}
					this.value = formatNum(value);
				});
			}
		});

		heroesTableBody.appendChild(row);
	});
}

function unlockAllSkins() {
	if (dataJSON == undefined) return;

	if (!dataJSON.autoclickerSkins || typeof dataJSON.autoclickerSkins !== 'object') {
		dataJSON.autoclickerSkins = {};
	}

	Array.from(document.querySelectorAll('#autoclicker-skins-table input[type="checkbox"]')).forEach(
		(element) => {
			if (element.disabled) return;
			element.checked = true;
			element.dispatchEvent(new Event('blur'));
		}
	);

	updateUnlockAllSkinsButton();

	if (typeof showToast === 'function') showToast('All skins unlocked');
}

function updateUnlockAllSkinsButton() {
	let unlockAllSkinsButton = document.getElementById('unlock-all-skins-btn');
	if (!unlockAllSkinsButton) return;

	let skinCheckboxes = Array.from(
		document.querySelectorAll('#autoclicker-skins-table input[type="checkbox"]')
	);
	let editableCheckboxes = skinCheckboxes.filter((element) => !element.disabled);
	let hasAnyLocked = editableCheckboxes.some((element) => !element.checked);

	unlockAllSkinsButton.classList.toggle('is-layout-hidden', editableCheckboxes.length > 0 && !hasAnyLocked);
}

function onSelectCustomFieldName(event) {
	if (dataJSON != undefined) {
		if (event.inputType == undefined || simpleKeysList.indexOf(customFieldSelectorElement.value) != -1) {
			SelectCustomFieldName(customFieldSelectorElement.value);
		}
	}
}

function SelectCustomFieldName(key) {
	if (key != '') {
		customFieldNameElement.innerText = key;
		customFieldValueElement.setAttribute('type', typeChanger[typeof dataJSON[key]]);
		customFieldValueElement[customFieldValueElement.type == 'checkbox' ? 'checked' : 'value'] =
			dataJSON[key];
		customFieldValueElement.title = dataJSON[key];
	}
}

function SaveFieldValue0(event) {
	const el = event.target;
	const raw = el.hasAttribute('data-numeric')
		? parseNum(el.value)
		: el[el.getAttribute('type') == 'checkbox' ? 'checked' : 'value'];
	SyncKeys(el.getAttribute('-sdv'), raw, 0);
	if (el.hasAttribute('data-numeric')) el.value = formatNum(raw);
}

function SaveFieldValue1() {
	SyncKeys(
		customFieldNameElement.innerText,
		customFieldValueElement.type == 'checkbox'
			? customFieldValueElement.checked
			: customFieldValueElement.value,
		1
	);
}

function SyncKeys(key, value, origin) {
	switch (origin) {
		case 0:
			if (customFieldNameElement.innerText == key)
				customFieldValueElement[typeof value == 'boolean' ? 'checked' : 'value'] = value;
			break;
		case 1:
			Array.from(document.querySelectorAll(`[-sdv="${key}"]`)).forEach(
				(element) => (element[typeof value == 'boolean' ? 'checked' : 'value'] = value)
			);
			break;
	}
	if (dataJSON.hasOwnProperty(key)) {
		//console.log( `[${key}] = (${value})` )
		dataJSON[key] = value;
	}
}

function SaveValue(event) {
	if (dataJSON != undefined) {
		let element = event.target;
		if (element.value == '') element.value = 0;
		let path = element.getAttribute('-sdv').split('-'),
			l = path.length - 1,
			obj = dataJSON,
			newValue;
		if (element.hasAttribute('data-numeric')) {
			newValue = parseNum(element.value);
		} else {
			newValue = element[element.getAttribute('type') == 'checkbox' ? 'checked' : 'value'];
		}
		for (let i = 0; i < l; i++) obj = obj[path[i]];
		if (
			(obj != undefined && obj.hasOwnProperty(path[l])) ||
			(element.hasAttribute('-sf-ae') && obj != undefined && !obj.hasOwnProperty(path[l]))
		) {
			if (!element.hasAttribute('-svt')) {
				obj[path[l]] = newValue;
			} else {
				switch (parseInt(element.getAttribute('-svt'))) {
					case 0:
						obj[path[l]] = newValue;
						ChangeOutsiderLevel(path[l - 1], newValue);
						break;
					case 1:
						SetAchievementStatus(path[l], newValue);
						break;
				}
			}
		}
		if (element.hasAttribute('data-numeric')) element.value = formatNum(newValue);
	}
}

function ChangeOutsiderLevel(id, level) {
	if (typeof id == 'string') id = parseInt(id);
	if (typeof level == 'string') level = parseInt(level);
	let val1, val2, val3;
	switch (id) {
		case 1:
			val1 = (Math.pow(1.5, level) - 1) * 100;
			break;
		case 2:
			if (level > 150) level = 150;
			val1 = 100 - Math.pow(0.95, level == 0 ? 0 : level - 1) * 100;
			break;
		case 3:
			val1 = level * 100;
			break;
		case 5:
			val1 = Math.pow(level, 2) * 1000;
			break;
		case 6:
			val1 = 12.5 * level;
			val2 = 8 + 1 * level;
			break;
		case 7:
			val1 = 25 * level;
			val2 = 75 + 18.75 * level;
			break;
		case 8:
			val1 = 50 * level;
			val2 = 5 + 2.5 * level;
			break;
		case 9:
			val1 = 75 * level;
			val2 = 30 + 22.5 * level;
			break;
		case 10:
			val1 = 100 * level;
			val2 = 1 + 99 * (level + 1);
			break;
	}
	if (id == 3) {
		val3 = level;
	} else {
		val3 = (level * (level + 1)) / 2;
	}
	outsidersLabels[id][0].innerText =
		val1 < 100000
			? val1.toFixed(2).replace(/\.?0+$/, '')
			: val1
					.toExponential(2)
					.replace('+', '')
					.replace(/\.?0+(e\d+)$/, '$1');
	if (id > 5) {
		outsidersLabels[id][1].innerText = val2.toFixed(2).replace(/\.?0+$/, '');
	}
	outsidersLabels[id][2].innerText = val3;
}

function SetAchievementStatus(id, status) {
	if (status) {
		dataJSON.achievements[id] = true;
	} else {
		delete dataJSON.achievements[id];
	}
}

function ConvertDataToJSON() {
	if (dataJSON != undefined) {
		outJSONobj.value = JSON.stringify(dataJSON);
	}
}

function ConvertJSONtoData() {
	if (inJSONobj.value != '') {
		dataJSON = JSON.parse(inJSONobj.value);
		PutDataToPage();
	}
}

function ClearTranscensions() {
	dataJSON.stats.transcensions = {};
}
