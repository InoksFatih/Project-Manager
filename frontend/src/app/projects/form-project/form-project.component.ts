import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { Project } from '../../models/projectMod';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectService } from '../project.service';
import {Priority} from "../../models/priorityMod";
import {Status} from "../../models/statusMod";

@Component({
  selector: 'app-form-project',
  templateUrl: './form-project.component.html',
  styleUrls: ['./form-project.component.scss'],
})
export class FormProjectComponent implements OnInit {
  selectedDueDate!: Date | null;
  projectClients: any[] = [];
  disabled: boolean = false;
  public listePriority: any[] = [] ;
  public listeStatus: any[] = [] ;

  constructor(
    public dialogRef: MatDialogRef<FormProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private projectService: ProjectService,
  ) {}

  ngOnInit(): void {
    this.selectedDueDate = this.data.dueDate || null;
    this.getAllClients();
    this.disabled = !!this.data.id;
    this.listePriority = Object.keys(Priority);
    this.listeStatus = Object.keys(Status);
    if (!this.data.id) {
      this.data.status = Status.NOTSTARTED;
    }
  }

  getAllClients(): void {
    this.projectService.getAllClients().subscribe(clients => {
      this.projectClients = clients as any [];
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
    window.location.reload();
  }

  onDueDateChange(event: any): void {
    this.selectedDueDate = event.value;
  }

  onSubmit(projectForm: NgForm): void {
    if (projectForm.valid && projectForm.value) {
      const selectedDueDate = projectForm.value.dueDate;

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

      const project: Project = {
        id: this.data.id,
        title: projectForm.value.title,
        detail: projectForm.value.detail,
        dueDate: selectedDueDate,
        status: status,
        priority: projectForm.value.priority,
        projectClient: projectForm.value.projectClient,
        realDaysConsumed: projectForm.value.realDaysConsumed,
        plannedDays: projectForm.value.plannedDays,
      };
      this.updateOrAddProject(project);
    } else {
      this.showSnackbar('Please fill in all the fields.', 'error-notification');
    }
  }

  private updateOrAddProject(project: Project): void {
    const callback = () => {
      const message = project.id ? 'Project updated successfully' : 'Project added successfully';
      this.snackBar.open(message, 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: ['success-notification'],
      });
      this.projectService.refreshProjects();
    };

    this.dialogRef.close(project);
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
