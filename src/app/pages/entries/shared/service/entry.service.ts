import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs';

import { Entry } from '../model/entry.class';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private apiPath: string = "api/categories";

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Entry[]> {
    return this.httpClient.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategories)
    );
  }

  getById(id: number): Observable<Entry> {
    const url = `${this.apiPath}/${id}`;
    return this.httpClient.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToentry)
    );
  }

  create(entry: Entry): Observable<Entry> {
    return this.httpClient.post(this.apiPath, entry).pipe(
      catchError(this.handleError),
      map(this.jsonDataToentry)
    );
  }

  update(entry: Entry): Observable<Entry> {
    const url = `${this.apiPath}/${entry.id}`;
    return this.httpClient.put(url, entry).pipe(
      catchError(this.handleError),
      map(() => entry)
    );
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;
    return this.httpClient.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    );
  }

  private jsonDataToCategories(jsonData: any[]): Entry[] {
    const categories: Entry[] = [];
    jsonData.forEach(item => categories.push(item as Entry));
    return categories;
  }

  private jsonDataToentry(jsonData: any): Entry {
    return jsonData as Entry;
  }

  private handleError(error: any): Observable<any> {
    console.error('[ERROR]: erro na requisição de categorias', error);
    return throwError(error);
  }

}
