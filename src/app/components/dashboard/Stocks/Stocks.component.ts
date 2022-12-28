import { Component, OnInit } from '@angular/core';
import { budget, weeklyVisitors } from './dashboardChartData03';

@Component({
  selector: 'app-Stocks',
  templateUrl: './Stocks.component.html',
  styleUrls: ['./Stocks.component.scss']
})
export class StocksComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public budget = budget;
  public weeklyVisitors = weeklyVisitors;
}
