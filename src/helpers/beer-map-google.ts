

declare var google;

let MAX_ZOOM = 15;
let MIN_ZOOM = 3;
let GREECE_COORDS = {
  lat: '39.074208',
  log: '21.824312'
};
// let PINS_PATH = 'images/pins/150x150cp/';
// let LOGO_PATH = 'images/pins/compressed/';
// let onGroupMode = 0;
// let initState = false;
// let on
let INITIAL_ZOOM = 3;
let INITIAL_CENTER = new google.maps.LatLng(39.074208, 22.824311999999964);


export class BeerMapGoogle{
  brews: any;
  areas: any;
  map: any;

  divCanvas: string;

  onClickBrewsMarker: any;
  onMoveMap: any;

  pinsPath: string;
  imgsPath: string;
  onLoadMap: any;
  brewsMarkers = [];
  brewsMarkers2 = [];
  areasMarkers = [];
  defaultZoom: number;
  // defaultZoom: number = 6;
  // defaultCenter: any = new google.maps.LatLng(GREECE_COORDS.lat, GREECE_COORDS.log);
  defaultCenter: any;



  constructor(brews, areas, divCanvas, onClickBrewsMarker,onMoveMap,onLoadMap, pinsPath, imgsPath) {
    this.brews = brews;
    this.areas = areas;
    this.onClickBrewsMarker = onClickBrewsMarker;
    this.onMoveMap = onMoveMap;
    this.divCanvas = divCanvas;
    this.pinsPath = pinsPath;
    this.imgsPath = imgsPath;
    this.onLoadMap = onLoadMap;
  }

