import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppsRoutingModule } from './apps-routing.module';
import { CardsComponent } from './cards/cards.component';
import { DraggableCardsComponent } from './draggable-cards/draggable-cards.component';
import { RangeSliderComponent } from './range-slider/range-slider.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ImageCompareComponent } from './image-compare/image-compare.component';
import { NotificationComponent } from './notification/notification.component';
import { WidgetNotificationComponent } from './widget-notification/widget-notification.component';
import { TreeviewComponent } from './treeview/treeview.component';
import { Filemanager01Component } from './filemanager01/filemanager01.component';
import { Filemanager02Component } from './filemanager02/filemanager02.component';
import { FileDetailsComponent } from './file-details/file-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragulaModule } from 'ng2-dragula';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxNotifierModule } from 'ngx-notifier';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatTreeModule } from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin
])

@NgModule({
  declarations: [
    CardsComponent,
    DraggableCardsComponent,
    RangeSliderComponent,
    CalendarComponent,
    ContactsComponent,
    ImageCompareComponent,
    NotificationComponent,
    WidgetNotificationComponent,
    TreeviewComponent,
    Filemanager01Component,
    Filemanager02Component,
    FileDetailsComponent
  ],
  imports: [
    CommonModule,
    AppsRoutingModule,
    NgbModule,
    SharedModule,
    FormsModule, ReactiveFormsModule,
    DragulaModule.forRoot(),
    NgxSliderModule,PerfectScrollbarModule,
    CarouselModule,
    NgxNotifierModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,MatSnackBarModule,
    MatTreeModule, MatIconModule, MatProgressBarModule,
    FullCalendarModule,
    GalleryModule.withConfig({
      // thumbView: 'contain',
    }),
    LightboxModule,
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppsModule { }
