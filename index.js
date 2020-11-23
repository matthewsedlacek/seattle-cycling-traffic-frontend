// Waits for DOM to load then fetches trail data and messages
document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");

  getBikeTrailData(1);
  getBikeTrailData(2);
  getBikeTrailData(3);
  getBikeTrailData(4);
  getBikeTrailData(5);
  getBikeTrailData(6);
  getBikeTrailData(7);
  getBikeTrailData(8);
  getBikeTrailData(9);
  getBikeTrailData(10);
  getMessage();
});

// MAP
let mymap = L.map("mapid").setView([47.6062, -122.3321], 12);

L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    // put mapbox access token here
    accessToken:
      "pk.eyJ1IjoibWF0dHNlZDE5OTEiLCJhIjoiY2todHg5bTd3MHpiYTMwbXkzdTNxbGRudCJ9.ThS7ZuUuMHb_rW8Z-GDUMg",
  }
).addTo(mymap);

// MAP COUNTER MARKERS
const burke_gilman_counter = L.marker([47.679359, -122.263684]).addTo(mymap);
burke_gilman_counter.bindPopup("Burke Gilman Bike Counter");
const elliott_bay_counter = L.marker([47.618844, -122.359963]).addTo(mymap);
elliott_bay_counter.bindPopup("Elliott Bay Bike Counter");
const ship_canal_counter = L.marker([47.648119, -122.349855]).addTo(mymap);
ship_canal_counter.bindPopup("Ship Canal Bike Counter");
const mts_counter = L.marker([47.590748, -122.288702]).addTo(mymap);
mts_counter.bindPopup("Mountain To Sound Bike Counter");
const wsb_counter = L.marker([47.571422, -122.349617]).addTo(mymap);
wsb_counter.bindPopup("West Seattle Bridge Bike Counter");
const cs_counter = L.marker([47.527844, -122.280171]).addTo(mymap);
cs_counter.bindPopup("Chief Sealth Bike Counter");
const second_ave_counter = L.marker([47.604777, -122.334661]).addTo(mymap);
second_ave_counter.bindPopup("Second Avenue Bike Counter");
const golden_gardens_counter = L.marker([47.670933, -122.384743]).addTo(mymap);
golden_gardens_counter.bindPopup("Golden Gardens Bike Counter");
const bryant_greenway_counter = L.marker([47.673886, -122.285766]).addTo(mymap);
bryant_greenway_counter.bindPopup("Bryant Greenway Bike Counter");
const broadway_counter = L.marker([47.6135, -122.320842]).addTo(mymap);
broadway_counter.bindPopup("Broadway Bike Counter");

// WEATHER
function drawWeather(d) {
  var celcius = Math.round(parseFloat(d.main.temp) - 273.15);
  var fahrenheit = Math.round((parseFloat(d.main.temp) - 273.15) * 1.8 + 32);
  var description = d.weather[0].description;

  document.getElementById("description").innerHTML = description;
  document.getElementById("temp").innerHTML = fahrenheit + "&deg;";
  document.getElementById("location").innerHTML = d.name;

  if (description.indexOf("rain") > 0) {
    document.querySelector(".weather").className = "rainy";
  } else if (description.indexOf("cloud") > 0) {
    document.querySelector("#weather").className = "cloudy";
  } else if (description.indexOf("sunny") > 0) {
    document.querySelector(".weather").className = "sunny";
  }
}

function weatherBalloon() {
  var key = "0adec15f5303cb5a41696c127460d8f9";
  fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=Seattle&appid=" + key
  )
    .then(function (resp) {
      return resp.json();
    }) // Convert data to json
    .then(function (data) {
      drawWeather(data);
    })
    .catch(function () {
      // catch any errors
    });
}

window.onload = function () {
  weatherBalloon("Seattle,WA");
};

//MESSAGES
const msgTabs = document.querySelector("#associated-trails");
const msgSection = document.querySelector("#messages");
const form = document.querySelector(".message-form");

// FETCHES MESSAGES FROM BACKEND
function getMessage() {
  fetch("https://shrouded-temple-24311.herokuapp.com/messages")
    .then((resp) => resp.json())
    .then((json) => json.forEach((message) => renderMessage(message)));
}

