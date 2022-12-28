import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';
import 'brace';
import 'brace/mode/json';
import 'brace/theme/eclipse';

@Component({
  selector: 'app-update-field',
  templateUrl: './update-field.component.html',
  styleUrls: ['./update-field.component.scss']
})
export class UpdateFieldComponent implements OnInit {

  title?: string;
  closeBtnName?: string;
  submitBtnName?: string;
  list: any[] = [];
  endpointID = '';
  spinner = true;
  actionName?= '';
  text:string = "";
  endpointList: any = null;
  supplier = '';
  resource = '';
  showFields: any = [];
  filedForm: any;
  @ViewChild('response') response: any;


  constructor(public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private fb: FormBuilder, public userService: UserService,
    private toster: ToastrService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef) {
      
    }

  ngOnInit(): void {
    this.supplier = this.list[0].endpoint.supplier.name;
    this.resource = this.list[0].resource;
    if (this.actionName == 'update_field') {
      this.filedForm = this.fb.group({
        field: this.fb.array([]) ,
      });
    }
    
    if(this.actionName == 'update_field') {
      this.showFiledList(1);
    } else if(this.actionName == 'show_field') {
      this.getFieldList(1);
    }
  }

  ngAfterViewInit() {
    if (this.actionName == 'sample_response') {
      this.response.text = this.list[0].sample_response ? JSON.stringify(JSON.parse(this.list[0].sample_response), null, 4) : '';
      this.spinner = false;
    }
  }

  getFieldList(page: any) {
    this.spinner = true;
    this.showFields = [];
    this.productService.updateFiled(this.list[0].endpoint.supplier.id, this.list[0].id, page).subscribe({
      next: (res) => {
          res.data.forEach((element: any) => {
            this.showFields.push({dihsan_field: element.dihsan_field, supplier_field: element.supplier_field, meta_field: element.meta_field});
          });
          if (res.pagination_data.next_page_number) {
            this.getFieldList(res.pagination_data.next_page_number);
          }
          this.cdr.detectChanges();
      },
      error: (err) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
      }
    }).add(()=>{
      this.spinner = false;
    })
  }

  showFiledList(page: any) {
    this.spinner = true;
    this.productService.updateFiled(this.list[0].endpoint.supplier.id, this.list[0].id, page).subscribe({
      next: (res) => {
        if(res.pagination_data.total_count == 0) {
          this.addField();
        } else {
          res.data.forEach((element: any) => {
            this.addField(element.dihsan_field, element.supplier_field);
          });
          if (res.pagination_data.next_page_number) {
            this.showFiledList(res.pagination_data.next_page_number);
          }
        }
      },
      error: (err) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
      }
    }).add(()=>{
      this.spinner = false;
    })
  }

  newFiled(dihsan_field = '', supplier_field = ''): FormGroup {
    return this.fb.group({
      dihsan_field: [dihsan_field, Validators.required],
      supplier_field: [supplier_field, Validators.required],
    })
  }

  removeField(i:number) {
    this.fields().removeAt(i);
  }

  addField(dihsan_field = '', supplier_field = '') {
    this.fields().push(this.newFiled(dihsan_field, supplier_field));
  }

  fields() : FormArray {
    return this.filedForm.get("field") as FormArray
  }

  updateField() {
    this.spinner = true;
    let field_mappings: any = [];
    this.filedForm.value.field.forEach((element:any) => {
      field_mappings.push({
        dihsan_field: element.dihsan_field,
        supplier_field: element.supplier_field
      });
    });

    const req = {
      supplier: this.list[0].endpoint.supplier.id,
      resource: this.list[0].id,
      field_mappings: field_mappings
    }
    this.productService.bulkUpdateField(req).subscribe({
      next: (res) => {
        this.toster.success('Field updated successfully', 'Success', { timeOut: 3000 });
        this.modalService.setDismissReason('Success');
        this.bsModalRef.hide();
      },
      error: (err) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
      }
    }).add(()=>{
      this.spinner = false;
    });
  }

}
