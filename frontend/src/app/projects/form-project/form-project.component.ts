import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { Project } from '../../models/projectMod';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-form-project',
  templateUrl: './form-project.component.html',
  styleUrls: ['./form-project.component.scss'],
})
export class FormProjectComponent implements OnInit {
  selectedDueDate!: Date | null;
  projectClients: any[] = [];
  disabled: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<FormProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private projectService: ProjectService,
  ) {}

  ngOnInit(): void {
    this.selectedDueDate = this.data.project?.dueDate || null;
    this.getAllClients();
    this.disabled = !!this.data.project?.id;
  }

  getAllClients(): void {
    this.projectService.getAllClients().subscribe(clients => {
      this.projectClients = clients as any [];
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onDueDateChange(event: any): void {
    this.selectedDueDate = event.value;
  }

  onSubmit(projectForm: NgForm): void {
    if (projectForm.valid && projectForm.value) {
      const selectedDueDate = projectForm.value.dueDate;

      if (!this.data.project?.id && this.isDateTodayOrPast(selectedDueDate)) {
        this.showSnackbar('Due date must be in the future.', 'error-notification');
        return;
      }

      const project: Project = {
        id: this.data.project?.id,
        title: projectForm.value.title,
        detail: projectForm.value.detail,
        dueDate: selectedDueDate,
        status: projectForm.value.status,
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
}
