import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/login.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/shared/services/firebase/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public show: boolean = false;
  public loginForm: FormGroup | any;
  public errorMessage: any;

  constructor(public loginService: LoginService, public userService: UserService,
    public authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private toster: ToastrService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

  }

  ngOnInit() {
  }

  showPassword() {
    this.show = !this.show;
  }

  // Login With Google
  loginGoogle() {
    this.authService.GoogleAuth();
  }

  // Login With Twitter
  loginTwitter(): void {
    this.authService.signInTwitter();
  }

  // Login With Facebook
  loginFacebook() {
    this.authService.signInFacebok();
  }

  // Simple Login
  login() {
    this.authService.showLoader = true;
    this.loginService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
      next: (res) => {
        this.toster.success(res.message, 'Success', { timeOut: 3000 });
        this.loginService.token = res.token;
        this.userService.userDetails = res.data;
        this.loginService.pass = this.loginService.getEncrypt(this.loginForm.value.password);
        localStorage.setItem('pass', this.loginService.pass);
        localStorage.setItem('email', this.loginForm.value.email);
        localStorage.setItem('user', JSON.stringify(res.data));
        localStorage.setItem('token', res.token);
        this.navigateToFirstPage(res.data)
        this.router.navigate([localStorage.getItem('route') || '/dashboard/overview']);
      },
      error: (err) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) : 
        this.toster.error('Please login after some time.', 'Error', { timeOut: 3000 });
      }
    }).add(() => {
      this.authService.showLoader = false;
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
