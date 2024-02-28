import { Component, OnInit, ViewChild, OnDestroy, ViewEncapsulation,   } from '@angular/core';
import { TaskService } from "./task.service";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from '@angular/material/dialog';
import { Task } from "../../models/taskMod";
import { ActivatedRoute, Router } from "@angular/router";
import { Person } from "../../models/personMod";
import { PersonService } from "../../services/person.service";
import { MatSelectChange } from "@angular/material/select";
import { Subscription} from "rxjs";
import { FormTaskComponent } from "./form-task/form-task.component";
import {SubtaskService} from "../subtasks/subtask.service";
import { Subtask } from '../../models/subtaskMod';
import { UploadComponent } from './upload/upload.component';
import { AttachementService } from "../../services/attachement.service";
import {ViewTaskComponent} from "./view-task/view-task.component";
import {Priority} from "../../models/priorityMod";
import {Status} from "../../models/statusMod";
import { Attachement } from '../../models/attachementModel';

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
  public displayedColumns: string[] = [ 'title','status', 'endDate', 'priority', 'assignPerson', 'subtasks', 'actions'];

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
      () => {
        // Do nothing if there's is no Assigned Person
      }
    );
  }

  updateStatus(newStatus: Status, task: Task): void {

    const updatedTask: any = {
      id: task.id,
      status: newStatus,
      title: task.title,
      detail: task.detail,
      startDate: task.startDate,
      endDate: task.endDate,
      priority: task.priority,
      projectId: task.projectId,
      assignPerson: task.assignPerson,
      subtasks: task.subtasks
    };

    this.taskService.updateTask(task.id!, updatedTask).subscribe(
      () => {
        task.status = newStatus;
        this.showNotification('Statut de la tâche mis à jour avec succès', 'success');
      },
      (err: any) => {
        console.error('Erreur lors de la mise à jour du statut de la tâche :', err);
        this.showNotification('Échec de la mise à jour du statut de la tâche', 'error');
      }
    );
  }




  viewTask(task: Task) {

    const dialogRef = this.dialog.open(ViewTaskComponent, {
      width: '1000px',
      data: { task: task } // Pass the entire task object as data
    });

  }


  assignPerson(event: MatSelectChange, task: Task): void {
    if (!task.id) {
      console.error('ID de tâche est indéfini ou nul');
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
        this.showNotification(`Affecté ${person.firstName} à la tâche : ${task.title}`, 'success');
      },
      (err: any) => {
        console.error('Erreur lors de l\'attribution de la personne à la tâche :', err);
        this.showNotification('Échec de l\'attribution de la personne à la tâche', 'error');
      }
    );
  }

  isDialogOpen: boolean = false;

  openUploadDialog(task: Task): void {
    if (!this.isDialogOpen) {
      this.isDialogOpen = true;
      this.attachementService.getAttachementByTask(task.id!).subscribe(
        (attachement?: Attachement) => {
          const dialogRef = this.dialog.open(UploadComponent, {
            width: '600px',
            data: { task: task, attachement: attachement! }
          });

          dialogRef.afterClosed().subscribe(result => {
            this.isDialogOpen = false;
            if (result) {
              this.refreshTasks();
            }
          });
        },
        (err) => {
          if (err.status === 404) {
            const dialogRef = this.dialog.open(UploadComponent, {
              width: '600px',
              data: { task: task }
            });

            dialogRef.afterClosed().subscribe(result => {
              this.isDialogOpen = false;
              if (result) {
                this.refreshTasks();
              }
            });
          } else {
          }
        }
      );
    }
  }




  protected removePersonFromTask(task: Task): void {
    if (!task || !task.assignPerson) {
      console.error('Tâche ou personne assignée est indéfinie ou invalide');
      return;
    }

    const personId = task.assignPerson.id;

    this.taskService.removePersonFromTask(personId, task.id!).subscribe(
      () => {
        this.showNotification('Personne retirée de la tâche avec succès', 'success');
        task.assignPerson = null;
      },
      (error) => {
        console.error('Erreur lors de la suppression de la personne de la tâche :', error);
        this.showNotification('Échec de la suppression de la personne de la tâche', 'error');
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
          // Update task in the array
          const index = this.tasks.findIndex(t => t.id === result.id);
          if (index !== -1) {
            this.tasks[index] = result;
          }
          // Update task in the database
          this.taskService.updateTask(result.id, result).subscribe(
            () => {
              this.showNotification('Tâche mise à jour avec succès', 'success');
              this.updateDataSource(); // Update data source after successful update
            },
            (err: any) => {
              console.error(err);
              this.showNotification('Échec de la mise à jour de la tâche.', 'error');
            }
          );
        } else {
          // Add new task to the array
          this.taskService.addTask(result, this.projectId).subscribe(
            (addedTask: Task) => {
              this.tasks.push(addedTask);
              this.showNotification('Tâche ajoutée avec succès', 'success');
              this.updateDataSource(); // Update data source after successful addition
            },
            (err: any) => {
              console.error(err);
              this.showNotification('Échec de l\'ajout de la tâche', 'error');
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
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      this.taskService.deleteTask(taskId)
        .subscribe(() => {
          this.showNotification('Tâche supprimée', 'success');
          this.refreshTasks();
        }, err => {
          console.error(err);
          this.showNotification('Échec de la suppression de la tâche', 'error');
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
          this.updateDataSource();

          this.tasks.forEach(task => {
            if (task.id) {
              this.getAssignedPersonForTask(task.id);
            }
          });
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
      }
    );
  }

  updatePriority(newPriority: Priority, task: Task): void {

    const updatedTask: any = {
      id: task.id,
      status: task.status,
      title: task.title,
      detail: task.detail,
      startDate: task.startDate,
      endDate: task.endDate,
      priority: newPriority,
      projectId: task.projectId,
      assignPerson: task.assignPerson,
      subtasks: task.subtasks
    };

    this.taskService.updateTask(task.id!, updatedTask).subscribe(
      () => {
        task.priority = newPriority;
        this.showNotification('La priorité de la tâche a été mise à jour', 'success');
      },
      (err: any) => {
        console.error('Error updating task priority:', err);
        this.showNotification('Échec de la mise à jour de la priorité de la tâche.', 'error');
      }
    );
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'Important':
        return 'red';
      case 'Essentiel':
        return 'blue';
      case 'Secondaire':
        return 'green';
      default:
        return '';
    }
  }
  getStatusColor(status: string): string {
    switch (status) {
      case 'Terminé':
        return 'green';
      case 'En cours':
        return '#b9ad2a';
      case 'Non commencé':
        return 'grey';
      default:
        return '';
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
  private updateDataSource(): void {
    this.dataSource.data = this.tasks.slice();
    this.refreshTasks();
  }
}
