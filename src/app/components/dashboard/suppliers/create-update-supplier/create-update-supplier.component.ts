import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-update-supplier',
  templateUrl: './create-update-supplier.component.html',
  styleUrls: ['./create-update-supplier.component.scss']
})
export class CreateUpdateSupplierComponent implements OnInit {
  title?: string;
  closeBtnName?: string;
  submitBtnName?: string;
  list: any[] = [];
  endpointID = '';
  spinner = false;
  actionName?= '';
  text:string = "";
  endpointList: any = null;

  supplierForm: FormGroup;

  constructor(public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private fb: FormBuilder, public userService: UserService,
    private toster: ToastrService,
    private productService: ProductService) {
      this.supplierForm = this.fb.group({
        supplierName: ['', Validators.required],
        active: [true, []]
      });
    }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    if (this.list[0]) {
      this.supplierForm.controls['active'].setValue(this.list[0].is_active);
      this.supplierForm.controls['supplierName'].patchValue(this.list[0].name);
    } else {
      this.supplierForm.controls['active'].clearValidators();
    }
  }

  changeResource(evt: any) {
    this.endpointID = evt;
  }

  createUpdateSupplier() {
    if (this.actionName === 'update_supplier') {
      this.updateSupplier()
    } else {
      this.createSupplier()
    }
  }

  createSupplier() {
    this.spinner = true;
    const req = {
      "name": this.supplierForm.value.supplierName
    }

    this.productService.createSupplier(req).subscribe({
      next: (res) => {
        this.toster.success('Supplier created successfully', 'Success', { timeOut: 3000 });
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

  updateSupplier() {
    this.spinner = true;
    const req = {
      "name": this.supplierForm.value.supplierName,
      "is_active": this.supplierForm.value.active
    }

    this.productService.updateSupplier(req, this.list[0].id).subscribe({
      next: (res) => {
        this.toster.success('Supplier updated successfully', 'Success', { timeOut: 3000 });
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

}
