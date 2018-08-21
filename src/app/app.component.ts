import {Component, ViewChild} from '@angular/core';
import {AlertController, LoadingController, NavController, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import {DataService} from "../services/data.service";
import {Brew} from "../helpers/brew.model";
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = 'home';
  brews: Brew[];

  // @ViewChild('myNav') navCtrl: NavController


  constructor(
    platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    public dataSrv: DataService,
    private loadingCtrl: LoadingController,
    // private navCtrl: NavController,
  private alertCtrl: AlertController,
    ) {



    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.dataSrv.createLoader();
    this.dataSrv.loading.present();
    // platform.exitApp();

    this.dataSrv.fetchData()
      .then(data => {
        this.brews = this.dataSrv.getBrews();
        // this.dataSrv.loading.dismiss();
      });


  }


  ionViewDidEnter() {

    console.log("mpike", this.rootPage)
    // this.rootPage = 'home'
    // this.navCtrl.setRoot('home')
  }
  isActive() {
    return 'primary';
  }

  onClickInfo() {
    console.log("mpike")
    const alert = this.alertCtrl.create({
      title: 'Επικοινωνία',
      subTitle: 'Είστε ζυθοποιός ή φίλος της ελληνικής μπύρας;',
      message: 'Επικοινονείστε μαζί μας: karasavm@gmail.com',
      buttons: ['OK']
    });
    alert.present();
  }

}

