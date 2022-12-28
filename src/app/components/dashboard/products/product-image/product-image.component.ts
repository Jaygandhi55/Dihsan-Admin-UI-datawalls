import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-product-image',
  templateUrl: './product-image.component.html',
  styleUrls: ['./product-image.component.scss']
})
export class ProductImageComponent implements OnInit {

  title?: string;
  closeBtnName?: string;
  submitBtnName?: string;
  list: any[] = [];
  endpointID = '';
  spinner = false;
  actionName?= '';
  text:string = "";
  endpointList: any = null;
  images: any = null;

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.images = this.list[0].images;
  }

}
