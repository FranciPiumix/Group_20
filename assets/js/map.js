// Base layer
const osm = new ol.layer.Tile({
    source: new ol.source.OSM()
});

// Mappa
const map = new ol.Map({
    target: 'map',
    layers: [osm],
    view: new ol.View({
        center: ol.proj.fromLonLat([15.4730, 49.8175]), // Repubblica Ceca in EPSG:4326
        zoom: 7
    }),
    controls: ol.control.defaults().extend([
        new ol.control.ScaleLine(),
        new ol.control.FullScreen(),
        new ol.control.MousePosition({
            coordinateFormat: ol.coordinate.createStringXY(4),
            projection: 'EPSG:4326',
            className: 'custom-control',
            placeholder: '0.0000, 0.0000'
        })
    ])
});