import { Component, OnInit, ViewChild, OnDestroy, ViewEncapsulation,   } from '@angular/core';
import { TaskService } from "./task.service";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from '@angular/material/dialog';
import { Task } from "../models/taskMod";
import { ActivatedRoute, Router } from "@angular/router";
import { Person } from "../models/personMod";
import { PersonService } from "../services/person.service";
import { MatSelectChange } from "@angular/material/select";
import {last, Subscription} from "rxjs";
import { FormTaskComponent } from "./form-task/form-task.component";
import {SubtaskService} from "../subtasks/subtask.service";
import { Subtask } from '../models/subtaskMod';
import { UploadComponent } from './upload/upload.component';
import { AttachementService } from "../services/attachement.service";
import {ViewTaskComponent} from "./view-task/view-task.component";
import {Priority} from "../models/priorityMod";
import {Status} from "../models/statusMod";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TasksComponent implements OnInit, OnDestroy {
  public dataSource: MatTableDataSource<Task> = new MatTableDataSource<Task>([]);
  public tasks: Task[] = [];
  public persons: Person[] = [];
  public displayedColumns: string[] = [ 'title','status', 'dueDate', 'priority', 'assignPerson', 'subtasks', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private projectId: any;
  private taskUpdatedSubscription!: Subscription;
  public listePriority: any[] = [] ;
  public listeStatus: any[] = [] ;


  constructor(
    protected taskService: TaskService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    protected subtaskService: SubtaskService,
    private route: ActivatedRoute,
    private router: Router,
    protected personService: PersonService,
    private attachementService: AttachementService
  ) { }

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
  }

  ngOnDestroy() {
    if (this.taskUpdatedSubscription) {
      this.taskUpdatedSubscription.unsubscribe();
    }
  }


  getAssignedPersonForTask(taskId: number): void {
    this.taskService.getAssignedPersonForTask(taskId).subscribe(
      (assignedPerson: Person) => {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
          this.tasks[taskIndex].assignPerson = assignedPerson;
        }
      },
      (error: any) => {
         console.error('Error getting assigned person for task:', error);
      }
    );
  }
  updateStatus(newStatus: Status, task: Task): void {
    console.log('New Status:', newStatus);
    console.log('Task:', task);

    const updatedTask: any = {
      id: task.id,
      status: newStatus,
      title: task.title,
      detail: task.detail,
      dueDate: task.dueDate,
      priority: task.priority,
      projectId: task.projectId,
      assignPerson: task.assignPerson,
      subtasks: task.subtasks
    };

    this.taskService.updateTask(task.id!, updatedTask).subscribe(
      () => {
        task.status = newStatus;
        this.showNotification('Task status updated successfully', 'success');
      },
      (err: any) => {
        console.error('Error updating task status:', err);
        this.showNotification('Failed to update task status', 'error');
      }
    );
  }




  viewTask(task: Task) {
    console.log('Received task:', task);
    console.log('Task ID:', task.id);

    const dialogRef = this.dialog.open(ViewTaskComponent, {
      width: '1000px',
      data: { task: task } // Pass the entire task object as data
    });

  }


  assignPerson(event: MatSelectChange, task: Task): void {
    if (!task.id) {
      console.error('Task ID is undefined or null');
      return;
    }

    if (event.value) {
      const selectedPerson = event.value;
      this.addPersonToTask(task, selectedPerson);
    } else {
      this.removePersonFromTask(task);
    }
  }

  private addPersonToTask(task: Task, person: Person): void {
    this.taskService.addPersonToTask(task.id!, person).subscribe(
      (result: Task) => {
        task.assignPerson = person;
        this.showNotification(`Assigned ${person.firstName} to task: ${task.title}`, 'success');
      },
      (err: any) => {
        console.error('Error assigning person to task:', err);
        this.showNotification('Failed to assign person to task', 'error');
      }
    );
  }
  openUploadDialog(task: Task): void {
    const dialogRef = this.dialog.open(UploadComponent, {
      width: '600px',
      data: { taskId: task.id }
    });
  console.log("Task id is : " + task);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshTasks();
      }
    });
  }

  protected removePersonFromTask(task: Task): void {
    if (!task || !task.assignPerson) {
      console.error('Task or assigned person is undefined or invalid');
      return;
    }

    const personId = task.assignPerson.id;

    this.taskService.removePersonFromTask(personId, task.id!).subscribe(
      () => {
        this.showNotification('Person removed from task successfully', 'success');
        task.assignPerson = null;
      },
      (error) => {
        console.error('Error removing person from task:', error);
        this.showNotification('Failed to remove person from task', 'error');
      }
    );
  }

  redirectToSubtasks(taskId: number): void {
    this.router.navigate(['subtasks', taskId]);
  }

  openTaskDialog(task?: Task): void {
    const dialogRef = this.dialog.open(FormTaskComponent, {
      width: '600px',
      data: task || {},
    });
    dialogRef.afterClosed().subscribe((result: Task) => {
      if (result) {
        if (result.id) {
          this.taskService.updateTask(result.id, result).subscribe(
            () => {
              this.showNotification('Task updated successfully', 'success');
              this.refreshTasks();
            },
            (err: any) => {
              console.error(err);
              this.showNotification('Failed to update task', 'error');
            }
          );
        } else {
          this.taskService.addTask(result, this.projectId).subscribe(
            () => {
              this.showNotification('Task added successfully', 'success');
              this.refreshTasks();
            },
            (err: any) => {
              console.error(err);
              this.showNotification('Failed to add task', 'error');
            }
          );
        }
      }
    });
    dialogRef.backdropClick().subscribe(() => {
      // Refresh the page
      this.refreshTasks();
    });
  }

  deleteTask(taskId: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId)
        .subscribe(() => {
          this.showNotification('Task deleted successfully', 'success');
          this.refreshTasks();
        }, err => {
          console.error(err);
          this.showNotification('Failed to delete task', 'error');
        });
    }
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
    if (this.projectId) {
      this.refreshTasksByProject(this.projectId);
    } else {
      this.taskService.getAllTasks().subscribe(
        (data: Task[]) => {
          this.tasks = data;
          this.dataSource.data = this.tasks;

          this.tasks.forEach(task => {
            if (task.id) {
              this.getAssignedPersonForTask(task.id);
            }
          });
        },
        (err: any) => {
          console.error(err);
        }
      );
    }
  }
  private refreshTasksByProject(projectId: number): void {
    this.taskService.getTasksByProject(projectId).subscribe(
      (data: Task[]) => {
        this.tasks = data;
        this.tasks.forEach(task => {
          this.subtaskService.getSubtasksByTask(task.id!).subscribe(
            (subtasks: Subtask[]) => {
              task.subtasks = subtasks;
            },
            (err: any) => {
              console.error(err);
            }
          );
        });
        this.dataSource.data = this.tasks;
        this.tasks.forEach(task => {
          if (task.id) {
            this.getAssignedPersonForTask(task.id);
          }
        });
      },
      (err: any) => {
        console.error(err);
      }
    );
  }

  updatePriority(newPriority: Priority, task: Task): void {
    console.log('New Priority:', newPriority);
    console.log('Task:', task);

    const updatedTask: any = {
      id: task.id,
      status: task.status,
      title: task.title,
      detail: task.detail,
      dueDate: task.dueDate,
      priority: newPriority,
      projectId: task.projectId,
      assignPerson: task.assignPerson,
      subtasks: task.subtasks
    };

    this.taskService.updateTask(task.id!, updatedTask).subscribe(
      () => {
        task.priority = newPriority;
        this.showNotification('Task priority updated successfully', 'success');
      },
      (err: any) => {
        console.error('Error updating task priority:', err);
        this.showNotification('Failed to update task priority', 'error');
      }
    );
  }

  getPriorityValue(priority: any) {
    switch (priority) {
      case "ESSENTIAL":
        return 'Essential';
      case "IMPORTANT":
        return 'Important';
      case "SECONDAIRE":
        return 'Secondaire';
      default:
        return '';
    }
  };
  getStatusValue(status: any) {
    switch (status) {
      case "COMPLETED":
        return 'Completed';
      case "PENDING":
        return 'Pending';
      case "NOTSTARTED":
        return 'Not Started';
      default:
        return '';
    }
  };
  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'IMPORTANT':
        return 'red';
      case 'ESSENTIAL':
        return 'blue';
      case 'SECONDAIRE':
        return 'green';
      default:
        return '';
    }
  }
  getStatusColor(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'green';
      case 'PENDING':
        return '#b9ad2a';
      case 'NOTSTARTED':
        return 'grey';
      default:
        return '';
    }
  }

}
