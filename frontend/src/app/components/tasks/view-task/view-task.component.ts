import {Component, ElementRef, Inject, OnInit, Renderer2} from '@angular/core';
import { Task } from '../../../models/taskMod';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.scss']
})
export class ViewTaskComponent implements OnInit {
  public selectedTask: Task | undefined;

  constructor(
    public dialogRef: MatDialogRef<ViewTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task: Task },
  private renderer: Renderer2,
  private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.selectedTask = this.data.task;

    // Delay the adjustment of textarea height
    setTimeout(() => {
      this.adjustTextareaHeight();
    });
  }


  onCloseClick(): void {
    this.dialogRef.close();
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
  onTextareaInput(): void {
    this.adjustTextareaHeight();
  }

  adjustTextareaHeight(): void {
    const textarea = this.elementRef.nativeElement.querySelector('textarea');
    const scrollHeight = textarea.scrollHeight;
    const maxHeight = 300;

    if (scrollHeight > maxHeight) {
      this.renderer.setStyle(textarea, 'height', maxHeight + 'px');
      this.renderer.setStyle(textarea, 'overflow-y', 'auto');
    } else {
      this.renderer.setStyle(textarea, 'height', 'auto');
      this.renderer.setStyle(textarea, 'overflow-y', 'hidden');
    }
  }
}
