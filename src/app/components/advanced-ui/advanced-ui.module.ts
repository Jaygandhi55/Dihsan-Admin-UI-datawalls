import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import { AdvancedUiRoutingModule } from './advanced-ui-routing.module';
import { AccordionComponent } from './accordion/accordion.component';
import { CarouselComponent } from './carousel/carousel.component';
import { CollapseComponent } from './collapse/collapse.component';
import { ModalsComponent } from './modals/modals.component';
import { TimelineComponent } from './timeline/timeline.component';
import { SweetAlertsComponent } from './sweet-alerts/sweet-alerts.component';
import { RatingsComponent } from './ratings/ratings.component';
import { CountersComponent } from './counters/counters.component';
import { SearchComponent } from './search/search.component';
import { UserlistComponent } from './userlist/userlist.component';
import { BlogComponent } from './blog/blog.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { FileAttachmentsComponent } from './file-attachments/file-attachments.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { NgxStarsModule } from 'ngx-stars';
import { CdTimerModule } from 'angular-cd-timer';
import { userlistService } from './userlist/userlist.service';
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';



@NgModule({
  declarations: [
    AccordionComponent,
    CarouselComponent,
    CollapseComponent,
    ModalsComponent,
    TimelineComponent,
    SweetAlertsComponent,
    RatingsComponent,
    CountersComponent,
    SearchComponent,
    UserlistComponent,
    BlogComponent,
    BlogDetailsComponent,
    EditPostComponent,
    FileAttachmentsComponent
  ],
  imports: [
    CommonModule,
    AdvancedUiRoutingModule,
    NgbModule,
    SharedModule,
    FormsModule, ReactiveFormsModule,
    NgSelectModule,
    SweetAlert2Module,
    NgxStarRatingModule,
    NgxStarsModule,
    CdTimerModule,
    GalleryModule.withConfig({
      // thumbView: 'contain',
    }),
    LightboxModule
  ],
  providers:[
    DecimalPipe,
    userlistService
  ]
})
export class AdvancedUiModule { }
