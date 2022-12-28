import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { filter, take } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { CreateUpdateEndpointComponent } from './create-update-endpoint/create-update-endpoint.component';

@Component({
  selector: 'app-endpoints',
  templateUrl: './endpoints.component.html',
  styleUrls: ['./endpoints.component.scss']
})
export class EndpointsComponent implements OnInit {
  bsModalRef?: BsModalRef;
  spinner = true;
  pagination_data = null;
  page = 1;
  public rows:Array<any> = [];
  access:any = null;
  public columns:Array<any> = [
    {title: 'Supplier', name: 'supplierName'},
    {title: 'Endpoints', name: 'endpoint'},
    {title: 'Version', name: 'version'},
    {title: 'Attributes', name: 'attributes'},
    {title: 'Headers', name: 'headers'}
  ];
  public actionHtml:Array<any> = [
    { title: 'Update Endpoint', class: 'fe fe-edit' },
    { title: 'Sync Endpoint', class: 'fe fe-refresh-cw' }
  ];

  public data:any = null;

  constructor(private productService: ProductService,
    private toster: ToastrService,
    private modalService: BsModalService,
    private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    let userDetails = JSON.parse(localStorage.getItem('user') || '{}');
    this.access = userDetails.access_rights['API Configurations'].submenu.Endpoints.access;
    if (this.access.write) {
      this.actionHtml = [
        { title: 'Update Endpoint', class: 'fe fe-edit', parentClass:'btn btn-success-light' },
        { title: 'Sync Endpoint', class: 'fe fe-refresh-cw', parentClass:'btn btn-info-light' }
      ]
    } else if (this.access.read) {
      this.actionHtml = [
      ]
    }
    this.getEndPoints();
  }

  getEndPoints() {
    this.spinner = true;
    this.productService.getEndPointList(this.page).subscribe({
      next: (res: any) => {
        this.data = null;
        this.pagination_data = null;
        this.cdr.detectChanges();
        this.pagination_data = res.pagination_data;
        res.data.forEach((node: any) => {
          node['supplierName'] = node.supplier.name;
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
    this.getEndPoints();
  }

  actionEvent(evt: any) {
    if (evt.action === 'createEndPoint') {
      this.createEndpoint();
    } else {
      // this.onActionClick(evt);
      if (evt.actionName == 'Update Endpoint') {
        this.updateEndpoint(evt.row);
      } else {
        this.syncEndpoint(evt.row);
      }
    }
  }

  createEndpoint() {
    const initialState: ModalOptions = {
      initialState: {
        list: [
        ],
        title: 'Create Endpoint',
        actionName: 'create_endpoint'
      },
      backdrop : 'static',
      keyboard : false
    };
    this.bsModalRef = this.modalService.show(CreateUpdateEndpointComponent, initialState);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.submitBtnName = 'Create Endpoint';
    this.modalService.onHide.pipe(take(1), filter(reason => reason === 'Success')).subscribe(() => {
      this.getEndPoints();
    });
  }

  updateEndpoint(row: any) {
    const initialState: ModalOptions = {
      initialState: {
        list: [
          row
        ],
        title: 'Update Endpoint',
        actionName: 'update_endpoint'
      },
      backdrop : 'static',
      keyboard : false
    };
    this.bsModalRef = this.modalService.show(CreateUpdateEndpointComponent, initialState);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.submitBtnName = 'Update Endpoint';
    this.modalService.onHide.pipe(take(1), filter(reason => reason === 'Success')).subscribe(() => {
      this.getEndPoints();
    });
  }

  syncEndpoint(row: any) {
    this.spinner = true;
    const req = {
      "api_endpoint": row.id
    }
    this.productService.syncEndPoint(req).subscribe({
      next: (res: any) => {
        this.toster.success('Endpoint synced successfully', 'Success', { timeOut: 3000 });
        this.getEndPoints();
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
