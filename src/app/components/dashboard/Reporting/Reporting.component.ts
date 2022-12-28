import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { chartOptions, weeklyVisitors } from './dashboardChartData';

@Component({
  selector: 'app-Reporting',
  templateUrl: './Reporting.component.html',
  styleUrls: ['./Reporting.component.scss']
})
export class ReportingComponent implements OnInit {
  constructor(public userService: UserService) { }

  ngOnInit(): void {
    let light: any = document.querySelector('.color-primary-light');
  }

  public chartOptions = chartOptions;
  public weeklyVisitors = weeklyVisitors;

}
