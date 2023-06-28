import { Component, OnInit, AfterContentChecked, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { switchMap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { PrimeNGConfig } from 'primeng/api';
import { Calendar } from 'primeng/calendar';

import { EntryService } from './../shared/service/entry.service';
import { Entry } from '../shared/model/entry.class';
import { Category } from '../../categories/shared/model/category.class';
import { CategoryService } from './../../categories/shared/service/category.service';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  @ViewChild('calendar') calendar: Calendar;

  currentAction: string;
  pageTitle: string;
  entryForm: FormGroup;
  submittingForm: boolean = false;
  serverErrorMessages: string[] | null = null;
  entry: Entry = new Entry();
  categories: Array<Category>;

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  };
  ptBR = {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    dayNamesMin: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    monthNames: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
      'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    today: 'Hoje',
    clear: 'Limpar'
  };

  constructor(
    private entryService:EntryService,
    private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public primengConfig: PrimeNGConfig
  ) {
    this.setLangBR();
    // this.primengConfig.translationObserver.subscribe(res =>console.log(res));
  }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
    this.loadCategories();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;
    if (this.currentAction == "new") {
      this.createEntry();
      return;
    }
    this.updateEntry();
  }

  get typeOptions(): Array<any> {
    return Object.entries(Entry.types).map(
      ([value, text]) => {
        return {
          text: text,
          value: value
        }
      }
    );
  }

  private setCurrentAction() {
   if (this.activatedRoute.snapshot.url[0].path == "new") {
    this.currentAction = "new";
   } else {
    this.currentAction = "edit";
   }
  }

  private buildEntryForm() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: ['expense', [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [true, [Validators.required]],
      categoryId: [null, [Validators.required]],
    });
  }

  private loadEntry() {
    if (this.currentAction != "edit") {
      return;
    }

    this.activatedRoute.paramMap.pipe(
      switchMap(entryParams => this.entryService.getById(Number(entryParams.get("id"))))
    ).subscribe({
      next: (entry) => {
        this.entry = entry;
        this.entryForm.patchValue(this.entry);
      },
      error: () => alert("Ops... Ocorreu um erro interno, tente novamente!")
    });
  }

  private loadCategories() {
    this.categoryService.getAll().subscribe(
      (categories) => this.categories = categories
    );
  }

  private setPageTitle() {
    if (this.currentAction == "new") {
      this.pageTitle = 'Cadastro de novo lançamento';
      return;
    }
    const entryName = this.entry.name || "";
    this.pageTitle = 'Editando lançamento: ' + entryName;
  }

  private createEntry() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);
    this.entryService.create(entry).subscribe({
      next: (entry) => this.actionsForSucces(entry),
      error: (error) => this.actionsForError(error)
    });
  }

  private updateEntry() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);
    this.entryService.update(entry).subscribe({
      next: (entry) => this.actionsForSucces(entry),
      error: (error) => this.actionsForError(error)
    });
  }

  private actionsForSucces(entry: Entry){
    this.toastr.success("Solicitação processada com sucesso!");
    this.router.navigateByUrl('entries', {skipLocationChange: true}).then(
      () => this.router.navigate(['entries', 'edit', entry.id])
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

  private setLangBR() {
    this.primengConfig.setTranslation(this.ptBR);
  }

}
