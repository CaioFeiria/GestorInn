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
import { RoomsService } from '../../services/rooms.service';

@Component({
  selector: 'app-form-reservation',
  imports: [CommonModule, CommomButtonComponent, ReactiveFormsModule],
  templateUrl: './form-reservation.component.html',
  styleUrl: './form-reservation.component.scss',
  providers: [DatePipe],
})
export class FormReservationComponent implements OnInit, OnChanges {
  formReservation!: FormGroup;
  formInvalid: boolean = true;
  guests!: Array<TGuests>;
  roomFull: boolean = false;
  roomCapacityFull: boolean = false;
  roomTypeValue: string = '';
  roomCapacityValue: number = 0;
  @Input() reservationId: string = '';
  @Input() add: boolean = false;
  @Output() openAlert = new EventEmitter<boolean>();

  roomTypeMaping = roomTypeMapping;
  roomTypesEnum = Object.values(RoomType);

  statusMaping = statusMapping;
  statusTypes = Object.values(Status);

  constructor(
    private reservationService: ReservationsService,
    private guestService: GuestsService,
    private datePipe: DatePipe,
    private roomService: RoomsService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getGuests();
    this.formValidation();
    this.roomValidate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadFormEdit();
  }

  createForm(): void {
    this.formReservation = new FormGroup({
      guestId: new FormControl('', [Validators.required]),
      checkIn: new FormControl(
        this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        [Validators.required]
      ),
      checkOut: new FormControl('', [Validators.required]),
      roomType: new FormControl('', [Validators.required]),
      numberOfGuests: new FormControl('', [
        Validators.required,
        Validators.min(1),
      ]),
      status: new FormControl('', [Validators.required]),
      remarks: new FormControl('', [Validators.required]),
    });
  }

  dateCheckOutIsNotBeforeCheckIn(): boolean {
    const checkIn = new Date(this.formReservation.get('checkIn')?.value);
    const checkOut = new Date(this.formReservation.get('checkOut')?.value);

    if (checkOut < checkIn) {
      return false;
    }
    return true;
  }

  getGuests(): void {
    this.guestService.getGuests().subscribe({
      next: (guests) => {
        this.guests = guests;
      },
      error: (err) => console.log(err),
    });
  }

  checkRoomAvailability(): boolean {
    if (this.roomService.isRoomAvailable(this.roomTypeValue)) {
      if (this.formReservation.invalid) this.formInvalid = true;
      return true;
    }
    this.formInvalid = true;
    return false;
  }

  roomHasCapacity(): boolean {
    return this.roomService.checkRoomCapacity(
      this.roomTypeValue,
      this.roomCapacityValue
    );
  }

  roomValidate(): void {
    this.formReservation.valueChanges.subscribe({
      next: () => {
        this.roomTypeValue = this.formReservation.get('roomType')?.value;
        this.roomCapacityValue =
          this.formReservation.get('numberOfGuests')?.value;
        !this.checkRoomAvailability()
          ? (this.roomFull = true)
          : (this.roomFull = false);
        this.roomHasCapacity()
          ? (this.roomCapacityFull = true)
          : (this.roomCapacityFull = false);
      },
      error: (err) => console.log(err),
    });
  }

  onSubmit(): void {
    if (!this.formInvalid) {
      if (
        this.dateCheckOutIsNotBeforeCheckIn() &&
        this.checkRoomAvailability() &&
        !this.roomHasCapacity()
      ) {
        if (this.add) {
          this.reservationService
            .insertReservation(this.formReservation.value)
            .subscribe({
              next: () => {
                this.clearForm();
                this.openAlert.emit(true);
              },
              error: (err) => console.log(err),
            });
        } else {
          this.reservationService
            .updateReservation(this.reservationId, this.formReservation.value)
            .subscribe({
              next: () => {
                this.openAlert.emit(true);
              },
              error: (err) => console.log(err),
            });
        }
      }
    }
  }

  formValidation(): void {
    this.formReservation.valueChanges.subscribe({
      next: () => {
        if (
          this.formReservation.invalid &&
          !this.checkRoomAvailability() &&
          this.roomHasCapacity()
        ) {
          this.formInvalid = true;
        } else {
          this.formInvalid = false;
        }
      },
      error: (err) => console.log(err),
    });
  }

  loadFormEdit(): void {
    this.reservationService.getReservationById(this.reservationId).subscribe({
      next: (reservation) => {
        this.formReservationSelected(reservation);
      },
      error: (err) => console.log(err),
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
