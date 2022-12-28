import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { filter, take } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';
import { CreateUpdateResourceComponent } from './create-update-resource/create-update-resource.component';
import { UpdateFieldComponent } from './update-field/update-field.component';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {
  bsModalRef?: BsModalRef;
  spinner = true;
  page = 1;
  pagination_data = null;
  public rows: Array<any> = [];
  public columns: Array<any> = [
    { title: 'Endpoint', name: 'endpointName' },
    { title: 'API Type', name: 'api_type' },
    { title: 'Resource', name: 'resource' },
    { title: 'Method', name: 'method' },
    { title: 'Content Type', name: 'content_type' },
    { title: 'keywords', name: 'keywords' },
    { title: 'Attributes', name: 'attributes' },
    { title: 'Headers', name: 'headers' },
    { title: 'Dihsan Website', name: 'dihsanWeb' }
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
    this.access = userDetails.access_rights['API Configurations'].submenu.Resources.access;
    if (this.access.write) {
      this.actionHtml = [
        { title: 'Update Resource', class: 'fe fe-edit', parentClass:'btn btn-info-light' },
        { title: 'Update Field', class: 'fe fe-file-text', parentClass:'btn btn-success-light' },
        { title: 'Sync Resource', class: 'fe fe-refresh-cw', parentClass:'btn btn-warning-light' },
        { title: 'Sample Response', class: 'fe fe-file-plus', parentClass:'btn btn-dark-light' }
      ]
    } else if (this.access.read) {
      this.actionHtml = [
        { title: 'Show Field', class: 'fe fe-file-text', parentClass:'btn btn-success-light' },
        { title: 'Sample Response', class: 'fe fe-file-plus', parentClass:'btn btn-dark-light' }
      ]
    }
    this.getResurces();
  }

  getResurces() {
    this.spinner = true;
    this.productService.getResourceList(this.page).subscribe({
      next: (res: any) => {
        this.data = null;
        this.pagination_data = null;
        this.cdr.detectChanges();
        this.pagination_data = res.pagination_data;
        res.data.forEach((node: any) => {
          node['endpointName'] = node.endpoint.endpoint;
          node['headers'] = node.headers ? node.headers : '';
          node['attributes'] = node.attributes ? node.attributes : '';
          node['dihsanWeb'] = node.dihsan_website ? `<i class="ion ion-ios-checkmark-circle success"></i>` : `<i class="error ion ion-ios-close-circle"></i>`;
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
    this.getResurces();
  }

  actionEvent(evt: any) {
    if (evt.action === 'createResource') {
      this.createResource();
    } else {
      // this.onActionClick(evt);
      if (evt.actionName == 'Update Resource') {
        this.updateResource(evt.row);
      } else if (evt.actionName == 'Update Field') {
        this.updateField(evt.row);
      } else if(evt.actionName == 'Show Field') {
        this.showField(evt.row);
      } else if(evt.actionName == 'Sync Resource'){
        this.syncResource(evt.row);
      } else if(evt.actionName == 'Sample Response') {
        this.sampleResponse(evt.row);
      }
    }
  }

  createResource() {
    const initialState: ModalOptions = {
      initialState: {
        list: [
        ],
        title: 'Create Resource',
        actionName: 'create_resource'
      },
      backdrop : 'static',
      keyboard : false
    };
    this.bsModalRef = this.modalService.show(CreateUpdateResourceComponent, initialState);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.submitBtnName = 'Create Resource';
    this.modalService.onHide.pipe(take(1), filter(reason => reason === 'Success')).subscribe(() => {
      this.getResurces();
    });
  }

  updateResource(row: any) {
    const initialState: ModalOptions = {
      initialState: {
        list: [
          row
        ],
        title: 'Update Resource',
        actionName: 'update_resource'
      },
      backdrop : 'static',
      keyboard : false
    };
    this.bsModalRef = this.modalService.show(CreateUpdateResourceComponent, initialState);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.submitBtnName = 'Update Resource';
    this.modalService.onHide.pipe(take(1), filter(reason => reason === 'Success')).subscribe(() => {
      this.getResurces();
    });
  }

  syncResource(row: any) {
    this.spinner = true;
    const req = {
      "api_resource": row.id
    }
    this.productService.syncResouce(req).subscribe({
      next: (res: any) => {
        this.toster.success('Resouce synced successfully', 'Success', { timeOut: 3000 });
        this.getResurces();
      },
      error: (err: any) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
      }
    }).add(() => {
      this.spinner = false;
    })
  }

  updateField(row: any) {
    const initialState: ModalOptions = {
      initialState: {
        list: [
          row
        ],
        title: 'Update Field',
        actionName: 'update_field'
      },
      backdrop : 'static',
      keyboard : false
    };
    this.bsModalRef = this.modalService.show(UpdateFieldComponent, initialState);
    this.bsModalRef.setClass('modal-lg');
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.submitBtnName = 'Update Field';
    this.modalService.onHide.pipe(take(1), filter(reason => reason === 'Success')).subscribe(() => {
      this.getResurces();
    });
  }

  showField(row: any) {
    const initialState: ModalOptions = {
      initialState: {
        list: [
          row
        ],
        title: 'Show Field',
        actionName: 'show_field'
      },
      backdrop : 'static',
      keyboard : false
    };
    this.bsModalRef = this.modalService.show(UpdateFieldComponent, initialState);
    this.bsModalRef.setClass('modal-lg');
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.submitBtnName = 'Show Field';
    this.modalService.onHide.pipe(take(1), filter(reason => reason === 'Success')).subscribe(() => {
      this.getResurces();
    });
  }
  
  sampleResponse(row: any) {
    const initialState: ModalOptions = {
      initialState: {
        list: [
          row
        ],
        title: 'Sample Response',
        actionName: 'sample_response'
      },
      backdrop : 'static',
      keyboard : false
    };
    this.bsModalRef = this.modalService.show(UpdateFieldComponent, initialState);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.submitBtnName = 'Sample Response';
    this.modalService.onHide.pipe(take(1), filter(reason => reason === 'Success')).subscribe(() => {
      this.getResurces();
    });
  }
}
