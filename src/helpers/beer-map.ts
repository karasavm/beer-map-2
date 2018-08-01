import Feature from 'ol/Feature.js';
import Map from 'ol/Map.js';
import Overlay from 'ol/Overlay.js';
import View from 'ol/View.js';
import Point from 'ol/geom/Point.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import TileJSON from 'ol/source/TileJSON.js';
import VectorSource from 'ol/source/Vector.js';
import {Icon, Style, Text, Fill} from 'ol/style.js';
import {fromLonLat} from 'ol/proj';
import {toSize} from 'ol/size';
import {Stamen, OSM} from 'ol/source';



const INIT_ZOOM = 3;
const INIT_CENTER = [21.824312, 39.074208]; //GREECE

export class BeerMap {
  brews: any;
  areas: any;
  map: Map;
  divCanvas: string;
  brewsLayers = {};
  areasLayer: VectorLayer;
  onClickBrewsMarker: any;
  onClickAreasMarker: any;

  constructor(brews, areas, divCanvas, onClickBrewsMarker, onClickAreasMarker) {
    console.log(onClickBrewsMarker)
    this.brews = brews;
    this.areas = areas;
    this.onClickBrewsMarker = onClickBrewsMarker;
    this.onClickAreasMarker = onClickAreasMarker;
    this.divCanvas = divCanvas;
  }

  _createBrewsLayers() {
    // init brewsLayers
    let features = {};

    for (let i=0; i < this.areas.length; i++) {
     features[this.areas[i].id] = [];
    }


    for (let i=0; i < this.brews.length; i++) {

      var iconFeature = new Feature({
        geometry: new Point(fromLonLat(mapurlToCoords(this.brews[i].mapUrl))),
        name: this.brews[i].name,
        type: "brews",
        id: this.brews[i].id
        // labelPoint: new Point(fromLonLat([Number(coords[1]), Number(coords[0])]))
      });

      var iconStyle = new Style({
        image: new Icon(({
          // anchor: [0.5, 0.5],
          // anchorXUnits: 'fraction',
          // anchorYUnits: 'fraction',
          scale: 0.3,
          // src: 'assets/150x150cp/' + this.areas[i].icon
          src: 'assets/150x150cp/' + this.brews[i].icon
        }))
      });
      var labelStyle = new Style({
        text: new Text({
            // text: this.brews[i].name,
            text: i.toString(),
            // anchor: [0.5, 0.5],
            offsetY: 28,
            scale: 1.5,
            // offsetX: -15.5,
            fill: new Fill({
                color: '#fff'
            })
          })
      })
      iconFeature.setStyle([iconStyle, labelStyle]);
      features[this.brews[i].area].push(iconFeature);
    }
    // create vector layers
    for (let i=0; i < this.areas.length; i++) {
      this.brewsLayers[this.areas[i].id] = new VectorLayer({
        source: new VectorSource({features: features[this.areas[i].id].slice()})
      });
      this.brewsLayers[this.areas[i].id].set('name', 'brews-layer-' + this.areas[i].id);
    }
  }

