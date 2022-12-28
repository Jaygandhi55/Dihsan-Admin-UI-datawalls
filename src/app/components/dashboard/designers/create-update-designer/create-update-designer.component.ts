import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-update-designer',
  templateUrl: './create-update-designer.component.html',
  styleUrls: ['./create-update-designer.component.scss']
})
export class CreateUpdateDesignerComponent implements OnInit {
  title?: string;
  closeBtnName?: string;
  submitBtnName?: string;
  list: any[] = [];
  endpointID = '';
  spinner = false;
  actionName?= '';
  text:string = "";
  endpointList: any = null;

  designerForm: FormGroup;

  constructor(public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private fb: FormBuilder, public userService: UserService,
    private toster: ToastrService,
    private productService: ProductService) {
      this.designerForm = this.fb.group({
        designerName: ['', Validators.required],
        websiteId: ['', Validators.required]
      });
    }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    if (this.list[0]) {
      this.designerForm.controls['designerName'].patchValue(this.list[0].name);
      this.designerForm.controls['websiteId'].patchValue(this.list[0].website_id);
    }
  }

  changeResource(evt: any) {
    this.endpointID = evt;
  }

  createUpdateDesigner() {
    if (this.actionName === 'update_designer') {
      this.updateDesigner()
    } else {
      this.createDesigner()
    }
  }

  createDesigner() {
    this.spinner = true;
    const req = {
      "name": this.designerForm.value.designerName,
      website_id: this.designerForm.value.websiteId
    }

    this.productService.createDesigner(req).subscribe({
      next: (res) => {
        this.toster.success('Designer created successfully', 'Success', { timeOut: 3000 });
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

  updateDesigner() {
    this.spinner = true;
    const req = {
      "name": this.designerForm.value.designerName,
      website_id: this.designerForm.value.websiteId
    }

    this.productService.updateDesigner(req, this.list[0].id).subscribe({
      next: (res: any) => {
        this.toster.success('Designer updated successfully', 'Success', { timeOut: 3000 });
        this.modalService.setDismissReason('Success');
        this.bsModalRef.hide();
      },
      error: (err: any) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
      }
    }).add(() => {
      this.spinner = false;
    });
  }

}
