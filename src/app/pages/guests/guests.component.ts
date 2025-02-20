import { Component, OnInit } from '@angular/core';
import { GuestsService } from '../../services/guests.service';
import { TGuests } from '../../@types/guests';
import { ModalComponent } from '../../components/modal/modal.component';
import { FormGuestComponent } from '../../components/form-guest/form-guest.component';
import { AlertComponent } from '../../components/alert/alert.component';
import { CommomButtonComponent } from '../../components/commom-button/commom-button.component';

@Component({
  selector: 'app-guests',
  imports: [
    ModalComponent,
    FormGuestComponent,
    AlertComponent,
    CommomButtonComponent,
  ],
  templateUrl: './guests.component.html',
  styleUrl: './guests.component.scss',
})
export class GuestsComponent implements OnInit {
  guests: Array<TGuests> = [];
  guestId: string = '';
  viewOrNo: boolean = false;

  constructor(private guestService: GuestsService) {}

  ngOnInit(): void {
    this.loadFirstGuest();
    this.loadGuests();
  }

  loadFirstGuest(): void {
    this.guestService.getGuests().subscribe({
      next: (guests) => {
        if (guests.length > 0) {
          this.guestId = guests[0].id;
        }
      },
      error: (err) => console.error(err),
    });
  }

  loadGuests(): void {
    this.guestService.getGuests().subscribe({
      next: (guests) => {
        this.guests = guests;
      },
      error: (err) => console.error(err),
    });
  }

  loadGuestInformations(id: string): void {
    this.guestService.getGuestById(id).subscribe({
      next: (guest) => {
        this.guestId = guest.id;
      },
      error: (err) => console.error(err),
    });
  }

  removeGuest(id: string): void {
    this.guestService.deleteGuest(id).subscribe({
      next: () => {
        this.loadGuests();
      },
      error: (err) => console.error(err),
    });
  }

  openModal(id: string, modalId: string) {
    this.guestId = id;
    this.toggleModal(modalId, true);
  }

  toggleModal(modalId: string, isOpen: boolean): void {
    const modal = document.getElementById(modalId) as HTMLDialogElement;
    if (modal) {
      isOpen ? modal.showModal() : modal.close();
    }
  }

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
