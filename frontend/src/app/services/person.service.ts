import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Person } from '../models/personMod';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  public host: string = 'http://localhost:8080';
  private personUpdatedSource = new Subject<void>();
  personUpdated$ = this.personUpdatedSource.asObservable();

  constructor(private http: HttpClient) {}

  public getAllPersons(): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.host}/getAllPersons`);
  }

  public addPerson(personDTO: any): Observable<Person> {
    return this.http.post<Person>(`${this.host}/addPerson`, personDTO);
  }

  public getPerson(personId: number): Observable<Person> {
    return this.http.get<Person>(`${this.host}/getPerson/${personId}`);
  }

  public updatePerson(personId: number, personDTO: any): Observable<Person> {
    return this.http.put<Person>(`${this.host}/updatePerson/${personId}`, personDTO);
  }

  public deletePerson(personId: number): Observable<void> {
    return this.http.delete<void>(`${this.host}/deletePerson/${personId}`);
  }
  public addPersonToTask(taskId: number, personDTO: any): Observable<Person> {
    return this.http.post<Person>(`${this.host}/addPersonToTask/${taskId}`, personDTO);
  }
  public removePersonFromTask(personId: number, taskId: number): Observable<Person> {
    return this.http.put<Person>(`${this.host}/removePersonFromTask/${personId}/${taskId}`, {});
  }
  public refreshPersons() {
    this.personUpdatedSource.next();
  }

}
