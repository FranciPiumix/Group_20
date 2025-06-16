// OpenStreetMap base map
var osm = new ol.layer.Tile({
    title: "Open Street Map",
    type: "base",
    visible: true,
    source: new ol.source.OSM()
});

// Colombia Administrative Boundaries
var colombiaBoundary = new ol.layer.Image({
    title: "Colombia Administrative level 0",
    source: new ol.source.ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/wms',
        params: { 'LAYERS': 'gis:COL_adm0' }
    }),
    visible: false
});

// Colombia Administrative level 1
var colombiaDepartments = new ol.layer.Image({
    title: "Colombia Administrative level 1",
    source: new ol.source.ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/wms',
        params: { 'LAYERS': 'gis:COL_adm1' }
    }),
    opacity: 0.5,
    visible: false
});

// Colombia Roads
var colombiaRoads = new ol.layer.Image({
    title: "Colombia Roads",
    source: new ol.source.ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/wms',
        params: { 'LAYERS': 'gis:COL_roads' }
    }),
    visible: false
});

// Colombia Rivers
var colombiaRivers = new ol.layer.Image({
    title: "Colombia Rivers",
    source: new ol.source.ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/wms',
        params: { 'LAYERS': 'gis:COL_rivers' }
    }),
    visible: false,
    minResolution: 1000,
    maxResolution: 5000
});

// Base and overlay layer groups
var basemapLayers = new ol.layer.Group({
    title: 'Base Maps',
    layers: [osm]
});
var overlayLayers = new ol.layer.Group({
    title: 'Overlay Layers',
    layers: [
        colombiaBoundary,
        colombiaDepartments,
        colombiaRivers,
        colombiaRoads
    ]
});

// Map initialization
var mapOrigin = ol.proj.fromLonLat([15.4730, 49.8175]); // Centro della Repubblica Ceca
var zoomLevel = 7;
var map = new ol.Map({
    target: 'map',
    layers: [basemapLayers, overlayLayers],
    view: new ol.View({
        center: mapOrigin,
        zoom: zoomLevel
    }),
    projection: 'EPSG:3857'
});

// Controls
map.addControl(new ol.control.ScaleLine());
map.addControl(new ol.control.MousePosition({
    coordinateFormat: ol.coordinate.createStringXY(4),
    projection: 'EPSG:4326',
    className: 'custom-control',
    placeholder: '0.0000, 0.0000'
}));

// LayerSwitcher control
var layerSwitcher = new ol.control.LayerSwitcher();
map.addControl(layerSwitcher);

// Stadia basemaps
var stamenWatercolor = new ol.layer.Tile({
    title: 'Stamen Watercolor',
    type: 'base',
    visible: false,
    source: new ol.source.StadiaMaps({
        layer: 'stamen_watercolor'
    })
});
var stamenToner = new ol.layer.Tile({
    title: 'Stamen Toner',
    type: 'base',
    visible: false,
    source: new ol.source.StadiaMaps({
        layer: 'stamen_toner'
    })
});
basemapLayers.getLayers().extend([stamenWatercolor, stamenToner]);

// ESRI XYZ basemaps
var esriTopoBasemap = new ol.layer.Tile({
    title: 'ESRI Topographic',
    type: 'base',
    visible: false,
    source: new ol.source.XYZ({
        attributions:
            'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
            'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
        url:
            'https://server.arcgisonline.com/ArcGIS/rest/services/' +
            'World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
    }),
});
var esriWorldImagery = new ol.layer.Tile({
    title: 'ESRI World Imagery',
    type: 'base',
    visible: false,
    source: new ol.source.XYZ({
        attributions:
            'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
            'rest/services/World_Imagery/MapServer">ArcGIS</a>',
        url:
            'https://server.arcgisonline.com/ArcGIS/rest/services/' +
            'World_Imagery/MapServer/tile/{z}/{y}/{x}'
    }),
});
basemapLayers.getLayers().extend([esriTopoBasemap, esriWorldImagery]);

// WFS Layer: Colombia Water Areas
var wfsUrl = "https://www.gis-geoserver.polimi.it/geoserver/gis/wfs?" +
    "service=WFS&version=2.0.0&request=GetFeature&" +
    "typeName=gis:COL_water_areas&srsname=EPSG:3857&outputFormat=application/json";

var wfsSource = new ol.source.Vector();

var wfsLayer = new ol.layer.Vector({
    title: "Colombia Water Areas",
    source: wfsSource,
    visible: true,
    style: new ol.style.Style({
        fill: new ol.style.Fill({ color: "#bde0fe" }),
        stroke: new ol.style.Stroke({ width: 2, color: "#a2d2ff" })
    })
});

fetch(wfsUrl)
    .then(function (response) {
        if (!response.ok) {
            throw new Error('Error ' + response.statusText);
        }
        return response.json();
    })
    .then(function (data) {
        var features = new ol.format.GeoJSON().readFeatures(data);
        wfsSource.addFeatures(features);
    })
    .catch(function (error) {
        console.error('WFS fetch error:', error);
    });

overlayLayers.getLayers().extend([wfsLayer]);

// Static GeoJSON layer: Colombia Municipalities
var staticGeoJSONSource = new ol.source.Vector({
    url: 'assets/geojson/COL_adm2.geojson',
    format: new ol.format.GeoJSON()
});
var staticGeoJSONLayer = new ol.layer.Vector({
    title: "Colombia Municipalities",
    source: staticGeoJSONSource,
    style: new ol.style.Style({
        fill: new ol.style.Fill({ color: "rgba(255, 127, 80, 0.5)" }),
        stroke: new ol.style.Stroke({ width: 2, color: "#ff7f50" })
    })
});
overlayLayers.getLayers().push(staticGeoJSONLayer);

// Popup overlay
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

var popup = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
});
map.addOverlay(popup);

closer.onclick = function () {
    popup.setPosition(undefined);
    closer.blur();
    return false;
};

// Single click event for popup on staticGeoJSONLayer
map.on('singleclick', function (event) {
    var feature = map.forEachFeatureAtPixel(event.pixel, function (feature, layer) {
        if (layer === staticGeoJSONLayer) {
            return feature;
        }
    });
    if (feature) {
        var coord = event.coordinate;
        popup.setPosition(coord);
        content.innerHTML = '<h5>Administrative Level 2</h5><br><span>' +
            feature.get('name_2') + ', ' + feature.get('name_1') + '</span>';
    } else {
        popup.setPosition(undefined);
        closer.blur();
    }
});

// Change mouse cursor when hovering features
map.on('pointermove', function (event) {
    var hit = map.hasFeatureAtPixel(event.pixel);
    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});

// Legend generation
var legendHTMLString = '<ul>';
function getLegendElement(title, color) {
    return '<li><span class="legend-color" style="background-color:' + color + '"></span>' + title + '</li>';
}

overlayLayers.getLayers().forEach(function (layer) {
    var source = layer.getSource();
    var title = layer.get('title');
    var color = null;
    if (source instanceof ol.source.ImageWMS) {
        // For simplicity, no legend graphic fetching here
        color = '#cccccc';
    } else if (layer.getStyle && layer.getStyle()) {
        var style = layer.getStyle();
        if (style.getFill) {
            color = style.getFill().getColor();
            if (Array.isArray(color)) {
                color = 'rgba(' + color.join(',') + ')';
            }
        }
    }
    if (color) {
        legendHTMLString += getLegendElement(title, color);
    }
});
legendHTMLString += '</ul>';

document.getElementById('legend-content').innerHTML = legendHTMLString;
