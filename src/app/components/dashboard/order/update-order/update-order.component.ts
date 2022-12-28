import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/services/product.service';
import 'brace';
import 'brace/mode/json';
import 'brace/theme/eclipse';

@Component({
  selector: 'app-update-order',
  templateUrl: './update-order.component.html',
  styleUrls: ['./update-order.component.scss']
})
export class UpdateOrderComponent implements OnInit {

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
  orderId = '';
  supplierId = '';
  designerId = '';
  supplierList:any = [];
  designerList:any = [];
  labelList:any = [];
  additionaData:any = null;
  @ViewChildren('attributes') attributes: any;
  @Output() notifyParent = new EventEmitter();

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
    this.additionaData = [];
    this.orderId = this.list[0].order_id;
    this.list[0].fields.forEach((element: any) => {
      if (element.is_json) {
        this.additionaData.push({label: element.field, data: element.value});
      } else {
        this.addField(element.field, element.value);
        this.labelList.push(element.field);
      }
    });
    this.getSupplierList(1);
    this.getDesignerList(1);
  }

  ngAfterViewInit() {
    this.attributes.forEach((element: any, i: any) => {
      element.text = JSON.stringify(this.additionaData[i].data, null, 4);
    });
  }

  newFiled(fieldName: any, fieldValue: any): FormGroup {
    let form = this.fb.group({});
      form.addControl(fieldName, new FormControl(fieldValue));
      return form;
  }

  addField(fieldName: any, fieldValue: any) {
    this.fields().push(this.newFiled(fieldName, fieldValue));
  }

  fields() : FormArray {
    return this.fieldForm.get("field") as FormArray
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
          this.fieldForm.controls['supplier'].patchValue(this.list[0].supplier ? this.list[0].supplier.name : null);
          this.supplierId = this.list[0].supplier ? this.list[0].supplier.id : '';
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
      }
    }).add(()=>{
      this.spinner = false;
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
          this.fieldForm.controls['designer'].patchValue(this.list[0].designer ? this.list[0].designer.name : null);
          this.designerId = this.list[0].designer ? this.list[0].designer.id : '';
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
      }
    }).add(()=>{
      this.spinner = false;
    });
  }
  
  changeSupplier(evt: any) {
    this.supplierId = evt;
  }

  changeDesigner(evt: any) {
    this.designerId = evt;
  }

  updateOrder() {
    this.spinner = true;
    let req:any = {
      "supplier": this.supplierId,
      "designer": this.designerId
    }

    this.additionaData.forEach((element: any, i: any) => {
      req[element.label] = this.attributes._results[i].text;
    });

    this.fields().value.forEach((elem: any) => {
      req = Object.assign({}, req, elem);
    });

    this.productService.updateOrderDetail(this.list[0].id, req).subscribe({
      next: (res: any) => {
        this.bsModalRef.hide();
        this.notifyParent.emit({result:res.data, action:'updateOrder'});
      },
      error: (err: any) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
        this.toster.error('', 'Error', { timeOut: 3000 });
      }
    }).add(() => {
      this.spinner = false;
    })

  }
  
}