import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgForm} from '@angular/forms';
import {Project} from '../../../models/projectMod';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ProjectService} from '../project.service';
import {Priority} from "../../../models/priorityMod";
import {Status} from "../../../models/statusMod";

@Component({
  selector: 'app-form-project',
  templateUrl: './form-project.component.html',
  styleUrls: ['./form-project.component.scss'],
})
export class FormProjectComponent implements OnInit {
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

  }
  onSubmit(projectForm: NgForm): void {
    if (projectForm.valid && projectForm.value) {

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

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'IMPORTANT':
        return 'red';
      case 'ESSENTIAL':
        return 'blue';
      case 'SECONDARY':
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
