mapboxgl.accessToken =
  "pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw";
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/light-v10", // style URL
  zoom: 3.75, // starting zoom
  center: [-98, 40], // starting center
  projection: "albers",
});

const grades = [5000, 10000, 20000, 30000, 40000, 50000, 60000],
  colors = [
    "rgb(208,209,230)",
    "rgb(150, 209, 230)",
    "rgb(103,169,207)",
    "rgb(1,108,89)",
    "rgb(10,90,50)",
    "rgb(150,90,10)",
    "rgb(200,50,50)",
  ],
  radii = [5, 10, 20, 30, 40, 50, 60];

//load data to the map as new layers.
//map.on('load', function loadingData() {
map.on("load", () => {
  //simplifying the function statement: arrow with brackets to define a function

  // when loading a geojson, there are two steps
  // add a source of the data and then add the layer out of the source
  map.addSource("covidCounts", {
    type: "geojson",
    data: "assets/us-covid-2020-counts.geojson",
  });

  map.addLayer({
    id: "covid-case",
    type: "circle",
    source: "covidCounts",
    paint: {
      // increase the radii of the circle as the zoom level and dbh value increases
      "circle-radius": {
        property: "cases",
        stops: [
          [
            {
              zoom: 5,
              value: grades[0],
            },
            radii[0],
          ],
          [
            {
              zoom: 5,
              value: grades[1],
            },
            radii[1],
          ],
          [
            {
              zoom: 5,
              value: grades[2],
            },
            radii[2],
          ],
          [
            {
              zoom: 5,
              value: grades[3],
            },
            radii[3],
          ],
          [
            {
              zoom: 5,
              value: grades[4],
            },
            radii[4],
          ],
          [
            {
              zoom: 5,
              value: grades[5],
            },
            radii[5],
          ],
          [
            {
              zoom: 5,
              value: grades[6],
            },
            radii[6],
          ],
        ],
      },
      "circle-color": {
        property: "cases",
        stops: [
          [grades[0], colors[0]],
          [grades[1], colors[1]],
          [grades[2], colors[2]],
          [grades[3], colors[3]],
          [grades[4], colors[4]],
          [grades[5], colors[5]],
          [grades[6], colors[6]],
        ],
      },
      "circle-stroke-color": "white",
      "circle-stroke-width": 1,
      "circle-opacity": 0.6,
    },
  });

  // click on tree to view magnitude in a popup
  map.on("click", "covid-case", (event) => {
    new mapboxgl.Popup()
      .setLngLat(event.features[0].geometry.coordinates)
      .setHTML(
        `
         <strong>County:</strong> ${event.features[0].properties.county}
      <br>
        <strong>Cases:</strong> ${event.features[0].properties.cases}
      <br>
      <strong>Deaths:</strong> ${event.features[0].properties.deaths}`
      )
      .addTo(map);
  });
});

// create legend
const legend = document.getElementById("legend");

//set up legend grades and labels
var labels = ["<strong>Cases</strong>"],
  vbreak;
//iterate through grades and create a scaled circle and label for each
for (var i = 0; i < grades.length; i++) {
  vbreak = grades[i];
  // you need to manually adjust the radii of each dot on the legend
  // in order to make sure the legend can be properly referred to the dot on the map.
  dot_radii = 2 * radii[i];
  labels.push(
    '<p class="break"><i class="dot" style="background:' +
      colors[i] +
      "; width: " +
      dot_radii +
      "px; height: " +
      dot_radii +
      'px; "></i> <span class="dot-label" style="top: ' +
      dot_radii / 2 +
      'px;">' +
      vbreak +
      "</span></p>"
  );
}
const source =
  '<p style="text-align: right; font-size:10pt">Source: <a href="https://earthquake.usgs.gov/earthquakes/">USGS</a></p>';

legend.innerHTML = labels.join("") + source;
