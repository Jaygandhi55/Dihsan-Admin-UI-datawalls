import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from 'src/app/services/login.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from '../../services/firebase/auth.service';
import { LayoutService } from '../../services/layout.service';
import { NavService } from '../../services/nav.service';
import { SwitcherService } from '../../services/switcher.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  private body: HTMLBodyElement | any = document.querySelector('body');
  public isCollapsed = true;
  activated: boolean = false;
  route: string = localStorage.getItem('route') || '/dashboard/overview';

  constructor(
    private layoutService: LayoutService,
    public SwitcherService: SwitcherService,
    public navServices: NavService,
    private auth: AuthService,
    private router: Router,
    private modalService: NgbModal,
    public userService: UserService, public loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.userService.getRoleList().subscribe({
      next: (res) => {
        this.userService.roleList = res.data;
        if (localStorage.getItem('user')) {
          this.userService.userDetails = JSON.parse(localStorage.getItem('user') || '{}');
        }
      },
      error: (err) => {
      }
    })
  }
  toggleSwitcher() {
    this.SwitcherService.emitChange(true);
  }
  
  toggleSidebarNotification() {
    this.layoutService.emitSidebarNotifyChange(true);
  }

  signout() {
    this.auth.SignOut();
    this.router.navigate(['/auth/login']);
  }

  open(content: any) {
    this.modalService.open(content, {
      backdrop: 'static',
      windowClass: 'modalCusSty',
    });
  }

  searchToggle() {
    if(this.body.classList.contains('search-open')){
      this.activated = false;
      this.body.classList.remove('search-open')
    }
    else{
      this.activated = true;
      this.body.classList.add('search-open')
    }
  }
  closeToggle() { 
    this.activated = false;
    this.body.classList.remove('search-open')
  }
}
