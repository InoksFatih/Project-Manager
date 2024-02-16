// calendar.component.ts
import { Component, ChangeDetectorRef, ChangeDetectionStrategy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { ProjectService } from '../projects/project.service';
import { Project } from '../models/projectMod';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements AfterViewInit {
  public calendarVisible = true;

  calendarOptions: CalendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    initialView: 'dayGridMonth',
    weekends: true,
    selectMirror: true,
    dayMaxEvents: true,
    events: [],
    eventClick: this.handleEventClick.bind(this),
    buttonText: {
      today: 'Today',
      month: 'Month',
      week: 'Week',
      day: 'Day',
    },
  };

  @ViewChild('fullCalendar') fullCalendar!: ElementRef;

  currentEvents: any[] = [];

  constructor(
    private changeDetector: ChangeDetectorRef,
    private projectService: ProjectService,
  ) {
    this.fetchDueDates();
  }

  fetchDueDates() {
    (this.projectService.getAllProjects() as any).subscribe(
      (projects: Project[]) => {
        this.currentEvents = projects.map((project) => ({
          id: project.id,
          title: project.title,
          start: project.dueDate,
          dueDate: project.dueDate,
          allDay: true,
        }));
        this.calendarOptions.events = this.currentEvents;
        this.changeDetector.detectChanges();
      },
      (error: any) => {
        console.error('Error fetching due dates:', error);
      }
    );
  }

  ngAfterViewInit(): void {
    // Access fullCalendar here
    console.log(this.fullCalendar.nativeElement);
  }

  handleEventClick(clickInfo: EventClickArg) {
    // Handle event click logic if needed
    console.log('Event clicked:', clickInfo.event);
  }

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends;
  }

  refreshCalendar(): void {
    if (this.fullCalendar) {
      this.fullCalendar.nativeElement.getApi().refetchEvents();
    }
  }
}
