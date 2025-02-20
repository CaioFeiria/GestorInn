export enum RoomType {
  Standard = 'Standard',
  Deluxe = 'Deluxe',
  Suite = 'Suite',
}

export const roomTypeMapping: Record<RoomType, string> = {
  [RoomType.Standard]: 'Standard',
  [RoomType.Deluxe]: 'Deluxe',
  [RoomType.Suite]: 'Suite',
};
