import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Attachement } from '../../../models/attachementModel';
import { AttachementService } from '../../../services/attachement.service';
import {Task} from "../../../models/taskMod";
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  attachement: Attachement = new Attachement();
  isDialogOpen: boolean = false;
  selectedTask: Task | undefined;

  constructor(
    public dialogRef: MatDialogRef<UploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private attachementService: AttachementService
  ) {
    if (data && data.task && data.task.id) {
      this.selectedTask = data.task; // Assign the task to selectedTask
      this.attachement.task = data.task; // Assign the taskId property
    }
    // Ensure that attachement is always initialized
    if (data && data.attachement) {
      this.attachement = data.attachement;
    }
  }

  ngOnInit(): void {
    this.isDialogOpen = true;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onFileChange(event: any): void {
    this.attachement.file = event.target.files[0];
  }

  uploadAttachement(): void {
    if (!this.selectedTask || !this.selectedTask.id) {
      console.error('Task ID is not available.');
      return;
    }

    if (this.attachement.id) {
      this.attachementService.updateAttachement(this.attachement.id, this.attachement.file!, this.selectedTask.id)
        .subscribe({
          next: () => {
            this.dialogRef.close(true);
            this.showSnackbar('Pièce jointe mise à jour avec succès.', 'success-notification');
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour de la pièce jointe :', error);
            this.showSnackbar('Erreur lors de la mise à jour de la pièce jointe.', 'error-notification');
          }
        });
    } else { // If the attachment has no identifier, it is a new attachment
      this.attachementService.saveAttachement(this.attachement.file!, this.selectedTask.id)
        .subscribe({
          next: () => {
            this.dialogRef.close(true);
            this.showSnackbar('Pièce jointe téléchargée avec succès.', 'success-notification');
          },
          error: (error) => {
            this.showSnackbar('Erreur lors du téléchargement de la pièce jointe.', 'error-notification');
          }
        });
    }
  }



  deleteAttachement(): void {
    if (!this.selectedTask || !this.selectedTask.id) {
      console.error('La tâche est indéfinie ou son identifiant est manquant.');
      return;
    }
    if (confirm('Êtes-vous sûr de vouloir supprimer cette pièce jointe ?')) {
      this.attachementService.deleteAttachement(this.selectedTask.id!).subscribe(
        () => {
          this.dialogRef.close(true);
          this.showSnackbar('Pièce jointe supprimée avec succès.', 'success-notification');
        },
        (error) => {
          if (error.status === 200) {
            this.dialogRef.close(true);
            this.showSnackbar('Pièce jointe supprimée avec succès.', 'success-notification');
          } else {
            console.error('Erreur lors de la suppression de la pièce jointe :', error);
            this.showSnackbar('Erreur lors de la suppression de la pièce jointe.', 'error-notification');
          }
        }
      );
    }
  }


  downloadAttachement(): void {
    if (this.attachement.id) {
      this.attachementService.getAttachement(this.attachement.id).subscribe((response: Blob) => {
        const downloadUrl = URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `attachement_${this.attachement.id}`;
        document.body.appendChild(link); // Append the link to the body
        link.click();
        document.body.removeChild(link); // Clean up: remove the link from the body
        URL.revokeObjectURL(downloadUrl); // Release the object URL
      }, error => {
        console.error('Erreur lors du téléchargement de la pièce jointe :', error);
        this.showSnackbar('Erreur lors du téléchargement de la pièce jointe.', 'error-notification');
      });
    } else {
      console.error('Aucune pièce jointe à télécharger.');
      this.showSnackbar('Aucune pièce jointe à télécharger.', 'error-notification');

    }
  }

  private showSnackbar(message: string, panelClass: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: [panelClass],
    });
  }
}
