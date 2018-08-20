import Feature from 'ol/Feature.js';
import Map from 'ol/Map.js';
import Overlay from 'ol/Overlay.js';
import View from 'ol/View.js';
import Point from 'ol/geom/Point.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import TileJSON from 'ol/source/TileJSON.js';
import VectorSource from 'ol/source/Vector.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import {Icon, Style, Text, Fill, Stroke} from 'ol/style.js';
import {fromLonLat} from 'ol/proj';
import {toSize} from 'ol/size';
import {Stamen, OSM} from 'ol/source';
import {containsExtent} from 'ol/extent';



const INIT_ZOOM = 3;
const ΜΑΧ_ΖΟΟΜ = 13;
const INIT_CENTER = [21.824312, 39.074208]; //GREECE

export class BeerMap {
  brews: any;
  areas: any;
  map: Map;
  divCanvas: string;
  brewsLayers = {};
  brewsLayer: VectorLayer;
  brewsFeatures = [];
  areasLayer: VectorLayer;
  onClickBrewsMarker: any;
  onClickAreasMarker: any;
  onMoveMap: any;
  pinsPath: string;
  imgsPath: string;
  constructor(brews, areas, divCanvas, onClickBrewsMarker, onClickAreasMarker,onMoveMap, pinsPath, imgsPath) {
    console.log(onClickBrewsMarker);
    this.brews = brews;
    this.areas = areas;
    this.onClickBrewsMarker = onClickBrewsMarker;
    this.onClickAreasMarker = onClickAreasMarker;
    this.onMoveMap = onMoveMap;
    this.divCanvas = divCanvas;
    this.pinsPath = pinsPath;
    this.imgsPath = imgsPath;
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
        id: this.brews[i].id,
        hidden: false
        // labelPoint: new Point(fromLonLat([Number(coords[1]), Number(coords[0])]))
      });

      var iconStyle = new Style({
        image: new Icon(({
          // anchor: [0.5, 0.5],
          // anchorXUnits: 'fraction',
          // anchorYUnits: 'fraction',
          scale: 0.3,
          // src: 'assets/150x150cp/' + this.areas[i].icon
          src: this.pinsPath + this.brews[i].icon
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
      });
      iconFeature.set('defaultStyle', [iconStyle, labelStyle]);
      iconFeature.setStyle([iconStyle, labelStyle]);
      this.brewsFeatures.push(iconFeature);
      features[this.brews[i].area].push(iconFeature);
    }
    // create vector layers
    for (let i=0; i < this.areas.length; i++) {
      this.brewsLayers[this.areas[i].id] = new VectorLayer({
        source: new VectorSource({features: features[this.areas[i].id].slice()})
      });
      this.brewsLayers[this.areas[i].id].set('name', 'brews-layer-' + this.areas[i].id);
    }

    this.brewsLayer = new VectorLayer({
      source: new VectorSource({features: this.brewsFeatures})
    });
    this.brewsLayer.set('name', 'brews-layer')
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
        opacity: 0.5
    });

    var textureLayer2 = new TileLayer({
        source: new OSM({
                url: 'assets/imgs/texture2.jpg'
        }),
        opacity: 0.3
    });
    /////////////////

    var style = new Style({
      fill: new Fill({
        color: '#eba251'
      }),
      stroke: new Stroke({
        color: '#000',
        width: 0.5
      }),
      text: new Text({
        font: '20px Calibri,sans-serif',
        fill: new Fill({
          color: '#8B4513'
        }),
        stroke: new Stroke({
          color: '#b3532d',
          width: 1
        }),
        opacity: 1
      })
    });

    var regionsLayer = new VectorLayer({
      source: new VectorSource({
        url: 'assets/data/greece-prefectures.geojson',
        format: new GeoJSON()
      }),
      opacity: 0.6,
      style: function(feature) {
        style.getText().setText(feature.get('name'));
        // console.log(feature.get('name'))
        return style;
        // return new Style({
        //   stroke: new Stroke({
        //             color: '#319FD3',
        //             width: 2
        //           })
        // });
      }
    });
    //
    // style: function(feature){
    //   if(feature.get("name") != inputs){
    //     return new ol.style.Style({
    //       fill: new ol.style.Fill({
    //         color: 'rgb(181, 208, 208)'
    //       })
    //     });
    //   }
    //   if(feature.get("name") == inputs){
    //     return new ol.style.Style({
    //       stroke: new ol.style.Stroke({
    //         color: '#319FD3',
    //         width: 2
    //       })
    //     });
    //   }
    // }

    this.map = new Map({
      layers: [
        // textureLayer2,

        new TileLayer({
          source: new Stamen({
            layer: 'watercolor'
          }),
          opacity: 1,
          visible: true,
          name: 'watercolor'
        }),
        new TileLayer({

          source: new Stamen({
            layer: 'terrain-labels'
          }),
          visible: false,
          name: 'labels'
        }),

        // regionsLayer,
        textureLayer2,
        textureLayer,


      ],
      target: document.getElementById(this.divCanvas),
      view: new View({
        center: fromLonLat(INIT_CENTER),
        zoom: INIT_ZOOM,
        maxZoom: ΜΑΧ_ΖΟΟΜ
      })
    });

    console.log(this.brewsLayer)
    this.brewsLayer.setVisible(false);
    this.map.addLayer(this.brewsLayer);

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
    this.map.on('zoomend', function(e) {
      console.log(e,'fffffffffffffffffffffffffffffff')
    })
    this.map.on('pointermove', function(e) {
      var pixel = e.map.getEventPixel(e.originalEvent);
      var hit = e.map.hasFeatureAtPixel(pixel);
      e.map.getTarget().style.cursor = hit ? 'pointer' : '';
    });
    // let that = this;
    this.map.on("moveend", function(e) {
      var extent = e.map.getView().calculateExtent(e.map.getSize());

      var output = [];
      let features = that.brewsLayer.getSource().getFeatures();
      for (var i = 0, l = features.length; i < l; i++) {
        var feature = features[i];

        if (containsExtent(extent, feature.getGeometry().getExtent())) {
          output.push(feature)
        }
      }
      that.onMoveMap({
        contents: output
      });


      let condition = e.map.getView().getZoom() > 9;
      condition = true;

      e.map.getLayers().forEach(function(el){
        if (el.get('name') === 'watercolor' || el.get('name') === 'labels') {
          el.setVisible(condition)
        }
      });

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
    this.hideAllLayers();
    this.brewsLayers[id].setVisible(true);
    if (fit) {
      this.fitBrewsMarkers(id);
    }

  }
  hideAllLayers() {
    for (var key in this.brewsLayers) {
      this.brewsLayers[key].setVisible();
    }
    this.areasLayer.setVisible(false);
  }

  showAreasMarkers(fit=true) {
    this.hideAllLayers();

    this.areasLayer.setVisible(true);
    if (fit) {
      console.log("fit")
      this.fitAreaMarkers();
    }
  }

  showAllBrews(fit=true) {
    this.brewsLayer.setVisible(true);
    if (fit) {
      this.map.getView().fit(this.brewsLayer.getSource().getExtent(),
        {
          size: this.map.getSize(),
          duration: 1000
        });
    }
    // this.hideAllLayers();
    //
    // for (var key in this.brewsLayers) {
    //   this.brewsLayers[key].setVisible(true);
    // }
    //
    // if (fit) {
    //   this.fitAreaMarkers();
    // }

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
  hideFeature(f) {
    if (f.get('hidden')) {
      return
    }
    f.setStyle(new Style({}));
    f.set('hidden', true);
  }
  showFeature(f) {
    if (!f.get('hidden')) {
      return
    }
    f.setStyle(f.get('defaultStyle'));
    f.set('hidden', false);
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

  showBrewsFeatures(brews) {

    let features = [];
    let source = this.brewsLayer.getSource();
    source.clear();

    for (let i=0; i < this.brewsFeatures.length; i++) {
      for (let j=0; j < brews.length; j++) {
        if (this.brewsFeatures[i].get('id') === brews[j].id) {
          features.push(this.brewsFeatures[i]);
        }
      }

    }
    // console.log(features);
    if (features.length ===  0) {
      return;
    }
    source.addFeatures(features);
    this.map.getView().fit(this.brewsLayer.getSource().getExtent(),
      {
        size: this.map.getSize(),
        duration: 500,
        maxZoom: 10
      });
    console.log(features);

    return;
    // for (var key in this.brewsFeatures) {
    //   let found = false;
    //   for (let i=0; i < brews.length; i++){
    //     // console.log(brews[i], key)
    //     if (brews[i].id === Number(key)) {
    //       console.log
    //       found = true;
    //       break;
    //     }
    //
    //   }
    //   if (found) {
    //     console.log('found')
    //     this.showFeature(this.brewsFeatures[key])
    //   } else {
    //     this.hideFeature(this.brewsFeatures[key])
    //   }
    //
    // }
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
