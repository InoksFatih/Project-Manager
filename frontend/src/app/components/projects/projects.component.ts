import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectService } from './project.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Project } from '../../models/projectMod';
import { Router } from '@angular/router';
import { FormProjectComponent } from './form-project/form-project.component';
import {TaskService} from "../tasks/task.service";
import { Task } from '../../models/taskMod';
import {ViewProjectComponent} from "./view-project/view-project.component";
import {Priority} from "../../models/priorityMod";
import {Status} from "../../models/statusMod";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  public dataSource: MatTableDataSource<Project> = new MatTableDataSource<Project>([]);
  public projects: Project[] = [];
  public displayedColumns: string[] = [ 'title', 'status', 'priority','projectClient', 'tasks', 'actions'];
  public listePriority: any[] = [] ;
  public listeStatus: any[] = [] ;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(
    protected projectService: ProjectService,
    protected taskService: TaskService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.refreshProjects();
    this.listePriority = Object.keys(Priority);
    this.listeStatus = Object.keys(Status);
  }

  redirectToTasks(projectId: number): void {
    this.router.navigate(['/tasks', projectId]).then(() => {
    });
  }
  viewProject(project: Project) {

    const dialogRef = this.dialog.open(ViewProjectComponent, {
      width: '1000px',
      data: { project: project }
    });
  }
  openProjectDialog(project?: Project): void {
    const dialogRef = this.dialog.open(FormProjectComponent, {
      width: '600px',
      data: project || {},
    });

    dialogRef.afterClosed().subscribe((result: Project) => {
      if (result) {
        if (result.id) {
          this.projectService.updateProject(result.id, result).subscribe(
            () => {
              this.showNotification('Projet mis à jour avec succès', 'success');
              this.refreshProjects();
            },
            (err: any) => {
              console.error(err);
              this.showNotification('Échec de la mise à jour du projet', 'error');
            }
          );
        } else {
          const projectId = result.projectClient?.id;
          this.projectService.addProject(result, projectId!).subscribe(
            () => {
              this.showNotification('Projet ajouté avec succès', 'success');
              this.refreshProjects();
            },
            (err: any) => {
              console.error(err);
              this.showNotification('Échec de l\'ajout du projet', 'error');
            }
          );
        }
      }
    });
  }


  deleteProject(projectId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      this.projectService.deleteProject(projectId).subscribe(
        () => {
          this.refreshProjects();
          this.showNotification('Projet supprimé avec succès', 'success');
        },
        (err: any) => {
          console.error(err);
          this.showNotification('Échec de la suppression du projet', 'error');
        }
      );
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

  private refreshProjects(): void {
    (this.projectService.getAllProjects() as any).subscribe(
      (data: Project[]) => {
        this.projects = data;

        if (this.projects) { // Check if this.projects is not null or undefined
          this.projects.forEach(project => {
            this.taskService.getTasksByProject(project.id!).subscribe(
              (tasks: Task[]) => {
                project.tasks = tasks;
              },
              (err: any) => {
                console.error(err);
              }
            );
          });

          this.dataSource.data = this.projects;
        } else {
          // Handle case where projects is null or undefined
          this.dataSource.data = [];
        }
      },
      (err: any) => {
        console.error(err);
      }
    );
  }


  getTasksCount(project: Project): number {
    return project.tasks?.length || 0;
  }
  updateStatus(newStatus: Status, project: Project): void {
    const updatedProject: any = {
      id: project.id,
      status: newStatus,
      title: project.title,
      detail: project.detail,
      priority: project.priority,
      projectClient: project.projectClient,
      plannedDays: project.plannedDays,
      realDaysConsumed: project.realDaysConsumed,
    };
    this.projectService.updateProject(project.id!, updatedProject).subscribe(
      () => {
        project.status = newStatus;
        this.showNotification('Statut du projet mis à jour avec succès', 'success');
      },
      (err: any) => {
        console.error('Erreur lors de la mise à jour du statut du projet :', err);
        this.showNotification('Échec de la mise à jour du statut du projet', 'error');
      }
    );
  }
  updatePriority(newPriority: Priority, project: Project): void {

    const updatedProject: any = {
      id: project.id,
      status: project.status,
      title: project.title,
      detail: project.detail,
      priority: newPriority,
      projectClient: project.projectClient,
      plannedDays: project.plannedDays,
      realDaysConsumed: project.realDaysConsumed,
    };
    this.projectService.updateProject(project.id!, updatedProject).subscribe(
      () => {
        project.priority = newPriority;
        this.showNotification('Priorité du projet mise à jour avec succès', 'success');
      },
      (err: any) => {
        console.error('Erreur lors de la mise à jour de la priorité du projet :', err);
        this.showNotification('Échec de la mise à jour de la priorité du projet', 'error');
      }
    );
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
