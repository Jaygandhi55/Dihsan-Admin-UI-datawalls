import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { ReportingComponent } from './Reporting/Reporting.component';
import { VendorsComponent } from './Vendors/Vendors.component';
import { StocksComponent } from './Stocks/Stocks.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ProductsComponent } from './products/products.component';

import {PaginationModule} from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderComponent } from './order/order.component';
import { Ng2TableModule } from '../ng2-table/ng-table-module';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './users/roles/roles.component';
import { CreateUpdateUserComponent } from './users/create-update-user/create-update-user.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { TableDataComponent } from './table-data/table-data.component';
import { UpdateRoleComponent } from './users/roles/update-role/update-role.component';
import { CheckboxComponent } from './users/roles/update-role/checkbox/checkbox.component';
import { DesignersComponent } from './designers/designers.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { EndpointsComponent } from './endpoints/endpoints.component';
import { CreateUpdateEndpointComponent } from './endpoints/create-update-endpoint/create-update-endpoint.component';
import { AceEditorModule } from 'ng2-ace-editor';
import { ResourcesComponent } from './resources/resources.component';
import { CreateUpdateResourceComponent } from './resources/create-update-resource/create-update-resource.component';
import { CreateUpdateSupplierComponent } from './suppliers/create-update-supplier/create-update-supplier.component';
import { CreateUpdateDesignerComponent } from './designers/create-update-designer/create-update-designer.component';
import { ProductSizeComponent } from './products/product-size/product-size.component';
import { ProductImageComponent } from './products/product-image/product-image.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { UpdateFieldComponent } from './resources/update-field/update-field.component';
import { CategoriesComponent } from './products/categories/categories.component';
import { SubCategoriesComponent } from './products/sub-categories/sub-categories.component';
import { SizeComponent } from './products/size/size.component';
import { GenderComponent } from './products/gender/gender.component';
import { ColorComponent } from './products/color/color.component';
import { NoAccessComponent } from './no-access/no-access.component';
import { SchedulesComponent } from './schedules/schedules.component';
import { CreateUpdateScheduleComponent } from './schedules/create-update-schedule/create-update-schedule.component';
import { ProductImageUploadComponent } from './products/product-image-upload/product-image-upload.component';
import { FileUploadModule } from 'ng2-file-upload';
import { FileUploadComponent } from './products/product-image-upload/file-upload/file-upload.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { FieldMappingComponent } from './products/field-mapping/field-mapping.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { DragulaModule } from 'ng2-dragula';
import { ProjectConfigurationComponent } from './project-configuration/project-configuration.component';
import { CategoryFieldMappingComponent } from './products/categories/category-field-mapping/category-field-mapping.component';
import { AssignToComponent } from './products/assign-to/assign-to.component';
import { ReplacePipe } from 'src/app/pipes/replace.pipe';
import { AdditionalDataComponent } from './order/additional-data/additional-data.component';
import { UpdateOrderComponent } from './order/update-order/update-order.component';

@NgModule({
  declarations: [
    ReportingComponent,
    VendorsComponent,
    StocksComponent,
    ProductsComponent,
    OrderComponent,
    UsersComponent,
    RolesComponent,
    CreateUpdateUserComponent,
    ChangePasswordComponent,
    TableDataComponent,
    UpdateRoleComponent,
    CheckboxComponent,
    DesignersComponent,
    SuppliersComponent,
    EndpointsComponent,
    CreateUpdateEndpointComponent,
    ResourcesComponent,
    CreateUpdateResourceComponent,
    CreateUpdateSupplierComponent,
    CreateUpdateDesignerComponent,
    ProductSizeComponent,
    ProductImageComponent,
    UpdateFieldComponent,
    CategoriesComponent,
    SubCategoriesComponent,
    SizeComponent,
    GenderComponent,
    ColorComponent,
    NoAccessComponent,
    SchedulesComponent,
    CreateUpdateScheduleComponent,
    ProductImageUploadComponent,
    FileUploadComponent,
    FieldMappingComponent,
    ProjectConfigurationComponent,
    CategoryFieldMappingComponent,
    AssignToComponent,
    ReplacePipe,
    AdditionalDataComponent,
    UpdateOrderComponent
  ],
  imports: [
    Ng2TableModule,
    FormsModule,
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    NgSelectModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    NgApexchartsModule,
    NgCircleProgressModule.forRoot(),
    AceEditorModule,
    CarouselModule,
    FileUploadModule,
    NgxDropzoneModule,
    GalleryModule.withConfig({
      // thumbView: 'contain',
    }),
    LightboxModule,
    CKEditorModule,
    DragulaModule.forRoot()
  ],
  exports: [ReplacePipe]
})
export class DashboardModule { }
