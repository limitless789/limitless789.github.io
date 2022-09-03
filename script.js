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
var img_park;
var marker;
function initMap() {
  let database = JSON.parse(JSON.stringify(data));

  //array of image
  img_park = {
    num: 0,
    url: "./img/parks.png",
    scaledSize: new google.maps.Size(40, 40),
  };
  img_center = {
    num: 0,
    url: "./img/center.png",
    scaledSize: new google.maps.Size(40, 40),
  };
  var img_arr = new Array(img_park, img_center);

  //array of area
  var bucheon = { lat: 37.5036901, lng: 126.786974 };
  //delete default markers of google map
  var myStyles = [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ];

  //map
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: bucheon,
    styles: myStyles,
    mapTypeControl: false,
    streetViewControl: false,
    styles: mapStyle,
  });

  //add markers from database of data.json

  for (index in database) addMarker(database[index]);
  var prev_info = false;
  function addMarker(data) {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(data.position[0], data.position[1]),
      map: map,
      icon: {
        url: `./img/${data.type}.png`,
        scaledSize: new google.maps.Size(40, 40),
      },
    });

    var contentString = `<div style="text-align:center">
          <h2 style="font-size:25px; padding: 5px 0px 20px 0px;">${data.title}</h2>
          <p><img src="./img/view/${data.pic}" width="480" height="270"></p>
          </div>`;
    var infowindow = new google.maps.InfoWindow({ content: contentString });
    google.maps.event.addListener(marker, "click", function () {
      if (prev_info) {
        prev_info.close();
      }
      infowindow.open(map, marker);
      prev_info = infowindow;
    });
  }
}
