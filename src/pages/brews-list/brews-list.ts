import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Brew} from "../../helpers/brew.model";
import {DataService} from "../../services/data.service";
import {normalizeKey} from "../../helpers/lib";

/**
 * Generated class for the BrewsListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-brews-list',
  templateUrl: 'brews-list.html',
})
export class BrewsListPage {
  searchKey: string = '';
  brews: Brew[];
  currentBrews: Brew[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dataSrv: DataService) {
  }

  ionViewDidLoad() {

    this.brews = this.dataSrv.getBrews();
    this.currentBrews = this.brews;
    console.log('ionViewDidLoad BrewsListPage');
  }
  onChangeInput(event) {
    console.log(this.searchKey);


    if (this.searchKey === '') {
      this.currentBrews = this.brews;
      return;
    }

    let list = [];
    const key = normalizeKey(this.searchKey);

    for (let i=0; i < this.brews.length; i++) {
      const searchkey = this.brews[i].name + this.brews[i].city + this.brews[i].beerNames;
      if (normalizeKey(searchkey).indexOf(key) != -1) {
        list.push(this.brews[i]);
      }
    }
    this.currentBrews = list;
    console.log(this.currentBrews)
  }

  onClickItem(brew: Brew) {
    console.log("mpike")
    this.navCtrl.pop();
    this.dataSrv.setSelectedAreaId(brew.area);
    this.dataSrv.getMap().showBrewsMarkerZoomTo(brew.id, 1000);
    let that = this;
    setTimeout(function() {
      that.navCtrl.push('brews-info', {brew: brew});

    }, 2000)


  }


}
