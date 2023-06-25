import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../shared/service/category.service';
import { Category } from '../shared/model/category.class';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  constructor(private categoryService: CategoryService) { }

  categories: Category[] = [];

  ngOnInit(): void {
    this.categoryService.getAll().subscribe({
      next: (categories) => this.categories = categories,
      error: () => alert('Erro ao carregar a lista de categoria')
    });
  }

  deleteCategory(category: Category) {
    const mustDelete = confirm('Deseja realmente excluir este item?');
    if (!mustDelete) {
      return;
    }
    if (category.id) {
      this.categoryService.delete(category.id).subscribe({
        next: () => this.categories = this.categories.filter(category => category.id != category.id),
        error: () => alert('Erro ao excluir categoria')
      });
    }
  }

}
