import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/login.service';
import { UserService } from 'src/app/services/user.service';
import { NavService } from 'src/app/shared/services/nav.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  password = '';
  confirmPassword = '';
  spinner = false;

  changePassword: FormGroup;
  constructor(private fb: FormBuilder, private userService: UserService,
    private loginService: LoginService,
    private toster: ToastrService,
    private router: Router,
    private navService: NavService) {

    this.changePassword = this.fb.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });

  }

  ngOnInit(): void {
  }

  change() {
    this.spinner = true;
    const req = {
      "password": this.loginService.getDecrypt(localStorage.getItem('pass')),
      "new_password": this.changePassword.value.password
    }

    this.userService.changeLoginPassword(req).subscribe({
      next: (res) => {
        this.loginService.pass = this.loginService.getEncrypt(this.changePassword.value.password);
        localStorage.setItem('pass', this.loginService.pass);
        this.toster.success(res.message, 'Success', { timeOut: 3000 });
        this.router.navigate(['']);
        this.navService.setItems();
      },
      error: (err) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) : 
        this.toster.error('', 'Error', { timeOut: 3000 });
      }
    }).add(() => {
      this.spinner = false;
    });
  }

}
