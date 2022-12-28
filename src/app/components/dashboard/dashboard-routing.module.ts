import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportingComponent } from './Reporting/Reporting.component';
import { VendorsComponent } from './Vendors/Vendors.component';
import { StocksComponent } from './Stocks/Stocks.component';
import { ProductsComponent } from './products/products.component';
import { OrderComponent } from './order/order.component';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './users/roles/roles.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { DesignersComponent } from './designers/designers.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { EndpointsComponent } from './endpoints/endpoints.component';
import { ResourcesComponent } from './resources/resources.component';
import { CategoriesComponent } from './products/categories/categories.component';
import { SubCategoriesComponent } from './products/sub-categories/sub-categories.component';
import { SizeComponent } from './products/size/size.component';
import { GenderComponent } from './products/gender/gender.component';
import { ColorComponent } from './products/color/color.component';
import { NoAccessComponent } from './no-access/no-access.component';
import { SchedulesComponent } from './schedules/schedules.component';
import { ProjectConfigurationComponent } from './project-configuration/project-configuration.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'overview',
        component: ReportingComponent
      },
      {
        path: 'vendors',
        component: VendorsComponent
      },
      {
        path: 'stocks',
        component: StocksComponent
      },
      {
        path: 'allproducts',
        component: ProductsComponent
      },
      {
        path: 'orders',
        component: OrderComponent
      },
      {
        path: 'designers',
        component: DesignersComponent
      },
      {
        path: 'suppliers',
        component: SuppliersComponent
      },
      {
        path: 'manageusers',
        component: UsersComponent
      },
      {
        path: 'manageroles',
        component: RolesComponent
      },
      {
        path: 'changepassword',
        component: ChangePasswordComponent
      },
      {
        path: 'endpoints',
        component: EndpointsComponent
      },
      {
        path: 'resources',
        component: ResourcesComponent
      },
      {
        path: 'categories',
        component: CategoriesComponent
      },
      {
        path: 'subcategories',
        component: SubCategoriesComponent
      },
      {
        path: 'sizes',
        component: SizeComponent
      },
      {
        path: 'genders',
        component: GenderComponent
      },
      {
        path: 'colors',
        component: ColorComponent
      },
      {
        path: 'no-access',
        component: NoAccessComponent
      },
      {
        path: 'schedules',
        component: SchedulesComponent
      },
      {
        path: 'projectconfigurations',
        component: ProjectConfigurationComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
