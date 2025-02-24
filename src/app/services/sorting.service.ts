import { Injectable } from '@angular/core';
import { SortingStrategy } from '../strategies/sorting.strategy';
import { TReservations } from '../@types/reservations';
import { TOrderState } from '../@types/orderState';

@Injectable({
  providedIn: 'root',
})

// Sorting Service Design Patter Strategy
// Service que seria o nosso contexto para setar o nosso tipo de ordenação que queremos utilizar
// Método setStrategy recebe a instância de nossa classe que é um tipo de ordenação que é implementada da interface SortingStrategy e sobrescreve o método sort com a sua forma de ordenação
// Método sort recebe um array do tipo TReservations e a sua order (tipo de ordenação = asc | desc ou null) a partir disso ele faz a ordenação conforme foi setada
export class SortingService {
  private strategy!: SortingStrategy;

  // Define qual tipo de ordenação atráves da istnância da classe da ordenação setada
  setStrategy(strategy: SortingStrategy): void {
    this.strategy = strategy;
  }

  // Faz a ordenação da classe que foi instânciada. obs: toda vez que foi utilizar o sort desse service precisa setar a classe antes!
  sort(reservations: TReservations[], order: TOrderState): TReservations[] {
    if (!this.strategy) {
      throw new Error('Nenhuma estratégia foi definida!');
    }
    return this.strategy.sort(reservations, order);
  }
}
