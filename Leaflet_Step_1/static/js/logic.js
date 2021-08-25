// Use this link to get the GeoJSON data.
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(link).then(function (data) {
  console.log(data);
  createFeatures(data.features);

});

 // Function to Determine Color of Marker Based on the Magnitude of the Earthquake
 function chooseColor(magnitude) {
  switch (true) {
    case magnitude > 2.5:
      return "#CD5C5C";
    case magnitude > 2:
      return "#F08080";
    case magnitude > 1.5:
      return "#FA8072";
    case magnitude > 1:
      return "#E9967A";
    case magnitude > 0.5:
      return "#FFA07A";
    default:
      return "#E6E6FA";
  }
}
function styles(feature){
  return{
    fillColor: chooseColor(feature.properties.mag), 
    fillOpacity: 1,
    weight: 0.1,
    radius: feature.geometry.coordinates[2]

  }
}
function createFeatures(earthquakeData) {
  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes teh place and time of the earthquake. 
  function onEachFeature(feature, layer)  {
    layer.bindPopup(`<h3>${feature.properties.title}</h3>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(feature,latlng){
      return L.circleMarker(latlng)
    },
    style: styles,
    onEachFeature: onEachFeature
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}



  // Send our earthquakes layer to the createMap function
  function createMap(earthquakes) {
    // Create base layer
  var lightMap = L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  });

  // Create a baseMap object
  var baseMap = {
    'Map':lightMap
  };

  // Create an overlay object to hold our overlay
  var overlayMap = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquake layers to display on load
  var myMap = L.map('map', {
    center: [39.82, -98.57],
    zoom: 5,
    layers: [lightMap, earthquakes],
  });

  // Create legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 0.5, 1, 1.5, 2, 2.5],
        colors = ["#E6E6FA", "#FFA07A", "#E9967A", "#FA8072", "#F08080", "#CD5C5C"];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};
legend.addTo(myMap);


  // Create a layer control, pass in baseMaps and overlayMaps, and add the layer control to the map
  L.control.layers(baseMap, overlayMap, {collapsed: false}).addTo(myMap);
  };

