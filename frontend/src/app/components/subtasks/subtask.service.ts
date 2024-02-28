import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Subtask } from '../../models/subtaskMod';

@Injectable({
  providedIn: 'root',
})
export class SubtaskService {
  public host: string = 'http://localhost:8080';
  private subtaskUpdatedSource = new Subject<void>();
  subtaskUpdated$ = this.subtaskUpdatedSource.asObservable();

  constructor(private http: HttpClient) {}



  public getSubtasksByTask(taskId: number): Observable<Subtask[]> {
    return this.http.get<Subtask[]>(`${this.host}/getSubtasksByTask/${taskId}`);
  }

  public addSubtask(subtaskDTO: any, taskId: number): Observable<Subtask> {
    return this.http.post<Subtask>(`${this.host}/addSubtask/${taskId}`, subtaskDTO);
  }


  public updateSubtask(subtaskId: number, subtaskDTO: any): Observable<Subtask> {
    return this.http.put<Subtask>(`${this.host}/updateSubtask/${subtaskId}`, subtaskDTO);
  }

  public deleteSubtask(subtaskId: number): Observable<void> {
    return this.http.delete<void>(`${this.host}/deleteSubtask/${subtaskId}`);
  }

  // Method to emit an event when a subtask is updated
  public refreshSubtasks() {
    this.subtaskUpdatedSource.next();
  }
}
