require("dotenv").config({ path: __dirname + "/.env" });
const axios = require("axios");
const L = require("leaflet");

console.log(process.env.ACCESS_KEY);
console.log(require("dotenv").config());

let loading = true;
let loadingDiv = document.getElementById("loading");

async function loadMap() {
  try {
    let response = await axios.get("../geo.json");
    let features = await response.data;

    let getColor = (law) => {
      return law === "law1"
        ? "red"
        : law === "law2"
        ? "yellow"
        : law === "law3"
        ? "blue"
        : "none";
    };

    let setLaw1Color = () => {
      myMap.removeLayer(worldCountries);
      worldCountries = L.geoJSON(features, {
        style: law1Style,
      });
      myMap.addLayer(worldCountries);
    };

    let setLaw2Color = () => {
      myMap.removeLayer(worldCountries);
      worldCountries = L.geoJSON(features, { style: law2Style });
      myMap.addLayer(worldCountries);
    };

    let setLaw3Color = () => {
      myMap.removeLayer(worldCountries);
      worldCountries = L.geoJSON(features, { style: law3Style });
      myMap.addLayer(worldCountries);
    };

    let basicStyle = {
      fillColor: "none",
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7,
    };

    let law1Style = (feature) => {
      return {
        fillColor: getColor(feature.properties.law1),
        weight: 2,
        opacity: 1,
        color: "white",
        dashArray: "3",
        fillOpacity: 0.7,
      };
    };

    let law2Style = (feature) => {
      return {
        fillColor: getColor(feature.properties.law2),
        weight: 2,
        opacity: 1,
        color: "white",
        dashArray: "3",
        fillOpacity: 0.7,
      };
    };

    let law3Style = (feature) => {
      return {
        fillColor: getColor(feature.properties.law3),
        weight: 2,
        opacity: 1,
        color: "white",
        dashArray: "3",
        fillOpacity: 0.7,
      };
    };

    document.getElementById("law1").onclick = setLaw1Color;
    document.getElementById("law2").onclick = setLaw2Color;
    document.getElementById("law3").onclick = setLaw3Color;
    console.log(process.env.API_URL);
    console.log(process.env.ACCESS_KEY);
    let myMap = L.map("mapid").setView([0, 0], 3);
    L.tileLayer(`${process.env.API_URL}`, {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      minZoom: 3,
      maxZoom: 10,
      zoomDelta: 0.1,
      zoomSnap: 0,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken: process.env.ACCESS_KEY,
    }).addTo(myMap);

    let worldCountries = L.geoJSON(features, {
      style: basicStyle,
    });
    myMap.addLayer(worldCountries);

    // let geojson;

    // let highlightFeature = (e) => {
    //   e.alert("hovered");
    //   let layer = e.target;

    //   layer.alert("hovered");

    //   layer.setStyle({
    //     weight: 5,
    //     color: "#666",
    //     dashArray: "",
    //     fillOpacity: 0.7,
    //   });
    // };

    // let resetHighlight = (e) => {
    //   geojson.resetStyle(e.target);
    // };

    // let zoomToFeature = (e) => {
    //   myMap.fitBounds(e.target.getBounds());
    // };

    // let onEachFeature = (feature, layer) => {
    //   layer.on({
    //     mouseover: highlightFeature,
    //     mouseout: resetHighlight,
    //     click: zoomToFeature,
    //   });
    // };

    // geojson = L.geoJson(features, {
    //   style: basicStyle,
    //   onEachFeature: onEachFeature,
    // });

    loading = false;
    if (loading) {
      document.getElementById("mapid").style.display = "none";
    } else {
      loadingDiv.style.display = "none";
    }
  } catch (err) {
    console.log(err);
  }
}

loadMap();
