import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
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
import { TReservations } from '../../@types/reservations';

@Component({
  selector: 'app-form-reservation',
  imports: [CommonModule, CommomButtonComponent, ReactiveFormsModule, DatePipe],
  templateUrl: './form-reservation.component.html',
  styleUrl: './form-reservation.component.scss',
})
export class FormReservationComponent implements OnInit, OnChanges {
  formReservation!: FormGroup;
  formInvalid: boolean = false;
  guests!: Array<TGuests>;
  @Input() reservationId: number = 0;
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

  ngOnChanges(changes: SimpleChanges): void {
    this.loadForm();
  }

  createForm(): void {
    this.formReservation = new FormGroup({
      guestId: new FormControl('', [Validators.required]),
      checkIn: new FormControl('', [Validators.required]),
      checkOut: new FormControl('', [Validators.required]),
      roomType: new FormControl('', [Validators.required]),
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

  loadForm(): void {
    this.reservationService.getReservationById(this.reservationId).subscribe({
      next: (reservation) => {
        this.formReservationSelected(reservation);
      },
    });
  }

  formReservationSelected(reservation: TReservations): void {
    this.formReservation.get('guestId')?.setValue(reservation.guestId);
    this.formReservation.get('checkIn')?.setValue(reservation.checkIn);
    this.formReservation.get('checkOut')?.setValue(reservation.checkOut);
    this.formReservation.get('roomType')?.setValue(reservation.roomType);
    this.formReservation
      .get('numberOfGuests')
      ?.setValue(reservation.numberOfGuests);
    this.formReservation.get('status')?.setValue(reservation.status);
    this.formReservation.get('remarks')?.setValue(reservation.remarks);
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
