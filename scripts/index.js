// require("dotenv").config({ path: __dirname + "/.env" });
const axios = require("axios");
const L = require("leaflet");

let loading = true;
let loadingDiv = document.getElementById("loading");
let buttonContainer = document.getElementById("button-container");
let mapContainer = document.getElementById("mapid");
let divCheck = document.getElementsByClassName("leaflet-control-container");
let modal = document.getElementById("myModal");
let span = document.getElementsByClassName("close")[0];
let mText = document.getElementsByClassName("modal-text")[0];

// if (divCheck.length === 0) {
//   mapContainer.style.display = "none";
//   buttonContainer.style.display = "none";
// } else {
//   loadingDiv.style.display = "none";
// }

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

    let currentStyle;
    let currentLaw;

    let setLaw1Color = () => {
      myMap.removeLayer(worldCountries);
      worldCountries = L.geoJSON(features, {
        style: law1Style,
        onEachFeature: onEachFeature,
      });
      myMap.addLayer(worldCountries);
      currentStyle = law1Style;
      currentLaw = "law1";
    };

    let setLaw2Color = () => {
      myMap.removeLayer(worldCountries);
      worldCountries = L.geoJSON(features, {
        style: law2Style,
        onEachFeature: onEachFeature,
      });
      myMap.addLayer(worldCountries);
      currentStyle = law2Style;
      currentLaw = "law2";
    };

    let setLaw3Color = () => {
      myMap.removeLayer(worldCountries);
      worldCountries = L.geoJSON(features, {
        style: law3Style,
        onEachFeature: onEachFeatureForPopupTest,
      });
      myMap.addLayer(worldCountries);
      currentStyle = law3Style;
      currentLaw = "law3";
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

    currentStyle = basicStyle;

    document.getElementById("law1").onclick = setLaw1Color;
    document.getElementById("law2").onclick = setLaw2Color;
    document.getElementById("law3").onclick = setLaw3Color;

    let myMap = L.map("mapid").setView([0, 0], 3);
    L.tileLayer(
      `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2hyaXNzdGFuYXJzZW5hdWx0IiwiYSI6ImNrOWY1dDV4NjA5bnczZW9iNXB4dmkzcHIifQ.03UOcpgGEfNQbYGxuVBkBQ`,
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        minZoom: 3,
        maxZoom: 10,
        zoomDelta: 0.1,
        zoomSnap: 0,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken:
          "pk.eyJ1IjoiY2hyaXNzdGFuYXJzZW5hdWx0IiwiYSI6ImNrOWY1dDV4NjA5bnczZW9iNXB4dmkzcHIifQ.03UOcpgGEfNQbYGxuVBkBQ",
      }
    ).addTo(myMap);

    let worldCountries = L.geoJSON(features, {
      style: basicStyle,
    });
    myMap.addLayer(worldCountries);

    let highlightFeature = (e) => {
      let layer = e.target;

      if (layer.feature.properties[currentLaw]) {
        layer.setStyle({
          weight: 5,
          color: "#666",
          dashArray: "",
          fillOpacity: 0.5,
        });
      }
    };

    let resetHighlight = (e) => {
      worldCountries.resetStyle(e.target);
    };

    let clickForPopup = (e) => {
      // myMap.fitBounds(e.target.getBounds());
      worldCountries
        .bindPopup(
          `<p>Oh hello there from ${e.target.feature.properties.ADMIN}</p>`
        )
        .openPopup();
    };

    let launchModal = (e) => {
      console.log(e.target.feature.properties.info);
      modal.style.display = "block";
      if (e.target.feature.properties.law1) {
        mText.innerHTML = e.target.feature.properties.info;
      } else {
        mText.innerHTML =
          "I was too lazy to keep adding new info for this one.  Only active in Law 1";
      }
      span.onclick = function () {
        modal.style.display = "none";
      };
      window.onclick = function (e) {
        if (e.target == modal) {
          modal.style.display = "none";
        }
      };
    };

    let onEachFeature = (feature, layer) => {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: launchModal,
      });
    };

    let onEachFeatureForPopupTest = (feature, layer) => {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: clickForPopup,
      });
    };
    // if (divCheck.length < 0) {
    //   mapContainer.style.display = "none";
    //   buttonContainer.style.display = "none";
    //   console.log("on");
    // } else {
    //   loadingDiv.style.display = "none";
    //   mapContainer.style.display = "flex";
    //   buttonContainer.style.display = "inline-block";
    //   console.log("off");
    // }
  } catch (err) {
    console.log(err);
  }
}

loadMap();