  _createAreasLayer() {
    // this.brewsLayer = [];
    let features = [];
    for (let i=0; i < this.areas.length; i++) {
      let coords = this.areas[i].latLng.split(',')

      var iconFeature = new Feature({
        geometry: new Point(fromLonLat([Number(coords[1]), Number(coords[0])])),
        name: this.areas[i].name,
        type: 'areas',
        id: this.areas[i].id,
        // labelPoint: new Point(fromLonLat([Number(coords[1]), Number(coords[0])]))
      });

      var iconStyle = new Style({
        image: new Icon(({
          // anchor: [0.5, 0.5],
          // size: [52, 52],
          // offset: [52, 0],
          // opacity: 0.5,
          scale: 0.3,
          // size: [100, 100],
          // src: 'assets/150x150cp/' + this.areas[i].icon
          src: 'assets/150x150cp/brews.png',
          // src: 'https://openlayers.org/en/v3.20.1/examples/data/icon.png'
        }))
      });
      var labelStyle = new Style({
        text: new Text({
            // text: this.areas[i].name,
            text: i.toString(),
            // anchor: [0.5, 0.5],
            offsetY: 18,
            scale: 1.5,
            offsetX: -14,
            fill: new Fill({
                color: '#fff'
            })
        })
    })
      iconFeature.setStyle([iconStyle, labelStyle]);
      features.push(iconFeature);
    }
    this.areasLayer = new VectorLayer({
      source: new VectorSource({features: features})
    });
    this.areasLayer.set('name', 'areas-layer');
  }
  init() {
    console.log("beermap: initializing map")
    this._createAreasLayer();
    this._createBrewsLayers();

    var textureLayer = new TileLayer({
        source: new OSM({
                url: 'assets/imgs/texture.jpg'
        }),
        opacity: 0.4
    });
    var textureLayer2 = new TileLayer({
        source: new OSM({
                url: 'assets/imgs/texture2.jpg'
        }),
        opacity: 0.5
    });
    this.map = new Map({
      layers: [
        // textureLayer2,

        new TileLayer({
          source: new Stamen({
            layer: 'watercolor'
          }),
          opacity: 1
        }),
        new TileLayer({
          source: new Stamen({
            layer: 'terrain-labels'
          })
        }),
        // textureLayer2,
        // textureLayer

      ],
      target: document.getElementById(this.divCanvas),
      view: new View({
        center: fromLonLat(INIT_CENTER),
        zoom: INIT_ZOOM
      })
    });


    this.areasLayer.setVisible(false);
    this.map.addLayer(this.areasLayer);

    for (var key in this.brewsLayers) {
      let layer = this.brewsLayers[key];
      layer.setVisible(false);
      this.map.addLayer(layer);
    }

    let that = this;


    // fix streched map (open layer bug)
    setTimeout( function() {
      that.map.updateSize();
    }, 500);
    // this.map.setSize(undefined)

    this.map.on('click', function(evt) {
      evt.map.forEachFeatureAtPixel(evt.pixel,
        function(feature, layer) {
          // if clicked feature is one of our markers
          if (feature.get('type') === 'brews') {
            that.onClickBrewsMarker({
              id: feature.get('id'),
              type: feature.get('type')
            })
          }
          if (feature.get('type') === 'areas') {
            that.onClickAreasMarker({
              id: feature.get('id'),
              type: feature.get('type')
            });
          }
          return feature;
        });
    });
    this.map.on('pointermove', function(e) {
      var pixel = e.map.getEventPixel(e.originalEvent);
      var hit = e.map.hasFeatureAtPixel(pixel);
      e.map.getTarget().style.cursor = hit ? 'pointer' : '';
    });

    // scale markers todo
    // this.map.on('moveend', function(e) {
    //   e.map.getLayers().forEach(function(el) {
    //     if (el.get('name') === 'areas-layer') {
    //       // todo scale markers
    //       // let features = el.getSource().getFeatures();
    //       // for (let i=0; i < features.length; i++) {
    //       //   let styles = features[i].getStyle();
    //       //   let img = styles[0].getImage()
    //       //   let label = styles[1].getText()
    //         // label.setScale(label.getScale() + 0.01)
    //         // img.setScale(getScale(that.map.getView().getZoom()))
    //       }
    //     }
    //   })
    // })
    // this.hide();
  }
  _onClickAreasMarker(data) {
    this.areasLayer.setVisible(false);
    this.brewsLayers[data.id].setVisible(true);
    this.fitBrewsMarkers(data.id);
  }
  showBrewsMarker(id, fit=true) {
    this.areasLayer.setVisible(false);
    this.brewsLayers[id].setVisible(true);
    if (fit) {
      this.fitBrewsMarkers(id);
    }

  }

  showAreasMarkers(fit=true) {
    for (var key in this.brewsLayers) {
      this.brewsLayers[key].setVisible();
    }
    this.areasLayer.setVisible(true);

    if (fit) {
      console.log("fit")
      this.fitAreaMarkers();
    }
  }

  showBrewsMarkerZoomTo(brewId, duration){

    for (let i = 0; i < this.brews.length; i++) {
      if (this.brews[i].id === brewId) {
          this.showBrewsMarker(this.brews[i].area, false);
          break;
      }
    }

    for (let i = 0; i < this.brews.length; i++) {
      if (this.brews[i].id === brewId) {
        this.map.getView().animate({
          center: fromLonLat(mapurlToCoords(this.brews[i].mapUrl)),
          zoom: 12,
          duration: duration
        });
        return;
      }
    }
  }

  fitBrewsMarkers(id) {
    const that = this;
    this.map.getView().fit(that.brewsLayers[id].getSource().getExtent(),
    {
      size: that.map.getSize(),
      duration: 1000
    });
  }
  fitAreaMarkers() {
      const that = this;
      this.map.getView().fit(that.areasLayer.getSource().getExtent(),
      {
        size: that.map.getSize(),
        duration: 1000
      });
  }
  hide() {
    this.map.getTargetElement().style.display = 'none';
  }
  show() {
    this.map.getTargetElement().style.display = 'block';
    this.map.updateSize();
  }
  load() {
    this.init();
    let that = this;

    setTimeout(function() {
      that.showAreasMarkers();
    }, 2000)

    // let features = this.areasLayer.getSource().getFeatures();


    // setTimeout(function() {
    //   that.showAreasMarkers();
    //   that.map.getView().fit(that.areasLayer.getSource().getExtent(),
    //   {
    //     size: that.map.getSize(),
    //     duration: 1000
    //   })
    // }, 2000);

  }
}

// HELPER FUNCITONS
function  mapurlToCoords(mapUrl: string) {
    let sp = mapUrl.split("!3d");
    let t = sp[sp.length-1];
    // return [lng, lat]
    return [Number(t.split("!4d")[1]), Number(t.split("!4d")[0])]
  }

function getScale(zoom) {
  return {
    '1': 0.2,
    '2': 0.2,
    '3': 0.2,
    '4': 0.2,
    '5': 0.3,
    '6': 0.35,
    '7': 0.4,
    '8': 0.5,
    '9': 0.55,
    '10': 0.55,
    '11': 0.55,
    '12': 0.55,
    '13': 0.55,
    '14': 0.55,
  }[zoom.toString()]
}
