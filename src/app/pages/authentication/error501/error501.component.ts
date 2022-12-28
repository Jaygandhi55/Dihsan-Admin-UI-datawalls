import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error501',
  templateUrl: './error501.component.html',
  styleUrls: ['./error501.component.scss']
})
export class Error501Component implements OnInit {
  route: string = localStorage.getItem('route') || '/dashboard/overview';

  constructor() { }

  ngOnInit(): void {
  }

}
