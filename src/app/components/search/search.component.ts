import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service';
import {
  SearchedEnum,
  SearchedEnumMapping,
} from '../../enums/searchedOptions.enum';

@Component({
  selector: 'app-search',
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  inputSearch: string = '';
  optionSearch: string = '';

  searchedMapping = SearchedEnumMapping;
  searchedEnum = Object.values(SearchedEnum);

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
