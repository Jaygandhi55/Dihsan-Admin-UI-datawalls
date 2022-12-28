import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartsRoutingModule } from './charts-routing.module';
import { ApexChartsComponent } from './apex-charts/apex-charts.component';
import { EChartsComponent } from './echarts/echarts.component';
import { ChartjsComponent } from './chartjs/chartjs.component';
import { ChartlistComponent } from './chartlist/chartlist.component';

import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxEchartsModule } from 'ngx-echarts';
import { ChartistModule } from 'ng-chartist';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ApexChartsComponent,
    EChartsComponent,
    ChartjsComponent,
    ChartlistComponent
  ],
  imports: [
    CommonModule,
    ChartsRoutingModule,
    SharedModule,
    NgApexchartsModule,
    NgChartsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    ChartistModule,
    FormsModule, ReactiveFormsModule
  ],
})
export class ChartsModule { }
