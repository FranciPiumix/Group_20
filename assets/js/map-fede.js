// ==============================
// BASEMAPS
// ==============================

const osm = new ol.layer.Tile({
    title: "OpenStreetMap",
    type: "base",
    visible: true,
    source: new ol.source.OSM()
});

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

const basemapLayers = new ol.layer.Group({
    title: 'Basemaps',
    fold: 'open',
    layers: [osm, stamenWatercolor, stamenToner, esriTopoBasemap, esriWorldImagery]
});


// ==============================
// WMS LAYERS (SEPARATED)
// ==============================

const geoServerURL = 'https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_20/wms';

function createWMSLayer(title, layerName) {
    return new ol.layer.Image({
        title: title,
        visible: true,
        source: new ol.source.ImageWMS({
            url: geoServerURL,
            params: {
                'LAYERS': layerName,
                'TILED': true,
                'STYLES': ''
            },
            ratio: 1,
            serverType: 'geoserver'
        })
    });
}

const overlayLayerList = [
    createWMSLayer('NO₂ CAMS – December 2022', 'gisgeoserver_20:CzechRepublic_CAMS_no2_2022_12'),
    createWMSLayer('PM2.5 CAMS – December 2022', 'gisgeoserver_20:CzechRepublic_CAMS_pm2p5_2022_12'),
    createWMSLayer('NO₂ – Annual average 2022', 'gisgeoserver_20:CzechRepublic_average_no2_2022'),
    createWMSLayer('PM2.5 – Annual average 2022', 'gisgeoserver_20:CzechRepublic_average_pm2p5_2022'),
    createWMSLayer('NO₂ – Concentration map 2022', 'gisgeoserver_20:CZ_no2_concentration_map_2022'),
    createWMSLayer('PM2.5 – Concentration map 2020', 'gisgeoserver_20:CZ_pm2p5_concentration_map_2020'),
    createWMSLayer('PM2.5 – Concentration map 2022', 'gisgeoserver_20:CZ_pm2p5_concentration_map_2022'),
    createWMSLayer('NO₂ – Concentration map 2020', 'gisgeoserver_20:CZ_no2_concentration_map_2020')
];


// ==============================
// MAP INITIALIZATION
// ==============================

const map = new ol.Map({
    target: 'map',
    layers: [basemapLayers, ...overlayLayerList],
    view: new ol.View({
        center: ol.proj.fromLonLat([15.4730, 49.8175]),
        zoom: 7
    })
});


// ==============================
// CONTROLS
// ==============================

map.addControl(new ol.control.ScaleLine());
map.addControl(new ol.control.MousePosition({
    coordinateFormat: ol.coordinate.createStringXY(4),
    projection: 'EPSG:4326',
    className: 'custom-control',
    placeholder: '0.0000, 0.0000'
}));

const layerSwitcher = new ol.control.LayerSwitcher();
map.addControl(layerSwitcher);


// ==============================
// SIMPLE LEGEND
// ==============================

let legendHTMLString = '<ul>';
function getLegendElement(title, color) {
    return `<li><span class="legend-color" style="background-color:${color}"></span>${title}</li>`;
}

overlayLayerList.forEach(layer => {
    const title = layer.get('title');
    legendHTMLString += getLegendElement(title, '#cccccc');
});
legendHTMLString += '</ul>';
document.getElementById('legend-content').innerHTML = legendHTMLString;


// ==============================
// INTERACTIVE CURSOR
// ==============================

map.on('pointermove', function (event) {
    const hit = map.hasFeatureAtPixel(event.pixel);
    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});
