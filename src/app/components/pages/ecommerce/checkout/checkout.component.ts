import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  constructor(private toaster: ToastrService) { }

  ngOnInit(): void {
  }
  public finish() {
    this.toaster.success('Successfully Done!')
  }
}
