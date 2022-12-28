import { Component, OnInit } from '@angular/core';
import { budget, statistics2, weeklyVisitors } from './dashboardChartData02';

@Component({
  selector: 'app-Vendors',
  templateUrl: './Vendors.component.html',
  styleUrls: ['./Vendors.component.scss']
})
export class VendorsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public chartOptions = statistics2;
  public budget = budget;
  public weeklyVisitors = weeklyVisitors;
}
