import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BodyComponent } from './body/body.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectsComponent } from './projects/projects.component';
import { TasksComponent } from './tasks/tasks.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { MytasksComponent } from './mytasks/mytasks.component';
import { ProfileComponent } from './profile/profile.component';
import { SubtasksComponent } from './subtasks/subtasks.component';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormProjectComponent } from './projects/form-project/form-project.component';
import { FormTaskComponent } from './tasks/form-task/form-task.component';
import { FormSubtaskComponent } from './subtasks/form-subtask/form-subtask.component';
import { CalendarModule, DateAdapter, MOMENT } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import moment from 'moment';
import { CalendarComponent } from './calendar/calendar.component';
import {NgOptimizedImage} from "@angular/common";
import {MatButtonToggle} from "@angular/material/button-toggle";
import {CdkMenu, CdkMenuTrigger} from "@angular/cdk/menu";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatBadge} from "@angular/material/badge";
import { UploadComponent } from './tasks/upload/upload.component';
import { ViewTaskComponent } from './tasks/view-task/view-task.component';
import { ViewProjectComponent } from './projects/view-project/view-project.component';
import { ViewSubtaskComponent } from './subtasks/view-subtask/view-subtask.component';
import {MatDivider} from "@angular/material/divider";
import {ScheduleModule ,DayService, WeekService, WorkWeekService, MonthService, AgendaService, MonthAgendaService, TimelineViewsService, TimelineMonthService} from "@syncfusion/ej2-angular-schedule";
import {FullCalendarModule} from "@fullcalendar/angular";



@NgModule({
  declarations: [
    AppComponent,
    BodyComponent,
    SidenavComponent,
    DashboardComponent,
    ProjectsComponent,
    TasksComponent,
    NotificationsComponent,
    MytasksComponent,
    ProfileComponent,
    SubtasksComponent,
    HeaderComponent,
    FormProjectComponent,
    FormTaskComponent,
    FormSubtaskComponent,
    CalendarComponent,
    UploadComponent,
    ViewTaskComponent,
    ViewProjectComponent,
    ViewSubtaskComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        FormsModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogClose,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        CalendarModule.forRoot({
            deps: [MOMENT],
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
        NgOptimizedImage,
        MatButtonToggle,
        CdkMenu,
        CdkMenuTrigger,
        MatMenu,
        MatMenuItem,
        MatMenuTrigger,
        MatBadge,
        ReactiveFormsModule,
        MatDivider,
        MatDialogActions,
        ScheduleModule,
        FullCalendarModule,

    ],
  providers: [
    provideClientHydration(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MOMENT, useValue: moment },
    DayService, WeekService, WorkWeekService, MonthService, AgendaService, MonthAgendaService, TimelineViewsService, TimelineMonthService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
