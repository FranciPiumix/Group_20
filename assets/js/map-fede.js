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

const legendData = {
    "NO₂ CAMS – December 2022": [
        { color: "#0571b0", label: "6,8125" },
        { color: "#92c5de", label: "10,7890" },
        { color: "#f7f7f7", label: "14,7656" },
        { color: "#f4a582", label: "18,7421" },
        { color: "#ca0020", label: "22,7187" }
    ],
    "PM2.5 CAMS – December 2022": [
        { color: "#0571b0", label: "7,5217" },
        { color: "#92c5de", label: "13,1830" },
        { color: "#f7f7f7", label: "18,8442" },
        { color: "#f4a582", label: "24,5054" },
        { color: "#ca0020", label: "30,1666" }
    ],

    "NO₂ – Annual average 2022": {
        type: "gradient",
        minLabel: "4,1826",
        maxLabel: "20,7782",
        gradient: [
            "#fff5eb",
            "#fee7cf",
            "#fdd2a5",
            "#fdb271",
            "#fd9243",
            "#f3701b",
            "#df5005",
            "#b13a03",
            "#7f2704"
        ]
    },

    "PM2.5 – Annual average 2022": {
        type: "gradient",
        minLabel: "4,7921",
        maxLabel: "14,5153",
        gradient: [
            "#f7fcf5",
            "#e5f5e0",
            "#c7e9c0",
            "#a1d99b",
            "#74c476",
            "#41ab5d",
            "#238b45",
            "#006d2c",
            "#00441b"
        ]
    }

    "PM2.5 – Annual average 2022": [
        { color: "#fff5eb", label: "7,5217" },
        { color: "#fee7cf", label: "8,9355" },
        { color: "#fdd2a5", label: "10,5638" },
        { color: "#fdb271", label: "11,2833" },
        { color: "#fd9243", label: "11,8765" },
        { color: "#f3701b", label: "12,3562" },
        { color: "#df5005", label: "12,8863" },
        { color: "#b13a03", label: "13,5553" },
        { color: "#7f2704", label: "30,1540" }
    ],
    "NO₂ – Concentration map 2020": [
        { color: "#003366", label: "1" },
        { color: "#2c7bb6", label: "2" }
    ],
    "PM2.5 – Concentration map 2020": [
        { color: "#2c7bb6", label: "2" },
        { color: "#c7e6db", label: "3" }
    ],
    "PM2.5 – Concentration map 2022": [
        { color: "#2c7bb6", label: "2" },
        { color: "#c7e6db", label: "3" },
        { color: "#fec980", label: "4" },
        { color: "#d7191c", label: "5" }
    ],
    "NO₂ AAD": [
        { color: "#003366", label: "<= -5,0000" },
        { color: "#6f8ead", label: "-5,0000 - -2,0000" },
        { color: "#abd0e3", label: "-2,0000 - 0,0000" },
        { color: "#dcb8b4", label: "0,0000 - 2,0000" },
        { color: "#ca6f7d", label: "2,0000 - 5,0000" },
        { color: "#ca0020", label: "> 5,0000" }
    ],
    "PM2.5 AAD": [
        { color: "#003366", label: "<= -3,0000" },
        { color: "#6f8ead", label: "-3,0000 - -1,5000" },
        { color: "#abd0e3", label: "-1,5000 - 0,0000" },
        { color: "#dcb8b4", label: "0,0000 - 1,5000" },
        { color: "#ca6f7d", label: "1,5000 - 3,0000" },
        { color: "#ca0020", label: "> 3,0000" }
    ],
    "Population – 5 Quantile Classes": [
        { color: "#fcfdbf", label: "1" },
        { color: "#fb8761", label: "2" },
        { color: "#b6367a", label: "3" },
        { color: "#50127b", label: "4" },
        { color: "#000004", label: "5" }
    ]
};

const overlayLayers = new ol.layer.Group({
    title: 'Overlay Layers',
    fold: 'open',
    layers: overlayLayerList
});

overlayLayerList.forEach(layer => {
    layer.on('change:visible', updateLegend);
});

updateLegend();

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
    const legendContainer = document.getElementById('legend-content');
    let legendHTML = '<ul>';
    let hasVisibleLayer = false;

    overlayLayerList.forEach(layer => {
        if (layer.getVisible()) {
            const title = layer.get('title');
            const items = legendData[title];
            if (items) {
                hasVisibleLayer = true;
                legendHTML += `<li><label>${title}</label><ul style="margin-left: 10px;">`;

                if (items.type === 'gradient') {
                    const gradientColors = items.gradient.join(', ');
                    legendHTML += `
                        <li>
                            <div style="display: flex; align-items: center;">
                                <span>${items.minLabel}</span>
                                <div style="
                                    height: 16px;
                                    flex-grow: 1;
                                    margin: 0 10px;
                                    background: linear-gradient(to right, ${gradientColors});
                                    border: 1px solid #555;
                                "></div>
                                <span>${items.maxLabel}</span>
                            </div>
                        </li>`;
                } else if (items.type === 'discrete') {
                    items.items.forEach(item => {
                        legendHTML += `<li>
                            <span class="legend-color" style="
                                background-color: ${item.color};
                                display: inline-block;
                                width: 16px;
                                height: 16px;
                                margin-right: 5px;
                                vertical-align: middle;
                                border: 1px solid #555;"></span>
                            ${item.label}
                        </li>`;
                    });
                }

                legendHTML += `</ul></li>`;
            }
        }
    });

    if (hasVisibleLayer) {
        legendContainer.innerHTML = legendHTML + '</ul>';
        legendContainer.style.display = 'block';
    } else {
        legendContainer.innerHTML = '';
        legendContainer.style.display = 'none';
    }
}

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