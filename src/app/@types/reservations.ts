// Tipo Reservations para criação de uma reserva no banco

export type TReservations = {
  id: string;
  guestId: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  numberOfGuests: number;
  status: string;
  remarks: string;
};
