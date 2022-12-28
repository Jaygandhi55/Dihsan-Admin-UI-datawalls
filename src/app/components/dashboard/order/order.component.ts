import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';
import { AdditionalDataComponent } from './additional-data/additional-data.component';
import { UpdateOrderComponent } from './update-order/update-order.component';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  bsModalRef?: BsModalRef;
  spinner = true;
  page = 1;
  pagination_data = null;
  public rows: Array<any> = [];
  public columns: Array<any> = [
  ];
  public actionHtml: Array<any> = [];

  public data:any = null;
  access:any = null;

  constructor(private productService: ProductService,
    private toster: ToastrService,
    private modalService: BsModalService,
    private cdr: ChangeDetectorRef,
    private userService: UserService) { }

  ngOnInit(): void {
    let userDetails = JSON.parse(localStorage.getItem('user') || '{}');
    this.access = userDetails.access_rights['Orders'].access;
    if (this.access.write) {
      this.actionHtml = [
        { title: 'Update Order', class: 'fe fe-edit', parentClass:'btn btn-info-light' },
        { title: 'Additional Data', class: 'fe fe-file-plus', parentClass:'btn btn-dark-light' }
      ]
    } else if (this.access.read) {
      this.actionHtml = [
        { title: 'Update Order', class: 'fe fe-edit', parentClass:'btn btn-info-light' },
        { title: 'Additional Data', class: 'fe fe-file-plus', parentClass:'btn btn-dark-light' }
      ]
    }
    this.columns = [
      { title: 'Order Id', name: 'order_id' },
      { title: 'Supplier Name', name: 'supplierName' },
      { title: 'Designer Name', name: 'designerName' }
    ];
    this.getOrders();
  }

  getOrders() {
    this.spinner = true;
    this.productService.getOrderList(this.page).subscribe({
      next: (res: any) => {
        this.data = null;
        this.pagination_data = null;
        this.cdr.detectChanges();
        this.pagination_data = res.pagination_data;
        res.data.forEach((node: any) => {
          node['supplierName'] = node.supplier ? node.supplier.name : '';
          node['designerName'] = node.designer ? node.designer.name : '';
          
          node.fields.forEach((element: any) => {
            if (this.columns.find((col: any) => col.name == element.field)) {
              if (element.is_json == false) {
                node[element.field] = element.value;
              }
            } else {
              if (element.is_json == false) {
                this.columns.push({ title: element.field.split('_').join(' '), name: element.field });
                node[element.field] = element.value;
              }
            }
          });
        })
        this.data = res.data;
      },
      error: (err: any) => {
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
    this.getOrders();
  }

  actionEvent(evt: any) {
    if (evt.actionName === 'Additional Data') {
      this.fieldMapping(evt.row)
    } else if (evt.actionName === 'Update Order') {
      this.updateOrder(evt.row)
    }
  }

  fieldMapping(row: any) {
    const initialState: ModalOptions = {
      initialState: {
        list: [
          row
        ],
        title: 'Additional Data',
        actionName: 'additional_data'
      },
      backdrop : 'static',
      keyboard : false
    };
    this.bsModalRef = this.modalService.show(AdditionalDataComponent, initialState);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.submitBtnName = 'Update';
  }

  updateOrder(row: any) {
    const initialState: ModalOptions = {
      initialState: {
        list: [
          row
        ],
        title: 'Update Order',
        actionName: 'update_order'
      },
      backdrop : 'static',
      keyboard : false
    };
    this.bsModalRef = this.modalService.show(UpdateOrderComponent, initialState);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.submitBtnName = 'Update';
    this.bsModalRef?.content.notifyParent.subscribe((result: any)=>{

      this.data.forEach((node: any, index: any) => {
        if (node.id === result.result.id) {
          this.data.splice(index, 1, result.result);
        }
      });
      
      this.data.forEach((node: any, index: any) => {
        if (node.id === result.result.id) {
          
          node['supplierName'] = node.supplier ? node.supplier.name : '';
          node['designerName'] = node.designer ? node.designer.name : '';
          
          node.fields.forEach((element: any) => {
            if (this.columns.find((col: any) => col.name == element.field)) {
              if (element.is_json == false) {
                node[element.field] = element.value;
              }
            } else {
              if (element.is_json == false) {
                this.columns.push({ title: element.field.split('_').join(' '), name: element.field });
                node[element.field] = element.value;
              }
            }
          });
        }
        this.cdr.detectChanges();
      });
    })
  }

}
