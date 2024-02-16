import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Attachement } from '../../models/attachementModel';
import { AttachementService } from '../../services/attachement.service';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  attachement: Attachement = new Attachement();
  isEditMode: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<UploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private attachementService: AttachementService
  ) {
    if (data && data.task && data.task.id) {
      this.attachement.task = data.task;
    }
  }

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.attachement.file && this.attachement.task && this.attachement.task.id) { // Check if both file and taskId are available
      if (this.isEditMode) {
        this.updateAttachement();
      } else {
        this.uploadAttachement();
      }
    } else {
      this.showSnackbar('Please select a file and provide a task ID.', 'error-notification');
    }
  }

  onFileChange(event: any): void {
    this.attachement.file = event.target.files[0];
  }

  uploadAttachement(): void {
    this.attachementService.uploadFile(this.attachement.file!, this.attachement.task!.id!).subscribe({
      next: () => {
        this.dialogRef.close(true);
        this.showSnackbar('Attachment uploaded successfully.', 'success-notification');
      },
      error: (error) => {
        console.error('Error uploading attachment:', error);
        this.showSnackbar('Error uploading attachment.', 'error-notification');
      }
    });
  }

  updateAttachement(): void {
    this.attachementService.updateFile(this.attachement.id!, this.attachement.file!, this.attachement.task!.id!).subscribe({
      next: () => {
        this.dialogRef.close(true);
        this.showSnackbar('Attachment updated successfully.', 'success-notification');
      },
      error: (error) => {
        console.error('Error updating attachment:', error);
        this.showSnackbar('Error updating attachment.', 'error-notification');
      }
    });
  }

  deleteAttachement(): void {
    if (confirm('Are you sure you want to delete this attachment?')) {
      this.attachementService.deleteFile(this.attachement.id!).subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.showSnackbar('Attachment deleted successfully.', 'success-notification');
        },
        error: (error) => {
          console.error('Error deleting attachment:', error);
          this.showSnackbar('Error deleting attachment.', 'error-notification');
        }
      });
    }
  }

  downloadAttachement(): void {
    this.attachementService.downloadFile(this.attachement.id!).subscribe((data: Blob) => {
      const downloadUrl = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `attachment_${this.attachement.id}`;
      link.click();
    }, error => {
      console.error('Error downloading attachment:', error);
      this.showSnackbar('Error downloading attachment.', 'error-notification');
    });
  }

  private showSnackbar(message: string, panelClass: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: [panelClass],
    });
  }
}
