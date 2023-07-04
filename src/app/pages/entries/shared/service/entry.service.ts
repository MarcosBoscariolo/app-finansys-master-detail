import { Injectable, Injector } from '@angular/core';

import { Observable, mergeMap } from 'rxjs';

import { BaseResourceService } from 'src/app/shared/services/base-resource.service';
import { CategoryService } from 'src/app/pages/categories/shared/service/category.service';
import { Entry } from '../model/entry.class';

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry>{

  constructor(
    protected override injector: Injector,
    private categoryService: CategoryService
  ) {
    super('api/entries', injector);
  }

  override create(entry: Entry): Observable<Entry> {
    return this.categoryService.getById(entry.categoryId as number).pipe(
      mergeMap((category) => {
        entry.category = category;
        return super.create(entry);
      })
    );
  }

  override update(entry: Entry): Observable<Entry> {
    return this.categoryService.getById(entry.categoryId as number).pipe(
      mergeMap((category) => {
        entry.category = category;
        return super.update(entry);
      })
    );
  }

  protected override jsonDataToResources(jsonData: any[]): Entry[] {
    const entries: Entry[] = [];
    jsonData.forEach((item) => {
      const entry = Object.assign(new Entry(), item);
      entries.push(entry);
    });
    return entries;
  }

  protected override jsonDataToResource(jsonData: any): Entry {
    return Object.assign(new Entry(), jsonData);
  }
}
