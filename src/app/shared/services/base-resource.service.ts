import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';

import { Observable, throwError, map, catchError } from 'rxjs';

import { BaseResourceModel } from "src/app/shared/models/base-resource.model";

export abstract class BaseResourceService<T extends BaseResourceModel> {

  protected httpClient: HttpClient;

  constructor(protected apiPath: string, protected injector: Injector) {
    this.httpClient = injector.get(HttpClient);
  }

  getAll(): Observable<T[]> {
    return this.httpClient.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToResources)
    );
  }

  getById(id: number): Observable<T> {
    const url = `${this.apiPath}/${id}`;
    return this.httpClient.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToResource)
    );
  }

  create(resource: T): Observable<T> {
    return this.httpClient.post(this.apiPath, resource).pipe(
      catchError(this.handleError),
      map(this.jsonDataToResource)
    );
  }

  update(resource: T): Observable<T> {
    const url = `${this.apiPath}/${resource.id}`;
    return this.httpClient.put(url, resource).pipe(
      catchError(this.handleError),
      map(() => resource)
    );
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;
    return this.httpClient.delete(url).pipe(
      map(() => null),
      catchError(this.handleError)
    );
  }

  protected jsonDataToResources(jsonData: any[]): T[] {
    const resources: T[] = [];
    jsonData.forEach(item => resources.push(item as T));
    return resources;
  }

  protected jsonDataToResource(jsonData: any): T {
    return jsonData as T;
  }

  protected handleError(error: any): Observable<any> {
    console.error('[ERROR]: erro na requisição de categorias', error);
    return throwError(error);
  }
}