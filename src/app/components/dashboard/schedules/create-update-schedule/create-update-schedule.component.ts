import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-update-schedule',
  templateUrl: './create-update-schedule.component.html',
  styleUrls: ['./create-update-schedule.component.scss']
})
export class CreateUpdateScheduleComponent implements OnInit {

  title?: string;
  closeBtnName?: string;
  submitBtnName?: string;
  list: any[] = [];
  resourceID = '';
  endpointId = '';
  apiTypeId = '';
  spinner = true;
  actionName?= '';
  text:string = "";
  resourceList: any = [];
  unitList: any = [
    "seconds",
    "minutes",
    "hours",
    "days",
    "weeks"
  ]
  apiTypeList: any = ["PRODUCT","STOCK","ORDER","PRICE"];
  endpointList: any = [];

  scheduleForm: FormGroup;

  constructor(public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private fb: FormBuilder, public userService: UserService,
    private toster: ToastrService,
    private productService: ProductService) {

      this.scheduleForm = this.fb.group({
        resource: [null, Validators.required],
        duration: ['', Validators.required],
        unit: [null, Validators.required],
        endpoint: [null],
        apiType: [null]
      });
    }

  ngOnInit(): void {
   
  }

  ngAfterViewInit() {
    this.getResourceList(1);
    this.getEndPointList(1);
  }

  getResourceList(page: any) {
    this.productService.getResourceList(page).subscribe({
      next: (res) => {
        res.data.forEach((element: any) => {
          this.resourceList.push(element);
        });
        if (res.pagination_data.next_page_number) {
          this.getResourceList(res.pagination_data.next_page_number);
        }

        if (this.list[0]) {
          let selected = this.list[0];
          this.scheduleForm.controls['unit'].patchValue(selected.unit);
          this.scheduleForm.controls['duration'].patchValue(selected.duration);
          this.scheduleForm.controls['resource'].patchValue(selected.resource.resource);
          this.resourceID = selected.resource.id;
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

  getEndPointList(page: any) {
    this.productService.getEndPointList(page).subscribe({
      next: (res) => {
        res.data.forEach((element: any) => {
          this.endpointList.push(element);
        });
        if (res.pagination_data.next_page_number) {
          this.getEndPointList(res.pagination_data.next_page_number);
        }

        if (this.list[0]) {
          let selected = this.list[0];
          this.scheduleForm.controls['endpoint'].patchValue(selected.resource.endpoint.endpoint);
          this.scheduleForm.controls['apiType'].patchValue(selected.resource.api_type);
          this.endpointId = selected.resource.endpoint.id;
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

  changeResource(evt: any) {
    this.resourceID = evt;
  }

  changeEndpoint(evt: any) {
    this.endpointId = evt;
    this.scheduleForm.controls['resource'].patchValue(null);
    this.resourceList = [];
    if (this.endpointId && this.apiTypeId) {
      this.getFilterResourceList(1);
    }
  }

  changeAPIType(evt: any) {
    this.apiTypeId = evt;
    this.scheduleForm.controls['resource'].patchValue(null);
    this.resourceList = [];
    if (this.endpointId && this.apiTypeId) {
      this.getFilterResourceList(1);
    }
  }

  getFilterResourceList(page: any) {
    this.spinner = true;
    this.productService.getFilterResourceList(page, this.endpointId, this.apiTypeId).subscribe({
      next: (res) => {
        res.data.forEach((element: any) => {
          this.resourceList.push(element);
        });
        if (res.pagination_data.next_page_number) {
          this.getFilterResourceList(res.pagination_data.next_page_number);
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

  createUpdateSchedule() {
    if (this.actionName === 'update_schedule') {
      this.updateSchedule()
    } else {
      this.createSchedule()
    }
  }

  createSchedule() {
    this.spinner = true;
    const req = {
      "unit": this.scheduleForm.value.unit,
      "duration": this.scheduleForm.value.duration,
      "resource": this.resourceID
    }

    this.productService.createSchedule(req).subscribe({
      next: (res) => {
        this.toster.success('Schedule created successfully', 'Success', { timeOut: 3000 });
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

  updateSchedule() {
    this.spinner = true;
    const req = {
      "unit": this.scheduleForm.value.unit,
      "duration": this.scheduleForm.value.duration,
      "resource": this.resourceID
    }

    this.productService.updateSchedule(req, this.list[0].id).subscribe({
      next: (res) => {
        this.toster.success('Schedule updated successfully', 'Success', { timeOut: 3000 });
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
