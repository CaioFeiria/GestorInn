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

// Componente FormReservation
// Formulário de cadastro e edição de reservas
// Utiliza Reactive Forms para gerenciar validações
// Método onSubmit para criação de uma nova reserva ou edição de uma existente
// Método createForm cria as variáveis e validators dos inputs do formulário
// Método loadFormEdit responsável por carregar os dados de uma reserva já existente ao editar (está no changes porque ao carregar a página de reservas, o @Input() reservationId recebe um id, e quando o botão de editar é clicado, ele busca os dados da reserva correspondente)
// Método formValidation observa os valores do formulário e, se houver algum inválido, impede o cadastro/edição
// Método clearForm limpa os campos do formulário após o envio
export class FormReservationComponent implements OnInit, OnChanges {
  formReservation!: FormGroup;
  formInvalid: boolean = true;
  guests!: Array<TGuests>;
  roomFull: boolean = false;
  roomCapacityFull: boolean = false;
  roomTypeValue: string = '';
  roomCapacityValue: number = 0;
  reservations: Array<TReservations> = [];
  @Input() reservationId: string = '';
  @Input() add: boolean = false;
  @Output() openAlert = new EventEmitter<boolean>();

  // Object.values transforma em um array que conseguimos acessar os seus valores no caso os enums
  roomTypeMaping = roomTypeMapping; // Mapeamento de tipos de quarto
  roomTypesEnum = Object.values(RoomType); // Lista de valores do enum RoomType

  statusMaping = statusMapping; // Mapeamento de status de reserva
  statusTypes = Object.values(Status); // Lista de valores do enum Status

  constructor(
    private reservationService: ReservationsService,
    private guestService: GuestsService,
    private datePipe: DatePipe,
    private roomService: RoomsService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getGuests();
    this.getReservatons();
    this.formValidation();
    this.roomValidate();
  }

  // Carrega os dados da reserva para edição quando o ID muda
  ngOnChanges(changes: SimpleChanges): void {
    this.loadFormEdit();
  }

  // Método createForm
  // Cria o FormGroup com os validators necessários
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

  // Método dateCheckOutIsNotBeforeCheckIn
  // Verifica se a data de check-out não é anterior à data de check-in
  dateCheckOutIsNotBeforeCheckIn(): boolean {
    const checkIn = new Date(this.formReservation.get('checkIn')?.value);
    const checkOut = new Date(this.formReservation.get('checkOut')?.value);

    if (checkOut < checkIn) {
      return false;
    }
    return true;
  }

  // Método getGuests
  // Obtém a lista de hóspedes do serviço GuestsService
  getGuests(): void {
    this.guestService.getGuests().subscribe({
      next: (guests) => {
        this.guests = guests;
      },
      error: (err) => console.log(err),
    });
  }

  // Método checkRoomAvailability
  // Verifica se o quarto está disponível
  checkRoomAvailability(): boolean {
    if (this.roomService.isRoomAvailable(this.roomTypeValue)) {
      if (this.formReservation.invalid) this.formInvalid = true;
      return true;
    }
    this.formInvalid = true;
    return false;
  }

  // Método roomHasCapacity
  // Verifica se o quarto tem capacidade para o número de hóspedes digitado
  roomHasCapacity(): boolean {
    return this.roomService.checkRoomCapacity(
      this.roomTypeValue,
      this.roomCapacityValue
    );
  }

  // Método getReservatons
  // Obtém a lista de reservas do serviço ReservationsService
  getReservatons(): void {
    this.reservationService.getReservations().subscribe({
      next: (value) => {
        this.reservations = value;
      },
      error: (err) => console.log(err),
    });
  }

  // Método roomValidate
  // Valida o tipo de quarto e a capacidade em tempo real
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

  // Método onSubmit
  // Envia o formulário para criar ou atualizar uma reserva
  onSubmit(): void {
    if (!this.formInvalid) {
      if (
        this.dateCheckOutIsNotBeforeCheckIn() &&
        this.checkRoomAvailability() &&
        !this.roomHasCapacity()
      ) {
        const operation = this.add
          ? this.reservationService.insertReservation(
              this.formReservation.value
            )
          : this.reservationService.updateReservation(
              this.reservationId,
              this.formReservation.value
            );
        operation.subscribe({
          next: () => {
            this.clearForm();
            this.openAlert.emit(true);
          },
          error: (err) => console.log(err),
        });
      }
    }
  }

  // Método formValidation
  // Valida o formulário em tempo real
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

  // Método loadFormEdit
  // Carrega os dados de uma reserva existente para edição
  loadFormEdit(): void {
    this.reservationService.getReservationById(this.reservationId).subscribe({
      next: (reservation) => {
        this.formReservationSelected(reservation);
      },
      error: (err) => console.log(err),
    });
  }

  // Método formReservationSelected
  // Preenche o formulário com os dados da reserva selecionada
  formReservationSelected(reservation: TReservations): void {
    this.formReservation.patchValue(reservation);
  }

  // Método clearForm
  // Limpa os campos do formulário após o envio
  clearForm(): void {
    this.formReservation.reset();
  }
}
