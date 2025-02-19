export enum Status {
  Confirmed = 'Confirmado',
  Pending = 'Pendente',
  Cancelled = 'Cancelado',
}

export const statusMapping: Record<Status, string> = {
  [Status.Confirmed]: 'Confirmado',
  [Status.Pending]: 'Pendente',
  [Status.Cancelled]: 'Cancelado',
};
