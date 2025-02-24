import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service';
import {
  SearchedEnum,
  SearchedEnumMapping,
} from '../../enums/searchedOptions.enum';
import { ReservationsService } from '../../services/reservations.service';

@Component({
  selector: 'app-search',
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})

// Componente Search
// Utilizado para fazer um pesquisa na página de reservas
// Método searched é passado o valor do input que o usuário digita com ngModel para o service seachService que da um next nesse valor
// Método returnValue retorna o valor do tipo de busca que o unuário clicou e é passado o valor para o service seachService que da um next nesse valor
// Método handleClick usado para fechar o dropdown quando o usúario escolher e clicar na opção desejada
export class SearchComponent {
  inputSearch: string = '';
  optionSearch: string = '';

  searchedMapping = SearchedEnumMapping; // Mapeamento de tipos de pesquisa
  searchedEnum = Object.values(SearchedEnum); // // Lista de valores do enum searchedOptions

  constructor(private searchService: SearchService) {}

  searched(): void {
    this.searchService.searchedValue(this.inputSearch);
  }

  returnValue(value: string): void {
    this.optionSearch = value;
    this.searchService.searchedOptionValue(value);
    this.inputSearch = '';
  }

  handleClick(): void {
    const elem = document.activeElement as HTMLElement;
    if (elem) {
      elem.blur();
    }
  }
}
