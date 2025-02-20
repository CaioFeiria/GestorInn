export type TRoom = {
  type: string;
  quantity: number;
  capacity: number;
  reserved: number;
};

export type TRooms = {
  [key: string]: TRoom;
};
