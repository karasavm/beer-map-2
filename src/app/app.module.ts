import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {BrewsListPage} from "../pages/brews-list/brews-list";
import {BrewsInfoPage} from "../pages/brews-info/brews-info";
import {DataService} from "../services/data.service";
import {HttpClientModule} from "@angular/common/http";
import {BrewsListPageModule} from "../pages/brews-list/brews-list.module";
import {BrewsInfoPageModule} from "../pages/brews-info/brews-info.module";

@NgModule({
  declarations: [
    MyApp,
    // HomePage
  ],
  imports: [


    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
    // IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    // HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataService
  ]
})
export class AppModule {}
