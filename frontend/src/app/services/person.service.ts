import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Person } from '../models/personMod';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  public host: string = 'http://localhost:8080';
  constructor(private http: HttpClient) {}

  public getAllPersons(): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.host}/getAllPersons`);
  }
  public getPerson(personId: number): Observable<Person> {
    return this.http.get<Person>(`${this.host}/getPerson/${personId}`);
  }


}
