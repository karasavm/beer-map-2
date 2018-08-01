import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BrewsListPage } from './brews-list';

@NgModule({
  declarations: [
    BrewsListPage,
  ],
  imports: [
    IonicPageModule.forChild(BrewsListPage),
  ],
})
export class BrewsListPageModule {}
