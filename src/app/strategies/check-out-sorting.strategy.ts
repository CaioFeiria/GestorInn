import { TReservations } from '../@types/reservations';
import { SortingStrategy } from './sorting.strategy';

export class CheckOutSorting implements SortingStrategy {
  sort(
    reservations: TReservations[],
    order: 'asc' | 'desc' | null
  ): TReservations[] {
    return reservations.sort((a, b) =>
      order === 'asc'
        ? new Date(a.checkOut).getTime() - new Date(b.checkOut).getTime()
        : new Date(b.checkOut).getTime() - new Date(a.checkOut).getTime()
    );
  }
}
