import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/finally';

/**
 * Generated class for the IntroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
// const host = 'https://mikesdevserver.tk/';
const host = 'http://localhost:3000/';

@IonicPage({
  name: "intro",
  segment: "intro"
})
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {
  scannerEnabled: boolean = false;

  constructor(
    private http: HttpClient,
    private toastCtrl: ToastController,
    public navCtrl: NavController, public navParams: NavParams) {

    this.scannerEnabled = false;






  }
  errorToastConf = {
    message: 'Απέτυχε, προσπάθησε πάλι!',
    duration: 4000,
    position: 'middle'
  };

  desiredDevice: any;
  votes = [0, 0, 0, 0, 0];
  tasted = null;
  beer: any = null;
  token: any = null;

  camerasFoundHandler(cameras: any[]) {

    if (cameras.length == 1) {
      this.desiredDevice = cameras[0];
      return;
    }

    for (let i=0 ; i < cameras.length; i++) {
      if (cameras[i].label.indexOf('back') !== -1) {
        this.desiredDevice = cameras[i];
        return;
      }
    }
    // this.desiredDevice = event[0]
  }


  scanSuccessHandler(event) {

    console.log('scanSuccessHandler', event);

    let result;
    let beerId;

    try {
      result = this.qrDecoder(event);
      beerId = result.beerId;

    } catch (e) {
      this.init();
      let toast = this.toastCtrl.create(this.errorToastConf);
      toast.data.message += '  (#1)';
      toast.present();
      return;
    }

    console.log('apiCheckToken');
    this.http.get(host + 'api/checkToken/'+ beerId+'/'+result.token)
    .subscribe(beer => {
      console.log("respond", beer);
      this.beer = beer;
      this.token = result.token;
    }, err => {


      this.scannerEnabled = false;
      this.init();

      let toast = this.toastCtrl.create(this.errorToastConf);
      toast.data.message += '  (#2)';
      toast.present();

      // alert('checkToken Api request Failed, try again');
    })
  }

  scanErrorHandler(event){
    console.log('scanError', event);
    let toast = this.toastCtrl.create(this.errorToastConf);
    toast.data.message += '  (#3)';
    toast.present();
  }

  scanFailureHandler(){
    console.log('scanFailure', event);
    let toast = this.toastCtrl.create(this.errorToastConf);
    toast.data.message += '  (#4)';
    toast.present();
  }

  scanCompleteHandler(event) {
    console.log('scanCompleteHandler', event);
    this.scannerEnabled = false;
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad IntroPage');
  }

  ionViewWillEnter() {
    // this.navCtrl.push("home")
  }



  init() {
    this.scannerEnabled = false;

    this.token = null;
    this.beer = null;
    this.tasted = null;
    this.votes = [0, 0, 0, 0, 0];

  }
  dataIsValid() {
    // RATING
    // return false;
    let found = false;
    for (let i=0; i < this.votes.length; i++) {
      if (this.votes[i]) {
        found = true;
        break;
      }
    }
    if (!found) {
      return false;
    }

    if (!(this.tasted == 1 || this.tasted == -1)) {
      return false;
    }

    //TASTE
    return true;
  }
  getIcon(i) {
    if (this.votes[i]) {
      return 'star';
    }
    return 'star-outline'
  }

  qrDecoder(data) {
    try {

      let r = JSON.parse(data);
      return r;
    }
    catch(e) {
      return null;
    }
  }

  onClickSubmit() {




    let meta = {};
    this.http.get('https://ipapi.co/json/')
      .finally(()=> {

        meta['timestamp'] = Date.now();
        const data = {
          rate: this.votes.reduce((a, b) => a + b, 0),
          tasted: this.tasted == 1,
          meta: meta
        };


        this.http.post(host + `api/vote/${this.beer.id}/${this.token}`, data)
          .finally(() => {
            this.init();
          })
          .subscribe(beer => {
            console.log("respond", beer);
            this.init();
            let toast = this.toastCtrl.create({
              message: 'Ευχαριστούμε πολύ!',
              duration: 2000,
              position: 'middle'
            });
            toast.onDidDismiss(() => {
              console.log('Dismissed toast');
            });

            toast.present();
          }, err => {
            console.log('unable to submit vote to server');
            let toast = this.toastCtrl.create(this.errorToastConf);
            toast.data.message += '  (#5)';
            toast.present();
          })
      })
      .subscribe(data => {
        console.log("fetch meta ok");
        meta = {
          ip: data['ip'],
          city: data['city'],
          country: data['country'],
          longitude: data['longitude'],
          latitude: data['latitude'],
        };
      }, err=>{
        console.log("fetch error")
      });










  }
  onClickCancel() {
    this.init();
  }

  onClickCancelScan() {
    this.scannerEnabled = false;
  }

  onClickScan() {
    this.scannerEnabled = true;
  }
  onClickThumb(b) {
    if (b) {
      this.tasted = 1;
    } else {
      this.tasted = -1;
    }
  }

  onClickStar(ind) {

    if (this.votes[ind]) {
      //remove next votes
      for (let i=ind+1  ; i < this.votes.length; i++ ) {
        this.votes[i] = 0;
      }
    } else {
      // fill previous votes
      console.log('end', ind)
      for (let i=0; i <= ind; i++ ) {
        this.votes[i] = 1;
      }
    }
  }

}
