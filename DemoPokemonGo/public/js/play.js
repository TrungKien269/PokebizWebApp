var map;
function initMap() {
  var kinh_do = 10.850930;
  var vi_do = 106.771615;
  var date = new Date();
  var daymode = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ebe3cd"
        }
      ]
    },
    {
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#523735"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f1e6"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#c9b2a6"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#dcd2be"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#ae9e90"
        }
      ]
    },
    {
      "featureType": "administrative.neighborhood",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#93817c"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#a5b076"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#447530"
        }
      ]
    },
    {
      "featureType": "road",
      "stylers": [
        {
          "saturation": 100
        },
        {
          "lightness": 100
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f1e6"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#fdfcf8"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f8c967"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#e9bc62"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e98d58"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#db8555"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#806b63"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "stylers": [
        {
          "visibility": "simplified"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8f7d77"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#ebe3cd"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#b9d3c2"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#92998d"
        }
      ]
    }
  ]
  var nightmode = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8ec3b9"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1a3646"
        }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#4b6878"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#64779e"
        }
      ]
    },
    {
      "featureType": "administrative.neighborhood",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.province",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#4b6878"
        }
      ]
    },
    {
      "featureType": "landscape.man_made",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#334e87"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#023e58"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#283d6a"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#6f9ba5"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#023e58"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#3C7680"
        }
      ]
    },
    {
      "featureType": "road",
      "stylers": [
        {
          "weight": 7.5
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#304a7d"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#98a5be"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#2c6675"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#255763"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#b0d5ce"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#023e58"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#98a5be"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "stylers": [
        {
          "weight": 8
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#283d6a"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#3a4762"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#0e1626"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#4e6d70"
        }
      ]
    }
  ]

  if (date.getHours() >= 6 && date.getHours() < 18) {
    map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 10.850930, lng: 106.771615 },
      zoom: 19,
      maxZoom: 19,
      minZoom: 19,
      styles: daymode
    });
  }
  else {
    map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 10.850930, lng: 106.771615 },
      zoom: 19,
      maxZoom: 19,
      minZoom: 19,
      styles: nightmode
    });
  }

  //Load Chacracter
  var avatar = $('#Avatar').attr('value');
  var charac_position = new google.maps.LatLng(10.850930, 106.771615);
  var charac_icon = {
    url: "/images/characters-plays/" + avatar + ".png",
    scaledSize: new google.maps.Size(80, 120)
  };
  var character = new google.maps.Marker(
    {
      id: 1,
      position: charac_position,
      icon: charac_icon,
      map: map,
      title: avatar
    });

  var numDeltas = 100;
  var delay = 1;
  var i = 0;
  var deltaLat
  var deltaLng;

  function transition(result) {
    i = 0;
    deltaLat = (result[0] - kinh_do) / numDeltas;
    deltaLng = (result[1] - vi_do) / numDeltas;
    moveMarker();
  }

  function moveMarker() {
    kinh_do += deltaLat;
    vi_do += deltaLng;
    var latlng = new google.maps.LatLng(kinh_do, vi_do);
    // character.setTitle(
    //   "kinh do:" + kinh_do + " || vi do:" + vi_do
    // );
    character.setPosition(latlng);
    if (i != numDeltas) {
      i++;;
      setTimeout(moveMarker, delay);
    }

  }

  //Click map to move character
  map.addListener('click', function (e) {
    // alert("Hello")
    var result = [e.latLng.lat(), e.latLng.lng()];
    transition(result);
    // console.log(userid);
    // character.position = new google.maps.LatLng(e.latLng.lat(), e.latLng.lng());
  })

  var ban_kinh = 0.03;//Ban kinh tinh tu vi tri hien tai

  var northEast = new google.maps.LatLng(kinh_do + ban_kinh, vi_do + ban_kinh);//Dong-Bac
  var southWest = new google.maps.LatLng(kinh_do - ban_kinh, vi_do - ban_kinh);//Tay-Nam

  // Khởi tạo một bounds của 2 vị trí trên
  var bounds = new google.maps.LatLngBounds(southWest, northEast);

  // Fill bound vào google map
  map.fitBounds(bounds);

  // Khoảng cách giữa các tọa độ northEast và northEast
  var lngSpan = northEast.lng() - southWest.lng();
  var latSpan = northEast.lat() - southWest.lat();

  $.post('/getPokemons', function (data) {
    if (data != undefined) {
      var pokemonlist = data;
      //Random pokemon lên map
      for (num = 0; num < 100; num++) {
        for (var i = 0; i < pokemonlist.length; i++) {
          if (parseInt(pokemonlist[i].next_evolution) != 0) {
            var a = southWest.lat() + latSpan * Math.random();
            var b = southWest.lng() + lngSpan * Math.random();
            var position = new google.maps.LatLng(a, b);
            var pokemon = CreatePokemon(pokemonlist[i]._id, position,
              "/images/pokemons-id/" + pokemonlist[i]._id + ".png",
              pokemonlist[i].name, map);
          }
        }
      }

      //Hàm tạo Pokemon
      function CreatePokemon(id, position, icon, title, map) {
        var pokemon = new google.maps.Marker({
          id: id,
          position: position,
          icon: icon,
          title: title,
          map: map,
        });

        //Thêm sự kiện click pokemon
        google.maps.event.addListener(pokemon, 'click', function () {
          var distance = getDistance(character, pokemon);
          if (distance <= 40) {
            alert("You can catch Pokemon at here");
            var location = pokemon.map;
            pokemon.setMap(null);

            $(".myRun").click(function (e){
              pokemon.setMap(location);
            });

            $(".background-catch-pokemon").addClass("show-background");
            $(".main-catch-pokemon").addClass("show-catch-pokemon");
            $("#catchPokeID").attr('value', pokemon.id);
            $("#imgCatchPokemon").attr('src', "/images/pokemons-name/" + pokemon.title + ".png");
          }
          else {
            alert("The distance is too long. You have to come close enough to catch Pokemon!");
          }
        });
        return pokemon;
      }

      var rad = function (x) {
        return x * Math.PI / 180;
      };

      var getDistance = function (p1, p2) {
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = rad(p2.getPosition().lat() - p1.getPosition().lat());
        var dLong = rad(p2.getPosition().lng() - p1.getPosition().lng());
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(rad(p1.getPosition().lat())) * Math.cos(rad(p2.getPosition().lat())) *
          Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d; // returns the distance in meter
      };
    }
  });

}