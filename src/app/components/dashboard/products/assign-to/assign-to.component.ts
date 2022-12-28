import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Roles } from 'src/app/constants/role.constant';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-assign-to',
  templateUrl: './assign-to.component.html',
  styleUrls: ['./assign-to.component.scss']
})
export class AssignToComponent implements OnInit {
  
  title?: string;
  closeBtnName?: string;
  submitBtnName?: string;
  list: any[] = [];
  endpointID = '';
  spinner = false;
  actionName?= '';
  text:string = "";
  count: number = 0;
  endpointList: any = [];
  assignTeams: any = [Roles.ROLE_MEDIA_TEAM, Roles.ROLE_DATA_TEAM];
  teamMembers: any = [];
  assignForm: FormGroup;

  constructor(public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private fb: FormBuilder, public userService: UserService,
    private toster: ToastrService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef) {
      this.assignForm = this.fb.group({
        assignTeam: [null, [Validators.required]],
        teamMember: [null, [Validators.required]],
      });
    }

  ngOnInit(): void {
    if (this.list[0].length > 0) {
      this.count = this.list[0].length;
    } else {
      this.spinner = true;
      this.productService.getFilterProductList(this.list[1]).subscribe({
        next: (res: any) => {
          this.count = res.pagination_data.total_count;
        },
        error: (err: any) => {
          err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
            this.toster.error('', 'Error', { timeOut: 3000 });
        }
      }).add(()=>{
        this.spinner = false;
      });
    }
  }

  ngAfterViewInit() {
    
  }

  changeTeam(evt: any) {
    if (!evt) {
      this.teamMembers = [];
      this.assignForm.controls['teamMember'].patchValue(null);
    } else {
      this.spinner = true;
   
      this.userService.getUsersListRoleBase(evt).subscribe({
        next: (res) => {
          this.assignForm.controls['teamMember'].patchValue(null);
          this.teamMembers = res.data;
          this.cdr.detectChanges();
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

  submitAssignTo() {
    this.spinner = true;
    const req: any = {
      assign_to: this.assignForm.value.assignTeam,
      user: this.assignForm.value.teamMember,
      products: {}
    }
    if (this.list[0].length > 0) {
      let products:any = [];
      this.list[0].forEach((element: any) => {
        products.push(element.id);
      });
      req.products['ids'] = products;
    } else {
      delete this.list[1].page;
      req.products['filters'] = this.list[1];
    }

    this.productService.postAssignTo(req).subscribe({
      next: (res) => {
        this.toster.success('Products Assign Successfully', 'Success', { timeOut: 3000 });
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

}
