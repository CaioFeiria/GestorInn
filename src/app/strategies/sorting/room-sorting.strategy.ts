import { TReservations } from '../../@types/reservations';
import { RoomType } from '../../enums/roomType.enum';
import { SortingStrategy } from './sorting.strategy';

export class RoomSorting implements SortingStrategy {
  private roomsOrder: Record<string, number> = {
    [RoomType.Suite]: 3,
    [RoomType.Deluxe]: 2,
    [RoomType.Standard]: 1,
  };

  sort(
    reservations: TReservations[],
    order: 'asc' | 'desc' | null
  ): TReservations[] {
    return reservations.sort((a, b) =>
      order === 'asc'
        ? this.roomsOrder[a.roomType] - this.roomsOrder[b.roomType]
        : this.roomsOrder[b.roomType] - this.roomsOrder[a.roomType]
    );
  }
}
