import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/firebase/auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  route: string = localStorage.getItem('route') || '/dashboard/overview';

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

}
