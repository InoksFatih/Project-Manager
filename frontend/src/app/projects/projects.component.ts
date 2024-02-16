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

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  public dataSource: MatTableDataSource<Project> = new MatTableDataSource<Project>([]);
  public projects: Project[] = [];
  public displayedColumns: string[] = [ 'title', 'dueDate', 'status', 'priority','projectClient', 'tasks', 'actions'];

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
  }

  redirectToTasks(projectId: number): void {
    this.router.navigate(['/tasks', projectId]).then(() => {
      window.location.reload();
    });
  }

  openProjectDialog(project?: Project): void {
    if (project && project.id) {
      // If project is provided and it has an ID, fetch the project data
      (this.projectService.getProject(project.id) as any).subscribe(
        (fetchedProject: Project) => {
          // Fetch project clients
          this.fetchProjectClients(fetchedProject);
        },
        (error: any) => {
          console.error('Failed to fetch project:', error);
        }
      );
    } else {
      // If no project is provided or it doesn't have an ID, fetch only project clients
      this.fetchProjectClients(null);
    }
  }

  fetchProjectClients(project: Project | null): void {
    (this.projectService.getAllClients() as any).subscribe(
      (projectClients: any[]) => {
        console.log('Project clients:', projectClients); // Log project clients
        const dialogRef = this.dialog.open(FormProjectComponent, {
          width: '600px',
          data: project ? { project: project, projectClients: projectClients } : { projectClients: projectClients }
        });

        dialogRef.afterClosed().subscribe((result: Project) => {
          if (result) {
            if (result.id) {
              // If the result has an ID, it means we are updating an existing project
              console.log('Updating project with ID:', result.id);
              this.projectService.updateProject(result.id, result).subscribe(
                () => {
                  this.showNotification('Project updated successfully', 'success');
                  this.refreshProjects(); // You can define the refreshProjects() method to update your project list
                },
                (err: any) => {
                  console.error('Failed to update project:', err);
                  this.showNotification('Failed to update project', 'error');
                }
              );
            } else {
              // If the result does not have an ID, it means we are adding a new project
              console.log('Adding new project');
              const projectId = result.projectClient!.id;
              this.projectService.addProject(result, projectId!).subscribe(
                () => {
                  this.showNotification('Project added successfully', 'success');
                  this.refreshProjects(); // You can define the refreshProjects() method to update your project list
                },
                (err: any) => {
                  console.error('Failed to add project:', err);
                  this.showNotification('Failed to add project', 'error');
                }
              );
            }
          }
        });
      },
      (error: any) => {
        console.error('Failed to fetch project clients:', error);
      }
    );
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
}
