// ==============================
// BASMAPS
// ==============================

// OpenStreetMap
const osm = new ol.layer.Tile({
    title: "Open Street Map",
    type: "base",
    visible: true,
    source: new ol.source.OSM()
});

// Stamen
const stamenWatercolor = new ol.layer.Tile({
    title: 'Stamen Watercolor',
    type: 'base',
    visible: false,
    source: new ol.source.StadiaMaps({ layer: 'stamen_watercolor' })
});
const stamenToner = new ol.layer.Tile({
    title: 'Stamen Toner',
    type: 'base',
    visible: false,
    source: new ol.source.StadiaMaps({ layer: 'stamen_toner' })
});

// ESRI basemaps
const esriTopoBasemap = new ol.layer.Tile({
    title: 'ESRI Topographic',
    type: 'base',
    visible: false,
    source: new ol.source.XYZ({
        attributions: 'Tiles © ESRI',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
    })
});
const esriWorldImagery = new ol.layer.Tile({
    title: 'ESRI World Imagery',
    type: 'base',
    visible: false,
    source: new ol.source.XYZ({
        attributions: 'Tiles © ESRI',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    })
});

// Gruppo basemaps
const basemapLayers = new ol.layer.Group({
    title: 'Basemaps',
    layers: [osm, stamenWatercolor, stamenToner, esriTopoBasemap, esriWorldImagery]
});


// ==============================
// OVERLAY LAYERS (GeoServer WMS)
// ==============================

const geoServerURL = 'https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_20/wms';

const geoLayers = [
    {
        title: 'NO2 CAMS - Dicembre 2022',
        layerName: 'gisgeoserver_20:CzechRepublic_CAMS_no2_2022_12'
    },
    {
        title: 'PM2.5 CAMS - Dicembre 2022',
        layerName: 'gisgeoserver_20:CzechRepublic_CAMS_pm2p5_2022_12'
    },
    {
        title: 'NO2 - Media annuale 2022',
        layerName: 'gisgeoserver_20:CzechRepublic_average_no2_2022'
    },
    {
        title: 'PM2.5 - Media annuale 2022',
        layerName: 'gisgeoserver_20:CzechRepublic_average_pm2p5_2022'
    },
    {
        title: 'NO2 - Mappa concentrazione 2022',
        layerName: 'gisgeoserver_20:CZ_no2_concentration_map_2022'
    },
    {
        title: 'PM2.5 - Mappa concentrazione 2020',
        layerName: 'gisgeoserver_20:CZ_pm2p5_concentration_map_2020'
    },
    {
        title: 'PM2.5 - Mappa concentrazione 2022',
        layerName: 'gisgeoserver_20:CZ_pm2p5_concentration_map_2022'
    }
];

// Creo i layer WMS
const overlayLayers = new ol.layer.Group({
    title: 'Dati GeoServer',
    layers: geoLayers.map(layerInfo => new ol.layer.Image({
        title: layerInfo.title,
        visible: false,
        source: new ol.source.ImageWMS({
            url: geoServerURL,
            params: {
                'LAYERS': layerInfo.layerName,
                'TILED': true,
                'STYLES': '' // Inserisci qui lo stile personalizzato se necessario
            },
            ratio: 1,
            serverType: 'geoserver'
        })
    }))
});


// ==============================
// MAPPA
// ==============================

const map = new ol.Map({
    target: 'map',
    layers: [basemapLayers, overlayLayers],
    view: new ol.View({
        center: ol.proj.fromLonLat([15.4730, 49.8175]), // Centro della CZ
        zoom: 7
    })
});


// ==============================
// CONTROLLI
// ==============================

// Scala e coordinate
map.addControl(new ol.control.ScaleLine());
map.addControl(new ol.control.MousePosition({
    coordinateFormat: ol.coordinate.createStringXY(4),
    projection: 'EPSG:4326',
    className: 'custom-control',
    placeholder: '0.0000, 0.0000'
}));

// LayerSwitcher
const layerSwitcher = new ol.control.LayerSwitcher();
map.addControl(layerSwitcher);


// ==============================
// LEGENDA SEMPLIFICATA
// ==============================

let legendHTMLString = '<ul>';

function getLegendElement(title, color) {
    return `<li><span class="legend-color" style="background-color:${color}"></span>${title}</li>`;
}

// Colore fittizio per i layer WMS
overlayLayers.getLayers().forEach(function (layer) {
    const title = layer.get('title');
    legendHTMLString += getLegendElement(title, '#cccccc');
});

legendHTMLString += '</ul>';
document.getElementById('legend-content').innerHTML = legendHTMLString;


// ==============================
// CURSORE INTERATTIVO
// ==============================

map.on('pointermove', function (event) {
    const hit = map.hasFeatureAtPixel(event.pixel);
    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});
