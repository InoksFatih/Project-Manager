import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attachement } from '../models/attachementModel';

@Injectable({
  providedIn: 'root',
})
export class AttachementService {
  private host: string = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  uploadFile(file: File, taskId: number): Observable<Attachement> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('taskId', taskId.toString());

    return this.http.post<Attachement>(
      `${this.host}/uploadFile`,
      formData
    );
  }

  downloadFile(fileId: number): Observable<Blob> {
    return this.http.get(
      `${this.host}/downloadFile/${fileId}`,
      { responseType: 'blob' }
    );
  }

  deleteFile(fileId: number): Observable<any> {
    return this.http.delete(`${this.host}/deleteFile/${fileId}`);
  }

  updateFile(fileId: number, file: File, taskId: number): Observable<Attachement> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('taskId', taskId.toString());

    return this.http.put<Attachement>(
      `${this.host}/updateFile/${fileId}`,
      formData
    );
  }
}
