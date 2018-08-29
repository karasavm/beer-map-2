import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IntroPage } from './intro';
import {ZXingScannerModule} from "@zxing/ngx-scanner";

@NgModule({
  declarations: [
    IntroPage,
  ],
  imports: [
    ZXingScannerModule,
    IonicPageModule.forChild(IntroPage),
  ],
})
export class IntroPageModule {}
