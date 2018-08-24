import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Brew} from "../../helpers/brew.model";
import {DataService} from "../../services/data.service";
import {ViewController} from "ionic-angular";

/**
 * Generated class for the BrewsInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage({
  "name": "brews-info",
  "segment": "brews-info"
})
@Component({
  selector: 'page-brews-info',
  templateUrl: 'brews-info.html',
})
export class BrewsInfoPage {
  brew: Brew;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataSrv: DataService,

  ) {


    this.brew = this.navParams.get('brew');
    if (!this.brew) {
      console.log("no data redirecting");
      this.brew = this.dataSrv.getBrews()[0]
      // this.navCtrl.setRoot('home');

    }
  }


  ionViewDidLoad() {
    console.log(history)
    history.pushState (null, null, "");
    console.log('ionViewDidLoad BrewsInfoPageeeee');
  }



  onClickBtn(type) {

    if (type === 'pin') {
      window.open(this.brew.mapUrl, "_blank");
    } else if (type === 'web') {
      window.open(this.brew.webUrl, "_blank");
    } else if (type === 'facebook') {
      window.open(this.brew.fbUrl, "_blank");
    } else if (type === 'tel') {
      alert(this.brew.tel)
    }
  }


}
