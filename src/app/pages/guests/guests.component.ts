import { Component, OnInit } from '@angular/core';
import { GuestsService } from '../../services/guests.service';
import { TGuests } from '../../@types/guests';
import { ModalComponent } from '../../components/modal/modal.component';
import { FormGuestComponent } from '../../components/form-guest/form-guest.component';
import { AlertComponent } from '../../components/alert/alert.component';
import { CommomButtonComponent } from '../../components/commom-button/commom-button.component';
import { ReservationsService } from '../../services/reservations.service';
import { TReservations } from '../../@types/reservations';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-guests',
  imports: [
    ModalComponent,
    FormGuestComponent,
    AlertComponent,
    CommomButtonComponent,
    CommonModule,
  ],
  templateUrl: './guests.component.html',
  styleUrl: './guests.component.scss',
})

// Componente GuestsComponent
// Listagem e gerenciamento de hóspedes em uma tabela
// Responsável por carregar a lista de hóspedes e suas reservas, além de permitir a exclusão de hóspedes
// Método loadGuests carrega a lista de hóspedes e define o primeiro hóspede como selecionado por padrão
// Método loadGuestInformations carrega as informações de um hóspede específico ao selecioná-lo
// Método getReservations obtém a lista de reservas para validação de hóspedes com reservas ativas
// Método validationGustHasReservation verifica se um hóspede possui reserva ativa
// Método removeGuest remove um hóspede, desde que ele não tenha reservas ativas
// Método openModal abre o modal de exclusão ou edição de hóspedes
// Método toggleModal controla a abertura e fechamento dos modais
// Método viewAlert exibe um alerta temporário após ações como exclusão ou edição de hóspedes
export class GuestsComponent implements OnInit {
  guests: Array<TGuests> = [];
  reservation!: TReservations;
  reservations: Array<TReservations> = [];
  guestHasReservation: boolean = false;
  guestId: string = '';
  guestIdHasReservation: string = '';
  viewOrNo: boolean = false;

  constructor(
    private guestService: GuestsService,
    private reservationService: ReservationsService
  ) {}

  ngOnInit(): void {
    this.loadGuests();
    this.getReservations();
  }

  // Método loadGuests
  // Carrega a lista de hóspedes do serviço e define o primeiro hóspede como selecionado por padrão
  loadGuests(): void {
    this.guestService.getGuests().subscribe({
      next: (guests) => {
        this.guests = guests;
        if (guests.length > 0) {
          this.guestId = guests[0].id;
        }
      },
      error: (err) => console.error(err),
    });
  }

  // Método loadGuestInformations
  // Carrega as informações de um hóspede específico ao selecioná-lo
  loadGuestInformations(id: string): void {
    this.guestService.getGuestById(id).subscribe({
      next: (guest) => {
        this.guestId = guest.id;
      },
      error: (err) => console.error(err),
    });
  }

  // Método getReservations
  // Obtém a lista de reservas para validação de hóspedes com reservas ativas
  getReservations(): void {
    this.reservationService.getReservations().subscribe({
      next: (reserv) => {
        this.reservations = reserv;
      },
    });
  }

  // Método validationGustHasReservation
  // Verifica se um hóspede possui reserva ativa
  validationGustHasReservation(id: string): boolean {
    this.reservations.forEach((element) => {
      if (element.guestId == id) {
        this.guestIdHasReservation = element.guestId;
      }
    });
    this.guestIdHasReservation == id
      ? (this.guestHasReservation = true)
      : (this.guestHasReservation = false);
    return true;
  }

  // Método removeGuest
  // Remove um hóspede, desde que ele não tenha reservas ativas
  removeGuest(id: string): void {
    if (this.guestIdHasReservation != id) {
      this.guestHasReservation = false;
      this.guestService.deleteGuest(id).subscribe({
        next: (value) => {
          this.loadGuests();
        },
        error: (err) => console.error(err),
      });
    }
  }

  // Método openModal
  // Abre o modal de exclusão ou edição de hóspedes
  openModal(id: string, modalId: string) {
    if (modalId == 'modalDeleteGuest') {
      this.validationGustHasReservation(id);
    }
    this.guestId = id;
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

  // Método viewAlert
  // Exibe um alerta temporário após ações como exclusão ou edição de hóspedes
  viewAlert(value: boolean): void {
    const intervalId = setInterval(() => {
      this.viewOrNo = value;
      this.loadGuests();
      this.toggleModal('modalUpdate', false);
      this.toggleModal('modalInsert', false);
      this.toggleModal('modalDeleteGuest', false);
    }, 100);
    setTimeout(() => {
      clearInterval(intervalId);
      this.viewOrNo = false;
    }, 2500);
  }
}
