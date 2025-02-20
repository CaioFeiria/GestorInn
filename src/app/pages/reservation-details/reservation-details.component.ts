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

  loadReservation(id: string): void {
    this.reservationService.getReservationById(id).subscribe({
      next: (reservation) => {
        this.reservation = reservation;
        this.loadGuest(reservation.guestId);
        console.log(this.reservation);
      },
      error: (err) => console.error(err),
    });
  }

  async loadGuest(id: string): Promise<void> {
    this.guestService.getGuestById(id).subscribe({
      next: (guest) => {
        this.guest = guest;
        console.log(this.guest);
      },
      error: (err) => console.error(err),
    });
  }
}
