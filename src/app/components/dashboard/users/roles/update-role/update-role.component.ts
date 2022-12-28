import { Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { CheckboxComponent } from './checkbox/checkbox.component';
import PerfectScrollbar from 'perfect-scrollbar';

@Component({
  selector: 'app-update-role',
  templateUrl: './update-role.component.html',
  styleUrls: ['./update-role.component.scss']
})
export class UpdateRoleComponent implements OnInit {

  title?: string;
  closeBtnName?: string;
  submitBtnName?: string;
  data?: any = null;
  roleId = '';
  spinner = false;
  actionName?= '';
  tabs: any = [];
  @ViewChildren('checkboxComp') checkboxComp: CheckboxComponent[];
  @ViewChild('scrollBar') scrollBar: ElementRef;

  // roleAccessForm: FormGroup;

  constructor(public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    public userService: UserService,
    private toster: ToastrService) {

    let rights = this.userService.roleAccessRights?.access_rights;
    const tabNames = Object.keys(rights);

    tabNames.forEach((data: any) => {
      this.tabs.push({
        menu_id: rights[data].id,
        name: data,
        access: rights[data].access,
        controlName: data.replace(/\s/g, '')
      })
      if (JSON.stringify(rights[data].submenu) != '{}') {
        Object.keys(rights[data].submenu).forEach((subData: any) => {
          this.tabs.push({
            menu_id: rights[data].submenu[subData].id,
            name: subData,
            access: rights[data].submenu[subData].access,
            controlName: subData.replace(/\s/g, ''),
            subTab: true
          })
        })
      }
    })
    
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {}

  updateAccess() {
    this.spinner = true;
    let req: any = {
      role_id: this.data.role.id,
      access_rights: []
    }
    this.checkboxComp.forEach((node: any) => {
      req.access_rights.push({
        menu_id: node.control.menu_id,
        access: {
          read: node.roleAccessForm.value.read,
          write: node.roleAccessForm.value.write
        }
      });
    });
    this.updateRoleAccess(req);
  }

  updateRoleAccess(req: any) {
    this.userService.updateRoleAccess(req).subscribe({
      next: (res) => {
        this.toster.success('Access updated successfully', 'Success', { timeOut: 3000 });
        this.modalService.setDismissReason('Success');
        this.bsModalRef.hide();
      },
      error: (err) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) : 
        this.toster.error('Access Update Failed', 'Error', { timeOut: 3000 });
      }
    }).add(() => {
      this.spinner = false;
    })
  }

}
