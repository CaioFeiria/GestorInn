import {
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnInit,
} from '@angular/core';
import { GuestsService } from '../../services/guests.service';
import { TGuests } from '../../@types/guests';
import { RouterLink } from '@angular/router';
import { ModalComponent } from '../../components/modal/modal.component';
import { FormGuestComponent } from '../../components/form-guest/form-guest.component';
import { AlertComponent } from '../../components/alert/alert.component';
import { CommomButtonComponent } from '../../components/commom-button/commom-button.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-guests',
  imports: [
    RouterLink,
    ModalComponent,
    FormGuestComponent,
    AlertComponent,
    CommomButtonComponent,
  ],
  templateUrl: './guests.component.html',
  styleUrl: './guests.component.scss',
})
export class GuestsComponent implements OnInit {
  guestsIds: Array<number> = [];
  guests: Array<TGuests> = [];
  guest!: TGuests;
  viewOrNo: boolean = false;

  constructor(private guestsService: GuestsService) {}

  ngOnInit(): void {
    this.loadGuests();
  }

  loadGuests(): void {
    this.guestsService.getGuests().subscribe({
      next: (guests) => {
        this.guests = guests;
        if (guests.length > 0) {
          this.loadGuestInformations(guests[0].id);
        }
      },
    });
  }

  loadGuestInformations(id: number): void {
    this.guestsService.getGuestById(id).subscribe({
      next: (guest) => {
        this.guest = guest;
      },
      error: (err) => {
        console.error(err);
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

  viewAlert(value: boolean): void {
    const intervalId = setInterval(() => {
      this.viewOrNo = value;
      this.loadGuests();
      this.toggleModal(false);
    }, 100);
    setTimeout(() => {
      clearInterval(intervalId);
      this.viewOrNo = false;
    }, 2500);
  }
}
