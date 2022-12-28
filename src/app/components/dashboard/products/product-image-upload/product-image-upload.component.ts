import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { saveAs } from 'file-saver';
import { ProductService } from 'src/app/services/product.service';
import { ToastrService } from 'ngx-toastr';
import * as JSZip from 'jszip';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Subscription } from 'rxjs';
import { DragulaService } from 'ng2-dragula';
import { Roles } from 'src/app/constants/role.constant';

@Component({
  selector: 'app-product-image-upload',
  templateUrl: './product-image-upload.component.html',
  styleUrls: ['./product-image-upload.component.scss']
})
export class ProductImageUploadComponent implements OnInit {

  title?: string;
  closeBtnName?: string;
  submitBtnName?: string;
  roles = Roles;
  list: any[] = [];
  endpointID = '';
  spinner = true;
  actionName?= '';
  text:string = "";
  endpointList: any = null;
  images: any = null;
  pageList: any;
  imageForm: any;
  getRequests: any = [];
  changeIcon = false;
  imageUrls: any = [];
  @Output() notifyParent = new EventEmitter();
  userDetail: any = JSON.parse(localStorage.getItem('user') || '{}');
  @ViewChildren('fileUpload') fileUpload: any;
  subs = new Subscription();

  constructor(public bsModalRef: BsModalRef, private productService: ProductService,
    private toster: ToastrService,
    private dragulaService:DragulaService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private modalService: BsModalService) {
      
  }

  ngOnInit(): void {
    let self = this;
    this.getProductImages();
    this.subs.add(this.dragulaService.drop('IMAGESDRAG')
      .subscribe(({name, el, target, source, sibling}) => {
        this.bulkUpdate(target);
      })
    );
  }

  bulkUpdate(target: any) {
    this.spinner = true;
    const req: any = [];
    target.childNodes.forEach((element: any, index: any) => {
      if (element.childNodes[0]) {
        req.push({id: element.childNodes[0].innerText, order: index});
      }
    });

    this.productService.postBulkUpdate(req).subscribe({
      next: (res: any) => {
        this.images = res.data;

        this.fields().clear();
        res.data.forEach((element: any) => {
          this.addField(element.alt_text, element.filename);
        });
    
        this.fields().controls.forEach((elem: any) => {
          elem.disable();
        });
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
      }
    }).add(() => {
      this.spinner = false;
    });
  }

  getProductImages() {
    this.imageForm = this.fb.group({
      field: this.fb.array([]) ,
    });
    this.spinner = true;
    this.productService.getproductImageList(this.list[0].id).subscribe({
      next: (res: any) => {
        this.images = res.data;
              
        res.data.forEach((element: any) => {
          this.addField(element.alt_text, element.filename);
        });
    
        this.fields().controls.forEach((elem: any) => {
          elem.disable();
        });
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
      }
    }).add(() => {
      this.spinner = false;
    });
  }

  ngAfterViewInit() {
    // this.images = this.list[0].images;
  }

  newFiled(altText = '', fileName = ''): FormGroup {
    return this.fb.group({
      altText: [altText],
      fileName: [fileName]
    });
  }

  addField(altText = '', fileName = '') {
    this.fields().push(this.newFiled(altText, fileName));
  }

  fields() : FormArray {
    return this.imageForm.get("field") as FormArray
  }

  downloadImage(img: any) {
    saveAs(img, img.split('/')[img.split('/').length - 1]);
  }

  changeOrder(evt: any) {
    console.log(evt);
  }

  downloadAll() {
    this.spinner = true;
    this.getRequests = [];
    this.imageUrls = [];
    this.createGetRequets(this.images);

    forkJoin(...this.getRequests).subscribe((res: any) => {
      const zip = new JSZip();
      let fileName: String;

      res.forEach((f: any, i: any) => {
        fileName = this.imageUrls[i].split('/')[this.imageUrls[i].split('/').length - 1]; // extract filename from the response
        zip.file(`${fileName}`, f); // use it as name, this way we don't need the file type anymore
      });

      zip
        .generateAsync({ type: "blob" })
        .then(blob => saveAs(blob, "images.zip"));
    }, (err: any) => {

    }).add(() => {
      this.spinner = false;
    });
  }

  createGetRequets(images: any) {
    images.forEach((data: any) => {
      if (data.image_url) {
        this.imageUrls.push(data.image_url);
        this.getRequests.push(
          this.http.get(data.image_url, { responseType: 'blob' })
        )
      }
    });
  }

  editImageDetails(field: any) {
    field.enable();
  }

  removeField(i:number) {
    this.fields().removeAt(i);
  }

  cancelField(field: any) {
    field.disable();
  }

  submitImageDetails(field: any, i: any) {
    if (this.fileUpload && this.fileUpload.first && this.fileUpload.first.filesPreview.length > 0) {
      if (this.images[i]) {
        this.imagePatch(field, i);
      } else {
        this.imagePost(field, i);
      }
    }
  }

  imagePatch(field: any, i: any) {
    this.spinner = true;
    let formData: FormData = new FormData(); 
    formData.append('alt_text', field.value.altText);
    formData.append('product', this.list[0].id);
    formData.append('filename', field.value.fileName);
    formData.append('image_url', this.images[i].image_url);    
    formData.append('updated_image', this.fileUpload.first.filesPreview[0]);

    this.productService.patchProductImage(formData, this.images[i].id).subscribe({
      next: (res: any) => {
        field.disable();
        this.getProductImages();
      },
      error: (err: any) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
          this.spinner = false;
      }
    })
  }

  imagePost(field: any, i: any) {
    this.spinner = true;
    let formData: FormData = new FormData(); 
    formData.append('alt_text', field.value.altText);
    formData.append('product', this.list[0].id);
    formData.append('filename', field.value.fileName);
    formData.append('image_url', '');
    formData.append('updated_image', this.fileUpload.first.filesPreview[0]);

    this.productService.postProductImage(formData).subscribe({
      next: (res: any) => {
        field.disable();
        this.getProductImages();
      },
      error: (err: any) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
          this.spinner = false;
      }
    })
  }

  deleteImageField(index: any) {
    if (this.images[index]) {
      this.spinner = true;
      this.productService.deleteProductImage(this.images[index].id).subscribe({
        next: (res: any) => {
          this.getProductImages();
        },
        error: (err: any) => {
          err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
            this.toster.error('', 'Error', { timeOut: 3000 });
            this.spinner = false;
        }
      });
    } else {
      this.removeField(index);
    }
  }

  lockkUnlock() {
    this.spinner = true;
    const req = {
      "is_media_locked": this.list[0].is_media_locked ? false : true
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

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  
}