import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-gender',
  templateUrl: './gender.component.html',
  styleUrls: ['./gender.component.scss']
})
export class GenderComponent implements OnInit {

  spinner = true;
  pagination_data = null;
  access:any = null;
  page = 1;
  public rows:Array<any> = [];
  public columns:Array<any> = [
    {title: 'Gender', name: 'gender'},
  ];
  public actionHtml:Array<any> = [
  ];

  public data:any = null;

  constructor(private productService: ProductService,
    private toster: ToastrService,
    private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    let userDetails = JSON.parse(localStorage.getItem('user') || '{}');
    this.access = userDetails.access_rights['Products'].submenu['Genders'].access;
    if (this.access.write) {
      this.actionHtml = []
    } else if (this.access.read) {
      this.actionHtml = []
    }
    this.getGenderList();
  }

  getGenderList() {
    this.spinner = true;
    this.productService.getGenderList(this.page).subscribe({
      next: (res) => {
        this.data = null;
        this.pagination_data = null;
        this.cdr.detectChanges();
        this.pagination_data = res.pagination_data;
        this.data = res.data;
      },
      error: (err) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
      }
    }).add(() => {
      this.spinner = false;
    });
  }

  ngAfterViewInit() {

  }

  pageChange(evt: any) {
    this.page = evt.page;
    this.getGenderList();
  }

  actionEvent(evt: any) {
    
  }

}
