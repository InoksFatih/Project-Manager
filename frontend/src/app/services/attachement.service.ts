import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Attachement } from '../models/attachementModel';

@Injectable({
  providedIn: 'root'
})
export class AttachementService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  saveAttachement(file: File, taskId: number): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('taskId', taskId.toString());

    return this.http.post<any>(`${this.baseUrl}/uploadFile`, formData, {
      reportProgress: true,
      observe: 'events'
    })
  }

  getAllAttachements(): Observable<Attachement[]> {
    return this.http.get<Attachement[]>(`${this.baseUrl}/getAllAttachements`).pipe(
    );
  }

  getAttachementByTask(taskId: number): Observable<Attachement> {
    return this.http.get<Attachement>(`${this.baseUrl}/getAttachementByTask/${taskId}`).pipe(
    );
  }

  getAttachement(fileId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/downloadFile/${fileId}`, {
      responseType: 'blob',
    });
  }

  deleteAttachement(taskId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteAttachement/${taskId}`).pipe(
    );
  }


  updateAttachement(fileId: number, file: File, taskId: number): Observable<Attachement> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('taskId', taskId.toString());

    return this.http.put<Attachement>(
      `${this.baseUrl}/updateFile/${fileId}`,
      formData
    )
  }
}

