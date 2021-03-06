import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {LoadingController} from "ionic-angular";
import {forkJoin} from "rxjs/observable/forkJoin";

@Injectable()
export class DataService {

  brews: any = null;
  areas: any = null;
  zoomToBrew: any = null;
  currentBrew: any = null;
  history = [];
  map: any = null;
  selectedArea: any = null;
  loading: any;
  // public pinsPath: string = 'https://mikesdevserver.tk/api/images/pins/150X150cp/';
  public pinsPath: string = 'https://mikesdevserver.tk/api/images/pins/150X150cp/';
  // public logosPath: string = 'http://mikesdevserver.tk/api/images/pins/compressed/';
  public logosPath: string = 'https://mikesdevserver.tk/api/images/pins/compressed/';



  constructor(
    private http: HttpClient,
    private loadingCtrl: LoadingController
  ) {

  }

  createLoader() {
    this.loading = this.loadingCtrl.create({
      // spinner: 'hide',
      content: `
      <div class="custom-spinner-container">
        <div class="custom-spinner-box">Loading ...</div>
      </div>`,
    });
  }
  fetchData() {
    console.log('fetching data');
    this.createLoader();
    this.loading.present();

    // this.prefetchPins();
    //  return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //         this.areas = areas;
    //         this.brews = brews;
    //         console.log('Data Fetching Complete.');
    //         resolve();
    //     }, 500);
    // });
    // this.areas = areas;
    this.loading.dismiss();

    let req1 = this.http.get('https://mikesdevserver.tk/api/brews');
    let req2 = this.http.get('https://mikesdevserver.tk/api/areas');

    return forkJoin([req1, req2]);

    // this.http.get('https://mikesdevserver.tk/api/brews')
    // .subscribe(brews => {
    //   console.log("Brews Fetched", brews);
    //   this.brews = brews;
    //
    //   this.loading.dismiss();
    //   return new Promise((resolve, reject) => {
    //     resolve();
    //   })
    // })


    //
    // this.http.get('http://138.68.180.1/api/areas')
    // .subscribe(areas => {
    //   console.log("Areas Fetched", areas);
    //   this.areas = areas;
    // })

  }
  loaded = false;
  getBrews() { return this.brews }
  getAreas() { return this.areas }
  getBrewById(id) {
    for (let i=0; i < this.brews.length; i++) {
      if (this.brews[i].id == id){
        return this.brews[i]
      }
    }
    return null;
  }
  setCurrentBrewById(id) {
    for (let i=0; i < this.brews.length; i++) {
      if (this.brews[i].id == id){
        this.setCurrentBrew(this.brews[i]);
        return this.brews[i]
      }
    }
    return null;
  }
  setCurrentBrew(brew: any) {this.currentBrew = brew}
  getCurrentBrew() { return this.currentBrew}

  getAreaById(id) {
    for (let i = 0; i < this.areas.length; i++) {
      if (this.areas[i].id === id){
        return this.areas[i];
      }
    }
    return null;
  }

  setMap(map){ this.map = map; return this.map;}


  getMap(){ return this.map;}
  setSelectedAreaId(area) {console.log("selected area", area); this.selectedArea = this.getAreaById(area);}
  getSelectedAreea() {return this.selectedArea;}


}

