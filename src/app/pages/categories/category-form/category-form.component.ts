import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { switchMap } from 'rxjs';
// import toastr from "toastr";

import { CategoryService } from './../shared/service/category.service';
import { Category } from '../shared/model/category.interface';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  pageTitle: string;
  categoryForm: FormGroup;
  submittingForm: boolean = false;
  serverErrorMessages: string[] = [];
  category: Category;

  constructor(
    private categoryService:CategoryService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  private setCurrentAction() {
   if (this.activatedRoute.snapshot.url[0].path == "new") {
    this.currentAction = "new";
   } else {
    this.currentAction = "edit";
   }
  }

  private buildCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, Validators.required, Validators.minLength(2)],
      description: [null],
    });
  }

  private loadCategory() {
    if (this.currentAction != "edit") {
      return;
    }

    this.activatedRoute.paramMap.pipe(
      switchMap(categoryParams => this.categoryService.getById(Number(categoryParams.get("id"))))
    ).subscribe({
      next: (category) => {
        this.category = category;
        this.categoryForm.patchValue(this.category);
      },
      error: () => alert("Ops... Ocorreu um erro interno, tente novamente!")
    });
  }

  private setPageTitle() {
    if (this.currentAction == "new") {
      this.pageTitle = 'Cadastro de nova categoria';
      return;
    }
    const categoryName = this.category.name || "";
    this.pageTitle = 'Editando categoria: ' + categoryName;
  }

}
