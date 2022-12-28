import {
  animate,
  animation,
  state,
  style,
  transition,
  trigger,
  useAnimation,
} from '@angular/animations';
import {
  Component,
  ViewEncapsulation,
  HostListener,
  ElementRef,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Menu, NavService } from '../../services/nav.service';
import { switcherArrowFn } from './sidebar';
import { fromEvent } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { ICONS } from 'src/app/constants/icon.constant';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent {
  public menuItems!: Menu[];
  public url: any;
  route: string = localStorage.getItem('route') || '/dashboard/overview';

  constructor(
    private router: Router,
    private navServices: NavService,
    public elRef: ElementRef
  ) {
    this.navServices.items.subscribe((menuItems) => {
      let access_rights: Menu[] = [
        {headTitle: 'Menu'}
      ];
      
      let rights = JSON.parse(localStorage.getItem('user') || '{}')?.access_rights;
      const tabNames = Object.keys(rights);
      tabNames.forEach((data: any) => {
        let menuItem:Menu = {
          title: data,
          type: JSON.stringify(rights[data].submenu) == '{}' ? 'link' : 'sub',
          active: data.toLowerCase() == 'dashboard' ? true : false,
          icon: ICONS[data.replace(/ /g,"")],
          readAccess: rights[data].access.read,
          writeAccess: rights[data].access.write,
        }
        if (JSON.stringify(rights[data].submenu) == '{}') {
          menuItem['path'] = `/dashboard/${data.toLowerCase().replace(/\s/g,'')}`;
        } else {
          menuItem['children'] = [];
          let items: Menu[] = [];
          Object.keys(rights[data].submenu).forEach((subData: any) => {
            items.push({ path: `/dashboard/${subData.toLowerCase().replace(/\s/g,'')}`,
            title: subData,
            type: 'link',
            readAccess: rights[data].submenu[subData].access.read,
            writeAccess: rights[data].submenu[subData].access.write,
          })
          });
          menuItem['children'] = items;
        }
        access_rights.push(menuItem);
      })
      this.menuItems = access_rights.concat(menuItems);
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          menuItems.filter((items) => {
            if (items.path === event.url) {
              this.setNavActive(items);
            }
            if (!items.children) {
              return false;
            }
            items.children.filter((subItems) => {
              if (subItems.path === event.url) {
                this.setNavActive(subItems);
              }
              if (!subItems.children) {
                return false;
              }
              subItems.children.filter((subSubItems) => {
                if (subSubItems.path === event.url) {
                  this.setNavActive(subSubItems);
                }
              });
              return;
            });
            return;
          });
        }
      });
    });
  }

  //Active NavBar State
  setNavActive(item: any) {
    this.menuItems.filter((menuItem) => {
      if (menuItem !== item) {
        menuItem.active = false;
        document.querySelector('.app')?.classList.remove('sidenav-toggled');
        document.querySelector('.app')?.classList.remove('sidenav-toggled1');
        this.navServices.collapseSidebar = false;
      }
      if (menuItem.children && menuItem.children.includes(item)) {
        menuItem.active = true;
      }
      if (menuItem.children) {
        menuItem.children.filter((submenuItems) => {
          if (submenuItems.children && submenuItems.children.includes(item)) {
            menuItem.active = true;
            submenuItems.active = true;
          }
        });
      }
    });
  }

  // Click Toggle menu
  toggleNavActive(item: any) {
    if (!item.active) {
      this.menuItems.forEach((a: any) => {
        if (this.menuItems.includes(item)) {
         // a.active = false;
        }
        if (!a.children) {
          return false;
        }
        a.children.forEach((b: any) => {
          if (a.children.includes(item)) {
            b.active = false;
          }
        });
        return;
      });
    }
    item.active = !item.active;
  }

  ngOnInit(): void {
    let sidemenu = document.querySelector('.side-menu');
    sidemenu?.addEventListener('scroll', () => {}, { passive: false });
    sidemenu?.addEventListener('wheel', () => {}, { passive: false });

    switcherArrowFn();

    fromEvent(window, 'resize').subscribe(() => {
      if (window.innerWidth > 772) {
        document
          .querySelector('body.horizontal')
          ?.classList.remove('sidenav-toggled');
      }
      if (
        document
          .querySelector('body')
          ?.classList.contains('horizontal-hover') &&
        window.innerWidth > 772
      ) {
        let li = document.querySelectorAll('.side-menu li');
        li.forEach((e, i) => {
          e.classList.remove('is-expanded');
        });
      }
    });
  }

  sidebarClose() {
    if ((this.navServices.collapseSidebar = true)) {
      document.querySelector('.app')?.classList.remove('sidenav-toggled');
      this.navServices.collapseSidebar = false;
    }
  }

  resetMenu() {
    this.navServices.setItems();
  }

  scrolled: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 70;
  }

  scrollTop() {
    window.scroll(0,0);
  }

}
