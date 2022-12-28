import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import 'brace';
import 'brace/mode/json';
import 'brace/theme/eclipse';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-create-update-endpoint',
  templateUrl: './create-update-endpoint.component.html',
  styleUrls: ['./create-update-endpoint.component.scss']
})
export class CreateUpdateEndpointComponent implements OnInit {

  title?: string;
  closeBtnName?: string;
  submitBtnName?: string;
  list: any[] = [];
  supplierID = '';
  spinner = true;
  actionName?= '';
  text:string = "";
  supplierList: any = [];

  endpointForm: FormGroup;
  @ViewChild('attributes') attributes: any;
  @ViewChild('headers') headers: any;

  constructor(public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private fb: FormBuilder, public userService: UserService,
    private toster: ToastrService,
    private productService: ProductService) {

      this.endpointForm = this.fb.group({
        endpoint: ['', Validators.required],
        version: ['', Validators.required],
        supplier: [null, Validators.required],
      });
    }

  ngOnInit(): void {
   
  }

  ngAfterViewInit() {
    this.getSupplierList(1);
  }

  getSupplierList(page: any) {
    this.productService.getActiveSupplierList(page).subscribe({
      next: (res) => {
        res.data.forEach((element: any) => {
          this.supplierList.push(element);
        });
        if (res.pagination_data.next_page_number) {
          this.getSupplierList(res.pagination_data.next_page_number);
        }

        if (this.list[0]) {
          let selected = this.list[0];
          this.endpointForm.controls['endpoint'].patchValue(selected.endpoint);
          this.endpointForm.controls['version'].patchValue(selected.version);
          this.endpointForm.controls['supplier'].patchValue(selected.supplier.name);
          this.supplierID = selected.supplier.id;
          this.headers.text = selected.headers ? JSON.stringify(JSON.parse(selected.headers), null, 4) : '';
          this.attributes.text = selected.attributes ? JSON.stringify(JSON.parse(selected.attributes), null, 4) : '';
        }

      },
      error: (err) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
      }
    }).add(() => {
      this.spinner = false;
    });
  }

  onChange(evt: any) {

  }

  checkHeadersJSON() {
    console.log(this.headers);
  }

  changeSupplier(evt: any) {
    this.supplierID = evt;
  }

  createUpdateEndpoint() {
    if (this.actionName === 'update_endpoint') {
      this.updateEndpoint()
    } else {
      this.createEndpoint()
    }
  }

  createEndpoint() {
    this.spinner = true;
    const req = {
      "endpoint": this.endpointForm.value.endpoint,
      "version": this.endpointForm.value.version,
      "attributes": JSON.stringify(JSON.parse(this.attributes.text)),
      "headers": JSON.stringify(JSON.parse(this.headers.text)),
      "supplier": this.supplierID
    }

    this.productService.createEndPointList(req).subscribe({
      next: (res) => {
        this.toster.success('Endpoit created successfully', 'Success', { timeOut: 3000 });
        this.modalService.setDismissReason('Success');
        this.bsModalRef.hide();
      },
      error: (err) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
      }
    }).add(() => {
      this.spinner = false;
    });
  }

  updateEndpoint() {
    this.spinner = true;
    const req = {
      "endpoint": this.endpointForm.value.endpoint,
      "version": this.endpointForm.value.version,
      "attributes": JSON.stringify(JSON.parse(this.attributes.text)),
      "headers": JSON.stringify(JSON.parse(this.headers.text)),
      "supplier": this.supplierID
    }

    this.productService.updateEndPointList(req, this.list[0].id).subscribe({
      next: (res) => {
        this.toster.success('Endpoit updated successfully', 'Success', { timeOut: 3000 });
        this.modalService.setDismissReason('Success');
        this.bsModalRef.hide();
      },
      error: (err) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 2000 });
      }
    }).add(() => {
      this.spinner = false;
    });
  }

  isJsonString(str: any) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

}
