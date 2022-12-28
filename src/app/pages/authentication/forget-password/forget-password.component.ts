import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  route: string = localStorage.getItem('route') || '/dashboard/overview';

  constructor() { }

  ngOnInit(): void {
  }
}
