import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/services/product.service';
import 'brace';
import 'brace/mode/json';
import 'brace/theme/eclipse';


@Component({
  selector: 'app-additional-data',
  templateUrl: './additional-data.component.html',
  styleUrls: ['./additional-data.component.scss']
})
export class AdditionalDataComponent implements OnInit {

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
  fieldForm: any;
  getRequests: any = [];
  additionaData:any = null;
  @ViewChildren('attributes') attributes: any;

  constructor(public bsModalRef: BsModalRef, private productService: ProductService,
    private toster: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private modalService: BsModalService) {
      
  }

  ngOnInit(): void {
    this.additionaData = [];
    this.list[0].fields.forEach((element: any) => {
      if (element.is_json) {
        this.additionaData.push({label: element.field.split('_').join(' '), data: element.value});
      }
    });
  }

  ngAfterViewInit() {
    this.attributes.forEach((element: any, i: any) => {
      element.text = JSON.stringify(this.additionaData[i].data, null, 4);
      element.setReadOnly(true);
    });
  }
  
}