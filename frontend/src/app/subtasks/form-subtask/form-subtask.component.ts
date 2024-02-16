import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

import {NgForm} from "@angular/forms";
import {SubtaskService} from "../subtask.service";
import {Subtask} from "../../models/subtaskMod";
import {Status} from "../../models/statusMod";
import {Priority} from "../../models/priorityMod";

@Component({
  selector: 'app-form-subtask',
  templateUrl: './form-subtask.component.html',
  styleUrl: './form-subtask.component.scss'
})
export class FormSubtaskComponent implements OnInit {
  private taskId: any;
  selectedDueDate: Date | null;
  public listePriority: any[] = [] ;
  public listeStatus: any[] = [] ;

  constructor(
    public dialogRef: MatDialogRef<FormSubtaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private subtaskService: SubtaskService
  ) {
    this.taskId = data?.taskId;
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
  onSubmit(subtaskForm: NgForm): void {
    if (subtaskForm.valid) {
      if (subtaskForm.value) {
        const selectedDueDate = subtaskForm.value.dueDate;

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

        const subtask: Subtask = {
          title: subtaskForm.value.title,
          status: status,
          dueDate: selectedDueDate,
          detail: subtaskForm.value.detail,
          priority: subtaskForm.value.priority,
          plannedDays: subtaskForm.value.plannedDays,
          realDaysConsumed: subtaskForm.value.realDaysConsumed,
          assignPerson: subtaskForm.value.assignPerson,
          taskId: this.taskId,
          id: this.data.id,
        };

        this.updateOrAddSubtask(subtask);
      }
    } else {
      this.showSnackbar('Please fill in all the fields.', 'error-notification');
    }
  }

  private updateOrAddSubtask(subtask: Subtask): void {
    const callback = () => {
      const message = subtask.id ? 'Subtask updated successfully' : 'Subtask added successfully';
      this.snackBar.open(message, 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: ['success-notification'],
      });
      this.subtaskService.refreshSubtasks();
    };

    this.dialogRef.close(subtask);
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
