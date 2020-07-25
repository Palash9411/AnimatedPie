import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PieChartComponent } from './pieChartComponent/pie-chart/pie-chart.component';
import { pieChartService } from './pieChartComponent/pie-chart/piechart.service';
import { ChangePiefunctionalityComponent } from './leftComponent/change-piefunctionality/change-piefunctionality.component';
import { commonService } from './commonShare.service';
@NgModule({
  declarations: [
    AppComponent,
    PieChartComponent,
    ChangePiefunctionalityComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [pieChartService,commonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
