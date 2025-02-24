import { Component, OnInit } from '@angular/core';
import { ReservationsService } from '../../services/reservations.service';
import { GuestsService } from '../../services/guests.service';
import { TReservations } from '../../@types/reservations';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TGuests } from '../../@types/guests';
import { CommonModule, DatePipe } from '@angular/common';
import { CommomButtonComponent } from '../../components/commom-button/commom-button.component';

@Component({
  selector: 'app-reservation-details',
  imports: [CommonModule, DatePipe, CommomButtonComponent, RouterLink],
  templateUrl: './reservation-details.component.html',
  styleUrl: './reservation-details.component.scss',
})
// Componente ReservationDetailsComponent
// Exibe os detalhes de uma reserva específica, incluindo informações do hóspede associado
// Responsável por carregar os dados da reserva e do hóspede correspondente com base no ID da reserva
export class ReservationDetailsComponent implements OnInit {
  reservation!: TReservations;
  guest!: TGuests;
  idParam: string = '';

  constructor(
    private reservationService: ReservationsService,
    private guestService: GuestsService,
    private activatedRouted: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.idParam = this.activatedRouted.snapshot.params['id'];
    this.loadReservation(this.idParam);
  }

  // Método loadReservation
  // Carrega os detalhes da reserva com base no ID fornecido
  // Após carregar a reserva, chama o método loadGuest para carregar os detalhes do hóspede associado
  loadReservation(id: string): void {
    this.reservationService.getReservationById(id).subscribe({
      next: (reservation) => {
        this.reservation = reservation;
        this.loadGuest(reservation.guestId);
      },
      error: (err) => console.error(err),
    });
  }

  // Método loadGuest
  // Carrega os detalhes do hóspede com base no ID fornecido
  loadGuest(id: string): void {
    this.guestService.getGuestById(id).subscribe({
      next: (guest) => {
        this.guest = guest;
      },
      error: (err) => console.error(err),
    });
  }
}