const brews = [
  {id: 1, name: "HELLENIC BREWERY of ATALANTI S.A./Ελληνική Ζυθοποιία Αταλάντης", city: "Atalanti/Αταλάντη", beerNames: "EZA/ΕΖΑ", icon: "eza.png", webUrl: "http://www.eza.gr/index.php?option=com_content&view=article&id=1&Itemid=6&lang=en", fbUrl: "https://www.facebook.com/EzaBeer/", tel: "2106898520", type: "commercial", area: "sterea", beers: "18", mapUrl: "https://www.google.gr/maps/place/Hellenic+Breweries+of+Atalanti+S.A./@38.6312018,22.7951828,10z/data=!4m8!1m2!2m1!1seza+microbrewery!3m4!1s0x14a0c199d6eb9d8f:0x82c3c2fa7b0d9dda!8m2!3d38.6312018!4d23.0753342"},
  {id: 2, name: "Macedonian Thrace Brewery SA/Ζυθοποιία Μακεδονίας Θράκης Α.Ε.", city: "Komotini/Κομοτηνή", beerNames: "vergina/Βεργίνα", icon: "vergina.png", webUrl: "http://www.verginabeer.com", fbUrl: "https://www.facebook.com/VerginaPremiumBeer/", tel: "2531038715,2310798915,2106664407", type: "commercial", area: "thrace", beers: "10", mapUrl: "https://www.google.gr/maps/place/Vergina+Beer+factory/@41.0226797,25.4495604,12.67z/data=!4m5!3m4!1s0x14adf1c6a5dd8b5d:0x15ac71b26c9bb566!8m2!3d41.0738353!4d25.492092"},
  {id: 3, name: "Septem Microbrewery/Μικροζυθοποιία Septem", city: "Evoia/Εύβοια", beerNames: "septem/Septem", icon: "septem.png", webUrl: "http://septem.gr/", fbUrl: "https://www.facebook.com/Septembrewery/", tel: "2222770000", type: "micro", area: "sterea", beers: "13", mapUrl: "https://www.google.gr/maps/place/Septem+Microbrewery/@38.5350089,24.1108791,15z/data=!4m5!3m4!1s0x0:0x38bac46c537cb731!8m2!3d38.5350089!4d24.1108791"},
  {id: 4, name: "Corfu Beer/Corfu Beer Κερκυραϊκή Μικροζυθοποιία", city: "Kerkira/Κέρκυρα", beerNames: "/Red Ale Special,Dark Ale Bitter,Amorosa Weiss,Contessa IPA,Royal Ionian Pilsner,Ionian Epos,Ionian Gold,1842 Ginger Beer", icon: "corfu.png", webUrl: "http://www.corfubeer.com", fbUrl: "https://www.facebook.com/CorfuBeerofficial/", tel: "2663052072", type: "micro", area: "ionio", beers: "8", mapUrl: "https://www.google.gr/maps/place/Corfu+Beer+%CE%9A%CE%B5%CF%81%CE%BA%CF%85%CF%81%CE%B1%CF%8A%CE%BA%CE%AE+%CE%96%CF%85%CE%B8%CE%BF%CF%80%CE%BF%CE%B9%CE%AF%CE%B1/@39.7468394,19.648364,14.25z/data=!4m5!3m4!1s0x135b4dfb775399a1:0xd79fd6503283f090!8m2!3d39.7494378!4d19.6568128"},
  {id: 5, name: "Zeos Breweries S.A./Ζέος Ζυθοποιία Α.Ε.", city: "Argos/Άργος", beerNames: "Zeos/Ζέος", icon: "zeos.png", webUrl: "http://zeosbrewery.com/", fbUrl: "https://www.facebook.com/zeosbeers/", tel: "2751031400", type: "micro", area: "pelloponisos", beers: "5", mapUrl: "https://www.google.gr/maps/place/Zeos+Breweries+S.A./@37.6580027,22.7437014,16z/data=!4m5!3m4!1s0x149ffbe14f3ea941:0xa835c99f7977dd30!8m2!3d37.6590984!4d22.7457882"},
  {id: 6, name: "Magnus Magister Papadimitriou S.A/Mangus Magister Παπαδημητρίου Α.Ε.", city: "Rhodes/Ρόδος", beerNames: "Magnus/Magnus", icon: "magnus.png", webUrl: "http://magnusmagister.gr/", fbUrl: "https://www.facebook.com/Magnus-Magister-514360781997636/", tel: "2241091545", type: "client", area: "dodekanisa", beers: "4", mapUrl: "https://www.google.gr/maps/place/Magnus+Magister+Papadimitriou+S.A/@36.3706317,28.0650966,13.25z/data=!4m8!1m2!2m1!1zzpbOpc6Yzp_OoM6fzpnOmc6RIM6hzp_OlM6fzqU!3m4!1s0x14957b25cbab085b:0x1ef85d77f93e4614!8m2!3d36.3772406!4d28.0978346"},
  {id: 7, name: "Rethymnian Brewery S.A./Ρεθυμνιακή Ζυθοποιία Α.Ε.", city: "Rethimno/Ρέθυμνο", beerNames: "/Brinks", icon: "brinks.png", webUrl: "http://www.brinks-beer.gr/", fbUrl: "", tel: "2831041243", type: "micro", area: "creta", beers: "3", mapUrl: "https://www.google.gr/maps/place/Rethymnian+Brewery+S.A./@35.3024262,24.4583361,16z/data=!4m5!3m4!1s0x149b7508ce2e3fed:0x82d765b479de9af!8m2!3d35.3032668!4d24.4599937"},
  {id: 8, name: "Santorini Brewing Company/Ζυθοποιία Σαντορίνης", city: "Santorini/Σαντορίνη", beerNames: "/Crazy Donkey", icon: "donkey.png", webUrl: "http://www.santorinibrewingcompany.gr", fbUrl: "https://www.facebook.com/donkeybeer/", tel: "2286030268", type: "micro", area: "aigaio", beers: "5", mapUrl: "https://www.google.gr/maps/place/Santorini+Brewing+Company/@36.4071539,25.4206309,12z/data=!4m8!1m2!2m1!1zzpbOpc6Yzp_OoM6fzpnOmc6RIM6jzpHOnc6kzp_Ooc6Zzp3Ol86j!3m4!1s0x1499ce18f7a849df:0x2e572f9b2c435648!8m2!3d36.384082!4d25.4645213"},
  {id: 9, name: "Chios Brewery/Μικροζυθοποιία Χίου", city: "Chios/Χίος", beerNames: "Chios Beer/Φρέσκια Μπύρα Χίου,Smoked Robust Porter,Chios Beer BBQ", icon: "chios.png", webUrl: "http://www.chiosbeer.gr", fbUrl: "https://www.facebook.com/chiosbeer/", tel: "2271033107", type: "micro", area: "vaigaio", beers: "3", mapUrl: "https://www.google.gr/maps/place/Chios+Beer+-+%CE%96%CF%85%CE%B8%CE%BF%CF%80%CE%BF%CE%B9%CE%AF%CE%B1+%CE%A7%CE%AF%CE%BF%CF%85/@38.319989,26.126711,17z/data=!3m1!4b1!4m5!3m4!1s0x14bb615187908c63:0x1f6fe99f353179ff!8m2!3d38.319989!4d26.126711"},
  {id: 10, name: "Vap P. Kouyos S.A./ΒΑΠ Π. Κούγιος Α.Β.Ε.Ε.", city: "Rhodes/Ρόδος", beerNames: "Vap/Ζύθος ΒΑΠ", icon: "vap.png", webUrl: "http://vap.gr", fbUrl: "https://www.facebook.com/ZythosVAP/", tel: "2241072920", type: "micro", area: "dodekanisa", beers: "1", mapUrl: "https://www.google.gr/maps/place/Vap+P.+Kouyos+S.A./@36.3818988,28.1978325,17z/data=!4m12!1m6!3m5!1s0x149563f7e20038f5:0xd2680a6de4a5f42c!2sVap+P.+Kouyos+S.A.!8m2!3d36.3818988!4d28.1978325!3m4!1s0x149563f7e20038f5:0xd2680a6de4a5f42c!8m2!3d36.3818988!4d28.1978325"},
  {id: 11, name: "Cyclades Microbrewery at Tinos Island/Μικροζυθοποιία Κυκλάδων στην Τήνο", city: "Tinos/Τήνος", beerNames: "Nissos/Νήσος Pilsner,Νήσος Βιολογική All-Day,7 Μποφόρ Strong Dark Pilner,Νήσος Θολή", icon: "nhsos.png", webUrl: "http://nissos.beer", fbUrl: "https://www.facebook.com/nissoscraftbeer/", tel: "2283026333", type: "micro", area: "aigaio", beers: "4", mapUrl: "https://www.google.gr/maps/place/%CE%9D%CE%97%CE%A3%CE%9F%CE%A3+Beer/@37.6017436,25.1131911,11z/data=!4m8!1m2!2m1!1zzpzOmc6azqHOn86WzqXOmM6fzqDOn86ZzpnOkSDOms6lzprOm86RzpTOqc6dIM6jzqTOl86dIM6kzpfOnc6f!3m4!1s0x14a2ec02da080b6f:0xa050ccefda014c8b!8m2!3d37.5388756!4d25.1749806"},
  {id: 12, name: "Cretan Brewery S.A./Κρητική Ζυθοποιία Α.Ε.", city: "Chania/Χανιά", beerNames: "Charma/Χάρμα", icon: "charma.png", webUrl: "https://www.cretanbeer.gr", fbUrl: "https://www.facebook.com/CretanBeer/", tel: "2824031002", type: "micro", area: "creta", beers: "4", mapUrl: "https://www.google.gr/maps/place/Cretan+Brewery+S.A.+%CE%9A%CF%81%CE%B7%CF%84%CE%B9%CE%BA%CE%AE+%CE%96%CF%85%CE%B8%CE%BF%CF%80%CE%BF%CE%B9%CE%AF%CE%B1+%CE%91.%CE%95/@35.48685,23.825786,17z/data=!3m1!4b1!4m12!1m6!3m5!1s0x149c8bb3ccd1b743:0x318bf645e5ada059!2zQ3JldGFuIEJyZXdlcnkgUy5BLiDOms-BzrfPhM65zrrOriDOls-FzrjOv8-Azr_Ouc6vzrEgzpEuzpU!8m2!3d35.48685!4d23.825786!3m4!1s0x149c8bb3ccd1b743:0x318bf645e5ada059!8m2!3d35.48685!4d23.825786"},
  {id: 13, name: "Siris MicroBrewery E.E./Siris Μικροζυθοποιία Σερρών & Β. Ελλάδος Ε.Ε.", city: "Serres/Σέρρες", beerNames: "Voreia/Βόρεια", icon: "voreia.png", webUrl: "http://www.sirisbrewery.gr/", fbUrl: "https://www.facebook.com/voreiabeer/", tel: "2321099949", type: "micro", area: "macedonia", beers: "6", mapUrl: "https://www.google.gr/maps/place/SIRIS+MICROBREWERY+E.E./@41.0845604,23.6175281,17z/data=!3m1!4b1!4m12!1m6!3m5!1s0x14a951544e6b926f:0x8af52ba095597e93!2sSIRIS+MICROBREWERY+E.E.!8m2!3d41.0845604!4d23.6175281!3m4!1s0x14a951544e6b926f:0x8af52ba095597e93!8m2!3d41.0845604!4d23.6175281"},
  {id: 14, name: "First Lomax Co. Ltd./First Lomax Co. Ltd.", city: "Santorini/Σαντορίνη", beerNames: "/Volkan", icon: "volkan.png", webUrl: "http://volkanbeer.com", fbUrl: "https://www.facebook.com/VolkanBeer/", tel: "2107209626", type: "client", area: "aigaio", beers: "5", mapUrl: "https://www.google.com/maps/place/First+Lomax+Sole+Shareholder+Co.+Ltd/@36.42,25.429478,17z/data=!3m1!4b1!4m5!3m4!1s0x1499cdd2010f946f:0xa391dfd88865f823!8m2!3d36.42!4d25.4316667"},
  {id: 15, name: "Thessaliki Brewery/Θεσσαλική Ζυθοποιία", city: "Chalandri, Athens/Χαλάνδρι, Αθήνα", beerNames: "/ZHTA-HTA-ΘΗΤΑ", icon: "thita-ita.png", webUrl: "http://thessaliki-beer.gr/", fbUrl: "https://www.facebook.com/ThessalikiBeer/", tel: "2106020818", type: "micro", area: "athens", beers: "5", mapUrl: "https://www.google.com/maps/place/Diogenous+8,+Chalandri+152+34/@38.0231582,23.8051994,17z/data=!3m1!4b1!4m5!3m4!1s0x14a198fc49067511:0xc2d87ea7b50f038a!8m2!3d38.0231582!4d23.8073881"},
  {id: 16, name: "Korinthiaki Zythopoiia S.A./Κορινθιακή Ζυθοποιία Α.Ε.", city: "Corinth/Κόρινθος", beerNames: "/Canal Dive", icon: "canal.png", webUrl: "http://canaldive.gr/", fbUrl: "https://www.facebook.com/CanalDiveGR/?locale2=el_GR", tel: "2741028500", type: "micro", area: "pelloponisos", beers: "2", mapUrl: "https://www.google.gr/maps/place/%CE%9A%CE%9F%CE%A1%CE%99%CE%9D%CE%98%CE%99%CE%91%CE%9A%CE%97+%CE%96%CE%A5%CE%98%CE%9F%CE%A0%CE%9F%CE%99%CE%AA%CE%91+%CE%91.%CE%95./@37.9234561,22.8710389,15z/data=!4m8!1m2!2m1!1zzprOn86hzpnOnc6YzpnOkc6azpcgzpbOpc6Yzp_OoM6fzpnOmc6R!3m4!1s0x14a011671a7e0577:0x72f53c6a9c48af1c!8m2!3d37.9234561!4d22.8797936"},
  {id: 17, name: "Grapes & Gratification IKE/Grapes & Gratification IKE", city: "Heraklion/Ηράκλειο", beerNames: "Solo/Σολο", icon: "solo.png", webUrl: "http://solobeer.gr/", fbUrl: "https://www.facebook.com/SoloYourCretanCraftBeer/", tel: "2811750209", type: "client", area: "creta", beers: "15", mapUrl: "https://www.google.com/maps/place/%CE%9F%CE%9D%CE%95WAY+car+rentals+Crete/@35.311657,25.1727411,16.22z/data=!4m5!3m4!1s0x149a594574b81ce9:0x8031146c46bc1298!8m2!3d35.3117313!4d25.1756237"},
  {id: 18, name: "Microbrewery of Vari/Μικροζυθοποιία Βάρης", city: "Vari, Attica/Βάρη Αττικής", beerNames: "Stergiou/Στεργίου", icon: "stergiou.png", webUrl: "http://mpyrastergiou.gr/", fbUrl: "https://www.facebook.com/mpyrastergiou/", tel: "6946419102", type: "micro", area: "athens", beers: "4", mapUrl: "https://www.google.com/maps/place/Triptolemou+17,+Vari+166+72/@37.8328926,23.8034262,17z/data=!4m13!1m7!3m6!1s0x14a195215ca68417:0xe16d5f4875e755ea!2sTriptolemou+17,+Vari+166+72!3b1!8m2!3d37.8328926!4d23.8056149!3m4!1s0x14a195215ca68417:0xe16d5f4875e755ea!8m2!3d37.8328926!4d23.8056149"},
  {id: 19, name: "Plastigga Microbrewery/Ζυθοποιία Πλάστιγγα", city: "Volos/Βόλος", beerNames: "Plastigga/Πλάστιγγα", icon: "plastigga.png", webUrl: "http://plastiga.gr", fbUrl: "https://www.facebook.com/plastigavolos/", tel: "2421024402", type: "micro", area: "thessalia", beers: "5", mapUrl: "https://www.google.com/maps/place/Ermou+64,+Volos+383+33/@39.3627696,22.9415707,17z/data=!4m13!1m7!3m6!1s0x14a76c65b747feef:0x96871f8c77ad610b!2sErmou+64,+Volos+383+33!3b1!8m2!3d39.3627696!4d22.9437594!3m4!1s0x14a76c65b747feef:0x96871f8c77ad610b!8m2!3d39.3627696!4d22.9437594"},
  {id: 20, name: "Sknipa Microbrewery of Thessaloniki/Sknipa Πρότυπη Μικροζυθοποιία Θεσσαλονίκης Ο.Ε.", city: "Thessaloniki/Θεσσαλονίκη", beerNames: "/Sknipa Bold,Sknipa Lady,Sknipa Salonikia,Sknipa Strong Ale", icon: "sknipa.png", webUrl: "http://sknipa.gr/", fbUrl: "https://www.facebook.com/sknipabeer/", tel: "2310463444", type: "micro", area: "macedonia", beers: "4", mapUrl: "https://www.google.gr/maps/place/SKNIPA+%CE%A0%CF%81%CF%8C%CF%84%CF%85%CF%80%CE%B7+%CE%9C%CE%B9%CE%BA%CF%81%CE%BF%CE%B6%CF%85%CE%B8%CE%BF%CF%80%CE%BF%CE%B9%CE%AF%CE%B1/@40.5280406,23.0413982,17z/data=!3m1!4b1!4m5!3m4!1s0x14a84051dd872c1d:0xfff156573db85f74!8m2!3d40.5280406!4d23.0413982"},
  {id: 21, name: "Kefalonian & Ithaca Microbrewery/Μικροζυθοποιία Κεφαλονιάς & Ιθάκης", city: "Kefalonia/Κεφαλονιά", beerNames: "/Kefalonian Beer", icon: "kefallonian.png", webUrl: "http://www.kefalonianbeer.com/", fbUrl: "https://www.facebook.com/Kefalonianbeer/", tel: "6946952951,6937870663", type: "micro", area: "ionio", beers: "1", mapUrl: "https://www.google.gr/maps/place/Kefalonian+Beer+-+%CE%9C%CE%B9%CE%BA%CF%81%CE%BF%CE%B6%CF%85%CE%B8%CE%BF%CF%80%CE%BF%CE%B9%CE%AF%CE%B1+%CE%9A%CE%B5%CF%86%CE%B1%CE%BB%CE%BF%CE%BD%CE%B9%CE%AC%CF%82+%26+%CE%99%CE%B8%CE%AC%CE%BA%CE%B7%CF%82/@38.2567968,20.6269362,17z/data=!4m12!1m6!3m5!1s0x135d8dda9155abb5:0xc645f2fd9b275254!2zS2VmYWxvbmlhbiBCZWVyIC0gzpzOuc66z4HOv862z4XOuM6_z4DOv865zq_OsSDOms61z4bOsc67zr_Ovc65zqzPgiAmIM6ZzrjOrM66zrfPgg!8m2!3d38.2567968!4d20.6269362!3m4!1s0x135d8dda9155abb5:0xc645f2fd9b275254!8m2!3d38.2567968!4d20.6269362"},
  {id: 22, name: "Ali Microbrewery/Μικροζυθοποιία Θεσσαλονίκης Ε.Π.Ε.", city: "Thessaloniki/Θεσσαλονίκη", beerNames: "/Άλη IPA,Άλη Weiss,Άλη Red Ale,Άλη Stout", icon: "ali.png", webUrl: "http://www.alibeer.gr/", fbUrl: "https://www.facebook.com/alibeerthessaloniki/", tel: "2310569939", type: "micro", area: "macedonia", beers: "4", mapUrl: "https://www.google.gr/maps/place/%CE%9C%CE%B9%CE%BA%CF%81%CE%BF%CE%B6%CF%85%CE%B8%CE%BF%CF%80%CE%BF%CE%B9%CE%AF%CE%B1+%CE%98%CE%B5%CF%83%CF%83%CE%B1%CE%BB%CE%BF%CE%BD%CE%AF%CE%BA%CE%B7%CF%82/@40.6859526,22.747106,12z/data=!4m8!1m2!2m1!1zzpzOmc6azqHOn86WzqXOmM6fzqDOn86ZzpnOkSDOmM6VzqPOo86RzpvOn86dzpnOms6XzqM!3m4!1s0x14a83ab152d46f0b:0xea139b01dc260b12!8m2!3d40.6859526!4d22.8171438"},
  {id: 23, name: "Olympos Beer/Μπύρα Olympos", city: "Katerini/Κατερίνη", beerNames: "/Olympos Beer", icon: "olymposbeer.png", webUrl: "http://olymposbeer.gr/", fbUrl: "https://www.facebook.com/olymposbeer/", tel: "2351501385 ,6978999945", type: "micro", area: "thessalia", beers: "2", mapUrl: "https://www.google.com/maps/place/Thessalonikis+106,+Katerini+601+00/@40.2786946,22.5141866,17z/data=!4m13!1m7!3m6!1s0x135802189b242f79:0x76691dfa67c1e013!2sThessalonikis+106,+Katerini+601+00!3b1!8m2!3d40.2786946!4d22.5163753!3m4!1s0x135802189b242f79:0x76691dfa67c1e013!8m2!3d40.2786946!4d22.5163753"},
  {id: 24, name: "Patraiki Brewery/Πατραική Ζυθοποιία", city: "Patra/Πάτρα", beerNames: "/ΔΙΩΝΗ ΟΡΑ", icon: "patraiki.png", webUrl: "http://www.patrabeer.gr/", fbUrl: "https://www.facebook.com/patrabeer/?ref=br_rs", tel: "2610672233", type: "micro", area: "pelloponisos", beers: "7", mapUrl: "https://www.google.gr/maps/place/PATRAIKI+ZYTHOPOIIA+P.C./@38.1751188,21.6814406,17z/data=!3m1!4b1!4m5!3m4!1s0x135e3708bb07c613:0xac4b5ce025ac326d!8m2!3d38.1751188!4d21.6814406"},
  {id: 25, name: "Epirus Microbrewery/Μικροζυθοποιία Ήπειρος", city: "Arta/Άρτα", beerNames: "Epirus/ΗΠΕΙΡΟΣ", icon: "ipiros.png", webUrl: "", fbUrl: "https://www.facebook.com/epirusmb/", tel: "", type: "micro", area: "epirus", beers: "2", mapUrl: "https://www.google.com/maps/place/Grimpovou+19,+Arta+471+00/@39.1601208,20.9808905,17z/data=!3m1!4b1!4m5!3m4!1s0x135c1b6903179839:0xe4b0fe27591a063b!8m2!3d39.1601208!4d20.9830792"},
  {id: 26, name: "Brewery of Thessaly/Ζυθοποιία Θεσσαλίας", city: "Karditsa/Καρδίτσα", beerNames: "/Στίλβη", icon: "stilvi.png", webUrl: "http://stilvibeer.gr/", fbUrl: "https://www.facebook.com/stilvibeer/", tel: "2441077601 ,6936843366", type: "micro", area: "thessalia", beers: "2", mapUrl: "https://www.google.gr/maps/place/%CE%96%CF%85%CE%B8%CE%BF%CF%80%CE%BF%CE%B9%CE%AF%CE%B1+%CE%98%CE%B5%CF%83%CF%83%CE%B1%CE%BB%CE%AF%CE%B1%CF%82+%CE%99%CE%9A%CE%95/@39.3847865,21.9164006,17z/data=!3m1!4b1!4m5!3m4!1s0x1358d93b6490ef7b:0x514730a17c833e7!8m2!3d39.3847865!4d21.9185893"},
  {id: 27, name: "Elixi S.A./Έλιξη Α.Ε.", city: "Athens/Αθήνα", beerNames: "/Delphi,Delphi D Triple Ale,Delphi Dark Ale,Marea,Marea Blonde,Marea Triple", icon: "marea.png", webUrl: "http://www.delphibeer.gr/", fbUrl: "https://www.facebook.com/DelphiBeer", tel: "2105242685,6945974381", type: "micro", area: "sterea", beers: "6", mapUrl: "https://www.google.com/maps/place/Millerou+27,+Athina+104+36/@37.9829262,23.7168576,17z/data=!3m1!4b1!4m5!3m4!1s0x14a1bd26f92bf25d:0x3962df9fbdc75349!8m2!3d37.9829262!4d23.7190463"},
  {id: 28, name: "Athineo/Μικροζυθοποιία Αθήνεο", city: "Peristeri, Athens/Περιστέρι, Αθήνα", beerNames: "/Αθήνεο", icon: "athineo.png", webUrl: "https://www.athineo.gr/", fbUrl: "https://www.facebook.com/letsbeer.gr", tel: "2105384585", type: "micro", area: "athens", beers: "8", mapUrl: "https://www.google.com/maps/place/Leof.+Kifisou+102,+Peristeri+121+32/@38.0036015,23.7051009,17z/data=!3m1!4b1!4m5!3m4!1s0x14a1a32e85ad0713:0x5b53363996664b53!8m2!3d38.0036015!4d23.7072896"},
  {id: 29, name: "Mediterranean Microbrewery Crete/Μεσογειακή Μικροζυθοποιία Κρήτης", city: "Chania/Χανιά", beerNames: "/ΛΥΡΑ", icon: "lyra.png", webUrl: "http://www.lyrabeer.com/", fbUrl: "https://www.facebook.com/LyraCretanBeer/?ref=bookmarks", tel: "2822023798", type: "micro", area: "creta", beers: "1", mapUrl: "https://www.google.gr/maps/place/LYRA+BEER+%CE%9C%CE%B5%CF%83%CE%BF%CE%B3%CE%B5%CE%B9%CE%B1%CE%BA%CE%AE+%CE%9C%CE%B9%CE%BA%CF%81%CE%BF%CE%B6%CF%85%CE%B8%CE%BF%CF%80%CE%BF%CE%B9%CF%8A%CE%B1+%CE%9A%CF%81%CE%AE%CF%84%CE%B7%CF%82/@35.4954916,23.6545257,17z/data=!3m1!4b1!4m5!3m4!1s0x149cf6b0748f4777:0xd53c409233321929!8m2!3d35.4954916!4d23.6545257"},
  {id: 30, name: "Elis Brewery/Ηλειακή Ζυθοποιία", city: "Elis/Ηλεία", beerNames: "/OLYMPICA MAGNA", icon: "magna.png", webUrl: "http://www.elisbrewery.com/", fbUrl: "https://www.facebook.com/elisbrewery/", tel: "2621069184", type: "micro", area: "pelloponisos", beers: "3", mapUrl: "https://www.google.com/maps/place/Elis+Brewery/@37.7307886,21.6164215,9.67z/data=!4m5!3m4!1s0x136096a8888f8c89:0x1ea879a6cc97ed1c!8m2!3d37.7093679!4d21.5595479"},
  {id: 31, name: "Macedonian Microbrewery/Μακεδονική Μικροζυθοποιία", city: "Doxato, Drama/Δοξάτο Δράμας", beerNames: "/JOHNNIE'S BEER", icon: "johnnies.png", webUrl: "http://johnniesbeer.gr/", fbUrl: "https://www.facebook.com/%CE%9C%CE%B1%CE%BA%CE%B5%CE%B4%CE%BF%CE%BD%CE%B9%CE%BA%CE%AE-%CE%9C%CE%B9%CE%BA%CF%81%CE%BF%CE%B6%CF%85%CE%B8%CE%BF%CF%80%CE%BF%CE%B9%CE%AF%CE%B1-897729140281738/timeline", tel: "2521069500", type: "micro", area: "macedonia", beers: "2", mapUrl: "https://www.google.gr/maps/place/%CE%9C%CE%B1%CE%BA%CE%B5%CE%B4%CE%BF%CE%BD%CE%B9%CE%BA%CE%AE+%CE%9C%CE%B9%CE%BA%CF%81%CE%BF%CE%B6%CF%85%CE%B8%CE%BF%CF%80%CE%BF%CE%B9%CE%AF%CE%B1+-+Johnnies'+Beer/@41.089483,24.224047,17z/data=!3m1!4b1!4m5!3m4!1s0x14aeabf12b3b82fd:0xc7d80e097867b6db!8m2!3d41.089483!4d24.224047"},
  {id: 32, name: "Trikalon Zythos/Τρικάλων Ζύθος", city: "Trikala/Τρίκαλα", beerNames: "/ΛΗΘΕΝΙΑ", icon: "trikalwn.png", webUrl: "http://www.trikalabeer.gr/", fbUrl: "https://www.facebook.com/trikalabeer", tel: "2431029288,6974312600", type: "micro", area: "thessalia", beers: "1", mapUrl: "https://www.google.gr/maps/place/%CE%A4%CF%81%CE%B9%CE%BA%CE%AC%CE%BB%CF%89%CE%BD+%CE%96%CF%8D%CE%B8%CE%BF%CF%82/@39.5467904,21.7739378,17z/data=!3m1!4b1!4m5!3m4!1s0x13591ed7f4afc0f5:0x1c1d8d52de1a7ea6!8m2!3d39.5467904!4d21.7739378"},
  {id: 33, name: "Paros Microbrewery - 56 Isles/Μικροζυθοποιία Πάρου", city: "Paros/Πάρος", beerNames: "/56 Isles", icon: "paros2.png", webUrl: "http://56islesbeer.gr/", fbUrl: "https://www.facebook.com/56Isles/?fref=ts", tel: "2284051102", type: "micro", area: "aigaio", beers: "3", mapUrl: "https://www.google.com/maps/place/37%C2%B006'38.3%22N+25%C2%B014'36.6%22E/@37.1106371,25.2259904,14z/data=!3m1!4b1!4m13!1m7!3m6!1s0x0:0x0!2zMzfCsDA2JzM4LjMiTiAyNcKwMTQnMzYuNiJF!3b1!8m2!3d37.11064!4d25.24349!3m4!1s0x0:0x0!8m2!3d37.11064!4d25.24349"},
  {id: 34, name: "Solar Microbrewery Xanthi/Ηλιακό Μικροζυθοποιείο Ξάνθης", city: "Xanthi/Ξάνθη", beerNames: "/Θέρος", icon: "theros.png", webUrl: "http://www.solarbeer.gr/", fbUrl: "https://www.facebook.com/profile.php?id=100012483304175", tel: "6936142935", type: "micro", area: "thrace", beers: "2", mapUrl: "https://www.google.gr/maps/place/Solar+micro+brewery+Xanthi/@41.112538,24.87042,17z/data=!3m1!4b1!4m5!3m4!1s0x14ac2ceda125ebab:0xe36f8a739f14d193!8m2!3d41.112538!4d24.87042"},
  {id: 35, name: "Folegandros Microbrewery/Μικροζυθοποιία Φολεγάνδρου", city: "Folegandros/Φολέγανδρος", beerNames: "/ΚΑΤΣΙΚΑ", icon: "katsika.png", webUrl: "http://www.folegandrosbrewery.gr/", fbUrl: "https://www.facebook.com/folegandrosbrewery/", tel: "6983711591", type: "micro", area: "aigaio", beers: "3", mapUrl: "https://www.google.com/maps/place/36%C2%B037'33.7%22N+24%C2%B055'08.2%22E/@36.626027,24.9101896,15z/data=!3m1!4b1!4m13!1m7!3m6!1s0x0:0x0!2zMzbCsDM3JzMzLjciTiAyNMKwNTUnMDguMiJF!3b1!8m2!3d36.62603!4d24.91894!3m4!1s0x0:0x0!8m2!3d36.62603!4d24.91894"},
  {id: 36, name: "Naxos Beer/Μικροζυθοποιία Νάξου", city: "Naxos/Νάξος", beerNames: "/NAXOS BEER", icon: "naxos.png", webUrl: "http://naxos.beer/", fbUrl: "https://www.facebook.com/naxosbeer", tel: "6988679806", type: "micro", area: "aigaio", beers: "3", mapUrl: "https://www.google.com/maps/place/Naxos/@37.0598888,25.3295715,11z/data=!3m1!4b1!4m13!1m7!3m6!1s0x149808a6fa0089c1:0xf47adb634b92d218!2sNaxos!3b1!8m2!3d37.1035665!4d25.3776734!3m4!1s0x149808a6fa0089c1:0xf47adb634b92d218!8m2!3d37.1035665!4d25.3776734"},
  {id: 37, name: "Epirus Brewery Ltd./Ζηθοποιία Ηπείρου", city: "Rodotopi, Ioannina/Ροδοτόπι, Ιωάννινα", beerNames: "/Στάλα Ρούσα,Στάλα Pale Ale,Στάλα Strong Ale", icon: "stala.png", webUrl: "http://www.epirusbrewery.gr/", fbUrl: "https://www.facebook.com/beer.stala", tel: "2651554933", type: "micro", area: "epirus", beers: "3", mapUrl: "https://www.google.com/maps/place/Rodotopi+455+00/@39.7075602,20.7218318,16z/data=!3m1!4b1!4m5!3m4!1s0x135bc01d612efb95:0xe93ee1fc84bcfa90!8m2!3d39.7083252!4d20.7237136"},
  {id: 38, name: "Lakoniki Brewery/Λακωνική Ζυθοποιία", city: "Lakonia/Λακωνία", beerNames: "/SPARTA", icon: "sparta.png", webUrl: "http://spartabeer.gr/", fbUrl: "https://www.facebook.com/LakonikiBrewery/", tel: "", type: "micro", area: "pelloponisos", beers: "2", mapUrl: "https://www.google.com/maps/place/Lakoniki+Brewery/@36.89304,22.5166913,17z/data=!4m13!1m7!3m6!1s0x0:0x0!2zMzbCsDUzJzM0LjkiTiAyMsKwMzEnMDguMCJF!3b1!8m2!3d36.89304!4d22.51888!3m4!1s0x0:0xb44010a0916dfe17!8m2!3d36.8930947!4d22.5184697"},
  {id: 39, name: "Samothraki Microbrewery/Μικροζυθοποιία Σαμοθράκης", city: "Samothraki/Σαμοθράκη", beerNames: "/FONIAS", icon: "samothraki.png", webUrl: "http://www.samothrakibeer.gr", fbUrl: "https://www.facebook.com/Samothrakibeer/", tel: "2551098079,6979301248", type: "micro", area: "vaigaio", beers: "1", mapUrl: "https://www.google.gr/maps/place/%CE%9C%CE%B9%CE%BA%CF%81%CE%BF%CE%B6%CF%85%CE%B8%CE%BF%CF%80%CE%BF%CE%B9%CE%AF%CE%B1+%CE%A3%CE%B1%CE%BC%CE%BF%CE%B8%CF%81%CE%AC%CE%BA%CE%B7%CF%82+%2F+Samothraki+Microbrewery/@40.4732432,25.4807834,15z/data=!4m5!3m4!1s0x0:0xbafa059bd20c6718!8m2!3d40.4732432!4d25.4807834"},
  {id: 40, name: "Noctua Brewery Athens/Noctua Ζυθοποιία Αθήνας", city: "Kato Petralona, Athens/Κάτω Πετράλωνα, Αθήνα", beerNames: "/NOCTUA", icon: "noctua.png", webUrl: "http://noctua.gr/", fbUrl: "https://www.facebook.com/noctuabeer/?fref=ts", tel: "2103454484", type: "micro", area: "athens", beers: "4", mapUrl: "https://www.google.gr/maps/place/Noctua+Brewery+Athens/@37.9753188,23.7099963,17z/data=!3m1!4b1!4m5!3m4!1s0x14a1bce0d4746151:0x551e97ccd19f4fa8!8m2!3d37.9753188!4d23.7099963"},
  {id: 41, name: "KORFI Microbrewery S.A./Μικροζυθοποιία Κορφή Α.Ε.", city: "Katerini/Κατερίνη", beerNames: "/VamBeer Pilsner,VamBeer Lager", icon: "korfi.png", webUrl: "http://vambeer.gr/", fbUrl: "https://www.facebook.com/vambeerdarkside/?hc_ref=ARSyrZRlY9KakLG6B4pQhfb10mBSOw7BpOlynHnK17YKdT4Km1Is7KXBIYSL8df9FCs&fref=nf", tel: "2351091696,2351091697", type: "micro", area: "thessalia", beers: "3", mapUrl: "https://www.google.com/maps/place/Korfi+S.A./@40.2700533,22.5126179,17z/data=!3m1!4b1!4m5!3m4!1s0x1358023a4254f3d7:0x1c636a6e7e6d69f1!8m2!3d40.2700533!4d22.5148066"},
  {id: 42, name: "Mykonos Brewing Company/Μικροζυθοποιία Μυκόνου", city: "Mykonos/Μύκονος", beerNames: "/MYKONOS", icon: "mikonos.png", webUrl: "http://www.mikonu.gr/", fbUrl: "https://www.facebook.com/mikonu.beer/", tel: "2289077912", type: "micro", area: "aigaio", beers: "4", mapUrl: "https://www.google.gr/maps/place/Mykonos+Brewing+Company/@37.447288,25.344194,17z/data=!3m1!4b1!4m5!3m4!1s0x14a2bf10120d7abb:0x11b51e385bd2d1a3!8m2!3d37.447288!4d25.344194"},
  {id: 43, name: "Microbrewery of Heraklion/Πρότυπη Μικροζυθοποιία Ηρακλείου", city: "Heraklion/Ηράκλειο", beerNames: "/Nότος Gold Lager", icon: "notos.png", webUrl: "http://notosbrewery.gr/", fbUrl: "https://www.facebook.com/notosbrewery", tel: "2811117167,2811103094", type: "micro", area: "creta", beers: "1", mapUrl: "https://www.google.gr/maps/place/Notos+Brewery/@35.3294596,25.114209,17z/data=!3m1!4b1!4m5!3m4!1s0x149a59f25affe157:0x12ec492facfb3b84!8m2!3d35.3294596!4d25.114209"},
  {id: 44, name: "Microbrewery of Peloponnisos/Μικροζυθοποιία Πελοποννήσου", city: "Nemea/Νεμέα", beerNames: "/ΚΑΡΜΑ", icon: "karma.png", webUrl: "http://www.karmabeer.gr/", fbUrl: "https://www.facebook.com/Karmanemea", tel: "2746024117", type: "micro", area: "pelloponisos", beers: "4", mapUrl: "https://www.google.com/maps/place/KARMA+%CE%96%CF%85%CE%B8%CE%BF%CF%80%CE%BF%CE%B9%CE%AF%CE%B1+%CE%A0%CE%B5%CE%BB%CE%BF%CF%80%CE%BF%CE%BD%CE%BD%CE%AE%CF%83%CE%BF%CF%85/@37.823823,22.647369,12z/data=!4m5!3m4!1s0x0:0x83635b5a4748685a!8m2!3d37.819755!4d22.647712"},
  {id: 45, name: "Asylum Brewing Co./Asylum Brewing Co.", city: "Dafni, Athens/Δάφνη, Αθήνα", beerNames: "/ASYLUM", icon: "asylum.png", webUrl: "https://www.asylumbeer.gr/", fbUrl: "https://www.facebook.com/asylumbeer/", tel: "2106136700", type: "client", area: "athens", beers: "1", mapUrl: "https://www.google.gr/maps/place/Anagenniseos+1,+Imittos+172+36/@37.948907,23.7415663,17z/data=!3m1!4b1!4m13!1m7!3m6!1s0x14a1bd9e40ffeec5:0xf3c8162293b557d3!2sAnagenniseos+1,+Imittos+172+36!3b1!8m2!3d37.948907!4d23.743755!3m4!1s0x14a1bd9e40ffeec5:0xf3c8162293b557d3!8m2!3d37.948907!4d23.743755"},
  {id: 46, name: "Levante Zakynthos Beer/Μικροζυθοποιία Ζακύνθου", city: "Thessaloniki/Ζάκυνθος", beerNames: "/LEVANTE", icon: "levande.png", webUrl: "http://levante-beer.eu/", fbUrl: "https://www.facebook.com/LevanteBeersZakynthos/?fref=ts", tel: "6981189799", type: "micro", area: "ionio", beers: "4", mapUrl: "https://www.google.gr/maps/place/LEVANTE+BEERS+ZAKYNTHOS/@37.8723145,20.7307569,17z/data=!4m12!1m6!3m5!1s0x13674217779bfd77:0xb33b205f4ff8ea7!2sLEVANTE+BEERS+ZAKYNTHOS!8m2!3d37.8723145!4d20.7329456!3m4!1s0x13674217779bfd77:0xb33b205f4ff8ea7!8m2!3d37.8723145!4d20.7329456"},
  {id: 47, name: "Ikariaki Brewery/Ικαριακή Μικροζυθοποιία Μον. ΙΚΕ", city: "Ikaria/Ικαρία", beerNames: "/Ικαριώτισσα", icon: "ikariotissa.png", webUrl: "http://www.ikariotissabeer.gr/", fbUrl: "https://www.facebook.com/ikariotissa/", tel: "2274031931,6984180337,6983810130", type: "micro", area: "aigaio", beers: "1", mapUrl: "https://www.google.gr/maps/place/Icaria/@37.5998642,26.0296138,11z/data=!3m1!4b1!4m5!3m4!1s0x14bd1d88f2402c4f:0x2a22c3406064214f!8m2!3d37.5967227!4d26.1123078"},
  {id: 48, name: "Dreamer Brewing/Dreamer Brewing", city: "Thessaloniki/Βέροια", beerNames: "/Oniro", icon: "dreamer.png", webUrl: "", fbUrl: "https://www.facebook.com/dreamerbrewing/", tel: "", type: "client", area: "macedonia", beers: "1", mapUrl: "https://www.google.gr/maps/place/40%C2%B030'55.0%22N+22%C2%B012'12.9%22E/@40.51528,22.2013913,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0x0!8m2!3d40.51528!4d22.20358"},
  {id: 49, name: "Anastasiou Brewery/Ζυθοποιία Αναστασίου", city: "Chalandri, Athens/Χαλάνδρι, Αθήνα", beerNames: "/Αναστασίου", icon: "anastasiou.png", webUrl: "", fbUrl: "https://www.facebook.com/zythosanastasiou/", tel: "6940864443", type: "micro", area: "athens", beers: "6", mapUrl: "https://www.google.com/maps/place/Chaimanta+25,+Chalandri+152+34/@38.0210252,23.8000943,17.25z/data=!4m5!3m4!1s0x14a198f907fa9781:0x223462a5dbe595ba!8m2!3d38.0209768!4d23.8019962"},
  {id: 50, name: "Satyr Brews/Satyr Brews", city: "Athens/Αθήνα", beerNames: "/Satyr", icon: "satyr.png", webUrl: "http://www.satyrbrews.gr", fbUrl: "https://www.facebook.com/satyrbrewsgr", tel: "2102323645", type: "client", area: "uknown", beers: "2", mapUrl: "https://www.google.com/maps/place/36%C2%B040'26.2%22N+20%C2%B041'33.9%22E/@36.673936,20.6905653,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0x0!8m2!3d36.673936!4d20.692754"},
  {id: 51, name: "Seven Island Brewery/Ζυθοποιία Seven Island", city: "Corfu/Κέρκυρα", beerNames: "/Seven Island", icon: "seven_island.png", webUrl: "https://sevenislandbrewery.com/", fbUrl: "https://www.facebook.com/sevenislandbrewery/", tel: "6945142509", type: "client", area: "ionio", beers: "5", mapUrl: "https://www.google.com/maps/place/39%C2%B037'06.5%22N+19%C2%B054'26.8%22E/@39.61847,19.9052413,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0x0!8m2!3d39.61847!4d19.90743"},
  {id: 52, name: "Microbrewery of Thessaly/Μικροζυθοποιία Θεσσαλίας", city: "Volos/Βόλος", beerNames: "/Αργώ", icon: "argo.png", webUrl: "http://volosbeer.gr/", fbUrl: "https://www.facebook.com/volosbeer", tel: "2421306743,6948205381", type: "micro", area: "thessalia", beers: "3", mapUrl: "https://www.google.gr/maps/place/%CE%9C%CE%B9%CE%BA%CF%81%CE%BF%CE%B6%CF%85%CE%B8%CE%BF%CF%80%CE%BF%CE%B9%CE%AF%CE%B1+%CE%98%CE%B5%CF%83%CF%83%CE%B1%CE%BB%CE%AF%CE%B1%CF%82/@39.3632214,13.9696698,5z/data=!4m8!1m2!2m1!1zzrHPgc6zz4kgYmVlcg!3m4!1s0x14a76c6dc928c34b:0xae93b43a88f4cc55!8m2!3d39.3632214!4d22.9345136"},
  {id: 53, name: "Dark Crops Brewery/Ζυθοποιία Dark Crops", city: "Palaio Faliro, Athens/Παλαιό Φάληρο, Αθήνα", beerNames: "/Dark Crops", icon: "dark_crops.png", webUrl: "http://www.darkcrops.com", fbUrl: "https://www.facebook.com/darkcrops/", tel: "", type: "client", area: "athens", beers: "7", mapUrl: "https://www.google.com/maps/place/Artemidos+125,+Paleo+Faliro+175+62/@37.9264714,23.7010706,17z/data=!3m1!4b1!4m5!3m4!1s0x14a1bc2579c44adf:0xeb587fc7a1018f58!8m2!3d37.9264714!4d23.7032593"},
  {id: 54, name: "Strange Brew/Strange Brew", city: "Athens/Αθήνα", beerNames: "/Jasmine", icon: "jasmine.png", webUrl: "http://www.strangebrew.gr/", fbUrl: "https://www.facebook.com/strangebrewathens", tel: "", type: "client", area: "uknown", beers: "5", mapUrl: "https://www.google.com/maps/place/35%C2%B053'12.7%22N+21%C2%B024'42.6%22E/@35.886847,21.4096553,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0x0!8m2!3d35.886847!4d21.411844"},
  {id: 55, name: "Hoppy Caravan/Hoppy Caravan", city: "Athens/Αθήνα", beerNames: "/Hoppy Caravan", icon: "hoppy_caravan.png", webUrl: "", fbUrl: "https://www.facebook.com/Hoppy-Caravan-1659696870945806/", tel: "6944300705", type: "client", area: "uknown", beers: "2", mapUrl: "https://www.google.com/maps/place/36%C2%B027'36.7%22N+20%C2%B054'54.1%22E/@36.460183,20.9128243,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0x0!8m2!3d36.460183!4d20.915013"},
  {id: 56, name: "The Icarian Spirit Microbrewery/Μικροζυθοποία The Icarian Spirit", city: "Ikaria/Ικαρία", beerNames: "/Wings", icon: "icarian_spirit.png", webUrl: "https://untappd.com/w/the-icarian-spirit-microbrewery/345939", fbUrl: "", tel: "", type: "client", area: "aigaio", beers: "2", mapUrl: "https://www.google.gr/maps/place/37%C2%B033'39.6%22N+26%C2%B003'11.6%22E/@37.5610042,26.0510214,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0x0!8m2!3d37.5610042!4d26.0532101"},
  {id: 57, name: "Lafkas Brewery/Ζυθοποιία Λαύκας", city: "Chania/Χανιά", beerNames: "/Λευκά Όρη", icon: "lafkas.png", webUrl: "https://lafkasbrewery.com", fbUrl: "https://www.facebook.com/sharer.php?u=https%3A%2F%2Flafkasbrewery.com%2Fcontact%2F&t=Contact", tel: "6945430402,6946710018", type: "micro", area: "creta", beers: "1", mapUrl: "https://www.google.com/maps/place/Lafkas+Brewery/@35.4945808,23.9838765,17z/data=!3m1!4b1!4m5!3m4!1s0x149c8788ddc82b49:0x8ee32eaeecced606!8m2!3d35.4945808!4d23.9860652"},
  {id: 58, name: "Kirki Beer/Kirki Beer", city: "Piraeus/Πειραιάς", beerNames: "/ΠΙΚΡΗ-ΚΙΡΚΗ-ΝΙΚΗ", icon: "kirki.png", webUrl: "http://kirkibeer.gr/", fbUrl: "https://www.facebook.com/pg/pikribeer/about/?ref=page_internal", tel: "6936790303", type: "client", area: "athens", beers: "3", mapUrl: "https://www.google.com/maps/place/Koundourou+Manousou+36,+Pireas+185+33/@37.9383906,23.6554681,17z/data=!3m1!4b1!4m5!3m4!1s0x14a1bbfaa1d8bafd:0x9b02119dff455d9f!8m2!3d37.9383906!4d23.6576568"},
  {id: 59, name: "Suburban Brew Peristeri/Μπύρα Προαστίων Περιστέρι", city: "Peristeri, Athens/Περιστέρι", beerNames: "/Περιστέρι", icon: "peristeri.png", webUrl: "", fbUrl: "https://www.facebook.com/peristeribeer/", tel: "", type: "client", area: "athens", beers: "1", mapUrl: "https://www.google.gr/maps/place/Peristeri/@38.0156529,23.6571215,13z/data=!3m1!4b1!4m5!3m4!1s0x14a1a338a717f79b:0x400bd2ce2b97ab0!8m2!3d38.0176649!4d23.6859275"},
  {id: 60, name: "Piraeus Microbrewery S.A./Πειραική Μικροζυθοποιία", city: "Drapetsona/Δραπετσώνα", beerNames: "/Πειραϊκή", icon: "piraiki.png", webUrl: "http://www.piraikibeer.gr", fbUrl: "https://www.facebook.com/pg/%CE%A0%CE%95%CE%99%CE%A1%CE%91%CE%99%CE%9A%CE%97-%CE%9C%CE%A0%CE%A5%CE%A1%CE%91-135351513176852/about/?ref=page_internal", tel: "2104612294", type: "micro", area: "athens", beers: "2", mapUrl: "https://www.google.gr/maps/place/Piraeus+Microbrewery+S.A./@37.9466559,23.6230802,15z/data=!4m5!3m4!1s0x0:0x7c4110cd57d5fcaa!8m2!3d37.9466559!4d23.6230802"},
  {id: 61, name: "Midnight Circus Gypsy Brewing/Midnight Circus Gypsy Brewing", city: "Athens/Αθήνα", beerNames: "/ΑΘΗΝΑ", icon: "midnight_circus.png", webUrl: "http://www.midnightcircus.gr", fbUrl: "https://www.facebook.com/pg/MidnightCircusGypsyBrewing/about/?ref=page_internal", tel: "", type: "client", area: "athens", beers: "2", mapUrl: "https://www.google.com/maps/place/Str.+Kontouli+7,+Athina+117+42/@37.9656671,23.7245736,17z/data=!3m1!4b1!4m8!1m2!2m1!1sMidnight+Circus+Gypsy+Brewing,Str.+Kontouli+7,+Athens,+,+Greece,+11742!3m4!1s0x14a1bd1a9061c205:0xb94eed9688c01729!8m2!3d37.965667!4d23.7267626"},
  {id: 62, name: "Peinios Brewery /Ζυθοποιιία Πηνειού", city: "Larissa/Λάρισα", beerNames: "/ΛΑΡΙΣΑ", icon: "phneios.png", webUrl: "http://www.lolabeer.gr", fbUrl: "https://www.facebook.com/pg/MidnightCircusGypsyBrewing/about/?ref=page_internal", tel: "2410289076", type: "micro", area: "thessalia", beers: "1", mapUrl: "https://www.google.gr/maps/place/Paleologou+19,+Larisa+412+23/@39.6303528,22.4196001,17z/data=!3m1!4b1!4m5!3m4!1s0x135888a3c7e7626d:0x2b40bf5a36f28c9!8m2!3d39.6303528!4d22.4217888"},
  {id: 63, name: "Skopelos Brewery/Ζυθοποία Σκοπέλου", city: "Skopelos/Σκόπελος", beerNames: "/Σπείρα", icon: "spira.png", webUrl: "", fbUrl: "https://www.facebook.com/SPIRA-Skopelos-Brewers-159198968079788/", tel: "", type: "micro", area: "vaigaio", beers: "4", mapUrl: "https://www.google.com/maps/place/39%C2%B007'12.1%22N+23%C2%B043'49.1%22E/@39.12003,23.7281213,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0x0!8m2!3d39.12003!4d23.73031"},
  {id: 64, name: "Flaros Beer/Flaros Beer", city: "Athens/Αθήνα", beerNames: "/Flaros", icon: "flaros.png", webUrl: "http://flaros.beer/", fbUrl: "https://www.facebook.com/Flarosbeer/", tel: "", type: "client", area: "uknown", beers: "3", mapUrl: "https://www.google.com/maps/place/36%C2%B014'14.6%22N+21%C2%B006'13.8%22E/@36.237391,21.1016423,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0x0!8m2!3d36.237391!4d21.103831"},
  {id: 65, name: "Noble Men/Noble Men", city: "Athens/Αθήνα", beerNames: "/Noble Men Beer", icon: "nobleman.png", webUrl: "http://www.noblemenbeer.gr/", fbUrl: "https://www.facebook.com/NobleMenBeer", tel: "2121046623", type: "client", area: "athens", beers: "4", mapUrl: "https://www.google.com/maps/place/Imittou+190,+Athina+116+36/@37.9629936,23.7395906,17z/data=!3m1!4b1!4m5!3m4!1s0x14a1bd6d0346b8b9:0x2619b29a1a895d55!8m2!3d37.9629936!4d23.7417793"},
  {id: 66, name: "Unibrau Hellas/Unibrau Hellas", city: "Athens/Αθήνα", beerNames: "/Unibrau Hellas", icon: "unibrau.png", webUrl: "http://www.unibrau.gr/", fbUrl: "https://www.facebook.com/unibrau.hellas/", tel: "2106654062", type: "client", area: "athens", beers: "2", mapUrl: "https://www.google.com/maps/place/Unibr%C3%A4u/@38.0278585,23.8515193,17z/data=!3m1!4b1!4m5!3m4!1s0x14a1995e1465d091:0xb7a60f6b6b13a48f!8m2!3d38.0278585!4d23.853708"},
  {id: 67, name: "Valtinger/Valtinger", city: "Kassandreia, Chalkidiki/Κασσανδρεία, Χαλκιδική", beerNames: "/Valtinger", icon: "valtinger.png", webUrl: "", fbUrl: "https://www.facebook.com/valtinger/", tel: "6974147063", type: "client", area: "macedonia", beers: "1", mapUrl: "https://www.google.com/maps/place/40%C2%B003'00.1%22N+23%C2%B025'06.0%22E/@40.0490537,23.4132024,16z/data=!4m5!3m4!1s0x0:0x0!8m2!3d40.05004!4d23.41834"},
  {id: 68, name: "Mary Rose - O.K. Athens/Mary Rose - O.K. Athens", city: "Piraeus/Πειραιάς", beerNames: "/Mary Rose", icon: "maryrose.png", webUrl: "http://www.okathens.gr/", fbUrl: "", tel: "2109883361", type: "client", area: "athens", beers: "1", mapUrl: "https://www.google.com/maps/place/O.K.+Athens+Ltd/@37.9259131,23.6889071,17z/data=!4m12!1m6!3m5!1s0x14a1bc21ccbc905f:0x73b7cc7039631a11!2sO.K.+Athens+Ltd!8m2!3d37.9259131!4d23.6910958!3m4!1s0x14a1bc21ccbc905f:0x73b7cc7039631a11!8m2!3d37.9259131!4d23.6910958"},

]
const areas = [
  {id: 'thrace', pre:"στη ", name: "Θράκη", icon: "area.png", latLng: "41.131851, 25.797940"},
  {id: 'macedonia', pre:"στη ", name: "Μακεδονία", icon: "area.png", latLng: "41.253268,23.591787"},
  {id: 'thessalia', pre:"στη ", name: "Θεσσαλία", icon: "area.png", latLng: "40.153343,22.385824",},
  {id: 'epirus', pre:"στην ", name: "Ήπειρος", icon: "area.png", latLng: "39.876058,20.461153"},
  {id: 'sterea', pre:"στη ", name: "Στερεά Ελλάδα", icon: "area.png", latLng: "38.5985686,22.101383"},
  {id: 'athens', pre:"στην ", name: "Αθήνα", icon: "area.png", latLng: "37.980171,23.726358"},
  {id: 'pelloponisos', pre:"στην ", name: "Πελοπόννησος", icon: "area.png", latLng: "37.854451,21.994998"},
  {id: 'creta', pre:"στην ", name: "Κρήτη", icon: "area.png", latLng: "35.229659,24.856523"},
  {id: 'ionio', pre:"στο ", name: "Ιόνιο", icon: "area.png", latLng: "38.814173,19.956799"},
  {id: 'aigaio', pre:"στο ", name: "Αιγαίο", icon: "area.png", latLng: "37.432107,25.553888"},
  {id: 'vaigaio', pre:"στο ", name: "Βόρειο Αιγαίο", icon: "area.png", latLng: "39.733846,25.087455"},
  {id: 'dodekanisa', pre:"στο ", name: "Δωδεκάνησα", icon: "area.png", latLng: "36.239398,28.003570"},
  {id: 'uknown', pre:"στο ", name: "Άγνωστη τοποθεσία", icon: "area.png", latLng: "36.524706,20.894167"},
];
