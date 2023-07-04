import { Injectable, Injector } from '@angular/core';

import { Category } from '../model/category.class';
import { BaseResourceService } from 'src/app/shared/services/base-resource.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseResourceService<Category> {

  constructor(protected override injector: Injector) {
    super('api/categories', injector);
  }
}
