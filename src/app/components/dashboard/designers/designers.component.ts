import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { filter, take } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { CreateUpdateDesignerComponent } from './create-update-designer/create-update-designer.component';

@Component({
  selector: 'app-designers',
  templateUrl: './designers.component.html',
  styleUrls: ['./designers.component.scss']
})
export class DesignersComponent implements OnInit {
  bsModalRef?: BsModalRef;
  spinner = true;
  pagination_data = null;
  access:any = null;
  page = 1;
  public rows:Array<any> = [];
  public columns:Array<any> = [
    {title: 'Name', name: 'name'},
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
    this.access = userDetails.access_rights['Products'].submenu['Designers'].access;
    if (this.access.write) {
      this.actionHtml = [
        { title: 'Update Designer', class: 'fe fe-edit', parentClass:'btn btn-success-light' },
    // { title: 'Sync Designer', class: 'fe fe-refresh-cw' }
      ]
    } else if (this.access.read) {
      this.actionHtml = [
      ]
    }
    this.getDesignerList();
  }

  getDesignerList() {
    this.spinner = true;
    this.productService.getDesignerList(this.page).subscribe({
      next: (res) => {
        this.data = null;
        this.pagination_data = null;
        this.cdr.detectChanges();
        this.pagination_data = res.pagination_data;
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
    this.getDesignerList();
  }

  actionEvent(evt: any) {
    if (evt.action === 'createDesigner') {
      this.createDesigner();
    } else {
      // this.onActionClick(evt);
      if (evt.actionName == 'Update Designer') {
        this.updateDesigner(evt.row);
      } else {
        // this.syncSupplier(evt.row);
      }
    }
  }

  createDesigner() {
    const initialState: ModalOptions = {
      initialState: {
        list: [
        ],
        title: 'Create Designer',
        actionName: 'create_designer'
      },
      backdrop : 'static',
      keyboard : false
    };
    this.bsModalRef = this.modalService.show(CreateUpdateDesignerComponent, initialState);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.submitBtnName = 'Create Designer';
    this.modalService.onHide.pipe(take(1), filter(reason => reason === 'Success')).subscribe(() => {
      this.getDesignerList();
    });
  }

  updateDesigner(row: any) {
    const initialState: ModalOptions = {
      initialState: {
        list: [
          row
        ],
        title: 'Update Designer',
        actionName: 'update_designer'
      },
      backdrop : 'static',
      keyboard : false
    };
    this.bsModalRef = this.modalService.show(CreateUpdateDesignerComponent, initialState);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.submitBtnName = 'Update Designer';
    this.modalService.onHide.pipe(take(1), filter(reason => reason === 'Success')).subscribe(() => {
      this.getDesignerList();
    });
  }

}
