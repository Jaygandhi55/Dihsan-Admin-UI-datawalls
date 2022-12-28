import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { filter, take } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { UserService } from 'src/app/services/user.service';
import { NavService } from 'src/app/shared/services/nav.service';
import { dataTable } from './roles.json';
import { UpdateRoleComponent } from './update-role/update-role.component';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  bsModalRef?: BsModalRef;
  public rows:Array<any> = [];
  pagination_data = null;
  page = 1;
  access: any = null;
  spinner: boolean = true;
  public columns:Array<any> = [
    {title: 'Role', name: 'name'}
  ];
  
  public actionHtml: any = [
  ];
  
  public data:any = null;

  constructor(private cdr: ChangeDetectorRef,
    private userService: UserService,
    private modalService: BsModalService, private router: Router, private navService: NavService,
    private loginService: LoginService) {
  }

  public ngOnInit():void {
    let userDetails = JSON.parse(localStorage.getItem('user') || '{}');
    this.access = userDetails.access_rights['Users'].submenu['Manage Roles'].access;
    if (this.access.write) {
      this.actionHtml = [
        {title : 'Update Role', class : 'fe fe-edit', parentClass:'btn btn-success-light'},
        {title : 'Delete Role', class : 'si si-shield', parentClass:'btn btn-secondary-light'}
      ]
    } else if (this.access.read) {
      this.actionHtml = [
      ]
    } else {
      this.router.navigate(['/dashboard/no-access']);
    }
    this.getRoleList();
  }

  getRoleList() {
    this.userService.getRoleList(this.page).subscribe({
      next: (res) => {
        this.data = null;
        this.pagination_data = null;
        this.cdr.detectChanges();
        this.userService.roleList = res.data;
        this.data = this.userService.roleList;
        this.pagination_data = res.pagination_data;
      },
      error: (err) => {
        this.data = [];
      }
    }).add(() => {
      this.spinner = false;
    });
  }

  pageChange(evt: any) {
    this.page = evt.page;
    this.getRoleList();
  }

  actionEvent(evt: any) {
    if (evt.actionName === 'Update Role') {
      this.updateRole(evt.row);
    }
  }

  updateRole(row: any) {
    this.spinner = true;
    const req = {
      "role_id": row.id
    }
    this.userService.getRoleAccess(req).subscribe({
      next: (res) => {
        this.userService.roleAccessRights = res.data;
        this.openUpdateRoleModal(res.data);
      },
      error: (err) => {
        
      }
    }).add(() => {
      this.spinner = false;
    });
  }

  openUpdateRoleModal(data: any) {
    const initialState: ModalOptions = {
      initialState: {
        data,
        title: 'Update Role'
      },
      backdrop : 'static',
      keyboard : false
    };
    this.bsModalRef = this.modalService.show(UpdateRoleComponent, initialState);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.submitBtnName = 'Update Access Rights';
    this.modalService.onHide.pipe(take(1), filter(reason => reason === 'Success')).subscribe(() => {
      this.callUserDetails()
    });
  }

  callUserDetails() {
    this.spinner = true;
    const email = localStorage.getItem('email');
    const pass = this.loginService.getDecrypt(localStorage.getItem('pass'));
    this.loginService.login(email, pass).subscribe({
      next: (res) => {
        this.userService.userDetails = res.data;
        localStorage.setItem('user', JSON.stringify(res.data));
        localStorage.setItem('token', res.token);
        this.navigateToFirstPage(res.data);
        this.router.navigate([localStorage.getItem('route') || '/dashboard/overview']);
        this.navService.setItems();
      },
      error: (err) => {
        
      }
    }).add(() => {
      this.spinner = false;
    });
  }

  navigateToFirstPage(data: any) {
    let routeFind = false;
    Object.keys(data.access_rights).forEach((page) => {
      const access = data.access_rights[page].access;
      if (access.read || access.write) {
          if (routeFind) {
            return;
          }
          if(JSON.stringify(data.access_rights[page].submenu) === '{}') {
            localStorage.setItem('route', `/dashboard/${page.toLocaleLowerCase().replace(/\s/g, '')}`);
            routeFind = true;
            return;
          } else {
            Object.keys(data.access_rights[page].submenu).forEach((subPage) => {
              const subAccess = data.access_rights[page].submenu[subPage].access;
              if ((subAccess.read || subAccess.write) && !routeFind) {
                localStorage.setItem('route', `/dashboard/${subPage.toLocaleLowerCase().replace(/\s/g, '')}`);
                routeFind = true;
                return;
              }
            })
          }
      }
    });
  }
}