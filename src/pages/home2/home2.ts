import {ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {DataService} from "../../services/data.service";
import {Brew} from "../../helpers/brew.model";
import {normalizeKey} from "../../helpers/lib";
import {BeerMapGoogle} from "../../helpers/beer-map-google";

/**
 * Generated class for the Home2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */




@IonicPage({
  "name": "home2",
  "segment": "home2"
})
@Component({
  selector: 'page-home2',
  templateUrl: 'home2.html',
})
export class Home2Page {

  @ViewChild('map') mapElement: ElementRef;
  searchKey = '';
  brews: Brew[];
  currentBrewsMode: Brew[];
  currentBrews: Brew[];
  contents: Brew[] = [];

  beerMap: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataSrv: DataService,
    public chDetector: ChangeDetectorRef
    ) {

    this.brews = this.dataSrv.getBrews();
    // this.areas = this.dataSrv.getAreas();
    this.currentBrewsMode = this.brews.slice();
    this.currentBrews = this.brews.slice();
    // this.contents = this.brews.slice();
  }

  ionViewDidLoad(){
    let that = this;
    this.beerMap = new BeerMapGoogle(
      this.brews,
      this.mapElement.nativeElement,
      (brew) => {
        console.log("brew marker clicked!!");
        this.navCtrl.push('brews-info', {brew: brew});
      },
      (data) => {
        this.contents = data.contents;
        this.chDetector.detectChanges()
      },
      this.dataSrv.pinsPath,
      this.dataSrv.logosPath
    );
    this.beerMap.init();
  }




  onChangeSearchInput() {
    console.log(this.searchKey);

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

    // console.log(this.currentBrews);
    // this.update();
    this.beerMap.showBrewsMarkers(this.currentBrews)

  }

  focusOut() {
    // return;
    let activeElement = <HTMLElement>document.activeElement;
    activeElement && activeElement.blur && activeElement.blur();
    console.log(activeElement)
  }
  onSearchBlur(e) {
    console.log(e)
    setTimeout(() => {
      this.beerMap.fitBoundsCurrent()
    }, 500)
  }

  start() {
    console.log('sssss')
  }


}



