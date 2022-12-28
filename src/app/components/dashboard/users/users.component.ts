import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { dataTable } from './users.json';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { CreateUpdateUserComponent } from './create-update-user/create-update-user.component';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { filter, take } from 'rxjs';
import { TableDataComponent } from '../table-data/table-data.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  bsModalRef?: BsModalRef;
  pagination_data = null;
  page = 1;
  @ViewChild('tableData') tableData: TableDataComponent;
  public rows: Array<any> = [];
  public columns: Array<any> = [
    { title: 'Name', name: 'name', sort: 'asc'},
    { title: 'Email', name: 'email' },
    { title: 'Role', name: 'roleName' },
    // { title: 'Active', name: 'active'}
  ];

  spinner = true;
  access: any = null;
  public actionHtml: any = [];

  // public config: any = {
  //   paging: true,
  //   sorting: { columns: this.columns },
  //   filtering: { filterString: '' },
  //   className: ['table-striped', 'table-bordered']
  // };

  public data:any = null;

  constructor(private cdr: ChangeDetectorRef,
    private modalService: BsModalService,
    private userService: UserService,
    private toster: ToastrService) {
  }

  public ngOnInit(): void {
    let userDetails = JSON.parse(localStorage.getItem('user') || '{}');
    this.access = userDetails.access_rights['Users'].submenu['Manage Users'].access;
    if (this.access.write) {
      this.actionHtml = [
        { title: 'Update User', class: 'fe fe-edit', parentClass:'btn btn-success-light' },
        // { title: 'Update Access', class: 'fe fe-user-check', parentClass:'btn btn-success-light' },
        { title: 'Activate/Deactivate User', class: 'si si-shield', parentClass:'btn btn-warning-light' },
        { title: 'Change Password', class: 'fe fe-lock', parentClass:'btn btn-dark-light' }
      ]
    } else if (this.access.read) {
      this.actionHtml = [
      ]
    }
  }

  ngAfterViewInit() {
    this.getUserList();
  }

  actionEvent(evt: any) {
    if (evt.action === 'createUser') {
      this.createUser();
    } else {
      this.onActionClick(evt);
    }
  }

  getUserList() {
    this.spinner = true;
    this.userService.getUsersList(this.page).subscribe({
      next: (res) => {
        res.data.forEach((role: any) => {
          role['name'] = role.first_name + ' ' + role.last_name;
          role['roleName'] = role.role.name;
          role['active'] = role.is_active ? '<span class="ion ion-ios-checkmark-circle success"></span>' : '<span class="ion ion-ios-close-circle error"></span>';
        });
        res.data.sort(this.dynamicSort('name'));
        this.data = null;
        this.pagination_data = null;
        this.cdr.detectChanges();
        this.data = res.data;
        this.pagination_data = res.pagination_data;
        setTimeout(()=>{
          this.tableData.getConfig();
        }, 200)
        //this.onChangeTable(this.config);
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
    this.getUserList();
  }

  public onActionClick(data: any) {
    if (data.actionName === 'Update User') {
      this.updateUser(data.row);
    } else if (data.actionName === 'Activate/Deactivate User') {
      this.activeDeactiveUser(data.row);
    }
    else if (data.actionName === 'Change Password') {
      this.changePassword(data.row);
    }
  }

  public activeDeactiveUser(row: any) {
    const req = {
        "first_name": row.first_name,
        "last_name": row.last_name,
        "email": row.email,
        "is_active": row.is_active ? false : true,
        "role": row.role.id
    }
    this.userService.updateUser(req, row.id).subscribe({
      next: (res) => {
        this.getUserList();
      },
      error: (err) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) : 
        this.toster.error('', 'Error', { timeOut: 3000 });
      }
    })

  }

  createUser() {
    const initialState: ModalOptions = {
      initialState: {
        list: [
        ],
        title: 'Create User',
        actionName: 'create_user'
      },
      backdrop : 'static',
      keyboard : false
    };
    this.bsModalRef = this.modalService.show(CreateUpdateUserComponent, initialState);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.submitBtnName = 'Create User';
    this.modalService.onHide.pipe(take(1), filter(reason => reason === 'Success')).subscribe(() => {
      this.getUserList();
    });
  }

  updateUser(row: any) {
    const initialState: ModalOptions = {
      initialState: {
        list: [
          row
        ],
        title: 'Update User',
        actionName: 'update_user'
      },
      backdrop : 'static',
      keyboard : false
    };
    this.bsModalRef = this.modalService.show(CreateUpdateUserComponent, initialState);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.submitBtnName = 'Update User';
    this.modalService.onHide.pipe(take(1), filter(reason => reason === 'Success')).subscribe(() => {
      this.getUserList();
    });
  }

  changePassword(row: any) {
    const initialState: ModalOptions = {
      initialState: {
        list: [
          row
        ],
        title: 'Change Password',
        actionName: 'change_pass'
      },
      backdrop : 'static',
      keyboard : false
    };
    this.bsModalRef = this.modalService.show(CreateUpdateUserComponent, initialState);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.submitBtnName = 'Change Password';
    this.modalService.onHide.pipe(take(1), filter(reason => reason === 'Success')).subscribe(() => {
      this.getUserList();
    });
  }

  dynamicSort(property: any) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a:any, b:any) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
  }
}