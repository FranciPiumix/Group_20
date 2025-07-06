// ==============================
// BASEMAPS
// ==============================

const osm = new ol.layer.Tile({
    title: "OpenStreetMap",
    type: "base",
    visible: true,
    source: new ol.source.OSM()
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
    title: 'Basemap Layers',
    fold: 'open',
    layers: [osm, esriTopoBasemap, esriWorldImagery]
});

// ==============================
// WMS LAYERS
// ==============================

const geoServerURL = 'https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_20/wms';

function createWMSLayer(title, layerName) {
    return new ol.layer.Image({
        title,
        visible: false,
        source: new ol.source.ImageWMS({
            url: geoServerURL,
            params: { 'LAYERS': layerName, 'TILED': true, 'STYLES': '' },
            ratio: 1,
            serverType: 'geoserver'
        })
    });
}

// Pollution layers
const pollutionLayers = [
    createWMSLayer('NO₂ CAMS – December 2022', 'gisgeoserver_20:CzechRepublic_CAMS_no2_2022_12'),
    createWMSLayer('PM2.5 CAMS – December 2022', 'gisgeoserver_20:CzechRepublic_CAMS_pm2p5_2022_12'),
    createWMSLayer('NO₂ – Annual average 2022', 'gisgeoserver_20:CzechRepublic_average_no2_2022'),
    createWMSLayer('PM2.5 – Annual average 2022', 'gisgeoserver_20:CzechRepublic_average_pm2p5_2022'),
    createWMSLayer('NO₂ – Concentration map 2020', 'gisgeoserver_20:CZ_no2_concentration_map_2020'),
    createWMSLayer('PM2.5 – Concentration map 2020', 'gisgeoserver_20:CZ_pm2p5_concentration_map_2020'),
    createWMSLayer('PM2.5 – Concentration map 2022', 'gisgeoserver_20:CZ_pm2p5_concentration_map_2022'),
    createWMSLayer('NO₂ – Concentration map 2022', 'gisgeoserver_20:CZ_no2_concentration_map_2022'),
    createWMSLayer('NO₂ AAD', 'gisgeoserver_20:no2_AAD'),
    createWMSLayer('PM2.5 AAD', 'gisgeoserver_20:pm2p5_AAD')
];
const pollutionGroup = new ol.layer.Group({
    title: 'Pollution Concentration',
    fold: 'open',
    layers: pollutionLayers
});

// Exposure layers
const exposureLayers = [
    createWMSLayer('NO₂ – Bivariate 2020', 'gisgeoserver_20:CzechRepublic_no2_2020_bivariate'),
    createWMSLayer('PM2.5 – Bivariate 2020', 'gisgeoserver_20:CzechRepublic_pm2p5_bivariate_2020'),
    createWMSLayer('Population – 5 Quantile Classes', 'gisgeoserver_20:CZ_population_quantile_5classes')
];
const exposureGroup = new ol.layer.Group({
    title: 'Population Exposure',
    fold: 'open',
    layers: exposureLayers
});

// All WMS layers in a main overlay group
const overlayLayers = new ol.layer.Group({
    title: 'Overlay Layers',
    fold: 'open',
    layers: [pollutionGroup, exposureGroup]
});

// ==============================
// MAP
// ==============================

const map = new ol.Map({
    target: 'map',
    layers: [basemapLayers, overlayLayers],
    view: new ol.View({
        projection: 'EPSG:4326',
        center: [15.4730, 49.8175], // Lon, Lat directly (EPSG:4326)
        zoom: 7
    })
});

// ==============================
// POPUP
// ==============================

const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');

const popup = new ol.Overlay({
    element: container,
    autoPan: { animation: { duration: 250 } }
});
map.addOverlay(popup);

closer.onclick = () => {
    popup.setPosition(undefined);
    closer.blur();
    return false;
};

const overlayLayerList = [...pollutionLayers, ...exposureLayers];

map.on('singleclick', evt => {
    const coordinate = evt.coordinate;
    const resolution = map.getView().getResolution();

    const visibleLayers = overlayLayerList.filter(layer => layer.getVisible());
    const urls = visibleLayers.map(layer => {
        return layer.getSource().getFeatureInfoUrl(coordinate, resolution, 'EPSG:4326', {
            INFO_FORMAT: 'application/json'
        });
    }).filter(Boolean);

    if (urls.length === 0) {
        content.innerHTML = '<p>No visible layers.</p>';
        popup.setPosition(coordinate);
        return;
    }

    Promise.all(urls.map(url =>
        fetch(url).then(r => r.json()).catch(() => null)
    )).then(results => {
        let html = '';
        results.forEach(result => {
            if (result?.features.length) {
                result.features.forEach(feature => {
                    html += '<ul>';
                    for (const key in feature.properties) {
                        html += `<li><strong>${key}:</strong> ${feature.properties[key]}</li>`;
                    }
                    html += '</ul><hr>';
                });
            }
        });
        content.innerHTML = html || '<p>No data found.</p>';
        popup.setPosition(coordinate);
    }).catch(() => {
        content.innerHTML = '<p>Error fetching data.</p>';
        popup.setPosition(coordinate);
    });
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

const layerSwitcher = new LayerSwitcher({
    activationMode: 'click',
    startActive: true,
    tipLabel: 'Layers',
    groupSelectStyle: 'children'
});
map.addControl(layerSwitcher);

// ==============================
// CURSORE INTERATTIVO
// ==============================

map.on('pointermove', function (event) {
    const hit = map.hasFeatureAtPixel(event.pixel);
    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});
