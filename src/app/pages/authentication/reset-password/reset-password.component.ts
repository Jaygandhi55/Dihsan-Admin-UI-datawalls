import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  route: string = localStorage.getItem('route') || '/dashboard/overview';

  constructor() { }

  ngOnInit(): void {
  }
}
