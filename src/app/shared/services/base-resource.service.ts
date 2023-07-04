import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';

import { Observable, throwError, map, catchError } from 'rxjs';

import { BaseResourceModel } from "src/app/shared/models/base-resource.model";

export abstract class BaseResourceService<T extends BaseResourceModel> {

  protected httpClient: HttpClient;

  constructor(
    protected apiPath: string,
    protected injector: Injector,
    protected jsonDataToResorceFn: (jsonData: any) => T
  ) {
    this.httpClient = injector.get(HttpClient);
  }

  getAll(): Observable<T[]> {
    return this.httpClient.get<any[]>(this.apiPath).pipe(
      map(this.jsonDataToResources.bind(this)),
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<T> {
    const url = `${this.apiPath}/${id}`;
    return this.httpClient.get(url).pipe(
      map(this.jsonDataToResource.bind(this)),
      catchError(this.handleError)
    );
  }

  create(resource: T): Observable<T> {
    return this.httpClient.post(this.apiPath, resource).pipe(
      map(this.jsonDataToResource.bind(this)),
      catchError(this.handleError)
    );
  }

  update(resource: T): Observable<T> {
    const url = `${this.apiPath}/${resource.id}`;
    return this.httpClient.put(url, resource).pipe(
      map(() => resource),
      catchError(this.handleError)
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
    jsonData.forEach((item) => resources.push(this.jsonDataToResorceFn(item)));
    return resources;
  }

  protected jsonDataToResource(jsonData: any): T {
    return this.jsonDataToResorceFn(jsonData);
  }

  protected handleError(error: any): Observable<any> {
    console.error('[ERROR]: erro na requisição de categorias', error);
    return throwError(error);
  }
}
