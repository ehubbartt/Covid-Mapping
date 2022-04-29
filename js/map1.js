mapboxgl.accessToken =
  "pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw";
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/light-v10", // style URL
  zoom: 3.75, // starting zoom
  center: [-98, 40], // starting center
  projection: "albers",
});

// load data and add as layer
async function geojsonFetch() {
  let response = await fetch("assets/us-covid-2020-rates.geojson");
  let countyData = await response.json();

  map.on("load", function loadingData() {
    map.addSource("countyData", {
      type: "geojson",
      data: countyData,
    });

    map.addLayer({
      id: "countyData-layer",
      type: "fill",
      source: "countyData",
      paint: {
        "fill-color": [
          "step",
          ["get", "cases"],
          "#FFEDA0", // stop_output_0
          5000, // stop_input_0
          "#FED976", // stop_output_1
          10000, // stop_input_1
          "#FEB24C", // stop_output_2
          20000, // stop_input_2
          "#FD8D3C", // stop_output_3
          30000, // stop_input_3
          "#FC4E2A", // stop_output_4
          40000, // stop_input_4
          "#E31A1C", // stop_output_5
          50000, // stop_input_5
          "#BD0026", // stop_output_6
          60000, // stop_input_6
          "#800026", // stop_output_7
        ],
        "fill-outline-color": "#BBBBBB",
        "fill-opacity": 0.7,
      },
    });

    const layers = [
      "0-4999",
      "5000-9999",
      "10000-19999",
      "20000-29999",
      "30000-39999",
      "40000-49999",
      "50000-59999",
      "60000 and more",
    ];
    const colors = [
      "#FFEDA070",
      "#FED97670",
      "#FEB24C70",
      "#FD8D3C70",
      "#FC4E2A70",
      "#E31A1C70",
      "#BD002670",
      "#80002670",
    ];

    // create legend
    const legend = document.getElementById("legend");
    legend.innerHTML =
      "<b>Covid-19 cases per county<br>(cases/county)</b><br><br>";

    layers.forEach((layer, i) => {
      const color = colors[i];
      const item = document.createElement("div");
      const key = document.createElement("span");
      key.className = "legend-key";
      key.style.backgroundColor = color;

      const value = document.createElement("span");
      value.innerHTML = `${layer}`;
      item.appendChild(key);
      item.appendChild(value);
      legend.appendChild(item);
    });
  });

  map.on("mousemove", ({ point }) => {
    const county = map.queryRenderedFeatures(point, {
      layers: ["countyData-layer"],
    });
    document.getElementById("text-escription").innerHTML = county.length
      ? `<h3>${county[0].properties.county}</h3><p><strong><em>${county[0].properties.cases}</strong> Cases</em></p>
      <p><strong><em>${county[0].properties.deaths}</strong> Deaths</em></p>`
      : `<p>Hover over a state!</p>`;
  });
}

geojsonFetch();
