document.querySelectorAll('#header nav a').forEach(link => {
	link.addEventListener('mouseover', () => {
		link.style.transform = 'scale(1.2)';
		link.style.transition = 'transform 0.2s';
	});
	link.addEventListener('mouseout', () => {
		link.style.transform = 'scale(1)';
	});
});
