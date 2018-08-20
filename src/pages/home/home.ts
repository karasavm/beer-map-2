import {Component, ElementRef, ViewChild} from '@angular/core';
import {AlertController, IonicPage, NavController, Platform} from 'ionic-angular';
import {BeerMap} from "../../helpers/beer-map";
import {Brew} from "../../helpers/brew.model";
import {DataService} from "../../services/data.service";
import {p} from "@angular/core/src/render3";
import {normalizeKey} from "../../helpers/lib";


@IonicPage({
  "name": "home",
  "segment": "home"
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  beerMap: BeerMap;
  brews: Brew[];
  currentBrews: Brew[];
  currentBrewsMode: Brew[];
  areas: any[];
  selectedArea: any = null;
  searchKey = '';
  search = false;
  contents = [];
  mode = "all"; // all, brews, gypsy
  modeLabel = 'ολες';
  mapMode = true;
  @ViewChild('map') mapEl: ElementRef;

  constructor(
    public navCtrl: NavController,
    public dataSrv: DataService,


  )
  {
    this.brews = this.dataSrv.getBrews();
    this.areas = this.dataSrv.getAreas();
    this.currentBrewsMode = this.brews.slice();
    this.currentBrews = this.brews.slice();
    this.contents = this.brews;
    const that = this;


  }

  onClickList() {
    this.mapMode = !this.mapMode;

    // if (this.mapMode) {
    //   this.mapEl.nativeElement.style.display = 'block';
    // } else {
    //   this.mapEl.nativeElement.style.display = 'none';
    // }


    // this.navCtrl.push('brews-list');
  }
  onClickSearch() {
    // this.navCtrl.push('brews-list');
    this.search = !this.search;
    if (!this.search) {
      this.currentBrews = this.brews.slice();
      this.update();
    }
  }

  ionViewDidEnter(){
    console.log('ionViewDidEnter')
    this.selectedArea = this.dataSrv.getSelectedAreea();

  }
  ionViewDidLoad() {
    this.beerMap = null;

    console.log('ionViewDidLoad: Home');

    // Initialize Map
    if (!this.dataSrv.getMap()) {
    // if(true){

      console.log("Creating Map");
      this.beerMap = this.dataSrv.setMap(
        new BeerMap(
          this.brews,
          this.areas,
          'map-canvas',
          function(that) {
            // Brews Marker Click
            return function(data) {
              console.log('onClickBrewsMarker', data);
              // that.dataSrv.setCurrentBrewById(data.id);
              let brew = that.dataSrv.getBrewById(data.id);

              // that.selectedArea = that.dataSrv.getAreaById(brew.area);
              that.navCtrl.push('brews-info', {brew: brew});
              // that.router.navigate(['/brews-info']);

            };
          }(this),
          function(that) {
            // Areas Marker Click
            return function(data) {
              console.log('Area Marker Clicked', data);
              that.selectedArea = that.dataSrv.getAreaById(data.id);
              that.dataSrv.setSelectedAreaId(that.selectedArea.id);
              // history.pushState(null, null, '')
              that.beerMap.showBrewsMarker(data.id);
              // window.history.pushState(null, null, '/home');
            };
          }(this),
          function(that) {
            return function(data) {
              console.log(data, "handler");
              that.contents = data.contents;
            }
          }(this),
          this.dataSrv.pinsPath,
          this.dataSrv.logosPath
        )
      );


      this.beerMap.init();
      const that = this;
      setTimeout(function() {
        // that.beerMap.showAreasMarkers(true);

        that.beerMap.showAllBrews(true);
        // that.beerMap.fitAreaMarkers();
      }, 2000);
      this.dataSrv.setMap(this.beerMap);
    } else {
      this.beerMap = this.dataSrv.getMap();
    }

    console.log("rendering")
    // this.beerMap.map.render();

  }

  ionViewWillEnter() {
    console.log("ionWillEnet");
    this.beerMap = this.dataSrv.map;
    this.beerMap.map.setTarget(this.mapEl.nativeElement);

    let that = this;
    setTimeout(function() {
      that.beerMap.map.updateSize();
      console.log('ff')
    }, 100);

  }





  onClickResetMap() {
    this.selectedArea = null;
    this.dataSrv.selectedArea = null;
    this.beerMap.showAreasMarkers(true);
  }






  onChangeSearchInput() {
    console.log(this.searchKey);

    //clear mode
    // this.mode = 'all';
    // this.modeLabel = "ολες";

    // if (this.searchKey === '') {
    //   this.currentBrews = this.brews;
    //   return;
    // }

    let list = [];
    const key = normalizeKey(this.searchKey);

    for (let i=0; i < this.currentBrewsMode.length; i++) {
      const searchkey = this.currentBrewsMode[i].name + this.currentBrewsMode[i].city + this.currentBrewsMode[i].beerNames;
      if (normalizeKey(searchkey).indexOf(key) != -1) {
        list.push(this.currentBrewsMode[i]);
      }
    }
    // this.currentBrews = list;
    // console.log(list)
    this.currentBrews = list.slice();

    this.update();

  }

  update() {
    this.contents = this.currentBrews;
    this.beerMap.showBrewsFeatures(this.currentBrews);
  }
  onClickSearchBack(k) {
    this.currentBrews = this.brews.slice();
    this.searchKey = '';
    this.update();
    // this.beerMap.showBrewsFeatures(this.currentBrews);
  }


  onClickMode() {

    // clear search funcitonality
    // this.searchKey = '';

    if (this.mode === 'all') {
      this.mode = 'brews';
      this.modeLabel = "ζυθοποια";
      this.currentBrewsMode = [];
      for (let i=0; i < this.brews.length; i++) {
        if (this.brews[i].type !== 'client') {
          this.currentBrewsMode.push(this.brews[i]);
        }
      }
    } else if (this.mode === 'brews') {
      this.mode = 'gypsy';
      this.modeLabel = "Gypsies";
      this.currentBrewsMode = [];
      for (let i=0; i < this.brews.length; i++) {
        if (this.brews[i].type === 'client') {
          this.currentBrewsMode.push(this.brews[i]);
        }
      }
    } else if (this.mode === 'gypsy') {
      this.mode = 'all';
      this.modeLabel = "ολες";
      this.currentBrewsMode = this.brews.slice();
    }

    this.currentBrews = this.currentBrewsMode.slice();
    this.onChangeSearchInput()

  }

  onChangeSegment() {
    console.log(this.mapMode)
  }

  onClickBrewItem(brew) {

    this.navCtrl.push('brews-info', {brew: brew});
  }
}
