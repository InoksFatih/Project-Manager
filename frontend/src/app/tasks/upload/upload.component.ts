import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Attachement } from '../../models/attachementModel';
import { AttachementService } from '../../services/attachement.service';
import {Task} from "../../models/taskMod";
import {catchError} from "rxjs/operators";
import {Observable} from "rxjs";

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
    console.log('Dialog closed without saving.');
    this.dialogRef.close();
  }

  onFileChange(event: any): void {
    console.log('File selected:', event.target.files[0]);
    this.attachement.file = event.target.files[0];
  }

  uploadAttachement(): void {
    console.log('Uploading attachement...');
    console.log('Attachement data:', this.attachement);

    // If the attachement has an ID, it means it's an update
    if (this.attachement.id) {
      this.attachementService.updateAttachement(this.attachement.id, this.attachement.file!, this.attachement.task?.id!)
        .subscribe({
          next: () => {
            console.log('Attachement updated successfully.');
            this.dialogRef.close(true);
            this.showSnackbar('Attachement updated successfully.', 'success-notification');
          },
          error: (error) => {
            console.error('Error updating attachement:', error);
            this.showSnackbar('Error updating attachement.', 'error-notification');
          }
        });
    } else { // If the attachement doesn't have an ID, it's a new attachement
      this.attachementService.saveAttachement(this.attachement.file!, this.attachement.task?.id!)
        .subscribe({
          next: () => {
            // console.log('Attachement uploaded successfully.');
            this.dialogRef.close(true);
            this.showSnackbar('Attachement uploaded successfully.', 'success-notification');
          },
          error: (error) => {
            // console.error('Error uploading attachement:', error);
            this.showSnackbar('Error uploading attachement.', 'error-notification');
          }
        });
    }
  }

  deleteAttachement(): void {
    if (!this.selectedTask || !this.selectedTask.id) {
      console.error('Task is undefined or missing ID.');
      return;
    }

    if (confirm('Are you sure you want to delete this attachment?')) {
      console.log(this.selectedTask.id + " Attachment taskId")
      this.attachementService.deleteAttachement(this.selectedTask.id!).subscribe(
        () => {
          console.log('Attachment deleted successfully.');
          this.dialogRef.close(true);
          this.showSnackbar('Attachment deleted successfully.', 'success-notification');
        },
        (error) => {
          if (error.status === 200) {
            // Treat 200 OK as a success
            console.log('Attachment deleted successfully.');
            this.dialogRef.close(true);
            this.showSnackbar('Attachment deleted successfully.', 'success-notification');
          } else {
            console.error('Error deleting attachment:', error);
            this.showSnackbar('Error deleting attachment.', 'error-notification');
          }
        }
      );
    }
  }


  downloadAttachement(): void {
    if (this.attachement.id) {
      console.log('Downloading attachement:', this.attachement.id);
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
        console.error('Error downloading attachement:', error);
        this.showSnackbar('Error downloading attachement.', 'error-notification');
      });
    } else {
      console.error('No attachement to download.');
      this.showSnackbar('No attachement to download.', 'error-notification');
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
