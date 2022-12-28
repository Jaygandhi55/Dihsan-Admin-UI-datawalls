import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { filter, take } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { CreateUpdateScheduleComponent } from './create-update-schedule/create-update-schedule.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.scss'],
  providers: [DatePipe]
})
export class SchedulesComponent implements OnInit {
  bsModalRef?: BsModalRef;
  spinner = true;
  pagination_data = null;
  page = 1;
  public rows:Array<any> = [];
  access:any = null;
  public columns:Array<any> = [
    {title: 'Resource Name', name: 'resourceName'},
    {title: 'Endpoint Name', name: 'endpointName'},
    {title: 'API Type', name: 'api_type'},
    {title: 'Duration', name: 'duration'},
    {title: 'Unit', name: 'unit'},
    {title: 'Last Run', name: 'last_run'}
  ];
  public actionHtml:Array<any> = [];

  public data:any = null;

  constructor(private productService: ProductService,
    private toster: ToastrService,
    private modalService: BsModalService,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe) {}

  ngOnInit(): void {
    let userDetails = JSON.parse(localStorage.getItem('user') || '{}');
    this.access = userDetails.access_rights['API Configurations'].submenu.Endpoints.access;
    if (this.access.write) {
      this.actionHtml = [
        { title: 'Update Schedule', class: 'fe fe-edit', parentClass:'btn btn-success-light' }
      ]
    } else if (this.access.read) {
      this.actionHtml = [
      ]
    }
    this.getScheduleList();
  }

  getScheduleList() {
    this.spinner = true;
    this.productService.getScheduleList(this.page).subscribe({
      next: (res: any) => {
        this.data = null;
        this.pagination_data = null;
        this.cdr.detectChanges();
        this.pagination_data = res.pagination_data;
        res.data.forEach((node: any) => {
          node['resourceName'] = node.resource.resource;
          node['api_type'] = node.resource.api_type;
          node['endpointName'] = node.resource.endpoint.endpoint;
          node['last_run'] = this.datePipe.transform(node.last_run_at, 'yyyy-dd-MM hh:mm');
        })
        this.data = res.data;
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

  }

  pageChange(evt: any) {
    this.page = evt.page;
    this.getScheduleList();
  }

  actionEvent(evt: any) {
    if (evt.action === 'createSchedule') {
      this.createSchedule();
    } else {
      // this.onActionClick(evt);
      if (evt.actionName == 'Update Schedule') {
        this.updateSchedule(evt.row);
      } else {
        
      }
    }
  }

  createSchedule() {
    const initialState: ModalOptions = {
      initialState: {
        list: [
        ],
        title: 'Create Schedule',
        actionName: 'create_schedule'
      },
      backdrop : 'static',
      keyboard : false
    };
    this.bsModalRef = this.modalService.show(CreateUpdateScheduleComponent, initialState);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.submitBtnName = 'Create Schedule';
    this.modalService.onHide.pipe(take(1), filter(reason => reason === 'Success')).subscribe(() => {
      this.getScheduleList();
    });
  }

  updateSchedule(row: any) {
    const initialState: ModalOptions = {
      initialState: {
        list: [
          row
        ],
        title: 'Update Schedule',
        actionName: 'update_schedule'
      },
      backdrop : 'static',
      keyboard : false
    };
    this.bsModalRef = this.modalService.show(CreateUpdateScheduleComponent, initialState);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.submitBtnName = 'Update Schedule';
    this.modalService.onHide.pipe(take(1), filter(reason => reason === 'Success')).subscribe(() => {
      this.getScheduleList();
    });
  }
}
