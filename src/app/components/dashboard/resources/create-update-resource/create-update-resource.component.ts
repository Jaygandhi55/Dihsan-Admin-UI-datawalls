import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';
import 'brace';
import 'brace/mode/json';
import 'brace/theme/eclipse';

const METHODS = ["GET","POST","PUT","DELETE"];
const CONTENT_TYPE = ["application/json","application/xml"];
const API_TYPE = ["PRODUCT","STOCK","ORDER","PRICE"];

@Component({
  selector: 'app-create-update-resource',
  templateUrl: './create-update-resource.component.html',
  styleUrls: ['./create-update-resource.component.scss']
})
export class CreateUpdateResourceComponent implements OnInit {

  @ViewChild('headers') headers: any;
  @ViewChild('attributes') attributes: any;
  @ViewChild('body') body: any;
  
  title?: string;
  closeBtnName?: string;
  submitBtnName?: string;
  list: any[] = [];
  endpointID = '';
  spinner = true;
  actionName?= '';
  text:string = "";
  endpointList: any = [];

  methodList = METHODS;
  content_type = CONTENT_TYPE;
  api_type = API_TYPE;

  resourceForm: FormGroup;

  constructor(public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private fb: FormBuilder, public userService: UserService,
    private toster: ToastrService,
    private productService: ProductService) {
      this.resourceForm = this.fb.group({
        resource: ['', Validators.required],
        keywords: ['', Validators.required],
        method: [null, Validators.required],
        content_type: [null, Validators.required],
        api_type: [null, Validators.required],
        endpoint: [null, Validators.required],
        multi: [false, []],
        dihsan_website: [false, []]
      });
    }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.getendPointList(1);
  }

  getendPointList(page: any) {
    this.productService.getEndPointList(page).subscribe({
      next: (res) => {
        res.data.forEach((element: any) => {
          this.endpointList.push(element);
        });
        if (res.pagination_data.next_page_number) {
          this.getendPointList(res.pagination_data.next_page_number);
        }
        if (this.list[0]) {
          const selected = this.list[0];
          this.resourceForm.controls['resource'].patchValue(selected.resource);
          this.resourceForm.controls['keywords'].patchValue(selected.keywords);
          this.resourceForm.controls['method'].patchValue(selected.method);
          this.resourceForm.controls['content_type'].patchValue(selected.content_type);
          this.resourceForm.controls['api_type'].patchValue(selected.api_type);
          this.resourceForm.controls['multi'].setValue(this.list[0].multi);
          this.resourceForm.controls['dihsan_website'].setValue(this.list[0].dihsan_website);
          this.headers.text = selected.headers ? JSON.stringify(JSON.parse(selected.headers), null, 4) : '';
          this.attributes.text = selected.attributes ? JSON.stringify(JSON.parse(selected.attributes), null, 4) : '';
          this.body.text = selected.body ? JSON.stringify(JSON.parse(selected.body), null, 4) : '';
          this.resourceForm.controls['endpoint'].patchValue(selected.endpoint.endpoint);
          this.endpointID = selected.endpoint.id;
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

  changeResource(evt: any) {
    this.endpointID = evt;
  }

  createUpdateResource() {
    if (this.actionName === 'update_resource') {
      this.updateresource()
    } else {
      this.createResource()
    }
  }

  createResource() {
    this.spinner = true;
    const req = {
      "resource": this.resourceForm.value.resource,
      "keywords": this.resourceForm.value.keywords,
      "method": this.resourceForm.value.method,
      "content_type": this.resourceForm.value.content_type,
      "api_type": this.resourceForm.value.api_type,
      "multi": this.resourceForm.value.multi,
      "dihsan_website": this.resourceForm.value.dihsan_website,
      "attributes": JSON.stringify(JSON.parse(this.attributes.text)),
      "headers": JSON.stringify(JSON.parse(this.headers.text)),
      "body": JSON.stringify(JSON.parse(this.body.text)),
      "endpoint": this.endpointID
    }

    this.productService.createResourceList(req).subscribe({
      next: (res) => {
        this.toster.success('Resource created successfully', 'Success', { timeOut: 3000 });
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

  updateresource() {
    this.spinner = true;
    const req = {
      "resource": this.resourceForm.value.resource,
      "keywords": this.resourceForm.value.keywords,
      "method": this.resourceForm.value.method,
      "content_type": this.resourceForm.value.content_type,
      "api_type": this.resourceForm.value.api_type,
      "multi": this.resourceForm.value.multi,
      "attributes": JSON.stringify(JSON.parse(this.attributes.text)),
      "headers": JSON.stringify(JSON.parse(this.headers.text)),
      "body": JSON.stringify(JSON.parse(this.body.text)),
      "endpoint": this.endpointID
    }

    this.productService.updateResourceList(req, this.list[0].id).subscribe({
      next: (res) => {
        this.toster.success('Resource updated successfully', 'Success', { timeOut: 3000 });
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

  isJsonString(str: any) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

}
