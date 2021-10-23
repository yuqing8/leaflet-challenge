
// Add a tile layer.
var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});


// Load the GeoJSON data.
var link="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson"


function chooseColor(depth) {
    if (depth >= 90) return "FireBrick";
    else if (depth >= 70) return "Crimson";
    else if (depth >= 50) return "Coral";
    else if (depth >= 30) return "LightSalmon";
    else if (depth >= 10) return "LimeGreen";
    else return "Chartreuse";
}

function chooseSize(mag) {
    if (mag >= 5.3) return mag*50000;
    else if (mag >= 4.5) return mag*50000;
    // else if (depth >= 50) return "orange";
    // else if (depth >= 30) return "yellow";
    // else if (depth >= 10) return "green";
    else return mag*5000;
}

function MakePops(feature){
    console.log(feature);
    var pop_div = L.DomUtil.create("div")
    var pop_text;

    pop_text = "hello:" +feature.geometry.coordinates[1]+"<br>"+"hello";

    pop_div.innerHTML = pop_text;
    return pop_div;
}


// Getting our GeoJSON data
function createMarkers(response){
    var features = response.features;
    var earthquake_markers = [];
    
    for (var index = 0; index < features.length; index++) {
        var mag = features[index].properties.mag;
        var coordinate = features[index].geometry.coordinates;
        var lat = coordinate[1];
        var lon = coordinate[0];
        var depth = coordinate[2];
        var earthquake_marker = L.circle([lat,lon],{
            color:chooseColor(depth),
            fillOpacity:1,
            radius: chooseSize(mag)
        }).bindPopup(`<h3> place: ${features[index].properties.place}</h3> <hr> <h3>mag: ${mag}</h3>`);
        earthquake_markers.push(earthquake_marker);
    }
    // createMap(L.layerGroup(earthquake_markers));
    var size_and_mag = L.layerGroup(earthquake_markers);
    
    // L.geoJson(response, {
    //     onEachFeature: function (feature, layer) {
    //         layer.bindPopup(MakePops(feature));
    //     }
    // }).addTo(size_and_mag);

    myMap = L.map("map", {
        center: [40.7, -73.95],
        zoom: 2,
        layers: [topo,size_and_mag]
    });

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (myMap) {
      
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [-10,10, 30, 50, 70, 90],
            labels = [];
      
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var j = 0; j < grades.length; j++) {
            div.innerHTML +=
            '<i style="background:' + chooseColor(grades[j] + 1) + '"></i> ' +
                grades[j] + (grades[j + 1] ? '&ndash;' + grades[j + 1] + '<br>' : '+');}
      
        return div;
    };
      
    legend.addTo(myMap);
    
    
}
d3.json(link).then(createMarkers);







