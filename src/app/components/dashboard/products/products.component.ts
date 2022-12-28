import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as JSZip from 'jszip';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { filter, forkJoin, Subscription, switchMap, take } from 'rxjs';
import { Roles } from 'src/app/constants/role.constant';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';
import { AssignToComponent } from './assign-to/assign-to.component';
import { FieldMappingComponent } from './field-mapping/field-mapping.component';
import { ProductImageUploadComponent } from './product-image-upload/product-image-upload.component';
import { ProductImageComponent } from './product-image/product-image.component';
import { ProductSizeComponent } from './product-size/product-size.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {

  bsModalRef?: BsModalRef;
  spinner = true;
  pagination_data = null;
  page = 1;
  public rows:Array<any> = [];
  access:any = null;
  productIDList: any = [];
  supplierList: any = [];
  designerList: any = [];
  categoryList: any = [];
  subCategoryList: any = [];
  mediaTeamList: any = [];
  contentTeamList: any = [];
  userDetails: any = null;
  roles = Roles;
  @ViewChild('tableData') tableData: any;
  public columns:Array<any> = [
    {title: 'Product Image', name: 'sample_image'},
    {title: 'Product ID', name: 'product_id', filtering: {type: 'text', filterString: '', placeholder: 'Filter by Product ID'}},
    {title: 'Supplier', name: 'supplierName', filtering: {type: 'drop', filterString: '', placeholder: 'Filter by Supplier Name'}},
    {title: 'Designer', name: 'designerName', filtering: {type: 'drop', filterString: '', placeholder: 'Filter by Designer Name'}},
    {title: 'Category', name: 'categoryName', filtering: {type: 'drop', multiSelect: true, filterString: '', placeholder: 'Filter by Category Name'}},
    // {title: 'Subcategory', name: 'subcategoryName', filtering: {type: 'drop', filterString: '', placeholder: 'Filter by Sub Category Name'}},
    {title: 'Name', name: 'productName'},
    {title: 'Price', name: 'special_price', sort: null},
    {title: 'Stock', name: 'qty'},
    {title: 'Color', name: 'colorList'},
    {title: 'Media Team Member', name: 'media_assign', filtering: {type: 'drop', filterString: '', placeholder: 'Filter by Media Assign'}},
    {title: 'Content Team Member', name: 'content_assign', filtering: {type: 'drop', filterString: '', placeholder: 'Filter by Content Assign'}},
    {title: 'Status', name: 'product_status', filtering: {type: 'drop', filterString: '', placeholder: 'Filter by Content Assign'}}
  ];
  // filtering: {filterString: '', placeholder: 'Filter by Product ID'}
  public actionHtml:Array<any> = [
  ];

  public data:any = null;

  constructor(private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private modalService: BsModalService,
    private toster: ToastrService,
    private router: Router,
    private userService: UserService,
    private http: HttpClient) {}

  ngOnInit(): void {
    this.userDetails = JSON.parse(localStorage.getItem('user') || '{}');
    this.access = this.userDetails.access_rights['Products'].submenu['All Products'].access;
    this.accessAction();
    this.accessColumn();

    this.getFilterList(1);
    this.getProductList();
  }

  accessAction() {
    if (this.userDetails.role.name == Roles.ROLE_MEDIA_TEAM) {
      this.actionHtml = [
        { title: 'View Images', class: 'fe fe-image', parentClass: 'btn btn-secondary-light' },
      ]
    } else if (this.userDetails.role.name == Roles.ROLE_DATA_TEAM) {
      this.actionHtml = [
        { title: 'View Sizes', class: 'fe fe-server', parentClass: 'btn btn-success-light' },
        { title: 'View Images', class: 'fe fe-image', parentClass: 'btn btn-secondary-light' },
        { title: 'View Other Data', class: 'fe fe-list', parentClass: 'btn btn-dark-light' }
      ]
    } else if (this.access.read || this.access.write) {
      this.actionHtml = [
        { title: 'View Sizes', class: 'fe fe-server', parentClass: 'btn btn-success-light' },
        { title: 'View Images', class: 'fe fe-image', parentClass: 'btn btn-secondary-light' },
        { title: 'View Other Data', class: 'fe fe-list', parentClass: 'btn btn-dark-light' }
      ]
    } else {
      this.router.navigate(['/dashboard/no-access']);
    }
  }

  accessColumn() {
    if (this.userDetails.role.name == Roles.ROLE_MEDIA_TEAM) {
      this.columns = this.columns.filter((node)=> {
        return node.name !== 'designerName' && node.name !== 'supplierName' && node.name !== 'special_price' && node.name !== 'qty' && node.name !== 'content_assign';
      })
    } else if (this.userDetails.role.name == Roles.ROLE_DATA_TEAM) {
      this.columns = this.columns.filter((node)=> {
        return node.name !== 'supplierName' && node.name !== 'special_price' && node.name !== 'qty' && node.name !== 'media_assign';
      })
    }
  }

  getProductList(pageChange?:any) {
    this.spinner = true;
    this.productService.getProductList(this.page).subscribe({
      next: (res: any) => {
        this.data = [];
        this.pagination_data = res.pagination_data;
        this.cdr.detectChanges();
        res = this.getNewData(res);
        res.data.forEach((element: any) => {
          this.data.push(element);
        });
        this.tableData.detectChange();
      },
      error: (err: any) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
      }
    }).add(()=>{
      if(pageChange) {
        this.spinner = false;
      }
    });
  }

  async getFilterList(page: any) {
    this.columns.forEach((node) => {
      if (node.name === 'product_status') {
        node.filtering['list'] = [
          {id: 'draft', text: 'Draft'},
          {id: 'in_review', text: 'In Review'},
          {id: 'live_ready', text: 'Live Ready'},
          {id: 'live', text: 'Live'}
        ]
      }
    });
    this.getSupplierList(page);
    this.getDesignerList(page);
    this.getCategoryList(page);
    if (this.userDetails.role.name !== Roles.ROLE_MEDIA_TEAM && this.userDetails.role.name !== Roles.ROLE_DATA_TEAM) {
      this.getMediaTeam(page);
      this.getContentTeam(page);
    }
    // this.getSubCategoryList(page);
  }

  // getProductIdList(page: any) {
  //   this.spinner = true;
  //   this.productService.getProductList(page).subscribe({
  //     next: (res: any) => {
  //       res.data.forEach((node: any) => {
  //         this.productIDList.push({id: node.product_id, text: node.product_id});
  //       });
  //       if (res.pagination_data.next_page_number){
  //         this.getProductIdList(res.pagination_data.next_page_number)
  //       } else {
  //         this.columns.forEach((node) => {
  //           if (node.name === 'product_id') {
  //             node.filtering['list'] = this.productIDList;
  //           }
  //         });
  //         this.spinner = false;
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
          this.columns.forEach((node) => {
            if (node.name === 'supplierName') {
              node.filtering['list'] = this.supplierList;
            }
          });
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
          this.columns.forEach((node) => {
            if (node.name === 'designerName') {
              node.filtering['list'] = this.designerList;
            }
          });
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
          this.columns.forEach((node) => {
            if (node.name === 'categoryName') {
              node.filtering['list'] = this.categoryList;
            }
          });
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

  getSubCategoryList(page: any) {
    this.spinner = true;
    this.productService.getSubCategoryList(page).subscribe({
      next: (res: any) => {
        res.data.forEach((node: any) => {
          this.subCategoryList.push({id: node.id, text: node.name});
        });
        if (res.pagination_data.next_page_number){
          this.getSubCategoryList(res.pagination_data.next_page_number)
        } else {
          this.columns.forEach((node) => {
            if (node.name === 'subcategoryName') {
              node.filtering['list'] = this.subCategoryList;
            }
          });
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

  getMediaTeam(page: any) {
    this.spinner = true;
    this.userService.getUsersListRoleBase(Roles.ROLE_MEDIA_TEAM).subscribe({
      next: (res: any) => {
        res.data.forEach((node: any) => {
          this.mediaTeamList.push({id: node.id, text: `${node.first_name} ${node.last_name}`});
        });
        this.columns.forEach((node) => {
          if (node.name === 'media_assign') {
            node.filtering['list'] = this.mediaTeamList;
          }
        });
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
      }
    }).add(()=>{
      
    });
  }

  getContentTeam(page: any) {
    this.spinner = true;
    this.userService.getUsersListRoleBase(Roles.ROLE_DATA_TEAM).subscribe({
      next: (res: any) => {
        res.data.forEach((node: any) => {
          this.contentTeamList.push({id: node.id, text: `${node.first_name} ${node.last_name}`});
        });
        this.columns.forEach((node) => {
          if (node.name === 'content_assign') {
            node.filtering['list'] = this.contentTeamList;
          }
        });
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
      }
    }).add(()=>{
      
    });
  }

  actionEvent(evt: any) {
    if (evt.actionName == 'View Sizes') {
      this.openSizeModal(evt.row);
    } else if(evt.actionName == 'View Images') {
      this.openImageModal(evt.row);
    } else if(evt.actionName == 'View Other Data') {
      const userD = JSON.parse(localStorage.getItem('user') || '{}');
      (evt.row.is_content_locked == false && (userD.id == evt.row.content_unlocked_by.id || evt.row.content_unlocked_by.role.name == Roles.ROLE_ADMIN)) ? this.fieldMapping(evt.row) : this.viewOtherData(evt.row);
    } else if (evt.actionName == 'in_review' || evt.actionName == 'live_ready' || evt.actionName == 'draft') {
      this.updateStatus(evt.row, evt.actionName);
    }
  }
  pageChange(evt: any) {
    this.page = evt.page;
    if (Object.keys(this.params).length > 1) {
      this.params['page'] = this.page;
      this.getFilterProductList();
    } else if (Object.keys(this.searchParams).length > 1) {
      this.searchParams['page'] = this.page;
      this.searchFilterProductList();
    }else{
      this.getProductList(true);
    }
    this.tableData.ngTable.selection.clear();
  }

  openSizeModal(row: any) {
    const initialState: ModalOptions = {
      initialState: {
        list: [
          row
        ],
        title: 'Product Size',
        actionName: 'product_size'
      },
      backdrop : 'static',
      keyboard : false
    };
    this.bsModalRef = this.modalService.show(ProductSizeComponent, initialState);
    this.bsModalRef.content.closeBtnName = 'Close';
    // this.parentNotify();
  }

  openImageModal(row: any) {
    const initialState: ModalOptions = {
      initialState: {
        list: [
          row
        ],
        title: 'Product Image',
        actionName: 'product_image'
      },
      backdrop : 'static',
      keyboard : false
    };
    this.bsModalRef = this.modalService.show(ProductImageUploadComponent, initialState);
    this.bsModalRef.setClass('modal-lg image-modal');
    this.bsModalRef.content.closeBtnName = 'Close';
    this.parentNotify('image');
  }

  viewOtherData(row: any) {
    const initialState: ModalOptions = {
      initialState: {
        list: [
          row
        ],
        title: 'Product Detail',
        actionName: 'product_detail'
      },
      backdrop : 'static',
      keyboard : false
    };
    this.bsModalRef = this.modalService.show(ProductSizeComponent, initialState);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.parentNotify('content');
  }

  fieldMapping(row: any) {
    const initialState: ModalOptions = {
      initialState: {
        list: [
          row
        ],
        title: 'Product Details Mapping',
        actionName: 'product_detail'
      },
      backdrop : 'static',
      keyboard : false
    };
    this.bsModalRef = this.modalService.show(FieldMappingComponent, initialState);
    this.bsModalRef.setClass('modal-lg');
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.submitBtnName = 'Update';
    this.parentNotify('fieldMap');
  }

  assign() {
    const initialState: ModalOptions = {
      initialState: {
        list: [
          this.tableData.ngTable.selection.selected,
          this.params
        ],
        title: 'Assign',
        actionName: 'assign_to'
      },
      backdrop : 'static',
      keyboard : false
    };
    this.bsModalRef = this.modalService.show(AssignToComponent, initialState);
    // this.bsModalRef.setClass('modal-lg');
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.submitBtnName = 'Submit';
    // this.parentNotify('fieldMap');
    this.modalService.onHide.pipe(take(1), filter(reason => reason === 'Success')).subscribe(() => {
      this.params = {};
      this.tableData.ngTable.selection.clear();
      this.data = null;
      this.getProductList(true);
    });
  }

  parentNotify(message: any) {
    this.bsModalRef?.content.notifyParent.subscribe((result: any)=>{
      let action = '';
      if (result.action == 'updateContent'){
        action = result.action;
        result = result.result;
      }
      this.data.forEach((element: any, index: any) => {
        if (element.id == result.id) {
          result = this.getTableData(result);
          this.data.splice(index, 1, result);
          this.cdr.detectChanges();
          setTimeout(() => {
            switch (message) {
              case 'image':
                this.openImageModal(result);
                break;
              case 'content':
                this.fieldMapping(result);
                break;
              case 'fieldMap':
                action == '' ? this.viewOtherData(result) : null;
                break;       
              default:
                break;
            }
          }, 200);
        }
      });
    })
  }

  syncAll() {
    this.spinner = true;
    this.productService.syncAll().subscribe({
      next: (res: any) => {
        this.toster.success(res.message, 'Success', { timeOut: 3000 })
      },
      error: (err: any) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
      }
    }).add(() => {
      this.spinner = false;
      this.getProductList(true);
    });
  }
  params: any = {}
  getFilterData(evt: any){
    evt.product_id ? this.params['product_id'] = evt.product_id : delete this.params['product_id'];
    evt.supplierName ? this.params['supplier'] = evt.supplierName : delete this.params['supplier'];
    evt.designerName ? this.params['designer'] = evt.designerName : delete this.params['designer'];
    evt.categoryName ? this.params['category'] = evt.categoryName : delete this.params['category'];
    evt.subcategoryName ? this.params['subcategory'] = evt.subcategoryName : delete this.params['subcategory'];
    evt.media_assign ? this.params['media_assigned_to'] = evt.media_assign : delete this.params['media_assigned_to'];
    evt.content_assign ? this.params['content_assigned_to'] = evt.content_assign : delete this.params['content_assigned_to'];
    evt.product_status ? this.params['status'] = evt.product_status : delete this.params['status'];

    this.page = 1;
    this.searchParams = {};
    this.params['page'] = this.page;
    this.getFilterProductList();
    this.tableData.ngTable.selection.clear();
  }


  getFilterProductList() {
    this.spinner = true;
    this.productService.getFilterProductList(this.params).subscribe({
      next: (res: any) => {
        this.data = [];
        this.tableData.showFilter = false;
        this.pagination_data = res.pagination_data;
        this.cdr.detectChanges();
        res = this.getNewData(res);
        res.data.forEach((element: any) => {
          this.data.push(element);
        });
        this.tableData.showFilter = true;
        this.tableData.detectChange();
      },
      error: (err: any) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
      }
    }).add(()=>{
      this.spinner = false;
    });
  }

  searchParams: any = {};
  commonSearch(evt: any) {
    this.params = {};
    this.page = 1;
    if (evt.length == 0) {
      this.searchParams = {};
      this.getProductList(true);
    } else {
      this.searchParams = {
        search: evt,
        page: this.page
      }
      this.searchFilterProductList();
    }
    this.tableData.ngTable.selection.clear();
  }
  
  searchFilterProductList() {
    this.spinner = true;
    this.productService.getFilterProductList(this.searchParams).pipe(
      switchMap(() => this.productService.getFilterProductList(this.searchParams))
    ).subscribe({
      next: (res: any) => {
        this.data = [];
        this.pagination_data = res.pagination_data;
        this.tableData.showSearch = false;
        this.cdr.detectChanges();
        res = this.getNewData(res);
        res.data.forEach((element: any) => {
          this.data.push(element);
        });
        this.tableData.showSearch = true;
        this.tableData.detectChange();
      },
      error: (err: any) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
      }
    }).add(()=>{
      this.spinner = false;
    });
  }

  updateStatus(row: any, actionName: any) {
    this.spinner = true;
    const req = {
      status: actionName
    };
    
    this.productService.patchFieldMap(req, row.id).subscribe({
      next: (res: any) => {
        this.data.forEach((element: any, index: any) => {
          if (element.id == res.data.id) {
            let result = this.getTableData(res.data);
            this.data.splice(index, 1, result);
            this.cdr.detectChanges();
          }
        });   
      },
      error: (err: any) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
      }
    }).add(() => {
      this.spinner = false;
    });
  }
  
  getNewData(res: any) {
    res.data.forEach((node: any) => {
      node = this.getTableData(node);
    });
    return res;
  }

  getTableData(node: any) {
    node['supplierName'] = node.supplier ? node.supplier.name : '';
      node['designerName'] = node.designer ? node.designer.name : '';
      node['categoryName'] = '';
      if (node.category && node.category[0]) {
        node.category.forEach((element: any, i: any) => {
          node['categoryName'] = node['categoryName'] ? node['categoryName'] + ' -> ' + element.name : node['categoryName'] + element.name;
        });
      }
      node['subcategoryName'] = node.subcategory ? node.subcategory.name : '';
      node['productName'] = node.fields ? node.fields.find((field: any) => field.field === 'name').value : '';
      node['colorList'] = '';
      node.color ? node.color.forEach((element:any) => {
        if (node['colorList'] == ''){
          node['colorList'] = `${element.color ? element.color.name : ''} ${element.secondary_color ? element.secondary_color.name : ''}`;
        } else {
          node['colorList'] = node['colorList'] + `, ${element.color ? element.color.name : ''} ${element.secondary_color ? element.secondary_color.name : ''}`;
        }
      }): null;
      node['special_price'] = node.price && node.price[0] ? node.price[0].special_price : '';
      node['maxPrice'] = node.price && node.price[0] ? node.price[0].price : '';
      node['currency'] = node.price && node.price[0] ? node.price[0].currency : '';
      node['qty'] = node.stocks && node.stocks[0] ? node.stocks[0].qty : '';
      node['media_assign'] = node.media_assigned_to ? `${node.media_assigned_to.first_name} ${node.media_assigned_to.last_name}` : '';
      node['content_assign'] = node.content_assigned_to ? `${node.content_assigned_to.first_name} ${node.content_assigned_to.last_name}` : '';
      node['sample_image'] = node.images && node.images[0] ? node.images[0].image_url : '';
      node['product_status'] = node.status;
      return node;
  }

  isEmptyObject(obj: any) {
    return (obj && ((Object.keys(obj).length === 0) || (Object.keys(obj).length === 1 && obj.page)));
  }

  downloadAllImage() {
    this.spinner = true;
    const commonZip = new JSZip();
    if (this.tableData.ngTable.selection.selected.length && this.tableData.ngTable.selection.selected.length !== this.tableData.itemsPerPage) {
      this.tableData.ngTable.selection.selected.forEach((element: any, index: any) => {
        
        const req = this.createGetRequets(element.images);
        let getReq: any = req.getReq;
        let imageUrls: any = req.imageUrl;
        
        forkJoin(...getReq).subscribe((res: any) => {
          const zip = new JSZip();
          let fileName: String;
    
          res.forEach((f: any, i: any) => {
            fileName = imageUrls[i].split('/')[imageUrls[i].split('/').length - 1]; // extract filename from the response
            zip.file(`${fileName}`, f); // use it as name, this way we don't need the file type anymore
          });
    
          zip.generateAsync({ type: "blob" })
            .then(blob => commonZip.file(`${element.productName.split(' ').join('_')}_${index + 1}.zip`, blob));
          
        }, (err: any) => {
    
        }).add(() => {
          if (this.tableData.ngTable.selection.selected.length == (index + 1)) {           
            setTimeout(() => {
              this.spinner = false;
              commonZip
              .generateAsync({ type: "blob" })
              .then(blob => saveAs(blob, `Images.zip`));
            }, 2500);
          }
        });
      });
    } else {
      this.productService.getFilterProductListForDownloadImages(this.params).subscribe((res) => {
        res.data.forEach((element: any, index: any) => {
          element['productName'] = element.fields ? element.fields.find((field: any) => field.field === 'name').value : '';
          const req = this.createGetRequets(element.images);
          let getReq: any = req.getReq;
          let imageUrls: any = req.imageUrl;
  
          forkJoin(...getReq).subscribe((res: any) => {
            const zip = new JSZip();
            let fileName: String;
      
            res.forEach((f: any, i: any) => {
              fileName = imageUrls[i].split('/')[imageUrls[i].split('/').length - 1]; // extract filename from the response
              zip.file(`${fileName}`, f); // use it as name, this way we don't need the file type anymore
            });
      
            zip.generateAsync({ type: "blob" })
              .then(blob => {
                commonZip.file(`${element.productName.split(' ').join('_')}_${index + 1}.zip`, blob);     
              });
          }, (err: any) => {
      
          }).add(() => {
            if (res.data.length == (index + 1)) {
              setTimeout(() => {
              this.spinner = false;
              commonZip
                .generateAsync({ type: "blob" })
                .then(blob => saveAs(blob, `Images.zip`));
              }, res.data.length * 60);
            }
          });
        });
      }, err => {

      });
    }
  }
  
  createGetRequets(images: any) {
    let getReq: any = [];
    let imageUrl: any = [];
    images.forEach((data: any) => {
      if (data.image_url) {
        imageUrl.push(data.image_url);
        getReq.push(
          this.http.get(data.image_url, { responseType: 'blob' })
        )
      }
    });
    const req = {
      getReq: getReq,
      imageUrl: imageUrl
    }
    return req;
  }

}