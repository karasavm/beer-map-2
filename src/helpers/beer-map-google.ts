

declare var google;

let MAX_ZOOM = 15;
let MIN_ZOOM = 3;
// let PINS_PATH = 'images/pins/150x150cp/';
// let LOGO_PATH = 'images/pins/compressed/';
// let onGroupMode = 0;
// let initState = false;
// let on
// let INITIAL_ZOOM = null;
let INITIAL_CENTER = new google.maps.LatLng(39.074208, 22.824311999999964);


export class BeerMapGoogle{
  brews: any;
  map: any;

  divCanvas: string;

  onClickBrewsMarker: any;
  onMoveMap: any;

  pinsPath: string;
  imgsPath: string;

  brewsMarkers = [];
  constructor(brews, divCanvas, onClickBrewsMarker,onMoveMap, pinsPath, imgsPath) {
    this.brews = brews;
    this.onClickBrewsMarker = onClickBrewsMarker;
    this.onMoveMap = onMoveMap;
    this.divCanvas = divCanvas;
    this.pinsPath = pinsPath;
    this.imgsPath = imgsPath;
  }

  createBrewsMarkers() {
    for (let i=0; i < this.brews.length; i++) {

      let sp = this.brews[i].mapUrl.split("!3d");
      sp = sp[sp.length-1];
      let lat = Number(sp.split("!4d")[0]);
      let log = Number(sp.split("!4d")[1]);
      // console.log(lat, log);

      let image = {
        origin: new google.maps.Point(0, 0),
        url: this.pinsPath + this.brews[i].icon,
        // url: 'assets/150x150cp/' + this.brews[i].icon.split('.')[0] + '.jpg',
        labelOrigin: new google.maps.Point(40,40),
        // scaledSize: new google.maps.Size(60, 88), // short pin
        scaledSize: new google.maps.Size(40, 40), // cap
        // anchor: new google.maps.Point(31, 88), // short pin
        anchor: new google.maps.Point(20, 20), // cap
      };

      let marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, log),
        // title: legend,
        // animation: null,
        // draggable: false,
        // shape: shape,
        // clickable: true,
        icon: image,
        // icon: getImageObj('images/pins/60x60/eza.png', MARKER_CAP_SIZE),
        // zIndex: ZINDEX_MARKER
      });

      marker.brew = this.brews[i];
      this.brewsMarkers.push(marker);


    }
  }
  loadMarkers() {
    for (let i=0; i < this.brewsMarkers.length; i++) {
      this.brewsMarkers[i].setMap(this.map);
    }
  }

  init() {
    this.createBrewsMarkers();


    let beerMapOptions = {
      center: INITIAL_CENTER,
      zoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      minZoom: MIN_ZOOM,
      backgroundColor: 'hsla(0, 0%, 0%, 0)',
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      panControl: false,
      mapTypeControl: false,
      streetViewControl: false
    };


    this.map = new google.maps.Map(this.divCanvas, beerMapOptions);

    // APPLY STYLE
    let styledMapType = new google.maps.StyledMapType(map_style);
    this.map.mapTypes.set('styled_map', styledMapType);
    this.map.setMapTypeId('styled_map');

    // APPLY TEXTURE
    let textureLayer = new google.maps.ImageMapType({
      getTileUrl: function(coord, zoom) {
        return 'assets/imgs/texture.jpg'
        // return 'tiles2' + '/' +zoom+ '/' +coord.x+ '/' + coord.y +'.png';
      },
      tileSize: new google.maps.Size(256, 256),
      opacity: 0.45
    });

    // this.map.overlayMapTypes.push(textureLayer);






    this.registerEvents();
    this.loadMarkers();
    this.fitBounds(this.brewsMarkers);
  }

  fitBounds(markers) {
    let bounds = new google.maps.LatLngBounds(0,0);
    for (let i = 0; i < markers.length; i++) {
      let marker = markers[i];
      bounds.extend(marker.getPosition());
    }

    this.map.fitBounds(bounds);
  }
  fitBoundsCurrent() {
    let bounds = new google.maps.LatLngBounds(0,0);
    for (let i = 0; i < this.brewsMarkers.length; i++) {
      let marker = this.brewsMarkers[i];
      if (marker.visible) {
        bounds.extend(marker.getPosition());
      }
    }

    this.map.fitBounds(bounds);
  }
  registerEvents() {

    // MAP
    this.map.addListener("bounds_changed", () => {
      this.map.boundsChanged = true;
    });

    this.map.addListener("idle", () => {
      if (this.map.boundsChanged) {
        console.log("idle:bounds_changed");
        this.onMoveMap({
          contents: this.findContents(this.brewsMarkers)
        });
        this.map.boundsChanged = false;
      }
    });

    let that = this;
    // BREWS MARKERS
    for (let i=0; i < this.brewsMarkers.length; i++) {
      this.brewsMarkers[i].addListener('click', function () {
        console.log("Marker Clicked -- ", this.brew.name)
        that.onClickBrewsMarker(this.brew);
      })
    }


  }

  findContents(markers) {
    let contents = [];
    for (let i=0; i < markers.length; i++) {
      if (markers[i].visible &&
        this.map.getBounds().contains(markers[i].getPosition())){
        contents.push(markers[i].brew);
      }
    }
    return contents;
  }
  showBrewsMarkers(brews, fit=true) {
    let markers = [];
    for (let i=0; i < this.brewsMarkers.length; i++) {
      let found = false;
      let marker = this.brewsMarkers[i];
      for (let j=0; j < brews.length; j++) {
        if (marker.brew.id === brews[j].id) {
          found = true;
          markers.push(marker); // keep alla markers that found
          break;
        }
      }
      marker.setVisible(found);
    }

    this.fitBounds(markers);
    // this.onMoveMap({contents: this.findContents(markers)});
    this.onMoveMap({contents: brews});

  }



  showAreasMarkers(fit=true) {}

  showAllBrews(fit=true) {}
  showBrewsMarkerZoomTo(brewId, duration){}

  fitBrewsMarkers(id) {}

  fitAreaMarkers() {}

  showBrewsFeatures(brews) {}

}


