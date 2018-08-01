import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BrewsInfoPage } from './brews-info';

@NgModule({
  declarations: [
    BrewsInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(BrewsInfoPage),
  ],
})
export class BrewsInfoPageModule {}
