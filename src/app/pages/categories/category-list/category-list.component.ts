import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../shared/service/category.service';
import { Category } from '../shared/model/category.interface';

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

  deleteCategory(categoryId: number) {
    const mustDelete = confirm('Deseja realmente excluir este item?');
    if (!mustDelete) {
      return;
    }
    this.categoryService.delete(categoryId).subscribe({
      next: () => this.categories = this.categories.filter(category => category.id != categoryId),
      error: () => alert('Erro ao excluir categoria')
    });
  }

}
