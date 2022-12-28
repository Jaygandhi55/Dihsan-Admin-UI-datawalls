import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-update-user',
  templateUrl: './create-update-user.component.html',
  styleUrls: ['./create-update-user.component.scss']
})
export class CreateUpdateUserComponent implements OnInit {

  title?: string;
  closeBtnName?: string;
  submitBtnName?: string;
  list: any[] = [];
  roleId = '';
  spinner = false;
  actionName?= '';


  userForm: FormGroup;

  constructor(public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private fb: FormBuilder, public userService: UserService,
    private toster: ToastrService) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: [null, Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.actionName === 'update_user') {
      this.userForm.controls['firstName'].patchValue(this.list[0].name.split(' ')[0]);
      this.userForm.controls['lastName'].patchValue(this.list[0].name.split(' ')[1]);
      this.userForm.controls['role'].patchValue(this.list[0].role.name);
      this.roleId = this.list[0].role.id;
      this.userForm.controls['email'].patchValue(this.list[0].email);
      this.userForm.controls['password'].clearValidators();
      this.userForm.controls['confirmPassword'].clearValidators();
    } else if (this.actionName === 'change_pass') {
      this.userForm.controls['firstName'].clearValidators();
      this.userForm.controls['lastName'].clearValidators();
      this.userForm.controls['role'].clearValidators();
      this.userForm.controls['email'].clearValidators();
    }
  }

  ngAfterViewInit() {
  }

  createUpdateUser() {
    if (this.actionName === 'update_user') {
      this.updateUser()
    } else if (this.actionName === 'change_pass') {
      this.changePassword()
    } else {
      this.createUser()
    }
  }

  updateUser() {
    this.spinner = true;
    const req = {
      "first_name": this.userForm.value.firstName,
      "last_name": this.userForm.value.lastName,
      "email": this.userForm.value.email,
      "is_active": true,
      "role": this.roleId
    }

    this.userService.updateUser(req, this.list[0].id).subscribe({
      next: (res) => {
        this.toster.success('User updated successfully', 'Success', { timeOut: 3000 });
        this.modalService.setDismissReason('Success');
        this.bsModalRef.hide();
      },
      error: (err) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
      }
    }).add(() => {
      this.spinner = false;
    });
  }

  createUser() {
    this.spinner = true;
    const req = {
      "first_name": this.userForm.value.firstName,
      "last_name": this.userForm.value.lastName,
      "email": this.userForm.value.email,
      "is_active": true,
      "role": this.roleId
    }
    this.userService.createUser(req).subscribe({
      next: (res) => {
        const passReq = {
          "user_id": res.data.id,
          "new_password": this.userForm.value.password
        }
        this.userService.changeLoginPassword(passReq).subscribe({
          next: (res) => {
            this.toster.success('User created successfully', 'Success', { timeOut: 3000 });
            this.modalService.setDismissReason('Success');
            this.bsModalRef.hide();
          },
          error: (err) => {
            this.toster.error('User is created but password is not created', 'Error', { timeOut: 3000 });
          }
        })
      },
      error: (err) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
      }
    }).add(() => {
      this.spinner = false;
    });
  }

  changePassword() {
    this.spinner = true;
    const req = {
      "user_id": this.list[0].id,
      "new_password": this.userForm.value.password
    }

    this.userService.changeLoginPassword(req).subscribe({
      next: (res) => {
        this.toster.success(res.message, 'Success', { timeOut: 3000 });
        this.modalService.setDismissReason('Success');
        this.bsModalRef.hide();
      },
      error: (err) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
      }
    }).add(() => {
      this.spinner = false;
    });
  }

  changeRole(evt: any) {
    this.roleId = evt;
  }

}
