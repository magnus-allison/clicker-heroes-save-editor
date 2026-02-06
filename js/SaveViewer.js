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

function copyButtonClick() {
	if (encodeFieldElement.value == '') {
		encodeSaveLaunch();
	}
	encodeFieldElement.select();
	encodeFieldElement.setSelectionRange(0, 99999);
	document.execCommand('copy');
	/*
	navigator.clipboard.writeText( encodeFieldElement.value ).then(() => {
		alert("successfully copied");
	  })
	  .catch(() => {
		alert("something went wrong");
	  });
	*/
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

	let profileValuesTable = document.getElementById('ProfileValuesTable');
	profileValuesTable.innerHTML += ProfileItems.map(
		(item) => `<tr>
		<td><img src="assets/${item.image}"></td>
		<td>${item.name}</td>
		<td><input type="${item.inputType}" ${item.ssf ? '-ssf' : ''} -sdv="${item.dataKey}"></td>
	</tr>`
	).join('');

	let currentAscensionTable = document.getElementById('CurrentAscensionTable');
	currentAscensionTable.innerHTML += CurrentAscensionItems.map(
		(item) => `<tr>
		<td><img src="${imagesURL}${item.image}"></td>
		<td>${item.name}</td>
		<td><input type="${item.inputType}" ${item.ssf ? '-ssf' : ''} -sdv="${item.dataKey}"></td>
	</tr>`
	).join('');

	profileValuesTable.innerHTML += `<tr>
		<td colspan="2">Current Autoclicker Skin</td>
		<td>
			<input type="hidden" id="currentSkinValue" -ssf -sdv="currentAutoclickerSkin">
			<div class="skin-selector">
				${Object.keys(AutoclickerSkins)
					.map(
						(skinId) => `
					<div class="skin-option" data-skin-id="${skinId}" title="${AutoclickerSkins[skinId][0]}">
						<img src="assets/${AutoclickerSkins[skinId][1]}" alt="${AutoclickerSkins[skinId][0]}">
					</div>
				`
					)
					.join('')}
			</div>
		</td>
	</tr>`;

	// Add click handlers for skin selection
	document.querySelectorAll('.skin-option').forEach((option) => {
		option.addEventListener('click', function () {
			let skinId = this.getAttribute('data-skin-id');
			let hiddenInput = document.getElementById('currentSkinValue');
			hiddenInput.value = skinId;
			hiddenInput.dispatchEvent(new Event('blur'));
			// Update visual selection
			document.querySelectorAll('.skin-option').forEach((opt) => opt.classList.remove('selected'));
			this.classList.add('selected');
		});
	});

	// Generate Autoclicker Skins Table
	let autoclickerSkinsTable = document.getElementById('AutoclickerSkinsTable');
	autoclickerSkinsTable.innerHTML += Object.keys(AutoclickerSkins)
		.map(
			(skinId) => `<tr>
		<td><img src="assets/${AutoclickerSkins[skinId][1]}"></td>
		<td>${AutoclickerSkins[skinId][0]}</td>
		<td><input type="checkbox" -sdv="autoclickerSkins-${skinId}" -sf-ae></td>
	</tr>`
		)
		.join('');

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
			<th>Status</th>
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
});

var typeChanger = { text: 'text', number: 'number', boolean: 'checkbox' },
	simpleKeysList,
	listOfEditableFields;

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
				// Don't change type for hidden inputs
				if (element.getAttribute('type') !== 'hidden') {
					element.setAttribute('type', typeChanger[typeof obj[path[l]]]);
				}
				element.title = obj[path[l]];
				element[typeof obj[path[l]] == 'boolean' ? 'checked' : 'value'] = obj[path[l]];
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

	// Update skin selector visual state
	updateSkinSelector();

	// Populate Heroes table
	let heroesTableBody = document.getElementById('HeroesTable');
	let heroRows = heroesTableBody.querySelector('tr'); // keep header
	heroesTableBody.innerHTML = heroRows.outerHTML;
	if (dataJSON.heroCollection && dataJSON.heroCollection.heroes) {
		let heroes = dataJSON.heroCollection.heroes;
		Object.keys(heroes).forEach((heroId) => {
			let hero = heroes[heroId];
			let heroInfo = Heroes[heroId];
			if (heroInfo) {
				let row = document.createElement('tr');
				row.innerHTML = `
					<td><img src="assets/${heroInfo[1]}"></td>
					<td>${heroInfo[0]}</td>
					<td><input type="number" value="${hero.level}" data-hero-id="${heroId}"></td>
				`;
				let input = row.querySelector('input');
				input.addEventListener('blur', function () {
					dataJSON.heroCollection.heroes[heroId].level = parseInt(this.value) || 0;
				});
				heroesTableBody.appendChild(row);
			}
		});
	}

	SelectCustomFieldName(customFieldSelectorElement.value);
}

const updateSkinSelector = () => {
	let currentSkin = dataJSON.currentAutoclickerSkin;
	document.querySelectorAll('.skin-option').forEach((opt) => {
		opt.classList.remove('selected');
		if (opt.getAttribute('data-skin-id') == currentSkin) {
			opt.classList.add('selected');
		}
	});
};

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
	SyncKeys(
		event.target.getAttribute('-sdv'),
		event.target[event.target.getAttribute('type') == 'checkbox' ? 'checked' : 'value'],
		0
	);
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
		newValue = element[element.getAttribute('type') == 'checkbox' ? 'checked' : 'value'];
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
