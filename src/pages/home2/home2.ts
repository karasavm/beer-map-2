import {ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, Platform, Searchbar} from 'ionic-angular';
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
  "segment": "home2",
  "defaultHistory": ['']
})
@Component({
  selector: 'page-home2',
  templateUrl: 'home2.html',
})
export class Home2Page {

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('searchbar') searchbar:Searchbar;

  searchKey = '';
  brewMode = 'all'; // all, brews, gypsy
  fab1 = 'brews';
  fab2 = 'gypsy';
  brews: Brew[];
  areas: any;
  mapMode = true;
  currentBrewsMode: Brew[];
  currentBrews: Brew[];
  contents: Brew[] = [];
  showSearch = true;
  beerMap: any;
  selectedBrew;

  brewTitle;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataSrv: DataService,
    public chDetector: ChangeDetectorRef,
    public modalCtrl: ModalController,
    public platform: Platform
    ) {


    this.brewTitle =  {
      'brews': 'ΜΙΚΡΟΖΥΘΟΠΟΙΙΕΣ',
      'all': 'ΖΥΘΟΠΟΙΙΕΣ',
      'gypsy': 'GYPSY'
    };

    this.brews = this.dataSrv.getBrews();
    this.areas = this.dataSrv.getAreas();
    // this.areas = this.dataSrv.getAreas();
    this.currentBrewsMode = this.brews.slice();
    this.currentBrews = this.brews.slice();


    // this.contents = this.brews.slice();
  }

  ionViewDidLoad(){

    let sp = window.location.href.toString().split('/');




    if (sp[sp.length -1] !== 'home2' && this.dataSrv.loaded) {
      history.back();
      console.log("backkkkk");
      // this.dataSrv.platform.exitApp();
      // window.close()
      // this.platform.exitApp();
    }

    this.showSearch = false;
    console.log("view did load home2")
    // this.dataSrv.createLoader();
    // this.dataSrv.loading.present();


    let that = this;
    this.beerMap = new BeerMapGoogle(
      this.brews,
      this.areas,
      this.mapElement.nativeElement,
      (brew) => {
        console.log("brew marker clicked!!");
        this.selectedBrew = brew;
        // this.navCtrl.push('brews-info', {brew: brew});


      },
      (data) => {

        this.contents = data.contents;
        this.chDetector.detectChanges()
      },
      () => {
        // this.dataSrv.loading.dismiss();
        console.log("onLoadMap")
      },
      this.dataSrv.pinsPath,
      this.dataSrv.logosPath
    );

    this.beerMap.init();

    // setTimeout(() => {
    //   this.onClickMapMode();
    //   this.searchKey = 'θεσσαλο';
    //   this.onChangeSearchInput();
    // },2000);


    // this.dataSrv.loading.present();
    // let that = this;
    this.dataSrv.loaded = true;

  }




  onChangeSearchInput() {
    console.log("searchKey: ", this.searchKey);

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

    console.log(this.currentBrews);
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

  onClickMapMode() {
    this.mapMode = !this.mapMode;
  }

  onClickBrewItem(brew) {
    this.selectedBrew = brew;
    // this.navCtrl.push('brews-info', {brew: brew});
  }

  isActive(s) {
    if (s==='map' && this.mapMode) {
      return 'dark_brown';
    }
    if (s==='list' && !this.mapMode) {
      return 'dark_brown';
    }
    return 'brown'
  }

  onClickSearch() {
    this.showSearch = true;
  // @ViewChild('searchbar') tst:Searchbar;
    this.chDetector.detectChanges();
    this.searchbar.setFocus();
  }

  onClickSearchBack() {
    // when back on searchbar
    this.showSearch = false;
    this.searchKey = '';
    this.onChangeSearchInput();
  }

  onClickBrewMode(mode, fab) {
    fab.close();
    // return;
    // clear search funcitonality
    // this.searchKey = '';

    if (mode === 'brews') {
      this.fab1 = 'all';
      this.fab2 = 'gypsy';
      this.brewMode= 'brews';
      // this.modeLabel = "ζυθοποια";
      this.currentBrewsMode = [];
      for (let i=0; i < this.brews.length; i++) {
        if (this.brews[i].type !== 'client') {
          this.currentBrewsMode.push(this.brews[i]);
        }
      }
    } else if (mode === 'gypsy') {
      this.fab1 = 'brews';
      this.fab2 = 'all';
      this.brewMode= 'gypsy';
      // this.modeLabel = "Gypsies";
      this.currentBrewsMode = [];
      for (let i=0; i < this.brews.length; i++) {
        if (this.brews[i].type === 'client') {
          this.currentBrewsMode.push(this.brews[i]);
        }
      }
    } else if (mode === 'all') {
      this.brewMode= 'all';
      this.fab1 = 'brews';
      this.fab2 = 'gypsy';
      // this.modeLabel = "ολες";
      this.currentBrewsMode = this.brews.slice();
    }

    this.currentBrews = this.currentBrewsMode.slice();
    this.onChangeSearchInput()


  }

  imgLoaded() {
    this.navCtrl.push('brews-info', {brew: this.selectedBrew});
    this.selectedBrew = null;
  }
}




