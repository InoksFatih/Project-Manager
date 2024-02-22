import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectService } from './project.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Project } from '../models/projectMod';
import { Router } from '@angular/router';
import { FormProjectComponent } from './form-project/form-project.component';
import {TaskService} from "../tasks/task.service";
import { Task } from '../models/taskMod';
import {Subtask} from "../models/subtaskMod";
import {ViewSubtaskComponent} from "../subtasks/view-subtask/view-subtask.component";
import {ViewProjectComponent} from "./view-project/view-project.component";
import {Priority} from "../models/priorityMod";
import {Status} from "../models/statusMod";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  public dataSource: MatTableDataSource<Project> = new MatTableDataSource<Project>([]);
  public projects: Project[] = [];
  public displayedColumns: string[] = [ 'title', 'dueDate', 'status', 'priority','projectClient', 'tasks', 'actions'];
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
      window.location.reload();
    });
  }
  viewProject(project: Project) {
    console.log('Received task:', project);
    console.log('Task ID:', project.id);

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
              this.showNotification('Project updated successfully', 'success');
              this.refreshProjects();
            },
            (err: any) => {
              console.error(err);
              this.showNotification('Failed to update project', 'error');
            }
          );
        } else {
          const projectId = result.projectClient?.id;
          this.projectService.addProject(result, projectId!).subscribe(
            () => {
              this.showNotification('Project added successfully', 'success');
              this.refreshProjects();
            },
            (err: any) => {
              console.error(err);
              this.showNotification('Failed to add project', 'error');
            }
          );
        }
      }
    });
  }


  deleteProject(projectId: number): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(projectId).subscribe(
        () => {
          this.refreshProjects();
          this.showNotification('Project deleted successfully', 'success');
        },
        (err: any) => {
          console.error(err);
          this.showNotification('Failed to delete project', 'error');
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

        // Fetch tasks for each project
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
    console.log('New Status:', newStatus);
    console.log('Project:', project);

    const updatedProject: any = {
      id: project.id,
      status: newStatus,
      title: project.title,
      detail: project.detail,
      dueDate: project.dueDate,
      priority: project.priority,
      projectClient: project.projectClient,
      plannedDays: project.plannedDays,
      realDaysConsumed: project.realDaysConsumed,
    };
    this.projectService.updateProject(project.id!, updatedProject).subscribe(
      () => {
        project.status = newStatus;
        this.showNotification('Project status updated successfully', 'success');
      },
      (err: any) => {
        console.error('Error updating project status:', err);
        this.showNotification('Failed to update Project status', 'error');
      }
    );
  }
  updatePriority(newPriority: Priority, project: Project): void {
    console.log('New Priority:', newPriority);
    console.log('Project:', project);

    const updatedProject: any = {
      id: project.id,
      status: project.status,
      title: project.title,
      detail: project.detail,
      dueDate: project.dueDate,
      priority: newPriority,
      projectClient: project.projectClient,
      plannedDays: project.plannedDays,
      realDaysConsumed: project.realDaysConsumed,
    };
    this.projectService.updateProject(project.id!, updatedProject).subscribe(
      () => {
        project.priority = newPriority;
        this.showNotification('Project priority updated successfully', 'success');
      },
      (err: any) => {
        console.error('Error updating project priority:', err);
        this.showNotification('Failed to update Project priority', 'error');
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
}
