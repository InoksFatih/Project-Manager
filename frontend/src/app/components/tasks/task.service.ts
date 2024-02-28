import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Task } from '../../models/taskMod';
import { Person } from "../../models/personMod";
import { Project } from "../../models/projectMod";

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  public host: string = 'http://localhost:8080';
  private taskUpdatedSource = new Subject<void>();
  taskUpdated$ = this.taskUpdatedSource.asObservable();

  constructor(private http: HttpClient) {}

  public getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.host}/getAllTasks`);
  }

  public getTasksByProject(projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.host}/getTasksByProject/${projectId}`);
  }

  public addTask(taskDTO: any, projectId: number): Observable<Task> {
    return this.http.post<Task>(`${this.host}/addTask/${projectId}`, taskDTO);
  }

  public getTasksByProjectAndPerson(projectId: number, personId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.host}/tasksByProjectAndPerson/${projectId}/${personId}`);
  }

  public removePersonFromTask(personId: number, taskId: number): Observable<Person> {
    return this.http.delete<Person>(`${this.host}/removePersonFromTask/${personId}/${taskId}`);
  }

  public updateTask(taskId: number, taskDTO: any): Observable<Task> {
    return this.http.put<Task>(`${this.host}/updateTask/${taskId}`, taskDTO);
  }

  public deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.host}/deleteTask/${taskId}`);
  }

  public addPersonToTask(taskId: number, person: Person): Observable<Task> {
    return this.http.post<Task>(`${this.host}/addPersonToTask/${taskId}`, person);
  }
  public getAssignedPersonForTask(taskId: number): Observable<Person> {
    return this.http.get<Person>(`${this.host}/task/${taskId}/assignedPerson`);
  }
  public getProjectsByPerson(personId: number): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.host}/getProjectsByPerson/${personId}`);
  }
  public refreshTasks() {
    this.taskUpdatedSource.next();
  }
}
