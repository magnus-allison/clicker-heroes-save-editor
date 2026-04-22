function showToast(message) {
	const container = document.getElementById('toast-container');
	if (!container) return;
	const toast = document.createElement('div');
	toast.className = 'toast';
	toast.innerHTML = '<span class="toast-icon">&#10003;</span><span>' + message + '</span>';
	container.appendChild(toast);
	requestAnimationFrame(() => {
		requestAnimationFrame(() => toast.classList.add('toast-show'));
	});
	setTimeout(() => {
		toast.classList.remove('toast-show');
		toast.addEventListener('transitionend', () => toast.remove(), { once: true });
	}, 3000);
}
