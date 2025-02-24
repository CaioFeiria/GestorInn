import { TReservations } from '../../@types/reservations';

// Interface Strategy
// Método sort recebe um array do tipo TReservations e o tipo de ordenação dele
export interface SortingStrategy {
  sort(
    reservations: TReservations[],
    order: 'asc' | 'desc' | null
  ): TReservations[];
}