  createBrewsMarkers() {
    for (let i=0; i < this.brews.length; i++) {

      let sp = mapUrlTolatlog(this.brews[i].mapUrl);
      let lat = sp[0];
      let log = sp[1];

      // console.log(lat, log);

      let image = {
        origin: new google.maps.Point(0, 0),
        url: this.pinsPath + this.brews[i].icon,
        // url: 'assets/150x150cp/' + this.brews[i].icon.split('.')[0] + '.jpg',
        labelOrigin: new google.maps.Point(40,40),
        // scaledSize: new google.maps.Size(60, 88), // short pin
        scaledSize: new google.maps.Size(40,40), // cap
        // anchor: new google.maps.Point(31, 88), // short pin
        anchor: new google.maps.Point(20, 20), // cap
      };

      let marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, log),
        // title: legend,
        animation: google.maps.Animation.DROP,
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

  createAreasMarkers() {
    for (let i=0; i < this.areas.length; i++) {

      let lat = this.areas[i].latLng.split(',')[0];
      let log = this.areas[i].latLng.split(',')[1];
      // console.log(lat, log);

      // let image = {
      //   origin: new google.maps.Point(0, 0),
      //   url: this.pinsPath + this.brews[i].icon,
      //   // url: 'assets/150x150cp/' + this.brews[i].icon.split('.')[0] + '.jpg',
      //   labelOrigin: new google.maps.Point(40,40),
      //   // scaledSize: new google.maps.Size(60, 88), // short pin
      //   scaledSize: new google.maps.Size(40, 40), // cap
      //   // anchor: new google.maps.Point(31, 88), // short pin
      //   anchor: new google.maps.Point(20, 20), // cap
      // };

      let marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, log),
        // title: legend,
        animation: google.maps.Animation.DROP,
        // draggable: false,
        // shape: shape,
        // clickable: true,
        // icon: image,
        // icon: getImageObj('images/pins/60x60/eza.png', MARKER_CAP_SIZE),
        // zIndex: ZINDEX_MARKER
      });
      marker.area = this.areas[i];
      this.areasMarkers.push(marker);
    }
  }

  loadBrewsMarkers(duration) {
    // let duration = 2000;
    let vMarkers = [];
    let size = 40;

    for (let i=0; i < 20; i++) {
      let image = {

        origin: new google.maps.Point(0, 0),
        url: 'assets/imgs/virtuals/'+ i % 5 +'.png',
        // url: 'assets/150x150cp/' + this.brews[i].icon.split('.')[0] + '.jpg',
        scaledSize: new google.maps.Size(size, size), // cap
        anchor: new google.maps.Point(size/2, size/2), // cap
      };
      let marker = new google.maps.Marker({
        position: new google.maps.LatLng(GREECE_COORDS.lat, GREECE_COORDS.log),
        // title: legend,
        animation: google.maps.Animation.DROP,
        // draggable: false,
        // shape: shape,
        // clickable: true,
        icon: image,
        // icon: getImageObj('images/pins/60x60/eza.png', MARKER_CAP_SIZE),
        zIndex: 10
      });
      vMarkers.push(marker);
    }

    // load virtuals
    for (let i=0; i < vMarkers.length;i++) {
      dropMarker(this.map, vMarkers[i],  Number(duration/vMarkers.length)*(i+1));
    }

    // let l = 15;
    setTimeout(()=>{
      for (let i=0; i < vMarkers.length;i++) {
       vMarkers[i].setMap(null);
      }
      // for (let i=0; i < this.brewsMarkers.length; i++) {
      //   this.brewsMarkers[i].setAnimation(null)
      //   this.brewsMarkers[i].setMap(this.map);
      //     // dropMarker(this.map, this.brewsMarkers[i],  Number(1000/this.brewsMarkers.length)*(i+1), null);
      // }
    }, duration);


  }

  loadAreasMarkers() {
    for (let i=0; i < this.areasMarkers.length; i++) {
      this.areasMarkers[i].setMap(this.map);
    }
  }
  hideAreasMarkers() {
    for (let i=0; i < this.areasMarkers.length; i++) {
      this.areasMarkers[i].setMap(null);
    }
  }

  init() {
    this.onMoveMap({contents: this.brews})
    console.log("init");
    this.createBrewsMarkers();
    this.createAreasMarkers();


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

    this.map.overlayMapTypes.push(textureLayer);



    let size = 100;
    let image = {
      origin: new google.maps.Point(0, 0),
      url: 'assets/150x150cp/brews.png',
      // url: 'assets/150x150cp/' + this.brews[i].icon.split('.')[0] + '.jpg',
      labelOrigin: new google.maps.Point(19,82),
      scaledSize: new google.maps.Size(size, size), // cap
      anchor: new google.maps.Point(size/2, size/2), // cap
    };

    let marker = new google.maps.Marker({
      position: new google.maps.LatLng(GREECE_COORDS.lat, GREECE_COORDS.log),
      label: {
        color: 'white',
        fontFamily_: null,
        fontSize: '25px',
        fontWeight: 'bold',
        text: '0'
      },
      // title: legend,
      animation: google.maps.Animation.DROP,
      // draggable: false,
      // shape: shape,
      // clickable: true,
      icon: image,
      // icon: getImageObj('images/pins/60x60/eza.png', MARKER_CAP_SIZE),
      zIndex: 100
    });
    let that = this;
    let duration = 2000;

    // timer for countdown
    setTimeout(() => {
      marker.setMap(that.map);


      // let counter = 0;
      //
      // var interval = setInterval(() => {
      //   if (counter + 6 >= this.brews.length) {
      //     counter = this.brews.length;
      //
      //     var label = marker.getLabel();
      //     label.text = counter.toString();
      //     marker.setLabel(label);
      //
      //     clearInterval(interval);
      //   } else {
      //     counter += 6;
      //
      //     var label = marker.getLabel();
      //     label.text = counter.toString();
      //     marker.setLabel(label);
      //   }
      // }, (duration-500)*6/this.brews.length);
      //
      //
      // that.loadBrewsMarkers(duration);
      // setTimeout(()=> {
      //   marker.setMap(null);
      //   // that.fitBounds(that.brewsMarkers2);
      // },duration + 1000)
      var label = marker.getLabel();
          label.text = this.brews.length.toString();
          marker.setLabel(label);
    }, 500)

    setTimeout(() => {
      marker.setMap(null)
      function CustomMarker(latlng, map, imageSrc, beers, type) {
        this.latlng_ = latlng;
        this.imageSrc = imageSrc;
        this.beers = beers;
        this.type = type;
        // Once the LatLng and text are set, add the overlay to the map.  This will
        // trigger a call to panes_changed which should in turn call draw.
        this.setMap(map);
      }

      CustomMarker.prototype = new google.maps.OverlayView();

      CustomMarker.prototype.draw = function() {
        // Check if the div has been created.
        var div = this.div_;
        if (!div) {
          // Create a overlay text DIV
          div = this.div_ = document.createElement('div');
          // Create the DIV representing our CustomMarker
          div.className = "customMarker";


          var img = document.createElement("img");
          img.src = this.imageSrc;
          div.appendChild(img);

          // my code
          let p = document.createElement('p');
          p.innerText = this.beers.toString();
          p.className = "pin-badge";
          if (this.type === 'client') {
            p.style.backgroundColor = '#488aff';
          } else {
            p.style.backgroundColor = '#fa8521';
          }

          div.appendChild(p);

          var me = this;
          google.maps.event.addDomListener(div, "click", function(event) {
            google.maps.event.trigger(me, "click");
            console.log("mpike")
          });

          // Then add the overlay to the DOM
          var panes = this.getPanes();
          panes.overlayImage.appendChild(div);
        }

        // Position the overlay
        var point = this.getProjection().fromLatLngToDivPixel(this.latlng_);
        if (point) {
          div.style.left = point.x + 'px';
          div.style.top = point.y + 'px';
        }
      };

      CustomMarker.prototype.remove = function() {
        // Check if the overlay was on the map and needs to be removed.
        if (this.div_) {
          this.div_.parentNode.removeChild(this.div_);
          this.div_ = null;
        }
      };

      CustomMarker.prototype.getPosition = function() {
        return this.latlng_;
      };
      CustomMarker.prototype.setVisible = function(show) {
        if (show) {
          this.div_.style.display = 'block'
        } else {
          this.div_.style.display = 'none';
        }
      };
      CustomMarker.prototype.isVisible = function() {
        if (this.div_.style.display === 'none') {
          return false;
        } else {
          return true;
        }
      };

      for (let i = 0; i < this.brews.length; i++) {
        let lat = mapUrlTolatlog(this.brews[i].mapUrl)[0];
        let log = mapUrlTolatlog(this.brews[i].mapUrl)[1];
        let marker = new CustomMarker(
          new google.maps.LatLng(lat, log),
          this.map,
          this.pinsPath + this.brews[i].icon,
          this.brews[i].beers,
          this.brews[i].type
        )
        marker.brew = this.brews[i];
        this.brewsMarkers2.push(marker);

        // let marker = new google.maps.Marker({
        //   position: new google.maps.LatLng(lat, log),
        // });
        // marker.setMap(this.map);


      }
      this.registerEvents();
      setTimeout(()=> {
        this.fitBounds(that.brewsMarkers2);
      }, 300)

    }, duration + 1500)



    // this.map.setZoom(7)


    // this.loadBrewsMarkers();
    // this.loadAreasMarkers();
    // this.fitBounds(this.brewsMarkers);
  }



  fitBounds(markers) {
    let bounds = new google.maps.LatLngBounds(0,0);
    for (let i = 0; i < markers.length; i++) {
      let marker = markers[i];
      bounds.extend(marker.getPosition());
    }


    if (!this.defaultCenter) {
      this.map.fitBounds(bounds);
      google.maps.event.addListenerOnce(this.map, 'idle', () => {
        // this.map.setZoom(this.map.getZoom()+1)
        this.defaultCenter = this.map.getCenter();
        this.defaultZoom = this.map.getZoom();
        this.map.setZoom(this.defaultZoom + 1);
      })

    }else if (markers.length == this.brews.length) {
      console.log("mpike")
      this.map.setCenter(this.defaultCenter);
      this.map.setZoom(this.defaultZoom + 1);
      // google.maps.event.addListenerOnce(this.map, 'idle', () => {
      //   this.map.setZoom(this.map.getZoom()+1)
      // })
    } else {
      console.log("mpike edw")
      this.map.fitBounds(bounds);
    }

  }
  fitBoundsCurrent() {
    let markers = [];
    for (let i = 0; i < this.brewsMarkers2.length; i++) {
      let marker = this.brewsMarkers2[i];
      if (marker.isVisible()) {
        markers.push(marker);
      }
    }
    this.fitBounds(markers);
  }
  registerEvents() {

    // MAP
    this.map.addListener("bounds_changed", () => {
      console.log("ssucceess")
      this.map.boundsChanged = true;
    });

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      // do something only the first time the map is loaded
      this.onLoadMap();

    });

    this.map.addListener("idle", () => {
      console.log("idle--")
      if (this.map.boundsChanged) {
        console.log("idle:bounds_changed");
        this.onMoveMap({
          contents: this.findContents(this.brewsMarkers2)
        });
        this.map.boundsChanged = false;
      }
    });

    this.map.addListener('zoom_changed', () => {
      return;
      // let zoom = this.map.getZoom();
      // let size;
      //
      // let step = 5;
      // if (zoom - 6 > 0 ) {
      //   size = (zoom - 6)*step + 40;
      // } else {
      //   size = 40;
      // }
      //
      // console.log(size)
      // for(let i=0; i < this.brewsMarkers.length; i++) {
      //   let icon = this.brewsMarkers[i].getIcon();
      //   icon.scaledSize = new google.maps.Size(size, size);
      //   icon.anchor = new google.maps.Point(size/2, size/2);
      //   this.brewsMarkers[i].setIcon(icon)
      //
      // }
    });

    let that = this;
    // BREWS MARKERS
    for (let i=0; i < this.brewsMarkers2.length; i++) {
      this.brewsMarkers2[i].addListener('click', function () {
        console.log("Marker Clicked -- ", this.brew.name);
        that.onClickBrewsMarker(this.brew);
      })
    }


  }

  findContents(markers) {
    let contents = [];
    for (let i=0; i < markers.length; i++) {
      if (markers[i].isVisible() &&
        this.map.getBounds().contains(markers[i].getPosition())){
        contents.push(markers[i].brew);
      }
    }
    return contents;
  }

  showBrewsMarkers(brews, fit=true) {

    let markers = [];
    for (let i=0; i < this.brewsMarkers2.length; i++) {
      let found = false;
      let marker = this.brewsMarkers2[i];
      for (let j=0; j < brews.length; j++) {
        if (marker.brew.id === brews[j].id) {
          found = true;
          markers.push(marker); // keep alla markers that found
          break;
        }
      }
      marker.setVisible(found);
    }

    console.log("kkk", markers, brews);

    this.fitBounds(markers);

    this.onMoveMap({contents: brews});

  }

  showAreasMarkers(fit=true) {}


  showBrewsMarkerZoomTo(brewId, duration){}

  fitBrewsMarkers(id) {}

  fitAreaMarkers() {}

  showBrewsFeatures(brews) {}
}

function dropMarker(map, marker, delay, animation=google.maps.Animation.DROP) {

  marker.setAnimation(animation);
  setTimeout(function() {
    marker.setMap(map);
  }, delay)
}

function mapUrlTolatlog(url) {
  let sp = url.split("!3d");
  sp = sp[sp.length-1];
  let lat = Number(sp.split("!4d")[0]);
  let log = Number(sp.split("!4d")[1]);
  return [lat, log]
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
