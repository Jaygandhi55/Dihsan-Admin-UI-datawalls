import { ChangeDetectorRef, Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';

@Component({
  selector: 'app-table-data',
  templateUrl: './table-data.component.html',
  styleUrls: ['./table-data.component.scss']
})
export class TableDataComponent implements OnInit {

  @Input() public rows:Array<any> = [];
  @Input() public columns:Array<any> = [];
  @Input() showFilter: boolean = false;
  @Input() public actionHtml: Array<any> = [];
  @Input() createUserBtn: boolean = false;
  @Input() createEndpointBtn: boolean = false;
  @Input() createResourceBtn: boolean = false;
  @Input() createSupplierBtn: boolean = false;
  @Input() createDesignerBtn: boolean = false;
  @Input() createScheduleBtn: boolean = false;
  @Input() syncAllBtn: boolean = false;
  @Input() selectable:boolean = false;
  @Input() pageTitle = '';
  @Input() page:number = 1;
  public itemsPerPage:number = 20;
  public maxSize:number = 4;
  public numPages:number = 1;
  @Input() length:number = 0;
  @Input() pagination_data:any = null;
  public showSearch = true;

  @Output() actionEvent: EventEmitter<any> = new EventEmitter();
  @Output() pageEvent: EventEmitter<any> = new EventEmitter();
  @Output() filterEvt: EventEmitter<any> = new EventEmitter();
  @Output() searchEvt: EventEmitter<any> = new EventEmitter();


  public config:any = null;

  @Input() public data:Array<any> = [];

  @ViewChild('ngTable') ngTable: any;

  constructor(private cdr: ChangeDetectorRef) {
  }

  public ngOnInit():void {
    this.detectChange();
  }

  getConfig() {
    this.onChangeTable(this.config);
  }

  public changePage(page:any, data:Array<any> = this.data):Array<any> {
    if (this.pagination_data) {
      return data;
    } else {
      let start = (page.page - 1) * page.itemsPerPage;
      let end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
      return data.slice(start, end);
    }
  }

  public detectChange() {
    this.config = {
      paging: true,
      sorting: {columns: this.columns},
      filtering: {filterString: ''},
      className: ['table-striped', 'table-bordered']
    };
    if (this.pagination_data) {
      this.length = this.pagination_data.total_count;
    } else {
      this.length = this.data.length;
    }
    this.getConfig();
    this.cdr.detectChanges();
  }

  public changeSort(data:any, config:any):any {
    if (!config.sorting) {
      return data;
    }

    let columns = this.config.sorting.columns || [];
    let columnName:any = void 0;
    let sort:any = void 0;

    for (let i = 0; i < columns.length; i++) {
      if (columns[i].sort !== '' && columns[i].sort !== false) {
        columnName = columns[i].name;
        sort = columns[i].sort;
      }
    }

    if (!columnName) {
      return data;
    }

    // simple sorting
    return data.sort((previous:any, current:any) => {
      if (previous[columnName] > current[columnName]) {
        return sort === 'desc' ? -1 : 1;
      } else if (previous[columnName] < current[columnName]) {
        return sort === 'asc' ? -1 : 1;
      }
      return 0;
    });
  }

  public changeFilter(data:any, config:any):any {
    let filteredData:Array<any> = data;
    this.columns.forEach((column:any) => {
      if (column.filtering) {
        filteredData = filteredData.filter((item:any) => {
          return item[column.name] && item[column.name].toString().toLowerCase().includes(column.filtering.filterString.toLowerCase());
        });
      }
    });

    if (!config.filtering) {
      return filteredData;
    }

    if (config.filtering.columnName) {
      return filteredData.filter((item:any) =>
      item[config.filtering.columnName] && item[config.filtering.columnName].toString().toLowerCase().includes(this.config.filtering.filterString.toLowerCase()));
    }

    let tempArray:Array<any> = [];
    filteredData.forEach((item:any) => {
      let flag = false;
      this.columns.forEach((column:any) => {
        if (item[column.name] && item[column.name].toString().toLowerCase().includes(this.config.filtering.filterString.toLowerCase())) {
          flag = true;
        }
      });
      if (flag) {
        tempArray.push(item);
      }
    });
    filteredData = tempArray;

    return filteredData;
  }

  public onChangeTable(config:any, page?: any):any {
    if (page) {
      if (this.pagination_data && ((this.pagination_data.next_page_number && page.page >= this.pagination_data.next_page_number) || (this.pagination_data.previous_page_number && page.page <= this.pagination_data.previous_page_number))) {
        this.pageEvent.emit(page);
      }
    } else {
      page = {page: this.page, itemsPerPage: this.itemsPerPage};
    }
    if (config.filtering) {
      Object.assign(this.config.filtering, config.filtering);
    }

    if (config.sorting) {
      Object.assign(this.config.sorting, config.sorting);
    }

    let filteredData = this.data;
    let sortedData = this.changeSort(filteredData, this.config);
    this.rows = page && config.paging ? this.changePage(page, sortedData) : sortedData;
    if (this.pagination_data) {
      this.length = this.pagination_data.total_count;
    } else {
      this.length = sortedData.length;
    }
  }

  scrollTop() {
    window.scroll(0,0);
  }

  public onCellClick(data: any): any {
    console.log(data);
  }

  createAction(actionName: any) {
    this.actionEvent.emit({'action': actionName});
  }

  onActionClick(evt: any) {
    this.actionEvent.emit(evt);
  }

  filterEmit(evt: any) {
    this.filterEvt.emit(evt);
  }

  onSearchChange(evt: any) {
    if (evt.target.value.length >= 3 || evt.target.value.length == 0) {
      this.searchEvt.emit(evt.target.value);
    }
  }
}