//script.js

var map;

function initMap() {
  var bucheon = { lat: 37.5036901, lng: 126.786974 };
  var myStyles = [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ];
  var imaging = {
    url: "./img/parks.png",
    scaledSize: new google.maps.Size(30, 30),
  };
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: bucheon,
    //styles: myStyles,
  });

  new google.maps.Marker({
    position: { lat: 37.5006223, lng: 126.7656312 },
    map: map,
    icon: imaging,
    title: "중앙공원",
  });
  new google.maps.Marker({
    position: { lat: 37.4947512, lng: 126.75401356 },
    map: map,
    label: "복사골 문화센터",
  });
}