const map_style = [
  {
    "featureType": "all",
    "elementType": "all",
    "stylers": [
      {
        "color": "#ff7000"
      },
      {
        "lightness": "69"
      },
      {
        "saturation": "100"
      },
      {
        "weight": "1.17"
      },
      {
        "gamma": "2.04"
      }
    ]
  },
  {
    "featureType": "all",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#cb8536"
      }
    ]
  },
  {
    "featureType": "all",
    "elementType": "labels",
    "stylers": [
      {
        "color": "#ffb471"
      },
      {
        "lightness": "66"
      },
      {
        "saturation": "100"
      }
    ]
  },
  {
    "featureType": "all",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "gamma": 0.01
      },
      {
        "lightness": 20
      }
    ]
  },
  {
    "featureType": "all",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "saturation": -31
      },
      {
        "lightness": -33
      },
      {
        "weight": 2
      },
      {
        "gamma": 0.8
      }
    ]
  },
  {
    "featureType": "all",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "weight": "1.22"
      },
      {
        "saturation": "41"
      },
      {
        "lightness": "-22"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "saturation": "-42"
      },
      {
        "weight": "4.39"
      },
      {
        "lightness": "27"
      },
      {
        "color": "#ba9494"
      },
      {
        "gamma": "1.87"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "saturation": "64"
      },
      {
        "lightness": "-27"
      },
      {
        "gamma": "4.30"
      },
      {
        "weight": "2.33"
      },
      {
        "visibility": "on"
      },
      {
        "invert_lightness": true
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "lightness": "99"
      },
      {
        "color": "#000000"
      },
      {
        "saturation": "100"
      },
      {
        "gamma": "5.98"
      },
      {
        "weight": "6.26"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "color": "#e69d32"
      },
      {
        "weight": "9.63"
      }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "all",
    "stylers": [
      {
        "lightness": "-8"
      },
      {
        "gamma": "0.98"
      },
      {
        "weight": "2.45"
      },
      {
        "saturation": "26"
      }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "simplified"
      },
      {
        "gamma": "1"
      },
      {
        "saturation": "30"
      },
      {
        "lightness": "30"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "saturation": 20
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "color": "#584516"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "lightness": 20
      },
      {
        "saturation": "27"
      },
      {
        "visibility": "off"
      },
      {
        "color": "#827a51"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#795514"
      },
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "visibility": "off"
      },
      {
        "saturation": "100"
      },
      {
        "hue": "#ff0000"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "lightness": "-5"
      },
      {
        "saturation": -30
      },
      {
        "visibility": "simplified"
      },
      {
        "gamma": "0.84"
      },
      {
        "weight": "0.48"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "saturation": 25
      },
      {
        "lightness": 25
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "color": "#000000"
      },
      {
        "saturation": "-100"
      },
      {
        "lightness": "-17"
      },
      {
        "gamma": "1.32"
      },
      {
        "weight": "0.71"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "saturation": "100"
      },
      {
        "lightness": "-68"
      },
      {
        "gamma": "1.68"
      },
      {
        "weight": "1.04"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "all",
    "stylers": [
      {
        "lightness": -20
      },
      {
        "color": "#ecc080"
      }
    ]
  }
]
