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

// Raggruppiamo i layer in base alle tue liste
const pollutantConcentrationTitles = [
    "NO₂ CAMS – December 2022",
    "PM2.5 CAMS – December 2022",
    "NO₂ – Annual average 2022",
    "PM2.5 – Annual average 2022",
    "NO₂ – Concentration map 2020",
    "PM2.5 – Concentration map 2020",
    "PM2.5 – Concentration map 2022",
    "NO₂ – Concentration map 2022",
    "NO₂ AAD",
    "PM2.5 AAD"
];

const populationExposureTitles = [
    "NO₂ – Bivariate 2020",
    "PM2.5 – Bivariate 2020",
    "Population – 5 Quantile Classes"
];

// Funzione per filtrare i layer per titolo
function filterLayersByTitles(titles) {
    return overlayLayerList.filter(layer => titles.includes(layer.get('title')));
}

// Creiamo i due gruppi
const pollutantConcentrationGroup = new ol.layer.Group({
    title: 'Pollutant concentration',
    fold: 'open',
    layers: filterLayersByTitles(pollutantConcentrationTitles)
});

const populationExposureGroup = new ol.layer.Group({
    title: 'Population exposure',
    fold: 'open',
    layers: filterLayersByTitles(populationExposureTitles)
});

const overlayLayers = new ol.layer.Group({
    title: 'Overlay Layers',
    fold: 'open',
    layers: [
        populationExposureGroup,
        pollutantConcentrationGroup
    ]
});


const legendData = {
    "NO₂ CAMS – December 2022": {
        type: "gradient",
        minLabel: `${parseFloat("6.8125").toFixed(2)} μg/m³`,
        maxLabel: `${parseFloat("22.7187").toFixed(2)} μg/m³`,
        gradient: [
            "#ca0020", "#f4a582", "#f7f7f7", "#92c5de", "#0571b0"
        ]
    },
    "PM2.5 CAMS – December 2022": {
        type: "gradient",
        minLabel: `${parseFloat("7.5217").toFixed(2)} μg/m³`,
        maxLabel: `${parseFloat("30.1666").toFixed(2)} μg/m³`,
        gradient: [
            "#ca0020", "#f4a582", "#f7f7f7", "#92c5de", "#0571b0"
        ]
    },
    "NO₂ – Annual average 2022": {
        type: "gradient",
        minLabel: `${parseFloat("4.1826").toFixed(2)} μg/m³`,
        maxLabel: `${parseFloat("20.7782").toFixed(2)} μg/m³`,
        gradient: [
            "#7f2704", "#b13a03", "#df5005", "#f3701b", "#fd9243", "#fdb271", "#fdd2a5", "#fee7cf", "#fff5eb"
        ]
    },
    "PM2.5 – Annual average 2022": {
        type: "gradient",
        minLabel: `${parseFloat("4.7921").toFixed(2)} μg/m³`,
        maxLabel: `${parseFloat("14.5153").toFixed(2)} μg/m³`,
        gradient: [
            "#7f2704", "#b13a03", "#df5005", "#f3701b", "#fd9243", "#fdb271", "#fdd2a5", "#fee7cf", "#fff5eb"
        ]
    },

    "NO₂ – Concentration map 2020": {
        type: "discrete",
        items: [
            { color: "#003366", label: "1" },
            { color: "#2c7bb6", label: "2" }
        ]
    },
    "PM2.5 – Concentration map 2020": {
        type: "discrete",
        items: [
            { color: "#2c7bb6", label: "2" },
            { color: "#c7e6db", label: "3" }
        ]
    },
    "NO₂ – Concentration map 2022": {
        type: "discrete",
        items: [
            { color: "#003366", label: "1" },
            { color: "#2c7bb6", label: "2" },
        ]
    },
    "PM2.5 – Concentration map 2022": {
        type: "discrete",
        items: [
            { color: "#2c7bb6", label: "2" },
            { color: "#c7e6db", label: "3" },
            { color: "#fec980", label: "4" },
            { color: "#d7191c", label: "5" }
        ]
    },
    "NO₂ AAD": {
        type: "discrete",
        items: [
            { color: "#003366", label: "<= -5.00 μg/m³" },
            { color: "#6f8ead", label: "-5.00 – -2.00 μg/m³" },
            { color: "#abd0e3", label: "-2.00 – 0.00 μg/m³" },
            { color: "#dcb8b4", label: "0.00 – 2.00 μg/m³" },
            { color: "#ca6f7d", label: "2.00 – 5.00 μg/m³" },
            { color: "#ca0020", label: "> 5.00 μg/m³" }
        ]
    },
    "PM2.5 AAD": {
        type: "discrete",
        items: [
            { color: "#003366", label: "<= -3.00 μg/m³" },
            { color: "#6f8ead", label: "-3.00 – -1.50 μg/m³" },
            { color: "#abd0e3", label: "-1.50 – 0.00 μg/m³" },
            { color: "#dcb8b4", label: "0.00 – 1.50 μg/m³" },
            { color: "#ca6f7d", label: "1.50 – 3.00 μg/m³" },
            { color: "#ca0020", label: "> 3.00 μg/m³" }
        ]
    },
    "Population – 5 Quantile Classes": {
        type: "discrete",
        items: [
            { color: "#fcfdbf", label: "1" },
            { color: "#fb8761", label: "2" },
            { color: "#b6367a", label: "3" },
            { color: "#50127b", label: "4" },
            { color: "#000004", label: "5" }
        ]
    },
    "NO₂ – Bivariate 2020": {
        type: "bivariate",
        title: "Pollution × Popolation",
        rows: 5,
        cols: 5,
        colors: [
            ["#fffffe", "#ffe8ee", "#ffcbd7", "#ffaec0", "#ff88a6"],
            ["#ddfffd", "#cde6e5", "#c3c6cb", "#bb68b4", "#b08ea6"],
            ["#b9fffc", "#a4dfdd", "#95b6c3", "#8a9cad", "#7d8ba1"],
            ["#7cfdfd", "#64dbdc", "#54b5bd", "#4591a0", "#397e8d"],
            ["#50fffd", "#44d6d4", "#3c9fad", "#32788f", "#2a6682"]
        ],
        xLabel: "Population",
        yLabel: "Pollution"
    },
    "PM2.5 – Bivariate 2020": {
        type: "bivariate",
        title: "Pollution × Popolation",
        rows: 5,
        cols: 5,
        colors: [
            ["#fffffe", "#ffe8ee", "#ffcbd7", "#ffaec0", "#ff88a6"],
            ["#ddfffd", "#cde6e5", "#c3c6cb", "#bb68b4", "#b08ea6"],
            ["#b9fffc", "#a4dfdd", "#95b6c3", "#8a9cad", "#7d8ba1"],
            ["#7cfdfd", "#64dbdc", "#54b5bd", "#4591a0", "#397e8d"],
            ["#50fffd", "#44d6d4", "#3c9fad", "#32788f", "#2a6682"]
        ],
        xLabel: "Population",
        yLabel: "Pollution"
    }
};

