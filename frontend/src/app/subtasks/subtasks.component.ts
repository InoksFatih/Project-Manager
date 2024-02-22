import { Component, OnInit, ViewChild } from '@angular/core';
import { SubtaskService } from './subtask.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Subtask } from '../models/subtaskMod';
import { ActivatedRoute } from '@angular/router';
import {FormSubtaskComponent} from "./form-subtask/form-subtask.component";
import {Task} from "../models/taskMod";
import {Status} from "../models/statusMod";
import {Priority} from "../models/priorityMod";
import {ViewTaskComponent} from "../tasks/view-task/view-task.component";
import { ViewSubtaskComponent } from './view-subtask/view-subtask.component';

@Component({
  selector: 'app-subtasks',
  templateUrl: './subtasks.component.html',
  styleUrls: ['./subtasks.component.scss']
})
export class SubtasksComponent implements OnInit {
  public dataSource: MatTableDataSource<Subtask> = new MatTableDataSource<Subtask>([]);
  public subtasks: Subtask[] = [];
  public displayedColumns: string[] = ['title','status', 'dueDate', 'priority', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private taskId: any;
  public listePriority: any[] = [] ;
  public listeStatus: any[] = [] ;

  constructor(
    protected subtaskService: SubtaskService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private route: ActivatedRoute

  ) { }

  ngOnInit() {
    this.listePriority = Object.keys(Priority);
    this.listeStatus = Object.keys(Status);
    this.route.params.subscribe(params => {
      this.taskId = params['taskId'];
      if (this.taskId) {
        this.refreshSubtasksByTask(this.taskId);
      } else {

        this.refreshSubtasks();
      }
    });
  }

  openSubtaskDialog(subtask?: Subtask): void {
    const dialogRef = this.dialog.open(FormSubtaskComponent, {
      width:'600px',
      data: subtask || {},
    });
    dialogRef.afterOpened().subscribe(() => {

      const textarea = document.querySelector('.mat-dialog-content textarea');


      if (textarea) {
        textarea.addEventListener('input', () => {

          const newWidth = textarea.scrollWidth + 32; // Add some padding


          dialogRef.updateSize(`${newWidth}px`, 'auto');
        });
      }
    });
    dialogRef.afterClosed().subscribe((result: Subtask) => {
      if (result) {
        if (result.id) {
          this.subtaskService.updateSubtask(result.id, result).subscribe(
            () => {
              this.showNotification('Subtask updated successfully', 'success');
              this.refreshSubtasksByTask(this.taskId);
            },
            (err: any) => {
              console.error(err);
              this.showNotification('Failed to update Subtask', 'error');
            }
          );
        } else {
          this.subtaskService.addSubtask(result, this.taskId).subscribe(
            () => {
              this.showNotification('Subtask added successfully', 'success');
              this.refreshSubtasksByTask(this.taskId);
            },
            (err: any) => {
              console.error(err);
              this.showNotification('Failed to add subtask', 'error');
            }
          );
        }
      }
    });
  }


  deleteSubtask(subtaskId: number) {
    if (confirm('Are you sure you want to delete this subtask?')) {
      this.subtaskService.deleteSubtask(subtaskId)
        .subscribe(() => {
          this.showNotification('Subtask deleted successfully', 'success');
          this.refreshSubtasksByTask(this.taskId);
        }, err => {
          console.error(err);
          this.showNotification('Failed to delete subtask', 'error');
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

  private refreshSubtasks(): void {
    this.subtaskService.getAllSubtasks().subscribe(
      (data: Subtask[]) => {
        this.subtasks = data;
        this.dataSource.data = this.subtasks;
      },
      (err: any) => {
        console.error(err);
      }
    );
  }

  private refreshSubtasksByTask(taskId: number): void {
    this.subtaskService.getSubtasksByTask(taskId).subscribe(
      (data: Subtask[]) => {
        this.subtasks = data;
        this.dataSource.data = this.subtasks;
      },
      (err: any) => {
        console.error(err);
      }
    );
  }
  viewSubtask(subtask: Subtask) {
    console.log('Received task:', subtask);
    console.log('Task ID:', subtask.id);

    const dialogRef = this.dialog.open(ViewSubtaskComponent, {
      width: '1000px',
      data: { subtask: subtask }
    });
  }
  updateStatus(newStatus: Status, subtask: Subtask): void {
    console.log('New Status:', newStatus);
    console.log('Subtask:', subtask);

    const updatedSubtask: any = {
      id: subtask.id,
      status: newStatus,
      title: subtask.title,
      detail: subtask.detail,
      dueDate: subtask.dueDate,
      priority: subtask.priority,
      assignPerson: subtask.assignPerson,
      plannedDays: subtask.plannedDays,
      realDaysConsumed: subtask.realDaysConsumed,

    };

    this.subtaskService.updateSubtask(subtask.id!, updatedSubtask).subscribe(
      () => {
        subtask.status = newStatus;
        this.showNotification('Subtask status updated successfully', 'success');
      },
      (err: any) => {
        console.error('Error updating subtask status:', err);
        this.showNotification('Failed to update subtask status', 'error');
      }
    );
  }
  getStatusPanelClass(status: string): string {
    switch (status) {
      case 'Completed':
        return 'green';
      case 'Pending':
        return 'yellow';
      case 'Not Started':
        return 'grey';
      default:
        return '';
    }
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
  updatePriority(newPriority: Priority, subtask: Subtask): void {
    console.log('New Priority:', newPriority);
    console.log('Subtask:', subtask);

    const updatedSubtask: any = {
      id: subtask.id,
      status: subtask.status,
      title: subtask.title,
      detail: subtask.detail,
      dueDate: subtask.dueDate,
      priority: newPriority,
      taskId: subtask.taskId,
      assignPerson: subtask.assignPerson,
      plannedDays: subtask.plannedDays,
      realDaysConsumed: subtask.realDaysConsumed,
    };
    this.subtaskService.updateSubtask(subtask.id!, updatedSubtask).subscribe(
      () => {
        subtask.priority = newPriority;
        this.showNotification('Subtask priority updated successfully', 'success');
      },
      (err: any) => {
        console.error('Error updating subtask priority:', err);
        this.showNotification('Failed to update Subtask priority', 'error');
      }
    );
}
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
