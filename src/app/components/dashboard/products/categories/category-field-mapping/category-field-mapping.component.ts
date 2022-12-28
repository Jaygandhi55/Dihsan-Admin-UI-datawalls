import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'app-category-field-mapping',
  templateUrl: './category-field-mapping.component.html',
  styleUrls: ['./category-field-mapping.component.scss']
})
export class CategoryFieldMappingComponent implements OnInit {

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
  dihsanFields: any;
  fieldTypeList: any = [
    "text",
    "number",
    "date",
    "time",
    "email",
    "textarea",
    "checkbox",
    "datetime-local"
  ];
  subs = new Subscription();


  constructor(public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private fb: FormBuilder, public userService: UserService,
    private toster: ToastrService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private dragulaService: DragulaService) {
      
    }

  ngOnInit(): void {
    this.filedForm = this.fb.group({
      websiteId: ['', Validators.required],
      field: this.fb.array([]) ,
    });
    if (this.list[0].id) {
      this.showFiledList(1);
    }
    this.getDihsanField();
    this.subs.add(this.dragulaService.drop('MAPPINGDRAG')
      .subscribe(({name, el, target, source, sibling}) => {
        this.orderField(target);
      })
    );
  }

  ngAfterViewInit() {
    if (this.list[0]) {
      this.filedForm.controls['websiteId'].patchValue(this.list[0].website_id);
    }
  }

  showFiledList(page: any) {
    this.spinner = true;
    this.productService.getCategoryMapping(this.list[0].id, page).subscribe({
      next: (res) => {
        if(res.pagination_data.total_count == 0) {
          this.addField();
        } else {
          res.data.forEach((element: any) => {
            this.addField(element.dihsan_field, element.meta_field, element.is_meta, element.field_data_type, element.field_mandatory, element.id, element.order);
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

  getDihsanField() {
    this.productService.getProjectConfig().subscribe({
      next: (res) => {
        this.dihsanFields = JSON.parse(res.data[0].dihsan_fields);
      },
      error: (err) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
      }
    }).add(() => {
      this.spinner = false;
    });
  }

  newFiled(dihsan_field = null, meta_field = '', is_meta = false, field_data_type = null, field_mandatory = false, id = '', order = 0): FormGroup {
    return this.fb.group({
      dihsan_field: [dihsan_field, Validators.required],
      meta_field: [meta_field, Validators.required],
      is_meta: is_meta,
      field_data_type: [field_data_type, Validators.required],
      field_mandatory: field_mandatory,
      categoryId : id,
      order: order
    })
  }

  removeField(i:number) {
    if (this.filedForm.value.field[i].categoryId) {
      this.productService.deleteCategoryMapping(this.filedForm.value.field[i].categoryId).subscribe({
        next: (res) => {
          this.fields().removeAt(i);
        },
        error: (err) => {
          err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
            this.toster.error('', 'Error', { timeOut: 3000 });
        }
      }).add(()=>{
        this.spinner = false;
      });
    } else {
      this.fields().removeAt(i);
    }
  }

  addField(dihsan_field = null, meta_field = '', is_meta = false, field_data_type = null, field_mandatory = false, id = '', order = 0) {
    this.fields().push(this.newFiled(dihsan_field, meta_field, is_meta, field_data_type, field_mandatory, id, order));
  }

  fields() : FormArray {
    return this.filedForm.get("field") as FormArray
  }

  updateField() {
    this.spinner = true;

    const req = {
      website_id: this.filedForm.value.websiteId
    }

    this.productService.updateWebID(req, this.list[0].id).subscribe({
      next: (res) => {
        let field_mappings: any = [];
        this.filedForm.value.field.forEach((element:any, index: any) => {
          field_mappings.push({
            dihsan_field: element.dihsan_field,
            meta_field: element.meta_field,
            field_data_type: element.field_data_type,
            field_mandatory: element.field_mandatory,
            category: this.list[0].id,
            order: index,
            is_meta: element.is_meta
          });
    
          if (element.categoryId) {
            field_mappings[index]['id'] = element.categoryId;
          }
        });
    
        this.productService.bulkUpdateCategoryField(field_mappings).subscribe({
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
      },
      error: (err) => {
        this.spinner = false;
      }
    });
  }

  orderField(target: any) {
    console.log(target);
    this.spinner = true;
    const req: any = [];
    target.childNodes.forEach((element: any, index: any) => {
      if (element.childNodes[0] && element.childNodes[0].children[0] && element.childNodes[0].children[0].value) {
        req.push({id: element.childNodes[0].children[0].value, order: index});
      }
    });
    this.productService.bulkUpdateCategoryField(req).subscribe({
      next: (res) => {
        this.fields().clear();
        res.data.forEach((element: any) => {
          this.addField(element.dihsan_field, element.meta_field, element.field_data_type, element.field_mandatory, element.id, element.order);
        });
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