// RENDERS MESSAGE CARD, APPENDS TO DOM
function renderMessage(message) {
  const cardBlock = document.querySelector(".card-block");

  const card = document.createElement("div");
  card.className = "card";

  card.id = `msg-${message.bike_trail_id}`;
  card.style.display = "none";

  const row = document.createElement("div");
  row.className = "row";

  const userCol = document.createElement("div");
  userCol.className = "col-sm-4";
  userCol.innerText = message.user_name;

  const msgCol = document.createElement("div");
  msgCol.className = "col-sm-6";
  msgCol.innerText = message.content;

  const messageId = document.createElement("div");
  messageId.hidden = true;
  messageId.id = message.id;

  row.append(userCol, msgCol);
  card.appendChild(messageId);
  card.appendChild(row);
  cardBlock.appendChild(card);
}

// ADDS DELETE BUTTON TO NEW MESSAGE
function addDeleteButton(message) {
  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "Delete";
  deleteBtn.className = "btn btn-danger btn-sm col-sm-2";
  message.children[1].appendChild(deleteBtn);
  deleteBtn.addEventListener("click", function (e) {
    deleteMessage(message);
    message.remove();
  });
}

// DELETE FETCH REQ
function deleteMessage(message) {
  fetch(
    `https://shrouded-temple-24311.herokuapp.com/messages/${message.children[0].id}`,
    {
      method: "DELETE",
    }
  )
    .then((response) => response.json())
    .then((json) => {
      return json;
    });
}

// ADDS LISTENER TO POST BUTTON
const postBtn = document.querySelector("#message-button");
postBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (form.bike_trail_id.id === "") {
    alert("Please select a bike trail");
  } else {
    let userInput = document.querySelector(".user_name-input").value;
    let msgInput = document.querySelector(".message-input").value;
    const newTrail = parseInt(`${e.target.parentNode.children[0].id}`);
    const newMsg = {
      user_name: userInput,
      content: msgInput,
      bike_trail_id: newTrail,
    };
    document.querySelector(".user_name-input").value = "";
    document.querySelector(".message-input").value = "";
    postMessage(userInput, msgInput, newTrail);
  }
});

// POST FETCH REQ
function postMessage(newUser, newMsg, newTrail) {
  fetch("https://shrouded-temple-24311.herokuapp.com/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json ",
    },
    body: JSON.stringify({
      user_name: newUser,
      content: newMsg,
      bike_trail_id: newTrail,
    }),
  })
    .then((resp) => resp.json())
    .then((json) => {
      renderMessage(json);
      const newMessage = document.getElementById(`${json.id}`).parentNode;
      newMessage.style.display = "block";
      addDeleteButton(newMessage);
    });
}

// TRAIL DATA
const trailData = document.querySelector("#trail-data");
const pathSelector = document.querySelector("#path-selector");
const trailInfo = document.querySelector("#trail-info");

// fetch bike trail data
function getBikeTrailData(bikeTrailId) {
  fetch(
    "https://shrouded-temple-24311.herokuapp.com/bike_trails/" + bikeTrailId
  )
    .then((resp) => resp.json())
    .then((json) => renderBikeTrailData(json));
}

