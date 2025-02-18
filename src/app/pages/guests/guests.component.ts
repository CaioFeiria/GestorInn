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
  guestInformations!: TGuests;
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
        this.guestInformations = guest;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  removeGuest(id: number): void {
    this.guestsService.deleteGuest(id).subscribe({
      next: (value) => {
        console.log(value);
        this.loadGuests();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  toggleModalUpdate(isOpen: boolean): void {
    const modal = document.getElementById('modalUpdate') as HTMLDialogElement;
    if (modal) {
      if (isOpen) {
        modal.showModal();
      } else {
        modal.close();
      }
    }
  }

  toggleModalInsert(isOpen: boolean): void {
    const modal = document.getElementById('modalInsert') as HTMLDialogElement;
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
      this.toggleModalUpdate(false);
    }, 100);
    setTimeout(() => {
      clearInterval(intervalId);
      this.viewOrNo = false;
    }, 2500);
  }
}
