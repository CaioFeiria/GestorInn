import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ReservationsService } from '../../services/reservations.service';
import { TReservations } from '../../@types/reservations';
import { CommomButtonComponent } from '../../components/commom-button/commom-button.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { GuestsService } from '../../services/guests.service';
import { TGuests } from '../../@types/guests';
import { FormReservationComponent } from '../../components/form-reservation/form-reservation.component';
import { RoomsService } from '../../services/rooms.service';
import { RouterLink } from '@angular/router';
import { SearchComponent } from '../../components/search/search.component';
import { SearchService } from '../../services/search.service';
import { TOrderState } from '../../@types/orderState';
import { SortingService } from '../../services/sorting.service';
import { CheckInSorting } from '../../strategies/sorting/check-in-sorting.strategy';
import { StatusSorting } from '../../strategies/sorting/status-sorting.strategy';
import { RoomSorting } from '../../strategies/sorting/room-sorting.strategy';
import { CheckOutSorting } from '../../strategies/sorting/check-out-sorting.strategy';
import { AlertComponent } from '../../components/alert/alert.component';

@Component({
  selector: 'app-reservations',
  imports: [
    CommonModule,
    DatePipe,
    CommomButtonComponent,
    ModalComponent,
    FormReservationComponent,
    RouterLink,
    SearchComponent,
    AlertComponent,
  ],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss',
})

// Componente ReservationsComponent
// Listagem e gerenciamento de reservas
// Responsável por carregar, filtrar, ordenar e exibir reservas, além de permitir a exclusão de reservas
// Utiliza serviços para buscar dados de reservas, hóspedes e quartos, além de implementar funcionalidades de busca e ordenação
export class ReservationsComponent implements OnInit {
  reservations: Array<TReservations> = [];
  reservationsBackup: Array<TReservations> = [];
  reservationInfo!: TReservations;
  guests!: Array<TGuests>;
  reservationId: string = '';
  viewOrNo: boolean = false;
  optionSearch: string = '';
  orderState: { [key: string]: TOrderState } = {};

  constructor(
    private reservationService: ReservationsService,
    private guestService: GuestsService,
    private roomService: RoomsService,
    private searchService: SearchService,
    private sortingService: SortingService
  ) {}

  ngOnInit(): void {
    this.loadOptionSearch();
    this.loadReservations();
    this.roomService.getReservations();
    this.inputSearch();
  }

  // Método loadOptionSearch
  // Carrega a opção de busca selecionada a partir do serviço SearchService
  loadOptionSearch(): void {
    this.searchService.searchedOption$.subscribe({
      next: (value) => {
        this.optionSearch = value;
      },
    });
  }

  // Método inputSearch
  // Configura a busca em tempo real, filtrando a lista de reservas conforme o valor digitado
  inputSearch(): void {
    this.searchService.searched$.subscribe({
      next: (value) => {
        this.filter(value);
      },
    });
  }

  // Método filter
  // Filtra a lista de reservas com base no valor de busca e na opção de busca selecionada
  filter(search: string): void {
    switch (this.optionSearch) {
      case 'checkIn':
        this.reservations = search.trim()
          ? this.reservations.filter((res) =>
              res.checkIn.toLowerCase().includes(search.toLowerCase())
            )
          : [...this.reservationsBackup];
        break;
      case 'checkOut':
        this.reservations = search.trim()
          ? this.reservations.filter((res) =>
              res.checkOut.toLowerCase().includes(search.toLowerCase())
            )
          : [...this.reservationsBackup];
        break;
      case 'status':
        this.reservations = search.trim()
          ? this.reservations.filter((res) =>
              res.status.toLowerCase().includes(search.toLowerCase())
            )
          : [...this.reservationsBackup];
        break;
      default:
        this.reservations = search.trim()
          ? this.reservations.filter((res) =>
              res.roomType.toLowerCase().includes(search.toLowerCase())
            )
          : [...this.reservationsBackup];
        break;
    }
  }

  // Método loadReservations
  // Carrega a lista de reservas do serviço e carrega a lista de hóspedes
  loadReservations(): void {
    this.reservationService.getReservations().subscribe({
      next: (reservations) => {
        this.reservations = reservations;
        this.reservationsBackup = reservations;
        this.getGuests();
      },
      error: (err) => console.error(err),
    });
  }

  // Método getInformationsReservation
  // Carrega os detalhes de uma reserva específica com base no ID fornecido
  getInformationsReservation(id: string): void {
    this.reservationService.getReservationById(id).subscribe({
      next: (reservation) => {
        this.reservationInfo = reservation;
      },
      error: (err) => console.error(err),
    });
  }

