import { TReservations } from '../@types/reservations';
import { SortingStrategy } from './sorting.strategy';

export class CheckInSorting implements SortingStrategy {
  sort(
    reservations: TReservations[],
    order: 'asc' | 'desc' | null
  ): TReservations[] {
    return reservations.sort((a, b) =>
      order === 'asc'
        ? new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime()
        : new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime()
    );
  }
}
