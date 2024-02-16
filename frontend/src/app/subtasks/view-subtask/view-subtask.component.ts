import {Component, ElementRef, Inject, Renderer2} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Subtask} from "../../models/subtaskMod";

@Component({
  selector: 'app-view-subtask',
  templateUrl: './view-subtask.component.html',
  styleUrl: './view-subtask.component.scss'
})
export class ViewSubtaskComponent {
  public selectedSubtask: Subtask | undefined;

  constructor(
    public dialogRef: MatDialogRef<ViewSubtaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { subtask: Subtask },
  private renderer: Renderer2,
  private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.selectedSubtask = this.data.subtask;
    console.log('Selected subtask:', this.selectedSubtask);
    this.adjustTextareaHeight();
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
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
  }

  // Method to get the string value of the priority enum
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
  }
  onTextareaInput(): void {
    this.adjustTextareaHeight();
  }

  adjustTextareaHeight(): void {
    const textarea = this.elementRef.nativeElement.querySelector('textarea');
    const scrollHeight = textarea.scrollHeight;
    const maxHeight = 300; // Set your threshold height here

    if (scrollHeight > maxHeight) {
      this.renderer.setStyle(textarea, 'height', maxHeight + 'px');
      this.renderer.setStyle(textarea, 'overflow-y', 'auto');
    } else {
      this.renderer.setStyle(textarea, 'height', 'auto');
      this.renderer.setStyle(textarea, 'overflow-y', 'hidden');
    }
  }

}
