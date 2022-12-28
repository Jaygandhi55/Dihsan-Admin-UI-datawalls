import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { Urls } from 'src/app/constants/url.constant';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-field-mapping',
  templateUrl: './field-mapping.component.html',
  styleUrls: ['./field-mapping.component.scss']
})
export class FieldMappingComponent implements OnInit {

 
  title?: string;
  closeBtnName?: string;
  submitBtnName?: string;
  list: any[] = [];
  endpointID = '';
  spinner = true;
  actionName?= '';
  text:string = "";
  endpointList: any = null;
  images: any = null;
  fieldForm: any;
  getRequests: any = [];
  imageUrls: any = [];
  supplierList: any = [];
  designerList: any = [];
  categoryList: any = [];
  subCategoryList: any = [];
  supplierId = '';
  designerId = '';
  categoryId: any = null;
  subCategoryId = '';
  changeIcon = false;
  fieldList: any = [];
  mandatoryList: any = [];
  labelList: any = [];
  @Output() notifyParent = new EventEmitter();
  userDetail: any = JSON.parse(localStorage.getItem('user') || '{}');  

  constructor(public bsModalRef: BsModalRef, private productService: ProductService,
    private toster: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private modalService: BsModalService) {
      this.fieldForm = this.fb.group({
        supplier: [null, Validators.required],
        designer: [null, Validators.required],
        category: [null, Validators.required],
        // subcategory: [null, Validators.required],
        field: this.fb.array([]) ,
      });
  }

  ngOnInit(): void {
    this.fieldMap(1);
  }

  newFiled(fieldName: any, fieldValue: any, required: any): FormGroup {
    let form = this.fb.group({});
    if (required){
      form.addControl(fieldName, new FormControl(fieldValue ,Validators.required));
      return form;
    } else {
      form.addControl(fieldName, new FormControl(fieldValue));
      return form;
    }
  }

  addField(fieldName: any, fieldValue: any, require: any) {
    this.fields().push(this.newFiled(fieldName, fieldValue, require));
  }

  fields() : FormArray {
    return this.fieldForm.get("field") as FormArray
  }


  fieldMap(page: any) {
    this.getSupplierList(page);
    this.getDesignerList(page);
    this.getCategoryList(page);
    // this.getSubCategoryList(page);

    if (this.list[0].category && this.list[0].category[0]) {
      this.getAllMapping(this.list[0].category[0].id);
    }
  }

