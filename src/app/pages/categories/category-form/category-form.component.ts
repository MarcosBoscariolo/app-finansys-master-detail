import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { switchMap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { CategoryService } from './../shared/service/category.service';
import { Category } from '../shared/model/category.class';

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
  serverErrorMessages: string[] | null = null;
  category: Category = new Category();

  constructor(
    private categoryService:CategoryService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;
    if (this.currentAction == "new") {
      this.createCategory();
      return;
    }
    this.updateCategory();
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
      name: [null, [Validators.required, Validators.minLength(2)]],
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

  private createCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.create(category).subscribe({
      next: (category) => this.actionsForSucces(category),
      error: (error) => this.actionsForError(error)
    });
  }

  private updateCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.update(category).subscribe({
      next: (category) => this.actionsForSucces(category),
      error: (error) => this.actionsForError(error)
    });
  }

  private actionsForSucces(category: Category){
    this.toastr.success("Solicitação processada com sucesso!");
    this.router.navigateByUrl('categories', {skipLocationChange: true}).then(
      () => this.router.navigate(['categories', 'edit', category.id])
    );
  }

  private actionsForError(error: any) {
    this.toastr.error('Ops... Ocorreu um erro ao processar sua solicitação!');
    this.submittingForm = false;
    if (error.status === 422) {
      this.serverErrorMessages = JSON.parse(error.body).errors;
    } else {
      this.serverErrorMessages = ['Falha na comunicação com o servidor. Por favor, tente mais tarde.'];
    }
  }

}
