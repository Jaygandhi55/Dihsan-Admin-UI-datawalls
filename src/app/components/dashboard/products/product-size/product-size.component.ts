import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-product-size',
  templateUrl: './product-size.component.html',
  styleUrls: ['./product-size.component.scss']
})
export class ProductSizeComponent implements OnInit {

  title?: string;
  closeBtnName?: string;
  submitBtnName?: string;
  list: any[] = [];
  endpointID = '';
  spinner = false;
  actionName?= '';
  text:string = "";
  changeIcon = false;
  endpointList: any = null;
  size: any = null;
  fields: any = null;
  @Output() notifyParent = new EventEmitter();

  constructor(public bsModalRef: BsModalRef,
    public userService: UserService,
    private sanitizer: DomSanitizer,
    private productService: ProductService,
    private toster: ToastrService,
    private modalService: BsModalService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    if (this.actionName == 'product_detail') {
      this.fields = this.list[0].fields
    } else {
      this.size = this.list[0].size;
      this.text = this.list[0].fields.find((field: any) => field.field === 'name').value;
    }
  }

  public sanitize(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  lockContent() {
    this.spinner = true;
    const req ={
      "is_content_locked": false
    }

    this.productService.mediaLockUnlock(this.list[0].id, req).subscribe({
      next: (res: any) => {
        this.bsModalRef.hide();
        this.notifyParent.emit(res.data);
      },
      error: (err: any) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
          this.spinner = false;
      }
    }).add(() => {
      this.spinner = false;
    });
  }

}
