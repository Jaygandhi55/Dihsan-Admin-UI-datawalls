import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

  route: string = localStorage.getItem('route') || '/dashboard/overview';
  constructor() { }

  ngOnInit(): void {
  }

}
