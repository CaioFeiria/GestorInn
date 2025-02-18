import { Component, OnInit } from '@angular/core';
import { GuestsService } from '../../services/guests.service';
import { TGuests } from '../../@types/guests';
import { RouterLink } from '@angular/router';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-guests',
  imports: [RouterLink, ModalComponent],
  templateUrl: './guests.component.html',
  styleUrl: './guests.component.scss',
})
export class GuestsComponent implements OnInit {
  guests: Array<TGuests> = [];

  constructor(private guestsService: GuestsService) {}

  ngOnInit(): void {
    this.guestsService.getGuests().subscribe({
      next: (guests) => {
        this.guests = guests;
      },
    });
  }

  toggleModal(isOpen: boolean): void {
    const modal = document.getElementById('mdl') as HTMLDialogElement;
    if (modal) {
      if (isOpen) {
        modal.showModal();
      } else {
        modal.close();
      }
    }
  }
}
