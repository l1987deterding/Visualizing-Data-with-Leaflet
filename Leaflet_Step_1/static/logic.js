// Create Earthquakes GeoJSON URL variables
var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_hour.geojson";

// Create earquake layer variable
var earthquakes = L.LayerGroup();

// Define object for base layer
var baseMap = {
  "Satellite": satelliteMap
};

// Define overlay object for overlay layer
var overlayMap = {
  "Earthquakes": earthquakeMap
};

// Create map with layers
var myMap = L.map('map', {
  center: [38.8026, -116.4194]
  zoom: 2,
  layers: [satelliteMap, earthquakeMap]
});


