import { Component, OnInit } from '@angular/core';
import { EntryService } from '../shared/service/entry.service';
import { Entry } from '../shared/model/entry.class';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent implements OnInit {

  constructor(private entryService: EntryService) { }

  entries: Entry[] = [];

  ngOnInit(): void {
    this.entryService.getAll().subscribe({
      next: (entries) => {
        this.entries = entries.sort((a, b) => {
          if (a.id && b.id) return b.id - a.id;
          return 0;
        })
      },
      error: () => alert('Erro ao carregar a lista de categoria')
    });
  }

  deleteEntry(entry: Entry) {
    const mustDelete = confirm('Deseja realmente excluir este item?');
    if (!mustDelete) {
      return;
    }
    if (entry.id) {
      this.entryService.delete(entry.id).subscribe({
        next: () => this.entries = this.entries.filter(entry => entry.id != entry.id),
        error: () => alert('Erro ao excluir categoria')
      });
    }
  }

}
