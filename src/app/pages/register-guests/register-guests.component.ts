import { Component, Input, OnInit } from '@angular/core';
import { AlertComponent } from '../../components/alert/alert.component';
import { GuestsService } from '../../services/guests.service';
import { FormGuestComponent } from '../../components/form-guest/form-guest.component';

@Component({
  selector: 'app-register-guests',
  imports: [AlertComponent, FormGuestComponent],
  templateUrl: './register-guests.component.html',
  styleUrl: './register-guests.component.scss',
})
export class RegisterGuestsComponent {
  viewOrNo: boolean = false;

  viewAlert(value: boolean): void {
    this.viewOrNo = value;
    setTimeout(() => {
      this.viewOrNo = false;
    }, 2000);
  }
}
