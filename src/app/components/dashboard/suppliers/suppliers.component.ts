import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { filter, take } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { CreateUpdateSupplierComponent } from './create-update-supplier/create-update-supplier.component';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit {
  bsModalRef?: BsModalRef;
  spinner = true;
  pagination_data = null;
  page = 1;
  access:any = null;
  public rows:Array<any> = [];
  public columns:Array<any> = [
    {title: 'Name', name: 'name'},
    {title: 'Active', name: 'active'}
  ];
  public actionHtml:Array<any> = [
  ];

  public data:any = null;

  constructor(private productService: ProductService,
    private toster: ToastrService,
    private modalService: BsModalService,
    private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    let userDetails = JSON.parse(localStorage.getItem('user') || '{}');
    this.access = userDetails.access_rights['Suppliers'].access;
    if (this.access.write) {
      this.actionHtml = [
        { title: 'Update Supplier', class: 'fe fe-edit', parentClass:'btn btn-success-light' },
        { title: 'Sync Supplier', class: 'fe fe-refresh-cw', parentClass:'btn btn-info-light' }
      ]
    } else if (this.access.read) {
      this.actionHtml = [
      ]
    }
    this.getSupplierList();
  }

  getSupplierList() {
    this.spinner = true;
    this.productService.getSupplierList(this.page).subscribe({
      next: (res) => {
        this.data = null;
        this.pagination_data = null;
        this.cdr.detectChanges();
        this.pagination_data = res.pagination_data;
        res.data.forEach((element: any) => {
          element['active'] = element.is_active ? '<span class="ion ion-ios-checkmark-circle success"></span>' : '<span class="ion ion-ios-close-circle error"></span>';
        });
        this.data = res.data;
      },
      error: (err) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
      }
    }).add(() => {
      this.spinner = false;
    });
  }

  ngAfterViewInit() {

  }

  pageChange(evt: any) {
    this.page = evt.page;
    this.getSupplierList();
  }

  actionEvent(evt: any) {
    if (evt.action === 'createSupplier') {
      this.createSupplier();
    } else {
      // this.onActionClick(evt);
      if (evt.actionName == 'Update Supplier') {
        this.updateSupplier(evt.row);
      } else {
        this.syncSupplier(evt.row);
      }
    }
  }

  createSupplier() {
    const initialState: ModalOptions = {
      initialState: {
        list: [
        ],
        title: 'Create Supplier',
        actionName: 'create_supplier'
      },
      backdrop : 'static',
      keyboard : false
    };
    this.bsModalRef = this.modalService.show(CreateUpdateSupplierComponent, initialState);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.submitBtnName = 'Create Supplier';
    this.modalService.onHide.pipe(take(1), filter(reason => reason === 'Success')).subscribe(() => {
      this.getSupplierList();
    });
  }

  updateSupplier(row: any) {
    const initialState: ModalOptions = {
      initialState: {
        list: [
          row
        ],
        title: 'Update Supplier',
        actionName: 'update_supplier'
      },
      backdrop : 'static',
      keyboard : false
    };
    this.bsModalRef = this.modalService.show(CreateUpdateSupplierComponent, initialState);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.submitBtnName = 'Update Supplier';
    this.modalService.onHide.pipe(take(1), filter(reason => reason === 'Success')).subscribe(() => {
      this.getSupplierList();
    });
  }

  syncSupplier(row: any) {
    this.spinner = true;
    const req = {
      "supplier": row.id
    }
    this.productService.syncSupplier(req).subscribe({
      next: (res: any) => {
        this.toster.success('Supplier synced successfully', 'Success', { timeOut: 3000 });
        this.getSupplierList();
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
