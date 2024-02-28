import { Component, OnInit, ViewChild } from '@angular/core';
import { SubtaskService } from './subtask.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Subtask } from '../../models/subtaskMod';
import { ActivatedRoute } from '@angular/router';
import {FormSubtaskComponent} from "./form-subtask/form-subtask.component";
import {Status} from "../../models/statusMod";
import {Priority} from "../../models/priorityMod";
import { ViewSubtaskComponent } from './view-subtask/view-subtask.component';

@Component({
  selector: 'app-subtasks',
  templateUrl: './subtasks.component.html',
  styleUrls: ['./subtasks.component.scss']
})
export class SubtasksComponent implements OnInit {
  public dataSource: MatTableDataSource<Subtask> = new MatTableDataSource<Subtask>([]);
  public subtasks: Subtask[] = [];
  public displayedColumns: string[] = ['title','status', 'priority', 'actions'];

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
              this.showNotification('Sous-tâche mise à jour avec succès', 'success');
              this.refreshSubtasksByTask(this.taskId);
            },
            (err: any) => {
              console.error(err);
              this.showNotification('Échec de la mise à jour de la sous-tâche', 'error');
            }
          );
        } else {
          this.subtaskService.addSubtask(result, this.taskId).subscribe(
            () => {
              this.showNotification('Sous-tâche ajoutée avec succès', 'success');
              this.refreshSubtasksByTask(this.taskId);
            },
            (err: any) => {
              console.error(err);
              this.showNotification('Échec de l\'ajout de la sous-tâche', 'error');
            }
          );
        }
      }
    });
    dialogRef.backdropClick().subscribe(() => {
      // Refresh the page
      this.refreshSubtasksByTask(this.taskId);
    });

  }

  deleteSubtask(subtaskId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette sous-tâche ?')) {
      this.subtaskService.deleteSubtask(subtaskId)
        .subscribe(() => {
          this.showNotification('Sous-tâche supprimée avec succès', 'success');
          this.refreshSubtasksByTask(this.taskId);
        }, err => {
          console.error(err);
          this.showNotification('Échec de la suppression de la sous-tâche', 'error');
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

  private refreshSubtasksByTask(taskId: number): void {
    this.subtaskService.getSubtasksByTask(taskId).subscribe(
      (data: Subtask[]) => {
        this.subtasks = data;
        this.dataSource.data = this.subtasks.slice();
      },
      (err: any) => {
        console.error(err);
      }
    );
  }

  viewSubtask(subtask: Subtask) {

    const dialogRef = this.dialog.open(ViewSubtaskComponent, {
      width: '1000px',
      data: { subtask: subtask }
    });
  }
  updateStatus(newStatus: Status, subtask: Subtask): void {

    const updatedSubtask: any = {
      id: subtask.id,
      status: newStatus,
      title: subtask.title,
      detail: subtask.detail,
      priority: subtask.priority,
      assignPerson: subtask.assignPerson,
    };

    this.subtaskService.updateSubtask(subtask.id!, updatedSubtask).subscribe(
      () => {
        subtask.status = newStatus;
        this.showNotification('Statut de la sous-tâche mis à jour avec succès', 'success');
      },
      (err: any) => {
        console.error('Erreur lors de la mise à jour du statut de la sous-tâche :', err);
        this.showNotification('Échec de la mise à jour du statut de la sous-tâche', 'error');
      }
    );
  }

  updatePriority(newPriority: Priority, subtask: Subtask): void {

    const updatedSubtask: any = {
      id: subtask.id,
      status: subtask.status,
      title: subtask.title,
      detail: subtask.detail,
      priority: newPriority,
      taskId: subtask.taskId,
      assignPerson: subtask.assignPerson,
    };
    this.subtaskService.updateSubtask(subtask.id!, updatedSubtask).subscribe(
      () => {
        subtask.priority = newPriority;
        this.showNotification('La priorité de la sous-tâche a été mise à jour avec succès', 'success');
      },
      (err: any) => {
        console.error('Erreur lors de la mise à jour de la priorité de la sous-tâche :', err);
        this.showNotification('Échec de la mise à jour de la priorité de la sous-tâche', 'error');
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
  private updateDataSource(): void {
    this.dataSource.data = this.subtasks.slice();
    this.refreshSubtasksByTask(this.taskId);
  }
}
