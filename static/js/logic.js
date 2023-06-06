// Store our API endpoint inside Url
Url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Perform a GET request to the query URL
d3.json(Url).then(function(data) {

// Once a response is received, send the data.features object to the createFeatures function
    createFeatures(data.features);
  });
  
  function markerSize(magnitude) {
      return magnitude * 5;
  }
  function markerColor(magnitude) {
    if (magnitude <= 1) {
      return "rgb(218, 236, 166)";
    } else if (magnitude <= 2) {
      return "rgb(236, 234, 156)";
    } else if (magnitude <= 3) {
      return "rgb(236, 213, 146)";
    } else if (magnitude <= 4) {
      return "rgb(223, 183, 120)";
    } else if (magnitude <= 5) {
      return "rgb(229, 160, 91)";
    } else {
      return "rgb(245, 134, 104)";
    }
  }

function createFeatures(earthquakeData) {

// Define a function to run once for each feature in the features array
// Give each feature a popup describing the place and time of the earthquake

    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "</h3><hr><p>" + "Magnitude: " + 
        (feature.properties.mag) + "</p>");
    }
  
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array

     earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng, {
              radius: markerSize(feature.properties.mag),
              fillColor: markerColor(feature.properties.mag),
              color: "#000",
              weight: 0.3,
              opacity: 0.4,
              fillOpacity: 1
          });
      },
      onEachFeature: onEachFeature
  });
// pass earthquakes layer to the createMap function
createMap(earthquakes);
}
function createMap(earthquakes) {

    // Define streetmap, topo, satellite and darkmap layers

  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

let topomap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
})

let darkmap = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles: &copy; <a href="https://carto.com/attributions">CARTO</a>'
});

let satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri',
    tileSize: 512,
    maxZoom: 18,
  zoomOffset: -1
});

  
    // Define a baseMaps object to hold our base layers
     baseMaps = {
      "Street Map": streetmap,
      "Topo Map": topomap,
      "Dark Map": darkmap,
      "Satellite Map": satellite
  
    };
  
    // Create overlay object to hold our overlay layer
     overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
     myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [topomap, darkmap, satellite, earthquakes]
    });
  
    // Create a layer control
    // Pass in baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  
     legend = L.control({ position: "bottomright" });
    legend.onAdd = function(_map) {
         div = L.DomUtil.create("div", "info legend");
        magnitudes = [0, 1, 2, 3, 4, 5];
        labels = [];
        legendInfo = "<strong>Magnitude</strong>";
        div.innerHTML = legendInfo;
        // push to labels array as list item
        for ( i = 0; i < magnitudes.length; i++) {
            labels.push('<li style="background-color:' + markerColor(magnitudes[i] + 1) + '"> <span>' + magnitudes[i] + (magnitudes[i + 1]
                 ? '&ndash;' + magnitudes[i + 1] + '' : '+') + '</span></li>');
        }
        // add label items to the div under the <ul> tag
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };
    // Add legend to the map
    legend.addTo(myMap);
  
  };
  