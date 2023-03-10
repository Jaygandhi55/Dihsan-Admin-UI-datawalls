import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/firebase/auth.service';

@Component({
  selector: 'app-resister',
  templateUrl: './resister.component.html',
  styleUrls: ['./resister.component.scss']
})
export class ResisterComponent implements OnInit {

  route: string = localStorage.getItem('route') || '/dashboard/overview';

  constructor(public authService: AuthService ) { }

  ngOnInit(): void {
  }

}
