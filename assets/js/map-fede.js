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
    title: 'Base maps',
    fold: 'open',
    layers: [osm, esriTopoBasemap, esriWorldImagery]
});

// ==============================
// WMS LAYERS
// ==============================

const geoServerURL = 'https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_20/wms';

function createWMSLayer(title, layerName) {
    const source = new ol.source.ImageWMS({
        url: geoServerURL,
        params: {
            'LAYERS': layerName,
            'TILED': true,
            'STYLES': ''
        },
        ratio: 1,
        serverType: 'geoserver'
    });

    const layer = new ol.layer.Image({
        title: title,
        visible: false,
        source: source
    });

    // Aggiungi qui l'URL per la legenda
    const legendUrl = `${geoServerURL}?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&FORMAT=image/png&LAYER=${encodeURIComponent(layerName)}`;
    layer.set('legendUrl', legendUrl);

    return layer;
}


const overlayLayerList = [
    createWMSLayer('NO₂ CAMS – December 2022', 'gisgeoserver_20:CzechRepublic_CAMS_no2_2022_12'),
    createWMSLayer('PM2.5 CAMS – December 2022', 'gisgeoserver_20:CzechRepublic_CAMS_pm2p5_2022_12'),
    createWMSLayer('NO₂ – Annual average 2022', 'gisgeoserver_20:CzechRepublic_average_no2_2022'),
    createWMSLayer('PM2.5 – Annual average 2022', 'gisgeoserver_20:CzechRepublic_average_pm2p5_2022'),
    createWMSLayer('NO₂ – Concentration map 2020', 'gisgeoserver_20:CZ_no2_concentration_map_2020'),
    createWMSLayer('PM2.5 – Concentration map 2020', 'gisgeoserver_20:CZ_pm2p5_concentration_map_2020'),
    createWMSLayer('PM2.5 – Concentration map 2022', 'gisgeoserver_20:CZ_pm2p5_concentration_map_2022'),
    createWMSLayer('NO₂ – Concentration map 2022', 'gisgeoserver_20:CZ_no2_concentration_map_2022'),
    createWMSLayer('NO₂ AAD', 'gisgeoserver_20:no2_AAD'),
    createWMSLayer('PM2.5 AAD', 'gisgeoserver_20:pm2p5_AAD'),
    createWMSLayer('NO₂ – Bivariate 2020', 'gisgeoserver_20:CzechRepublic_no2_2020_bivariate'),
    createWMSLayer('PM2.5 – Bivariate 2020', 'gisgeoserver_20:CzechRepublic_pm2p5_bivariate_2020'),
    createWMSLayer('Population – 5 Quantile Classes', 'gisgeoserver_20:CZ_population_quantile_5classes'),
].reverse();


const overlayLayers = new ol.layer.Group({
    title: 'Overlay Layers',
    fold: 'open',
    layers: overlayLayerList
});

// ==============================
// MAP
// ==============================

const map = new ol.Map({
    target: 'map',
    layers: [basemapLayers, overlayLayers],
    view: new ol.View({
        center: ol.proj.fromLonLat([15.4730, 49.8175]),
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

closer.onclick = function () {
    popup.setPosition(undefined);
    closer.blur();
    return false;
};

map.on('singleclick', function (evt) {
    const coordinate = evt.coordinate;
    const resolution = map.getView().getResolution();

    const visibleLayers = overlayLayerList.filter(layer => layer.getVisible());
    const urls = visibleLayers.map(layer => {
        const source = layer.getSource();
        return source.getFeatureInfoUrl(coordinate, resolution, 'EPSG:3857', {
            INFO_FORMAT: 'application/json'
        });
    }).filter(url => url);

    if (urls.length === 0) {
        content.innerHTML = '<p>No visible layers.</p>';
        popup.setPosition(coordinate);
        return;
    }

    Promise.all(urls.map(url => fetch(url).then(r => r.json()).catch(() => null)))
        .then(results => {
            let html = '';
            results.forEach(result => {
                if (result && result.features.length > 0) {
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
        })
        .catch(() => {
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
// LEGENDA
// ==============================

function getLegendElement(title, color = '#cccccc') {
    return `<li><span class="legend-color" style="background-color:${color}; display:inline-block; width:12px; height:12px; margin-right:5px; vertical-align:middle; border:1px solid #555;"></span>${title}</li>`;
}

function updateLegend() {
    let legendHTML = '<ul>';

    // Filtra tutti i layer visibili e aggiungi la loro legenda
    overlayLayerList.forEach(layer => {
        if (layer.getVisible()) {
            const legendUrl = layer.get('legendUrl');
            if (legendUrl) {
                legendHTML += `<li><img src="${legendUrl}" alt="Legenda ${layer.get('title')}" style="vertical-align:middle; height:20px; margin-right:5px;">${layer.get('title')}</li>`;
            } else {
                legendHTML += `<li>${layer.get('title')}</li>`;
            }
        }
    });

    legendHTML += '</ul>';
    document.getElementById('legend-content').innerHTML = legendHTML;
}


overlayLayerList.forEach(layer => {
    layer.on('change:visible', updateLegend);
});
updateLegend();

// ==============================
// FULLSCREEN
// ==============================

document.getElementById('fullscreen-toggle').addEventListener('click', function (e) {
    e.preventDefault();
    const header = document.getElementById('header');
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
            header.style.display = 'none';
        });
    } else {
        document.exitFullscreen().then(() => {
            header.style.display = 'block';
        });
    }
});

document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        document.getElementById('header').style.display = 'block';
    }
});

// ==============================
// CURSORE INTERATTIVO
// ==============================

map.on('pointermove', function (event) {
    const hit = map.hasFeatureAtPixel(event.pixel);
    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});
