import { Component, ChangeDetectorRef, ChangeDetectionStrategy, ElementRef, ViewChild, AfterViewInit, PLATFORM_ID, Inject, Renderer2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { ProjectService } from '../projects/project.service';
import { PersonService } from '../../services/person.service';
import { Task } from '../../models/taskMod';
import { TaskService } from '../tasks/task.service';
import { Person } from "../../models/personMod";
import { Project } from "../../models/projectMod";
import { MatDialog } from '@angular/material/dialog';
import { ViewTaskComponent } from '../tasks/view-task/view-task.component';
import {FormTaskComponent} from "../tasks/form-task/form-task.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements AfterViewInit {
  public calendarVisible = true;
  public calendarOptions: CalendarOptions = {
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
      today: "Aujourd'hui",
      month: 'Mois',
      week: 'Semaine',
      day: 'Jour',
      list: 'Emplois'
    },
  };

  @ViewChild('fullCalendar') fullCalendar!: ElementRef;

  public currentEvents: any[] = [];
  public selectedPerson: Person | null = null;
  public selectedProject: Project | null = null;
  public persons: Person[] = [];
  public projects: Project[] = [];
  public tasks: Task[] = [];
  private lastClickTime: number = 0;
  private clickDelay: number = 300;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private projectService: ProjectService,
    private personService: PersonService,
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private renderer: Renderer2, // Inject Renderer2
    @Inject(PLATFORM_ID) private platformId: Object,
    private dialog: MatDialog, // Inject MatDialog

  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchPersons();
      this.refreshCalendar();
      this.calendarOptions.eventClick = this.handleEventClick.bind(this);

      if (typeof interactionPlugin !== 'undefined') {
        this.calendarOptions.dateClick = this.handleDateClick.bind(this);
      }

      // Set selectedPerson and selectedProject to null
      this.selectedPerson = null;
      this.selectedProject = null;
    }
  }


  fetchPersons() {
    this.personService.getAllPersons().subscribe(
      (persons: Person[]) => {
        this.persons = persons;
        // If there are persons available and selectedPerson is not already set, leave it as null
        if (persons.length > 0 && !this.selectedPerson) {
          // Optionally, you can set a default person here if needed
          // this.selectedPerson = persons[0];
        }
        this.changeDetector.detectChanges();
      },
      (error: any) => {
        console.error('Error fetching persons:', error);
      }
    );
  }


  fetchProjects() {
    if (this.selectedPerson) {
      this.taskService.getProjectsByPerson(this.selectedPerson.id).subscribe(
        (projects: Project[]) => {
          this.projects = projects;
          if (projects.length > 0) {
            this.selectedProject = projects[0];
            this.fetchTasks();
          }
          this.changeDetector.detectChanges();
        },
        (error: any) => {
          console.error('Error fetching projects:', error);
        }
      );
    }
  }

  fetchTasks() {
    if (this.selectedPerson && this.selectedProject) {
      this.taskService.getTasksByProjectAndPerson(this.selectedProject.id!, this.selectedPerson.id).subscribe(
        (tasks: Task[]) => {
          this.tasks = tasks;
          this.currentEvents = tasks.map((task) => ({
            id: task.id,
            title: task.title,
            start: task.startDate,
            end: task.endDate,
            task: task
          }));
          this.calendarOptions.events = this.currentEvents;
          this.changeDetector.detectChanges(); // Trigger change detection
          this.refreshCalendar(); // Refresh the calendar
        },
        (error: any) => {
          console.error('Error fetching tasks:', error);
        }
      );
    }
  }

  viewTask(task: Task) {

    const scrollPosition = window.pageYOffset;
    const dialogRef = this.dialog.open(ViewTaskComponent, {
      width: '1000px',
      data: { task: task } // Pass the entire task object as data
    });
    dialogRef.afterClosed().subscribe(() => {
      window.scrollTo(0, scrollPosition);
    });
  }

  refreshCalendar(): void {
    if (this.fullCalendar && this.fullCalendar.nativeElement) {
      this.selectedPerson = null;
      this.selectedProject = null;
      this.projects = [];
      this.tasks = [];
      this.calendarOptions.events = [];

      this.changeDetector.detectChanges();
    }
  }

  handlePersonChange(person: Person | null) {
    this.selectedPerson = person;
    if (!person) {
      this.calendarOptions.events = [];
    }
    this.fetchProjects();
  }

  handleProjectChange(project: Project | null) {
    this.selectedProject = project;
    if (!project) {
      this.calendarOptions.events = [];
    }
    this.fetchTasks();
  }

  handleEventClick(clickInfo: any) {
    const task = clickInfo.event.extendedProps['task'];

    // Record the timestamp of the click
    const currentClickTime = new Date().getTime();

    // Check if it's a double click
    if (currentClickTime - this.lastClickTime < this.clickDelay) {
      // Double click detected, open the form dialog for updating the task
      this.openUpdateTaskDialog(task);
    } else {
      // Single click, open the view task dialog
      setTimeout(() => {
        if (this.lastClickTime === currentClickTime) {
          this.viewTask(task);
        }
      }, this.clickDelay);
    }

    // Update the last click time
    this.lastClickTime = currentClickTime;

    const eventElement = clickInfo.el;
    eventElement.style.cursor = 'pointer';
  }


  openUpdateTaskDialog(task: Task) {

    const scrollPosition = window.pageYOffset;
    const dialogRef = this.dialog.open(FormTaskComponent, {
      width: '600px',
      data: task
    });
    dialogRef.afterClosed().subscribe((result: Task) => {
      if (result) {
        if (result.id) {
          this.taskService.updateTask(result.id, result).subscribe(
            () => {
              this.showNotification('Task updated successfully', 'success');
              this.fetchPersons();
              this.fetchProjects();
              this.refreshCalendar()
            },
            (err: any) => {
              console.error(err);
              this.showNotification('Failed to update task', 'error');
            }
          );
        }
      }
    });
  }



  handleDateClick(selectionInfo: any) {
    if (this.selectedPerson && this.selectedProject) {
      const startDate = selectionInfo.startStr; // Start date of the clicked column
      const endDate = selectionInfo.endStr; // Get the end date of the selection

      // Ensure that selectedProject is not null before accessing its id
      if (this.selectedProject) {
        // Fetch the complete object for the selected project
        (this.projectService.getProject(this.selectedProject.id!) as any).subscribe(
          (project: Project) => {

            this.selectedProject = project;

            // Ensure that selectedPerson is not null before accessing its id
            if (this.selectedPerson) {
              // Fetch the complete object for the selected person
              this.personService.getPerson(this.selectedPerson.id).subscribe(
                (person: Person) => {


                  this.selectedPerson = person;

                  // Open the dialog for adding a task
                  const dialogRef = this.dialog.open(FormTaskComponent, {
                    width: '600px',
                    data: { startDate, endDate: selectionInfo.endStr, project: this.selectedProject, person: this.selectedPerson }
                  });
                  dialogRef.afterClosed().subscribe((result: Task) => {
                    if (result) {
                      // Assign the selected project and person to the task
                      result.projectId = this.selectedProject?.id;
                      result.assignPerson = this.selectedPerson;

                      // Add the task and assign the person to it using TaskService
                      this.taskService.addTask(result, this.selectedProject?.id!).subscribe(
                        (addedTask: Task) => {
                          // Assign the selected person to the task
                          this.taskService.addPersonToTask(addedTask.id!, this.selectedPerson!).subscribe(
                            () => {
                              this.showNotification('Task added successfully', 'success');
                              this.fetchPersons();
                              this.fetchProjects();
                              this.refreshCalendar();
                            },
                            (err: any) => {
                              console.error('Error assigning person to task:', err);
                              this.showNotification('Failed to add task', 'error');
                            }
                          );
                        },
                        (err: any) => {
                          console.error(err);
                          this.showNotification('Failed to add task', 'error');
                        }
                      );
                    }
                  });
                },
                (error: any) => {
                  console.error('Error fetching person:', error);
                }
              );
            }
          },
          (error: any) => {
            console.error('Error fetching project:', error);
          }
        );
      }
    } else {
      // Show a message indicating that both project and person need to be selected
      this.showNotification('Please select both a project and a person before adding a task', 'warning');
    }
  }

  private showNotification(message: string, panelClass: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [panelClass],
    });
  }

}
