import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgForm} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TaskService} from '../task.service';
import {Task} from '../../models/taskMod';
import {Status} from "../../models/statusMod";
import {Priority} from "../../models/priorityMod";

@Component({
  selector: 'app-form-task',
  templateUrl: './form-task.component.html',
  styleUrls: ['./form-task.component.scss'],
})
export class FormTaskComponent implements OnInit {
  private projectId: any;
  selectedDueDate: Date | null;
  public listePriority: any[] = [] ;
  public listeStatus: any[] = [] ;

  constructor(
    public dialogRef: MatDialogRef<FormTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private taskService: TaskService,


  ) {
    this.projectId = data?.projectId;
    this.selectedDueDate = data?.dueDate;
  }

  ngOnInit(): void {
    this.listePriority = Object.keys(Priority);
    this.listeStatus = Object.keys(Status);
    if (!this.data.id) {
      this.data.status = Status.NOTSTARTED;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
    window.location.reload();
  }
  onDueDateChange(event: any): void {
    this.selectedDueDate = event.value;
  }
  onSubmit(taskForm: NgForm): void {
    if (taskForm.valid) {
      if (taskForm.value) {
        const selectedDueDate = taskForm.value.dueDate;

        if (!this.data.id && this.isDateTodayOrPast(selectedDueDate)) {
          this.showSnackbar('Due date must be in the future.', 'error-notification');
          return;
        }

        let status: Status;
        if (!this.data.id) {
          status = Status.NOTSTARTED;
        } else {
          status = this.data.status;
        }

        const task: Task = {
          title: taskForm.value.title,
          status: status,
          dueDate: selectedDueDate,
          detail: taskForm.value.detail,
          priority: taskForm.value.priority,
          projectId: this.projectId,
          id: this.data.id,
          plannedDays: taskForm.value.plannedDays,
          realDaysConsumed: taskForm.value.plannedDays,
        };

        this.updateOrAddTask(task);
      }
    } else {
      this.showSnackbar('Please fill in all the fields.', 'error-notification');
    }
  }


  private updateOrAddTask(task: Task): void {
    const callback = () => {
      const message = task.id ? 'Task updated successfully' : 'Task added successfully';
      this.snackBar.open(message, 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: ['success-notification'],
      });
      this.taskService.refreshTasks();
    };

    this.dialogRef.close(task);
  }



  private showSnackbar(message: string, panelClass: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: [panelClass],
    });
  }
  private isDateTodayOrPast(date: Date): boolean {
    const today = new Date();
    return date <= today;
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
      case 'Completed':
        return 'green';
      case 'Pending':
        return '#b9ad2a';
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
  }
}
