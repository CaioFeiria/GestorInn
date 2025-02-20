import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
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
