import {Component, ViewChild} from '@angular/core';
import {AlertController, App, LoadingController, NavController, Platform, IonicApp, MenuController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import {DataService} from "../services/data.service";
import {Brew} from "../helpers/brew.model";
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = 'home2';
  brews: Brew[];

  // @ViewChild('myNav') navCtrl: NavController


  constructor(
    platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    public dataSrv: DataService,
    private loadingCtrl: LoadingController,
    // private navCtrl: NavController,
  private alertCtrl: AlertController,
    private _app: App, private _ionicApp: IonicApp, private _menu: MenuController
    ) {



    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      window.onpopstate = (evt) => {

        // Close menu if open
        // if (this._menu.isOpen()) {
        //   this._menu.close ();
        //   return;
        // }

        // Close any active modals or overlays
        // let activePortal = this._ionicApp._loadingPortal.getActive() ||
        //   this._ionicApp._modalPortal.getActive() ||
        //   this._ionicApp._toastPortal.getActive() ||
        //   this._ionicApp._overlayPortal.getActive();
        //
        // if (activePortal) {
        //   activePortal.dismiss();
        //
        //   return;
        // }

        // Navigate back
        // if (this._app.getRootNav().canGoBack()) this._app.getRootNav().pop();

      };

    });

    // this.dataSrv.createLoader();
    // this.dataSrv.loading.present();
    // platform.exitApp();
    this.brews = this.dataSrv.brews;

    this.dataSrv.fetchData()
      .subscribe(data => {
        this.dataSrv.brews = data[0];
        this.brews = this.dataSrv.brews;

        this.dataSrv.areas = data[1];

        // this.brews = this.dataSrv.getBrews();
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

