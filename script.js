//script.js
const mapStyle = [
  {
    featureType: "administrative",
    elementType: "all",
    stylers: [{ visibility: "on" }, { lightness: 33 }],
  },
  {
    featureType: "landscape.man_made",
    elementType: "geometry.Fill",
    stylers: [{ color: "#eee6c4" }],
  },
  {
    featureType: "landscape.man_made",
    elementType: "geometry.Stroke",
    stylers: [{ color: "#000000" }, { lightness: 40 }],
  },
  {
    featureType: "road",
    elementType: "all",
    stylers: [{ lightness: 20 }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#a0a0a0" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#c5c6c6" }],
  },
  {
    featureType: "road.local",
    elementType: "geometry",
    stylers: [{ color: "#d2d2d2" }],
  },
  {
    featureType: "water",
    elementType: "all",
    stylers: [{ visibility: "on" }, { color: "#acbcc9" }],
  },
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
];

var map;
let hash_map = new Map();
let hash_num = new Map();
function initMap() {
  let database = JSON.parse(JSON.stringify(data));
  var marker;
  //array of area
  var bucheon = { lat: 37.5036901, lng: 126.786974 };
  //map
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: bucheon,
    mapTypeControl: false,
    streetViewControl: false,
    styles: mapStyle,
  });

  //add markers from database of data.json

  for (index in database) addMarker(database[index]);
  var prev_info = false;
  function addMarker(data) {
    if (!hash_map.has(data.place)) {
      var marker;
      if (data.type != "rail") {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(data.position[0], data.position[1]),
          map: map,
          icon: {
            url: `./img/${data.type}.png`,
            scaledSize: new google.maps.Size(40, 40),
          },
          id: data.place,
        });
      } else {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(data.position[0], data.position[1]),
          map: map,
          icon: {
            url: `./img/${data.type}.png`,
            scaledSize: new google.maps.Size(35, 35),
          },
          id: data.place,
        });
      }

      var contentString = `<div class="info" style="text-align:center">
        <h2>${data.title}</h2>
        <div class="right_button">
          <button type="button" onclick="right_click_action('${data.place}')">
          <img  src="./img/butt${data.button}n.png" width="40" height="40" onerror="this.parentNode.style.display='none'">
        </div>
        <div class="left_button">
          <button type="button" onclick="left_click_action('${data.place}')">
          <img  src="./img/butt${data.button}n.png" width="40" height="40" style="transform: scaleX(-1)" onerror="this.parentNode.style.display='none'">
        </div>
        <div id="imgcenter">
          <a href=${data.link} target="_blank">
          <img class="target_image" src="./img/view/${data.pic}" width="480px" height="330px">
          </a>
        </div>
      </div>`;

      var infowindow = new google.maps.InfoWindow({ content: contentString });

      google.maps.event.addListener(marker, "click", function () {
        map.setCenter(this.getPosition());
        if (prev_info) {
          prev_info.close();
        }
        infowindow.open(map, marker);
        prev_info = infowindow;
      });

      infos = new Array();
      infos.push(infowindow);
      if (data.button == "o") {
        hash_map.set(data.place, infos);
        hash_num.set(data.place, 0);
      }
    } else {
      var contentString = `<div class="info" style="text-align:center">
        <h2>${data.title}</h2>
        <div class="right_button">
          <button type="button" onclick="right_click_action('${data.place}')">
          <img  src="./img/butt${data.button}n.png" width="40" height="40" onerror="this.parentNode.style.display='none'">
        </div>
        <div class="left_button">
          <button type="button" onclick="left_click_action('${data.place}')">
          <img  src="./img/butt${data.button}n.png" width="40" height="40" style="transform: scaleX(-1)" onerror="this.parentNode.style.display='none'">
        </div>
        <div id="imgcenter">
          <a href=${data.link} target="_blank">
          <img class="target_image" src="./img/view/${data.pic}" width="480px" height="330px">
          </a>
        </div>
      </div>`;

      var infowindow = new google.maps.InfoWindow({ content: contentString });

      var infos = hash_map.get(data.place);
      infos.push(infowindow);
      hash_map.set(data.place, infos);
    }
  }
}

function right_click_action(place) {
  if (hash_map.has(place)) {
    var infos = hash_map.get(place);
    if (infos.length == 1) {
      return;
    } else {
      var number = hash_num.get(place);
      if (number + 1 < infos.length) {
        var content = infos[number + 1].getContent();
        infos[number + 1].setContent(infos[0].getContent());
        infos[0].setContent(content);
        hash_num.set(place, number + 1);
      } else {
        for (var i = 0; i < number; i++) left_click_action(place);
      }
    }
  }
}

function left_click_action(place) {
  if (hash_map.has(place)) {
    var infos = hash_map.get(place);
    if (infos.length == 1) {
      return;
    } else {
      var number = hash_num.get(place);
      if (number > 0) {
        var content = infos[number].getContent();
        infos[number].setContent(infos[0].getContent());
        infos[0].setContent(content);
        hash_num.set(place, number - 1);
      } else {
        for (var i = 0; i < infos.length - 1; i++) right_click_action(place);
      }
    }
  }
}

function main_link() {
  if (window.self != window.top) {
    var str = document.getElementById("text");
    str.innerHTML = "이곳에선 사용할 수 없는 기능입니다!";
  } else {
    window.location.href =
      "https://shell-pyramid-486.notion.site/34e902c50ac74258954b979f311a2964";
  }
}
