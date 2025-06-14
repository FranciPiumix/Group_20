// assets/js/map.js

let osm = new Tile({
    title: "Open Street Map",
    type: "base",
    visible: true,
    source: new OSM()
});
// Add the layer groups code here:
let basemapLayers = new Group({
    title: 'Base Maps',
    layers: [osm]
});
let overlayLayers = new Group({
    title: 'Overlay Layers',
    layers: [
 ]
});

// Add the map controls here:
map.addControl(new ScaleLine());
map.addControl(new FullScreen());
map.addControl(
    new MousePosition({
        coordinateFormat: createStringXY(4),
        projection: 'EPSG:4326',
        className: 'custom-control',
        placeholder: '0.0000, 0.0000'
    })
);


// Coordinate centro della Repubblica Ceca
const czechCenter = [49.8175, 15.4730];

const map = L.map('map').setView(czechCenter, 7);