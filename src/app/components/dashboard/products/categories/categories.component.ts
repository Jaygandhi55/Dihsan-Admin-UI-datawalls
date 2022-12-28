import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { filter, switchMap, take } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { CategoryFieldMappingComponent } from './category-field-mapping/category-field-mapping.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  spinner = true;
  pagination_data = null;
  access:any = null;
  page = 1;
  public rows:Array<any> = [];
  public columns:Array<any> = [
    {title: 'Category Name', name: 'name'},
    {title: 'Path Level', name: 'categoryPath'},
  ];
  public actionHtml:Array<any> = [
  ];
  bsModalRef?: BsModalRef;

  public data:any = null;
  @ViewChild('tableData') tableData: any;

  constructor(private productService: ProductService,
    private toster: ToastrService,
    private cdr: ChangeDetectorRef,
    private modalService: BsModalService) {}

  ngOnInit(): void {
    let userDetails = JSON.parse(localStorage.getItem('user') || '{}');
    this.access = userDetails.access_rights['Products'].submenu['Categories'].access;
    if (this.access.write) {
      this.actionHtml = [
        { title: 'Dihsan Field', class: 'fe fe-file-plus', parentClass:'btn btn-info-light' }
      ]
    } else if (this.access.read) {
      this.actionHtml = [
        { title: 'Dihsan Field', class: 'fe fe-file-plus', parentClass:'btn btn-info-light' }
      ]
    }
    this.getCategoryList();
  }

  getCategoryList() {
    this.spinner = true;
    this.productService.getCategoryList(this.page).subscribe({
      next: (res) => {
        this.data = null;
        this.pagination_data = null;
        this.cdr.detectChanges();
        this.pagination_data = res.pagination_data;
        this.data = this.flatten(res.data);
      },
      error: (err) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
      }
    }).add(() => {
      this.spinner = false;
    });
  }

  flatten(arr: any) {

    let flatArray: any = [];
  
    function pushLoop(a: any) {
      var len = a.length;
      var i=0;
      for (i; i < len; i++) {
        a[i]['categoryPath'] = a[i].path.name.join(' -> ');
        flatArray.push(a[i]);
        if (a[i] && a[i].children.length) {
          pushLoop(a[i].children);
        }
      }
    }
  
    pushLoop(arr);
    return flatArray;
  }

  ngAfterViewInit() {

  }

  searchParams: any = {};
  params: any = {}
  commonSearch(evt: any) {
    this.params = {};
    this.page = 1;
    if (evt.length == 0) {
      this.searchParams = {};
      this.getCategoryList();
    } else {
      this.searchParams = {
        search: evt,
        page: this.page
      }
      this.getSearchCategoryList();
    }
  }

  getSearchCategoryList() {
    this.spinner = true;
    this.productService.getCategorySearchList(this.searchParams).pipe(
      switchMap(() => this.productService.getCategorySearchList(this.searchParams))
    ).subscribe({
      next: (res) => {
        // this.data = [];
        // this.pagination_data = null;
        // this.cdr.detectChanges();
        this.pagination_data = res.pagination_data;
        this.data = this.flatten(res.data);
        this.tableData.detectChange();
      },
      error: (err) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
      }
    }).add(() => {
      this.spinner = false;
    });
  }

  pageChange(evt: any) {
    this.page = evt.page;
    this.getCategoryList();
  }

  actionEvent(evt: any) {
    if (evt.actionName == 'Dihsan Field') {
      this.updateMapping(evt.row);
    }
  }

  updateMapping(row: any) {
    const initialState: ModalOptions = {
      initialState: {
        list: [
          row
        ],
        title: 'Category Field Mappings',
        actionName: 'update_mapping'
      },
      backdrop : 'static',
      keyboard : false
    };
    this.bsModalRef = this.modalService.show(CategoryFieldMappingComponent, initialState);
    this.bsModalRef.setClass('modal-lg category-mapping');
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.submitBtnName = 'Update';
    this.modalService.onHide.pipe(take(1), filter(reason => reason === 'Success')).subscribe(() => {
      this.getCategoryList();
    });
  }

}