  // Método getGuests
  // Carrega a lista de hóspedes do serviço GuestsService
  getGuests(): void {
    this.guestService.getGuests().subscribe({
      next: (guest) => {
        this.guests = guest;
      },
      error: (err) => console.error(err),
    });
  }

  // Método removeReservation
  // Remove uma reserva com base no ID fornecido e recarrega a lista de reservas
  removeReservation(id: string): void {
    this.reservationService.deleteReservation(id).subscribe({
      next: () => {
        this.loadReservations();
      },
      error: (err) => console.error(err),
    });
  }

  // Método openModal
  // Abre o modal de edição ou exclusão de reservas com base no ID fornecido
  openModal(id: string, modalId: string) {
    this.reservationId = id;
    this.toggleModal(modalId, true);
  }

  // Método toggleModal
  // Controla a abertura e fechamento dos modais
  toggleModal(modalId: string, isOpen: boolean): void {
    const modal = document.getElementById(modalId) as HTMLDialogElement;
    if (modal) {
      isOpen ? modal.showModal() : modal.close();
    }
  }

  // Método orderByCheckIn
  // Ordena a lista de reservas por data de check-in
  orderByCheckIn(): void {
    this.toggleOrder('thCheckIn');
    this.sortingService.setStrategy(new CheckInSorting());
    this.reservations = this.sortingService.sort(
      this.reservations,
      this.orderState['thCheckIn']
    );
    this.updateTableHeader('thCheckIn');
  }

  // Método orderByCheckOut
  // Ordena a lista de reservas por data de check-out
  orderByCheckOut(): void {
    this.toggleOrder('thCheckOut');
    this.sortingService.setStrategy(new CheckOutSorting());
    this.reservations = this.sortingService.sort(
      this.reservations,
      this.orderState['thCheckOut']
    );
    this.updateTableHeader('thCheckOut');
  }

  // Método orderByStatus
  // Ordena a lista de reservas por status
  orderByStatus(): void {
    this.toggleOrder('thStatus');
    this.sortingService.setStrategy(new StatusSorting());
    this.reservations = this.sortingService.sort(
      this.reservations,
      this.orderState['thStatus']
    );
    this.updateTableHeader('thStatus');
  }

  // Método orderByRoom
  // Ordena a lista de reservas por tipo de quarto
  orderByRoom(): void {
    this.toggleOrder('thRoom');
    this.sortingService.setStrategy(new RoomSorting());
    this.reservations = this.sortingService.sort(
      this.reservations,
      this.orderState['thRoom']
    );
    this.updateTableHeader('thRoom');
  }

  // Método toggleOrder
  // Alterna o estado de ordenação (ascendente, descendente ou nenhum) a cada chamada que a função ordenar fazer
  toggleOrder(columnId: string): void {
    if (!this.orderState[columnId]) {
      this.orderState[columnId] = 'asc';
    } else if (this.orderState[columnId] === 'asc') {
      this.orderState[columnId] = 'desc';
    } else {
      this.orderState[columnId] = null;
    }
  }

  // Método updateTableHeader
  // Atualiza o ícone de ordenação na tabela conforme o estado de ordenação atual
  updateTableHeader(columnId: string): void {
    document.querySelectorAll('.sort-icon').forEach((icon) => icon.remove());

    const columnDiv = document.getElementById(columnId);
    if (!columnDiv) return;

    const order = this.orderState[columnId];

    if (order) {
      const icon = document.createElement('span');
      icon.classList.add('sort-icon');
      icon.innerHTML =
        order === 'asc'
          ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4 w-4 text-primary">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
      </svg>`
          : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4 w-4 text-primary">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5 7.5 21m0 0L12 16.5M7.5 21V7.5m13.5 0L16.5 3m0 0L12 7.5m4.5-4.5V16.5" />
      </svg>`;

      columnDiv.appendChild(icon);
    }
  }

  // Método handleClick
  // Utilizado para fechar dropdown após o usuario selecionar a opção
  handleClick(): void {
    const elem = document.activeElement as HTMLElement;
    if (elem) {
      elem.blur();
    }
  }

  // Método viewAlert
  // Exibe um alerta temporário após ações como exclusão ou edição de reservas
  viewAlert(value: boolean): void {
    const intervalId = setInterval(() => {
      this.viewOrNo = value;
      this.loadReservations();
      this.toggleModal('modalUpdate', false);
      this.toggleModal('modalInsert', false);
      this.toggleModal('modalDeleteReservation', false);
    }, 100);
    setTimeout(() => {
      clearInterval(intervalId);
      this.viewOrNo = false;
    }, 2500);
  }
}
