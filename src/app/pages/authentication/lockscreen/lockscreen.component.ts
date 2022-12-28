import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lockscreen',
  templateUrl: './lockscreen.component.html',
  styleUrls: ['./lockscreen.component.scss']
})
export class LockscreenComponent implements OnInit {
  route: string = localStorage.getItem('route') || '/dashboard/overview';

  constructor() { }

  ngOnInit(): void {
  }
}
