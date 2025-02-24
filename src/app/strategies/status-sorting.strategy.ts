import { TReservations } from '../@types/reservations';
import { Status } from '../enums/status.enum';
import { SortingStrategy } from './sorting.strategy';

export class StatusSorting implements SortingStrategy {
  private statusOrder: Record<string, number> = {
    [Status.Confirmed]: 1,
    [Status.Pending]: 2,
    [Status.Cancelled]: 3,
  };

  sort(
    reservations: TReservations[],
    order: 'asc' | 'desc' | null
  ): TReservations[] {
    return reservations.sort((a, b) =>
      order === 'asc'
        ? this.statusOrder[a.status] - this.statusOrder[b.status]
        : this.statusOrder[b.status] - this.statusOrder[a.status]
    );
  }
}
