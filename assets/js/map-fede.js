import 'ol/ol.css';
import 'ol-layerswitcher/dist/ol-layerswitcher.css';
import { Map, View, Overlay } from 'ol';
import { Tile, Image, Group, Vector } from 'ol/layer';
import { OSM, ImageWMS, XYZ, StadiaMaps } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import { GeoJSON } from 'ol/format';
import { fromLonLat } from 'ol/proj';
import { ScaleLine, FullScreen, MousePosition } from 'ol/control';
import LayerSwitcher from 'ol-layerswitcher';
import { createStringXY } from 'ol/coordinate';
import { Style, Fill, Stroke } from 'ol/style';

// --- BASEMAPS ---
let osm = new Tile({
    title: "Open Street Map",
    type: "base",
    visible: true,
    source: new OSM()
});

let basemapLayers = new Group({
    title: 'Base Maps',
    layers: [osm]
});

let stamenWatercolor = new Tile({
    title: 'Stamen Watercolor',
    type: 'base',
    visible: false,
    source: new StadiaMaps({ layer: 'stamen_watercolor' })
});

let stamenToner = new Tile({
    title: 'Stamen Toner',
    type: 'base',
    visible: false,
    source: new StadiaMaps({ layer: 'stamen_toner' })
});

let esriTopoBasemap = new Tile({
    title: 'ESRI Topographic',
    type: 'base',
    visible: false,
    source: new XYZ({
        attributions: 'Tiles © ArcGIS',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
    })
});

let esriWorldImagery = new Tile({
    title: 'ESRI World Imagery',
    type: 'base',
    visible: false,
    source: new XYZ({
        attributions: 'Tiles © ArcGIS',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    })
});

basemapLayers.getLayers().extend([
    stamenWatercolor, stamenToner, esriTopoBasemap, esriWorldImagery
]);

// --- OVERLAYS ---
let overlayLayers = new Group({
    title: 'Overlay Layers',
    layers: []
});

const wmsUrl = 'https://www.gis-geoserver.polimi.it/geoserver/wms';
const wmsLayers = [
    { title: "Colombia Administrative level 0", layer: "gis:COL_adm0" },
    { title: "Colombia Administrative level 1", layer: "gis:COL_adm1", opacity: 0.5 },
    { title: "Colombia Roads", layer: "gis:COL_roads" },
    { title: "Colombia Rivers", layer: "gis:COL_rivers", minResolution: 1000, maxResolution: 5000 }
];

for (let w of wmsLayers) {
    overlayLayers.getLayers().push(new Image({
        title: w.title,
        source: new ImageWMS({
            url: wmsUrl,
            params: { LAYERS: w.layer }
        }),
        opacity: w.opacity ?? 1,
        minResolution: w.minResolution,
        maxResolution: w.maxResolution,
        visible: false
    }));
}

// --- WFS LAYER ---
let wfsSource = new VectorSource({});
let wfsLayer = new Vector({
    title: "Colombia Water Areas",
    source: wfsSource,
    visible: true,
    style: new Style({
        fill: new Fill({ color: "#bde0fe" }),
        stroke: new Stroke({ width: 2, color: "#a2d2ff" })
    })
});
overlayLayers.getLayers().push(wfsLayer);

fetch("https://www.gis-geoserver.polimi.it/geoserver/gis/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=gis:COL_water_areas&srsname=EPSG:3857&outputFormat=application/json")
    .then(res => res.json())
    .then(data => {
        wfsSource.addFeatures(new GeoJSON().readFeatures(data));
    });

// --- STATIC GEOJSON ---
let staticGeoJSONLayer = new Vector({
    title: "Colombia Municipalities",
    source: new VectorSource({
        url: 'assets/geojson/COL_adm2.geojson',
        format: new GeoJSON()
    }),
    style: new Style({
        fill: new Fill({ color: "rgba(255, 127, 80, 0.5)" }),
        stroke: new Stroke({ width: 2, color: "#ff7f50" })
    })
});
overlayLayers.getLayers().push(staticGeoJSONLayer);

// --- MAP INIT ---
let map = new Map({
    target: 'map',
    layers: [],
    view: new View({
        center: fromLonLat([-74, 4.6]),
        zoom: 5
    })
});
map.addLayer(basemapLayers);
map.addLayer(overlayLayers);

// --- CONTROLS ---
map.addControl(new ScaleLine());
map.addControl(new FullScreen());
map.addControl(new MousePosition({
    coordinateFormat: createStringXY(4),
    projection: 'EPSG:4326',
    className: 'custom-control',
    placeholder: '0.0000, 0.0000'
}));
map.addControl(new LayerSwitcher({ tipLabel: 'Legend' }));

// --- POPUP ---
let container = document.getElementById('popup');
let content = document.getElementById('popup-content');
let closer = document.getElementById('popup-closer');
let popup = new Overlay({ element: container });
map.addOverlay(popup);

closer.onclick = function () {
    popup.setPosition(undefined);
    closer.blur();
    return false;
};

map.on('singleclick', function (event) {
    let feature = map.forEachFeatureAtPixel(event.pixel, function (feature, layer) {
        return layer === staticGeoJSONLayer ? feature : null;
    });

    if (feature) {
        let coord = map.getCoordinateFromPixel(event.pixel);
        popup.setPosition(coord);
        content.innerHTML =
            `<h5>Administrative Level 2</h5><span>${feature.get('name_2')}, ${feature.get('name_1')}</span>`;
    }
});

map.on('pointermove', function (event) {
    map.getTargetElement().style.cursor = map.hasFeatureAtPixel(event.pixel) ? 'pointer' : '';
});

// --- LEGEND ---
(async () => {
    let legendHTMLString = '<ul>';
    const getLegendElement = (title, color) =>
        `<li><span class="legend-color" style="background-color:${color}"></span>${title}</li>`;

    for (let layer of overlayLayers.getLayers().getArray()) {
        if (layer.getSource() instanceof ImageWMS) {
            try {
                const legendUrl = layer.getSource().getLegendUrl(0, { format: "application/json" });
                const response = await fetch(legendUrl);
                const json = await response.json();
                const symbol = json.Legend[0]?.rules[0]?.symbolizers[0];
                let color = symbol?.Polygon?.fill || symbol?.Line?.stroke;
                if (color) legendHTMLString += getLegendElement(layer.get('title'), color);
            } catch (e) {
                console.warn("Legend fetch error", e);
            }
        } else {
            const style = layer.getStyle();
            const color = style.getFill()?.getColor();
            if (color) legendHTMLString += getLegendElement(layer.get('title'), color);
        }
    }

    legendHTMLString += "</ul>";
    document.getElementById('legend-content').innerHTML = legendHTMLString;
})();
