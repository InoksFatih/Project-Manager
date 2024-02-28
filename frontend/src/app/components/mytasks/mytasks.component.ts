import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { Task } from "../../models/taskMod";
import { Person } from "../../models/personMod";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Subscription } from "rxjs";
import { TaskService } from "../tasks/task.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { SubtaskService } from "../subtasks/subtask.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PersonService } from "../../services/person.service";
import { AttachementService } from "../../services/attachement.service";
import { Priority } from "../../models/priorityMod";
import { Status } from "../../models/statusMod";
import { ViewTaskComponent } from "../tasks/view-task/view-task.component";
import { Subtask } from "../../models/subtaskMod";
import { Project } from "../../models/projectMod";
import { ProjectService } from "../projects/project.service";

@Component({
  selector: 'app-inbox',
  templateUrl: './mytasks.component.html',
  styleUrls: ['./mytasks.component.scss']
})
export class MytasksComponent implements OnInit, OnDestroy {

  public dataSource: MatTableDataSource<Task> = new MatTableDataSource<Task>([]);
  public persons: Person[] = [];
  public projects: Project[] = [];
  public tasks: Task[] = [];
  public displayedColumns: string[] = ['title', 'status', 'endDate', 'priority', 'subtasks', 'actions'];
  public selectedPerson: Person | null = null;
  public selectedProject: Project | null = null;
  public assignedTasks: { [key: number]: Task[] } = {}; // Store assigned tasks by person ID

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private projectId: any;
  private taskUpdatedSubscription!: Subscription;
  public listePriority: any[] = [];
  public listeStatus: any[] = [];

  constructor(
    protected taskService: TaskService,
    protected projectService: ProjectService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    protected subtaskService: SubtaskService,
    private route: ActivatedRoute,
    private router: Router,
    protected personService: PersonService,
    private attachementService: AttachementService
  ) { }

  ngOnDestroy() {
    if (this.taskUpdatedSubscription) {
      this.taskUpdatedSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.listePriority = Object.keys(Priority);
    this.listeStatus = Object.keys(Status);
    this.route.params.subscribe(params => {
      this.projectId = params['projectId'];
      this.refreshTasks();
    });

    this.personService.getAllPersons().subscribe(
      (data: Person[]) => {
        this.persons = data;
      },
      (err: any) => {
        console.error(err);
      }
    );

    this.taskUpdatedSubscription = this.taskService.taskUpdated$.subscribe(() => {
      this.refreshTasks();
    });
    this.personService.getAllPersons().subscribe(
      (data: Person[]) => {
        this.persons = data;
      },
      (err: any) => {
        console.error(err);
      }
    );
    (this.projectService.getAllProjects() as any).subscribe(
      (data: Project[]) => {
        this.projects = data;
      },
      (err: any) => {
        console.error(err);
      }
    );

  }

  viewTask(task: Task) {


    const dialogRef = this.dialog.open(ViewTaskComponent, {
      width: '1000px',
      data: { task: task } // Pass the entire task object as data
    });

  }
  redirectToSubtasks(taskId: number): void {
    this.router.navigate(['subtasks', taskId]);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
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
  private refreshTasks(): void {
    if (this.selectedPerson && this.selectedProject) {
      const personId = this.selectedPerson?.id; // Optional chaining to access id property
      const projectId = this.selectedProject?.id; // Optional chaining to access id property
      if (personId !== undefined && projectId !== undefined) {
        // Fetch tasks assigned to the selected person and project
        this.taskService.getTasksByProjectAndPerson(projectId, personId).subscribe(
          (data: Task[]) => {
            this.tasks = data.map(task => {
              // Fetch subtasks for each task
              this.subtaskService.getSubtasksByTask(task.id!).subscribe(
                (subtasks: Subtask[]) => {
                  task.subtasks = subtasks;
                },
                (err: any) => {
                  console.error(err);
                }
              );
              return task;
            });
            this.dataSource.data = this.tasks;
          },
          (err: any) => {
            console.error(err);
          }
        );
      } else {
        console.error("Person ID or Project ID is undefined");
      }
    } else {
      // Reset tasks when either person or project is not selected
      this.tasks = [];
      this.dataSource.data = this.tasks;
    }
  }



  getPriorityValue(priority: any) {
    switch (priority) {
      case "ESSENTIAL":
        return 'Essentiel';
      case "IMPORTANT":
        return 'Important';
      case "SECONDARY":
        return 'Secondaire';
      default:
        return '';
    }
  };
  getStatusValue(status: any) {
    switch (status) {
      case "COMPLETED":
        return 'Terminé';
      case "PENDING":
        return 'En cours';
      case "NOTSTARTED":
        return 'Non commencé';
      default:
        return '';
    }
  };

  onPersonSelectionChange(person: Person | null) {
    if (person !== null) {
      this.selectedPerson = person;
      const personId = person.id;
      // Fetch assigned projects for the selected person
      this.taskService.getProjectsByPerson(personId).subscribe(
        (data: Project[]) => {
          this.projects = data;
        },
        (err: any) => {
          console.error(err);
        }
      );
    } else {
      this.selectedPerson = null;
      this.selectedProject = null;
      this.refreshTasks();
    }
  }

  onProjectSelectionChange(project: Project | null) {
    if (project !== null) {
      this.selectedProject = project;
      const projectId = project.id;
      this.refreshTasks();
    } else {
      this.selectedProject = null;
      this.refreshTasks();
    }
  }


}
