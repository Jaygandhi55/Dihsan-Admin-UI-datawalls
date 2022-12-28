import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-access',
  templateUrl: './no-access.component.html',
  styleUrls: ['./no-access.component.scss']
})
export class NoAccessComponent implements OnInit {
  route: string = localStorage.getItem('route') || '/dashboard/overview';
  constructor() { }

  ngOnInit(): void {
  }

}
