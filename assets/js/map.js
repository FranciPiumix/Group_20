// assets/js/map.js

// Coordinate centro della Repubblica Ceca
const czechCenter = [49.8175, 15.4730];

const map = L.map('map').setView(czechCenter, 7);

// Aggiunge tile base OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);