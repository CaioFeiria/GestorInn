export enum RoomType {
  Standard = 'Standart',
  Deluxe = 'Deluxe',
  Suite = 'Suite',
}

export const roomTypeMapping: Record<RoomType, string> = {
  [RoomType.Standard]: 'Standard',
  [RoomType.Deluxe]: 'Deluxe',
  [RoomType.Suite]: 'Suite',
};
