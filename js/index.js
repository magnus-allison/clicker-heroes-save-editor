document.addEventListener('DOMContentLoaded', function () {
	const fileInput = document.getElementById('file-input');
	const fileInputText = document.getElementById('file-input-text');
	const fileInputLabel = fileInput?.closest('.file-input-label');

	if (fileInput && fileInputText) {
		fileInput.addEventListener('change', function () {
			if (fileInput.files.length > 0) {
				fileInputText.textContent = fileInput.files[0].name;
				fileInputLabel?.classList.add('has-file');
			} else {
				fileInputText.textContent = 'Choose a file...';
				fileInputLabel?.classList.remove('has-file');
			}
		});
	}
});
