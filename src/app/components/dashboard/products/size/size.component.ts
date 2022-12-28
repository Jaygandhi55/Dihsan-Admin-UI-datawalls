import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Countries } from 'src/app/constants/countries.constant';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-size',
  templateUrl: './size.component.html',
  styleUrls: ['./size.component.scss']
})
export class SizeComponent implements OnInit {

  spinner = true;
  pagination_data = null;
  access:any = null;
  page = 1;
  public rows:Array<any> = [];
  public columns:Array<any> = [
    {title: 'Country', name: 'country_name'},
    {title: 'Size', name: 'size'}
  ];
  public actionHtml:Array<any> = [
  ];

  public data:Array<any> = [];

  constructor(private productService: ProductService,
    private toster: ToastrService,
    private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    let userDetails = JSON.parse(localStorage.getItem('user') || '{}');
    this.access = userDetails.access_rights['Products'].submenu['Sizes'].access;
    if (this.access.write) {
      this.actionHtml = []
    } else if (this.access.read) {
      this.actionHtml = []
    }
    this.getSizeList();
  }

  getSizeList() {
    this.spinner = true;
    this.productService.getSizeList(this.page).subscribe({
      next: (res) => {
        this.data = [];
        this.pagination_data = null;
        this.cdr.detectChanges();
        this.pagination_data = res.pagination_data;
        res.data.forEach((element: any) => {
          element['size'] = element['value'] + (element['unit'] ? ' ' + element['unit'] : '');
          element['country_name'] = Countries.find((country) => country.code ===  element['country_code'])?.country || element['country_code'];
        });
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
    this.getSizeList();
  }

  actionEvent(evt: any) {
    
  }

}