// Funzione ricorsiva per aggiungere listener a tutti i layer figli
function addVisibilityListenerToAllLayers(layerGroup) {
    layerGroup.getLayers().forEach(layer => {
        if (layer instanceof ol.layer.Group) {
            // Se è un gruppo, ricorsivamente aggiungi listener ai figli
            addVisibilityListenerToAllLayers(layer);
        } else {
            // Layer singolo: aggiungi listener sul cambio di visibilità
            layer.on('change:visible', updateLegend);
        }
    });
}

// Applichiamo ai gruppi overlay
addVisibilityListenerToAllLayers(overlayLayers);

// Chiamiamo updateLegend all’inizio
updateLegend();


// ==============================
// MAP
// ==============================

const map = new ol.Map({
    target: 'map',
    layers: [basemapLayers, overlayLayers],
    view: new ol.View({
        projection: 'EPSG:4326',
        center: [15.4730, 49.8175],
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
        return source.getFeatureInfoUrl(coordinate, resolution, 'EPSG:4326', {
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
                    const gradientSquares = items.gradient.map(color => `
        <div style="width: 20px; height: 10px; background-color: ${color}; margin: 0; padding: 0;"></div>
    `).join('');

                    legendHTML += `
        <li>
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="display: flex; flex-direction: column;">
                    ${gradientSquares}
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-start; font-size: 12px;">
                    <span>${items.maxLabel}</span>
                    <div style="flex-grow: 1;"></div>
                    <span>${items.minLabel}</span>
                </div>
            </div>
        </li>`;
                }
                else if (items.type === 'bivariate') {
                    const { rows, cols, colors, xLabel, yLabel } = items;

                    // Costruisci griglia (invertendo le righe)
                    let gridHTML = '<table style="border-collapse: collapse; margin: 10px 0;">';
                    for (let r = rows - 1; r >= 0; r--) {
                        gridHTML += '<tr>';
                        for (let c = 0; c < cols; c++) {
                            const color = colors[r][c];
                            gridHTML += `<td style="width: 20px; height: 20px; background-color: ${color}; border: 1px solid #ccc;"></td>`;
                        }
                        gridHTML += '</tr>';
                    }
                    gridHTML += '</table>';

                    legendHTML += `
        <li style="display: flex; flex-direction: column; align-items: center;">
            <strong>${items.title || ""}</strong>
            <div style="display: flex; flex-direction: row; align-items: center; margin-top: 8px;">
                
              <!-- Y axis label with arrow up -->
        <div 
            style="
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                justify-content: center; 
                margin-right: 10px; 
                font-size: 12px;
                height: ${20 * rows}px;  /* 📍MODIFICA QUI: Assicura altezza pari alla griglia */
            "
        >
            <div 
                style="
                    writing-mode: vertical-rl; 
                    text-align: center;
                    transform: rotate(180deg); /* 📍MODIFICA QUI: Ruota il testo per leggerlo dal basso verso l’alto */
                "
            >
                ${yLabel || "Pollution"} 
                <div style="margin-top: 4px;">↑</div> <!-- 📍MODIFICA QUI: Sposta la freccia sotto -->
            </div>
        </div>
                }
                < !--Grid and x - axis-- >
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        ${gridHTML}
                        <div style="font-size: 12px; margin-top: 4px;">
                            ${xLabel || "Population"} →
                        </div>
                    </div>
            </div >
        </li > `;
                }
                else if (items.type === 'discrete') {
                    items.items.forEach(item => {
                        legendHTML += `< li >
                    <span class="legend-color" style="
                                background-color: ${item.color};
                                display: inline-block;
                                width: 16px;
                                height: 16px;
                                margin-right: 5px;
                                vertical-align: middle;
                                border: 1px solid #555;"></span>
                            ${item.label}
                        </li > `;
                    });
                }

                legendHTML += `</ul ></li > `;
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