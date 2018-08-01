import {Component, ViewChild} from '@angular/core';
import {LoadingController, NavController, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import {DataService} from "../services/data.service";
import {Brew} from "../helpers/brew.model";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;
  brews: Brew[];
  @ViewChild('myNav') navCtrl: NavController


  constructor(
    platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    private dataSrv: DataService,
    private loadingCtrl: LoadingController
    // private navCtrl: NavController
    ) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.dataSrv.loading.present();
    this.dataSrv.fetchData()
      .then(data => {
        this.brews = this.dataSrv.getBrews();
        this.dataSrv.loading.dismiss();
      });

  }


}

