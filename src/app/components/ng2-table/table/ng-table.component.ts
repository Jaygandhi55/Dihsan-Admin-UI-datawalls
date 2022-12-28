import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, Output, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'ng-table',
  templateUrl: 'ng-table.component.html',
  styleUrls: ['ng-table.component.scss']
})
export class NgTableComponent {

  selection = new SelectionModel<any>(true, []);

  // Table values
  @Input() public rows: Array<any> = [];
  @Input() actionHtml: any = null;
  @Input() selectable: boolean = false;
  public actionName = '';

  @ViewChildren('filterSelect') filterSelect: any;
  @ViewChildren('filterText') filterText: any;

  @Input()
  public set config(conf: any) {
    if (!conf.className) {
      conf.className = 'table-striped table-bordered';
    }
    if (conf.className instanceof Array) {
      conf.className = conf.className.join(' ');
    }
    this._config = conf;
  }

  // Outputs (Events)
  @Output() public tableChanged: EventEmitter<any> = new EventEmitter();
  @Output() public cellClicked: EventEmitter<any> = new EventEmitter();
  @Output() public actionClicked: EventEmitter<any> = new EventEmitter();
  @Output() public filterEvt: EventEmitter<any> = new EventEmitter();

  public showFilterRow: Boolean = false;

  @Input()
  public set columns(values: Array<any>) {
    values.forEach((value: any) => {
      if (value.filtering) {
        this.showFilterRow = true;
      }
      if (value.className && value.className instanceof Array) {
        value.className = value.className.join(' ');
      }
      let column = this._columns.find((col: any) => col.name === value.name);
      if (column) {
        Object.assign(column, value);
      }
      if (!column) {
        this._columns.push(value);
      }
    });
  }

  private _columns: Array<any> = [];
  private _config: any = {};

  public constructor(private sanitizer: DomSanitizer) {
  }

  public sanitize(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  public get columns(): Array<any> {
    return this._columns;
  }

  public get config(): any {
    return this._config;
  }

  public get configColumns(): any {
    let sortColumns: Array<any> = [];

    this.columns.forEach((column: any) => {
      if (column.sort) {
        sortColumns.push(column);
      }
    });

    return { columns: sortColumns };
  }

  public onChangeTable(column: any): void {
    this._columns.forEach((col: any) => {
      if (col.name !== column.name && col.sort !== false) {
        col.sort = '';
      }
    });
    this.tableChanged.emit({ sorting: this.configColumns });
  }

  public getData(row: any, propertyName: string): string {
    // if (!propertyName) {
    //   return this.actionHtml;
    // }
    return propertyName.split('.').reduce((prev: any, curr: string) => prev[curr], row);
  }

  public actionClick(row: any, actionName: any) {
    event?.stopPropagation();
    this.actionName = actionName;
    this.actionClicked.emit({ row, actionName: actionName });
  }

  public cellClick(row: any, column: any): void {
    this.cellClicked.emit({ row, column });
  }

  public changeOption(evt: any) {
    let selection: any = {};
    this.filterSelect.forEach((element: any) => {
      selection[element.element.id] = element.selectedValues.length ? element.selectedValues.join(','): undefined;
    });

    this.filterText.forEach((element: any) => {
      selection[element.nativeElement.id] = element.nativeElement.value ? element.nativeElement.value: undefined;
    });

    this.filterEvt.emit(selection);
  }

  changeSearch(evt: any) {
    if (evt.target.value.length >= 3 || evt.target.value.length == 0) {
      this.changeOption(evt);
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.rows.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.rows);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  replaceLineBreak(s:string) {
    return s.replace(/_/g, ' ');
  }
}
