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
    super('api/entries', injector, Entry.fromJson);
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
}
