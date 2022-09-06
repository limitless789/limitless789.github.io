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
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.position[0], data.position[1]),
        map: map,
        icon: {
          url: `./img/${data.type}.png`,
          scaledSize: new google.maps.Size(40, 40),
        },
        id: data.place,
      });
      var contentString = `<div style="text-align:center">
            <h2 style="font-size:25px; padding: 0px 0px 5px 0px;">${data.title}</h2>
            <div id="imgcenter">
              <p><img src="./img/view/${data.pic}" width="480px" height="330px" style="margin: 5px 4px 0px 10px"></p>
                <div style="position:absolute; bottom:165px; right:16px">
                  <button type="button" onclick="right_click_action('${data.place}')" style="border: 0; outline:none; background-color:transparent; cursor:pointer">
                  <img  src="./img/button.png" width="40" height="40"></button>
                </div>
                <div style="position:absolute; bottom:165px; left:16px">
                  <button type="button" onclick="left_click_action('${data.place}')" style="border: 0; outline:none; background-color:transparent; cursor:pointer">
                  <img  src="./img/button.png" width="40" height="40" style="transform: scaleX(-1)"></button>
                </div>
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
      hash_map.set(data.place, infos);
      hash_num.set(data.place, 0);
    } else {
      var contentString = `<div style="text-align:center">
            <h2 style="font-size:25px; padding: 0px 0px 5px 0px;">${data.title}</h2>
            <div id="imgcenter">
              <p><img src="./img/view/${data.pic}" width="480px" height="330px" style="margin: 5px 10px 0px 10px"></p>
                <div style="position:absolute; bottom:165px; right:16px">
                  <button type="button" onclick="right_click_action('${data.place}')" style="border: 0; outline:none; background-color:transparent; cursor:pointer">
                  <img  src="./img/button.png" width="40" height="40"></button>
                </div>
                <div style="position:absolute; bottom:165px; left:16px">
                  <button type="button" onclick="left_click_action('${data.place}')" style="border: 0; outline:none; background-color:transparent; cursor:pointer">
                  <img  src="./img/button.png" width="40" height="40" style="transform: scaleX(-1)"></button>
                </div>
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
      var content = infos[number].getContent();
      infos[number].setContent(infos[0].getContent());
      infos[0].setContent(content);
      if (number - 1 >= 0) hash_num.set(place, number - 1);
    }
  }
}