// RENDERS BIKE TRAIL DATA CARDS
function renderBikeTrailData(data) {
  // parses counter data api
  const trailName = data["data"]["attributes"]["name"];
  const trailDistance = data["data"]["attributes"]["distance"];
  const trailType = data["data"]["attributes"]["trail_type"];
  const trailCard = document.createElement("div");
  trailCard.id = `card-${data["data"]["id"]}`;
  const innerTrailInfo = document.createElement("div");

  // creates "Report a Problem" button
  const trailProblemRow = document.createElement("row");
  const trailProblemBtn = document.createElement("button");
  trailProblemBtn.innerText = "Report a Problem";
  trailProblemBtn.className = "btn btn-primary btn-block btn-lg";
  trailProblemBtn.addEventListener("click", () => {
    document.location.href =
      "https://seattle-cwiprod.motorolasolutions.com/cwi/select";
  });
  trailProblemRow.appendChild(trailProblemBtn);

  // trail name
  const trailHeader = document.createElement("h1");
  trailHeader.innerText = `${trailName}`;
  trailHeader.className = `${data["data"]["id"]}`;

  // trail info
  const trailInfoDistance = document.createElement("h2");
  trailInfoDistance.className = "col-sm-6";
  trailInfoDistance.innerText = `${trailDistance} Miles`;
  const trailInfoType = document.createElement("h2");
  trailInfoType.className = "col-sm-6";
  trailInfoType.innerText = trailType;
  trailCard.style.display = "none";

  // appends to DOM element
  innerTrailInfo.append(trailInfoDistance, trailInfoType, trailProblemRow);
  trailCard.appendChild(trailHeader);
  trailCard.appendChild(innerTrailInfo);
  trailInfo.append(trailCard);

  // creates dropdown menu option
  const trailNameDropdown = document.createElement("a");
  trailNameDropdown.innerText = trailName;
  trailNameDropdown.id = `${data["data"]["id"]}`;
  trailNameDropdown.className = "dropdown-item";
  trailNameDropdown.setAttribute(
    "longitude",
    data["data"]["attributes"]["locations"][0]["longitude"]
  );
  trailNameDropdown.setAttribute(
    "latitude",
    data["data"]["attributes"]["locations"][0]["latitude"]
  );
  addListenerToDropdownItem(trailNameDropdown);
  pathSelector.appendChild(trailNameDropdown);

  // creates data chart
  const chartContainer = document.createElement("div");
  chartContainer.style =
    "height: 290px; width: 90%; right: 40px; position: absolute;";
  chartContainer.id = `chartContainer-${data["data"]["id"]}`;
  trailData.appendChild(chartContainer);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let dateTime = `${data["included"][0]["attributes"]["date_time"]})`;
  let yearMonth = dateTime.split("-", 2);
  let year = yearMonth[0];
  let month = parseInt(yearMonth[1]);
  let monthValue = monthNames[month - 1];

  // creates data points
  let trailDataPoints = [];
  data["included"].forEach((point) => {
    let dataObj = {
      label: point["attributes"]["date_time"],
      y: point["attributes"]["total_trips"],
    };
    trailDataPoints.push(dataObj);
  });
  let chart = new CanvasJS.Chart(`chartContainer-${data["data"]["id"]}`, {
    theme: "light2",
    zoomEnabled: true,
    rangeChanging: function (e) {
      //update total count
      var eventCountElement = document.getElementById("eventCount");
      eventCountElement.setAttribute(
        "value",
        parseInt(eventCountElement.getAttribute("value")) + 1
      );

      // update event Trigger
      var triggerLogElement = document.getElementById("triggerLog");
      triggerLogElement.setAttribute("value", e.trigger);
    },
    title: {
      text: `${monthValue} ${year} Traffic`,
    },
    data: [
      {
        type: "line",
        dataPoints: trailDataPoints,
      },
    ],
    axisX: {
      crosshair: {
        enabled: true,
        labelFormatter: (e) => {
          return "";
        },
      },
      gridThickness: 0,
      tickLength: 0,
      lineThickness: 0,
      title: "Date-Time",
      labelFontColor: "transparent",
    },
  });
  chart.render();
  chartContainer.style.display = "none";
}

// BIKE PATH LISTENERS AND SELECTORS
function addListenerToDropdownItem(item) {
  item.addEventListener("click", (e) => {
    let infoChildren = trailInfo.children;
    for (let i = 0; i < infoChildren.length; i++) {
      let tableChild = infoChildren[i];
      tableChild.style.display = "none";
    }
    let chartChildren = trailData.children;
    for (let i = 0; i < chartChildren.length; i++) {
      let tableChild = chartChildren[i];
      tableChild.style.display = "none";
    }
    const cardBlock = document.querySelector(".card-block");
    let messageChildren = cardBlock.children;
    for (let i = 0; i < messageChildren.length; i++) {
      let messageChild = messageChildren[i];
      messageChild.style.display = "none";
    }

    const card = document.getElementById(`card-${e.target.id}`);
    card.style.display = "block";
    const chart = document.getElementById(`chartContainer-${e.target.id}`);
    chart.style.display = "block";
    const trailMessages = document.querySelectorAll(`#msg-${e.target.id}`);
    trailMessages.forEach((message) => {
      message.style.display = "block";
    });
    const hiddenInput = document.querySelector(".message-form").childNodes[1]
      .children[0];
    hiddenInput.id = `${item.id}`;

    // zooms map to bike trail counter location
    const longitude = parseFloat(e.target.attributes.longitude.value);
    const latitude = parseFloat(e.target.attributes.latitude.value);
    mymap.flyTo([longitude, latitude], 14);
  });
}