  getSupplierList(page: any) {
    this.spinner = true;
    this.productService.getActiveSupplierList(page).subscribe({
      next: (res: any) => {
        res.data.forEach((node: any) => {
          this.supplierList.push({id: node.id, text: node.name});
        });
        if (res.pagination_data.next_page_number){
          this.getSupplierList(res.pagination_data.next_page_number)
        } else {
          this.fieldForm.controls['supplier'].patchValue(this.list[0].supplier.name);
          this.supplierId = this.list[0].supplier.id;
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
      }
    }).add(()=>{
      
    });
  }

  getDesignerList(page: any) {
    this.spinner = true;
    this.productService.getDesignerList(page).subscribe({
      next: (res: any) => {
        res.data.forEach((node: any) => {
          this.designerList.push({id: node.id, text: node.name});
        });
        if (res.pagination_data.next_page_number){
          this.getDesignerList(res.pagination_data.next_page_number)
        } else {
          this.fieldForm.controls['designer'].patchValue(this.list[0].designer.name);
          this.designerId = this.list[0].designer.id;
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
      }
    }).add(()=>{
      
    });
  }

  getCategoryList(page: any) {
    this.spinner = true;
    this.productService.getAllCategories(page).subscribe({
      next: (res: any) => {
        res.data.forEach((node: any) => {
          this.categoryList.push({id: node.id, text: node.name});
        });
        if (res.pagination_data.next_page_number){
          this.getCategoryList(res.pagination_data.next_page_number)
        } else {
          if (this.list[0].category && this.list[0].category[0]) {
            this.categoryId = [];
            let val: any = [];
            this.list[0].category.forEach((elem: any) => {
              this.categoryId.push(elem.id);
              val.push(elem.name)
            });
            this.fieldForm.controls['category'].patchValue(val);
            
          }
          this.spinner = false;
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
          this.spinner = false;
      }
    }).add(()=>{

    });
  }

  // getSubCategoryList(page: any) {
  //   this.spinner = true;
  //   this.productService.getSubCategoryList(page).subscribe({
  //     next: (res: any) => {
  //       res.data.forEach((node: any) => {
  //         this.subCategoryList.push({id: node.id, text: node.name});
  //       });
  //       if (res.pagination_data.next_page_number){
  //         this.getSubCategoryList(res.pagination_data.next_page_number)
  //       } else {
  //         this.fieldForm.controls['subcategory'].patchValue(this.list[0].subcategory.name);
  //         this.subCategoryId = this.list[0].subcategory.id;
  //         this.cdr.detectChanges();
  //       }
  //     },
  //     error: (err: any) => {
  //       err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
  //         this.toster.error('', 'Error', { timeOut: 3000 });
  //     }
  //   }).add(()=>{
      
  //   });
  // }

  getAllMapping(id: any, categoryChange?: any) {
    this.spinner = true;
    
    this.fieldList = [];
    this.labelList = [];
    this.fields().clear();
    let excludeData = ['price', 'size', 'category', 'subcategory', 'designer', 'supplier', 'color', 'colour'];
    this.mandatoryList = [];
    // this.list[0].fields.forEach((data: any) => {
    //     getRequests.push(this.http.get(Urls.base_url + Urls.fieldMap + `/${data.field_mapping}`));
    // });

    this.productService.getFieldMapList(id, 1000).subscribe({
      next: (res: any) => {
        res.data.forEach((element: any, index: any) => {
          if (!excludeData.find((elem: any) => element.dihsan_field.toLowerCase().indexOf(elem) > -1)) {
            this.fieldList.push(element.field_data_type);
            this.mandatoryList.push(element.field_mandatory);
            this.labelList.push(element.dihsan_field);
            const fieldVal = this.list[0].fields.find((node: any) => node.field == element.dihsan_field);
            this.addField(element.dihsan_field, fieldVal ? fieldVal.value : null, element.field_mandatory);
          }
        });
      },
      error: (err: any) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
      }
    }).add(() => {
      if (categoryChange) {
        this.spinner = false;
      }
    });
  }

  ngAfterViewInit() {
    
  }

  changeSupplier(evt: any) {
    this.supplierId = evt;
  }

  changeDesigner(evt: any) {
    this.designerId = evt;
  }

  changeCategory(evt: any) {
    this.categoryId = evt;
    if (this.categoryId && this.categoryId.length) {
      this.getAllMapping(this.categoryId, true);
    } else {
      this.fields().clear();
    }
  }

  changeSubcategory(evt: any) {
    this.subCategoryId = evt;
  }

  public Editor:any = ClassicEditor;
  public onReady(editor:any) {
    editor.ui.view.editable.element.parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.view.editable.element
    );
  }

  lockContent() {
    this.spinner = true;
    const req ={
      "is_content_locked": true
    }

    this.productService.mediaLockUnlock(this.list[0].id, req).subscribe({
      next: (res: any) => {
        this.bsModalRef.hide();
        this.notifyParent.emit(res.data);
      },
      error: (err: any) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
          this.spinner = false;
      }
    }).add(() => {
      this.spinner = false;
    });
  }

  updateFieldMapping() {
    this.spinner = true;
    let req ={
      "supplier": this.supplierId,
      "designer": this.designerId,
      "category": this.categoryId
    }
    this.fields().value.forEach((elem: any) => {
      req = Object.assign({}, req, elem);
    });

    this.productService.patchFieldMap(req, this.list[0].id).subscribe({
      next: (res: any) => {
        this.bsModalRef.hide();
        this.notifyParent.emit({result:res.data, action:'updateContent'});
      },
      error: (err: any) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
          this.spinner = false;
      }
    }).add(() => {
      this.spinner = false;
    });
    
  }
  
}