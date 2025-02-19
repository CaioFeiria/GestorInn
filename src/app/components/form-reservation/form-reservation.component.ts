import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommomButtonComponent } from '../commom-button/commom-button.component';
import { CommonModule, DatePipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ReservationsService } from '../../services/reservations.service';
import { GuestsService } from '../../services/guests.service';
import { TGuests } from '../../@types/guests';
import { RoomType, roomTypeMapping } from '../../enums/roomType.enum';
import { Status, statusMapping } from '../../enums/status.enum';

@Component({
  selector: 'app-form-reservation',
  imports: [CommonModule, CommomButtonComponent, ReactiveFormsModule, DatePipe],
  templateUrl: './form-reservation.component.html',
  styleUrl: './form-reservation.component.scss',
})
export class FormReservationComponent implements OnInit {
  formReservation!: FormGroup;
  formInvalid: boolean = false;
  guests!: Array<TGuests>;
  @Input() reservationId!: number;
  @Input() add: boolean = false;
  @Output() openAlert = new EventEmitter<boolean>();

  roomTypeMaping = roomTypeMapping;
  roomTypesEnum = Object.values(RoomType);

  statusMaping = statusMapping;
  statusTypes = Object.values(Status);

  constructor(
    private reservationService: ReservationsService,
    private guestService: GuestsService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getGuests();
  }

  createForm(): void {
    this.formReservation = new FormGroup({
      guestId: new FormControl('', [Validators.required]),
      checkIn: new FormControl('', [Validators.required]),
      checkOut: new FormControl('', [Validators.required]),
      roomType: new FormControl('selected', [Validators.required]),
      numberOfGuests: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
      remarks: new FormControl('', [Validators.required]),
    });
  }

  getGuests(): void {
    this.guestService.getGuests().subscribe({
      next: (guests) => {
        this.guests = guests;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onSubmit(): void {
    if (!this.formInvalid) {
      if (this.add) {
        this.reservationService
          .insertReservation(this.formReservation.value)
          .subscribe({
            next: (cadasgtro) => {
              console.log('AQUI O CADASTRADO', cadasgtro);
              this.clearForm();
              this.openAlert.emit(true);
            },
            error: (err) => {
              console.log(err);
            },
          });
      } else {
        this.reservationService
          .updateReservation(this.reservationId, this.formReservation.value)
          .subscribe({
            next: (value) => {
              console.log('EIS O PUT:', value);
              this.openAlert.emit(true);
            },
            error: (err) => {
              console.log(err);
            },
          });
      }
    }
  }

  formValidation(): void {
    this.formReservation.valueChanges.subscribe({
      next: () => {
        if (this.formReservation.invalid) {
          this.formInvalid = true;
        } else {
          this.formInvalid = false;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  clearForm(): void {
    this.formReservation.get('guestId')?.reset();
    this.formReservation.get('checkIn')?.reset();
    this.formReservation.get('checkOut')?.reset();
    this.formReservation.get('roomType')?.reset();
    this.formReservation.get('numberOfGuests')?.reset();
    this.formReservation.get('status')?.reset();
    this.formReservation.get('remarks')?.reset();
  }
}
