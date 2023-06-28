import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs';

import { Entry } from '../model/entry.class';
import { CategoryService } from 'src/app/pages/categories/shared/service/category.service';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private apiPath: string = "api/entries";

  constructor(
    private httpClient: HttpClient,
    private categoryService: CategoryService
  ) { }

  getAll(): Observable<Entry[]> {
    return this.httpClient.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntries)
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
    return this.categoryService.getById(entry.categoryId as number).pipe(
      mergeMap((category) => {
        entry.category = category;
        return this.httpClient.post(this.apiPath, entry).pipe(
          catchError(this.handleError),
          map(this.jsonDataToentry)
        );
      })
    );
  }

  update(entry: Entry): Observable<Entry> {
    const url = `${this.apiPath}/${entry.id}`;
    return this.categoryService.getById(entry.categoryId as number).pipe(
      mergeMap((category) => {
        entry.category = category;
        return this.httpClient.put(url, entry).pipe(
          catchError(this.handleError),
          map(() => entry)
        );
      })
    );
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;
    return this.httpClient.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    );
  }

  private jsonDataToEntries(jsonData: any[]): Entry[] {
    const entries: Entry[] = [];
    jsonData.forEach((item) => {
      const entry = Object.assign(new Entry(), item);
      entries.push(entry);
    });
    return entries;
  }

  private jsonDataToentry(jsonData: any): Entry {
    return Object.assign(new Entry(), jsonData);
  }

  private handleError(error: any): Observable<any> {
    console.error('[ERROR]: erro na requisição de categorias', error);
    return throwError(error);
  }

}
