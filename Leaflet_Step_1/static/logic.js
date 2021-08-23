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
  center: [38.8026, -116.4194],
  zoom: 2,
  layers: [satelliteMap, earthquakeMap]
});

// Get USGS data with D3
d3.json(earthquakeUrl).then(function (data) {
  // Pass function to make marker size = magnitude of earthquake
  function markerSize(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 3;
  }
  // Pass function to make color of marker align with magnitude
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: chooseColor(feature.properties.mag),
      color: "#000000",
      radius: markerSize(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
};
// Function to Determine Color of Marker Based on the Magnitude of the Earthquake
function chooseColor(magnitude) {
    switch (true) {
    // dark red
    case magnitude > 5:
        return "#8B0000";
    // firebrick
    case magnitude > 4:
        return "##B22222";
    // crimson
    case magnitude > 3:
        return "#DC143C";
    // deep pink
    case magnitude > 2:
        return "#FF1493";
    // hot pink
    case magnitude > 1:
        return "#FF69B4";
    // lavender blush
    default:
        return "#FFF0F5";
    }
};

// Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Create a GeoJSON Layer Containing the Features Array on the earthquakeData Object
  L.geoJSON(earthquakeData, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
      },
      style: styleInfo,
      // Function to Run Once For Each feature in the features Array
      // Give Each feature a Popup Describing the Place & Time of the Earthquake
      onEachFeature: function(feature, layer) {
          layer.bindPopup("<h4>Location: " + feature.properties.place + 
          "</h4><hr><p>Date & Time: " + new Date(feature.properties.time) + 
          "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
      }
  // Add earthquakeData to earthquakes LayerGroups 
  }).addTo(earthquakes);
  // Add earthquakes Layer to the Map
  earthquakes.addTo(myMap)
});