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
// WMS LAYERS
// ==============================
// URL base GeoServer
const geoServerURL = 'https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_20/wms';

function createWMSLayer(title, layerName) {
    return new ol.layer.Image({
        title: title,
        visible: false,
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
    createWMSLayer('PM2.5 – Concentration map 2022', 'gisgeoserver_20:CZ_pm2p5_concentration_map_2022'),
    createWMSLayer('PM2.5 AAD', 'gisgeoserver_20:pm2p5_AAD'),
    createWMSLayer('NO₂ AAD', 'gisgeoserver_20:no2_AAD')
    createWMSLayer('NO₂ – Concentration map 2020', 'gisgeoserver_20:CZ_no2_concentration_map_2020'),
    createWMSLayer('PM2.5 – Concentration map 2020', 'gisgeoserver_20:CZ_pm2p5_concentration_map_2020'),
];

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

// Elementi popup dal DOM
const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');

// Crea overlay popup
const popup = new ol.Overlay({
    element: container,
    autoPan: {
        animation: {
            duration: 250,
        },
    },
});
map.addOverlay(popup);

// Chiudi popup cliccando la "x"
closer.onclick = function () {
    popup.setPosition(undefined);
    closer.blur();
    return false;
};

// Evento click mappa per GetFeatureInfo
map.on('singleclick', function (evt) {
    const coordinate = evt.coordinate;
    const view = map.getView();
    const viewResolution = view.getResolution();

    // Trova il primo layer visibile tra gli overlay che supporta GetFeatureInfo
    let url = null;
    overlayLayerList.some(layer => {
        if (layer.getVisible()) {
            const source = layer.getSource();
            url = source.getFeatureInfoUrl(
                coordinate,
                viewResolution,
                'EPSG:3857', // proiezione mappa (modifica se usi altra)
                { 'INFO_FORMAT': 'application/json' }
            );
            return !!url; // ferma il ciclo se url valido
        }
        return false;
    });

    if (url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                let info = '';
                if (data.features && data.features.length > 0) {
                    // Prendi proprietà della prima feature (puoi personalizzare)
                    const props = data.features[0].properties;
                    info = '<ul>';
                    for (const key in props) {
                        info += `<li><strong>${key}:</strong> ${props[key]}</li>`;
                    }
                    info += '</ul>';
                } else {
                    info = '<p>No feature info found at this location.</p>';
                }
                content.innerHTML = info;
                popup.setPosition(coordinate);
            })
            .catch(() => {
                content.innerHTML = '<p>Error fetching feature info.</p>';
                popup.setPosition(coordinate);
            });
    } else {
        // Se nessun layer WMS visibile o nessuna info disponibile
        popup.setPosition(undefined);
    }
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

function getLegendElement(title, color) {
    return `<li><span class="legend-color" style="background-color:${color}"></span>${title}</li>`;
}

function updateLegend() {
    let legendHTML = '<ul>';
    overlayLayerList.forEach(layer => {
        if (layer.getVisible()) {
            const title = layer.get('title');
            legendHTML += getLegendElement(title, '#cccccc');
        }
    });
    legendHTML += '</ul>';
    document.getElementById('legend-content').innerHTML = legendHTML;
}

// Inizializza legenda al caricamento
updateLegend();

// Aggiorna legenda ogni volta che cambia la visibilità di un layer
overlayLayerList.forEach(layer => {
    layer.on('change:visible', updateLegend);
});


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
