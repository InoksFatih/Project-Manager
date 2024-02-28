import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgForm} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TaskService} from '../task.service';
import {Task} from '../../../models/taskMod';
import {Status} from "../../../models/statusMod";
import {Priority} from "../../../models/priorityMod";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";

@Component({
  selector: 'app-form-task',
  templateUrl: './form-task.component.html',
  styleUrls: ['./form-task.component.scss'],
})
export class FormTaskComponent implements OnInit {
  private projectId: any;
  selectedEndDate: Date | null;
  public listePriority: any[] = [] ;
  public listeStatus: any[] = [] ;
  public startDate: string;
  constructor(
    public dialogRef: MatDialogRef<FormTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private taskService: TaskService,


  ) {
    this.projectId = data?.projectId;
    this.selectedEndDate = data?.endDate;
    this.startDate = data.startDate; // Assign the startDate from the dialog data
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
  }
  onEndDateChange(event: any): void {
    this.selectedEndDate = event.value;
  }
  onStartDateChange(event: MatDatepickerInputEvent<Date>): void {
    this.data.startDate = event.value;
  }
  onSubmit(taskForm: NgForm): void {
    if (taskForm.valid) {
      if (taskForm.value) {
        const selectedEndDate = taskForm.value.endDate;

        if (selectedEndDate && selectedEndDate < new Date()) {
          this.showSnackbar('End date cannot be in the past.', 'error-notification');
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
          startDate: taskForm.value.startDate,
          endDate: selectedEndDate,
          detail: taskForm.value.detail,
          priority: taskForm.value.priority,
          projectId: this.projectId,
          id: this.data.id,
          plannedDays: parseFloat(taskForm.value.plannedDays || 0),
          realDaysConsumed: parseFloat(taskForm.value.realDaysConsumed || 0),
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
}
