// Ingrandisce i link del menu
document.querySelectorAll('#header nav a').forEach(link => {
	link.addEventListener('mouseover', () => {
		link.style.transform = 'scale(1.2)';
		link.style.transition = 'transform 0.2s';
	});
	link.addEventListener('mouseout', () => {
		link.style.transform = 'scale(1)';
	});
});

// Ingrandisce l'icona home
const homeIcon = document.querySelector('#top-right-nav a');
homeIcon.addEventListener('mouseenter', () => {
	homeIcon.style.transform = 'scale(1.3)';
	homeIcon.style.transition = 'transform 0.2s ease';
});
homeIcon.addEventListener('mouseleave', () => {
	homeIcon.style.transform = 'scale(1)';
});
