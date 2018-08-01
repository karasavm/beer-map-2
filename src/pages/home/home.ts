import { Component } from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {BeerMap} from "../../helpers/beer-map";
import {Brew} from "../../helpers/brew.model";
import {DataService} from "../../services/data.service";
import {p} from "@angular/core/src/render3";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  beerMap: BeerMap;
  brews: Brew[];
  areas: any[];
  selectedArea: any = null;

  constructor(
    public navCtrl: NavController,
    public dataSrv: DataService,
    private alertCtrl: AlertController
  )
  {
    this.brews = this.dataSrv.getBrews();
    this.areas = this.dataSrv.getAreas();

    console.log("onview did load", this.dataSrv.getSelectedAreea());
    const that = this;

  }


  onClickSearch() {
    this.navCtrl.push('brews-list')
  }

  ionViewDidEnter(){
    this.selectedArea = this.dataSrv.getSelectedAreea();
  }
  ionViewDidLoad() {
    // console.log(this.dataSrv.get)

    // Initialize Map
    if (!this.dataSrv.getMap()) {
      console.log("Inside")
      this.beerMap = new BeerMap(
        this.brews,
        this.areas,
        'map-canvas',
        this.onClickBrewsMarker(this),
        this.onClickAreasMarker(this),
        // function(data){console.log("fun2")},
        // this.onClickBrewsMarker(this),
        // this.onClickAreasMarker(this)
      );

      this.beerMap.init();
      const that = this;
      setTimeout(function() {
        that.beerMap.showAreasMarkers(true);
        // that.beerMap.fitAreaMarkers();
      }, 2000);
      this.dataSrv.setMap(this.beerMap);
    } else {
      this.beerMap = this.dataSrv.getMap();
    }
  }


  onClickBrewsMarker(that) {
    return function(data) {
      console.log('onClickBrewsMarker', data);
      // that.dataSrv.setCurrentBrewById(data.id);
      let brew = that.dataSrv.getBrewById(data.id);

      that.selectedArea = that.dataSrv.getAreaById(brew.area);
      that.navCtrl.push('brews-info', {brew: brew});
      // that.router.navigate(['/brews-info']);

    };
  }


  onClickAreasMarker(that) {

    return function(data) {
      console.log('Area Marker Clicked', data);
      that.selectedArea = that.dataSrv.getAreaById(data.id);
      that.dataSrv.setSelectedAreaId(that.selectedArea.id);
      // history.pushState(null, null, '')
      that.beerMap.showBrewsMarker(data.id);
      // window.history.pushState(null, null, '/home');
    };
  }

  onClickResetMap() {
    this.selectedArea = null;
    this.dataSrv.selectedArea = null;
    this.beerMap.showAreasMarkers(true);
  }


  onClickInfo() {
    const alert = this.alertCtrl.create({
      title: 'Επικοινωνία',
      subTitle: 'Είστε ζυθοποιός ή φίλος της ελληνικής μπύρας;',
      message: 'Επικοινονείστε μαζί μας: karasavm@gmail.com',
      buttons: ['OK']
    });
    alert.present();
  }
}
