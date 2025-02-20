export enum SearchedEnum {
  RoomType = 'roomType',
  CheckIn = 'checkIn',
  CheckOut = 'checkOut',
  Status = 'status',
}

export const SearchedEnumMapping: Record<SearchedEnum, string> = {
  [SearchedEnum.RoomType]: 'Tipo de quarto',
  [SearchedEnum.CheckIn]: 'Data CheckIn',
  [SearchedEnum.CheckOut]: 'Data CheckOut',
  [SearchedEnum.Status]: 'Status',
};
