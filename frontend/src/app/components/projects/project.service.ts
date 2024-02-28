// project.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../../models/projectMod';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  public host: string = 'http://localhost:8080';
  private projectUpdatedSource = new Subject<void>();
  projectUpdated$ = this.projectUpdatedSource.asObservable();

  constructor(private http: HttpClient) {}

  public getAllProjects() {
    return this.http.get(this.host + '/getAllProjects');
  }

  public getAllClients() {
    return this.http.get(this.host + '/getAllClients');
  }
  public addProject(projectDTO: Project, projectClientId: number) {
    return this.http.post(`${this.host}/addProject/${projectClientId}`, projectDTO);
  }

  public getProject(projectId: number) {
    return this.http.get(`${this.host}/getProject/${projectId}`);
  }

  public updateProject(projectId: number, projectDTO: Project) {
    return this.http.put(`${this.host}/updateProject/${projectId}`, projectDTO);
  }

  public deleteProject(projectId: number) {
    return this.http.delete(`${this.host}/deleteProject/${projectId}`);
  }

  public refreshProjects() {
    this.projectUpdatedSource.next();
  }
}
