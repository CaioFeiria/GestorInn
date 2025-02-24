import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

// Search Service
// Responsável por pegar o valor do input de do componente search e enviar para todos os inscritos
// Método searchedValue recebe um valor que o usuário digitou e enviar para os inscritos
// Método searchedOptionValue recebe a opção de pesquisa notifica os inscritos e também notifica com uma string vazia os inscritos da pesquisa (reset para quando mudar a opção de busca)
export class SearchService {
  private searchedSub = new Subject<string>();
  searched$ = this.searchedSub.asObservable();

  private searchedOptionSub = new Subject<string>();
  searchedOption$ = this.searchedOptionSub.asObservable();

  constructor() {}

  searchedValue(value: string): void {
    this.searchedSub.next(value);
  }

  searchedOptionValue(value: string): void {
    this.searchedOptionSub.next(value);
    this.searchedSub.next('');
  }
}
