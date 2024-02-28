import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BodyComponent } from './components/body/body.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { MytasksComponent } from './components/mytasks/mytasks.component';
import { SubtasksComponent } from './components/subtasks/subtasks.component';
import { HeaderComponent } from './components/header/header.component';
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
import { FormProjectComponent } from './components/projects/form-project/form-project.component';
import { FormTaskComponent } from './components/tasks/form-task/form-task.component';
import { FormSubtaskComponent } from './components/subtasks/form-subtask/form-subtask.component';
import { CalendarModule, DateAdapter, MOMENT } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import moment from 'moment';
import { CalendarComponent } from './components/calendar/calendar.component';
import {NgOptimizedImage} from "@angular/common";
import {MatButtonToggle} from "@angular/material/button-toggle";
import {CdkMenu, CdkMenuTrigger} from "@angular/cdk/menu";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatBadge} from "@angular/material/badge";
import { UploadComponent } from './components/tasks/upload/upload.component';
import { ViewTaskComponent } from './components/tasks/view-task/view-task.component';
import { ViewProjectComponent } from './components/projects/view-project/view-project.component';
import { ViewSubtaskComponent } from './components/subtasks/view-subtask/view-subtask.component';
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
    MytasksComponent,
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
