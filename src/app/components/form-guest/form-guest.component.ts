import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { GuestsService } from '../../services/guests.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommomButtonComponent } from '../commom-button/commom-button.component';
import { CommonModule } from '@angular/common';
import { TGuests } from '../../@types/guests';
import { InputMaskModule } from 'primeng/inputmask';

@Component({
  selector: 'app-form-guest',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CommomButtonComponent,
    InputMaskModule,
  ],
  templateUrl: './form-guest.component.html',
  styleUrl: './form-guest.component.scss',
})

// Componente FormGuest
// Formulário de cadastro e edição dos hospedes
// Utiliza Reactive Forms para gerenciar validações
// Utilizando a lib PrimeNG para a mascara do input de telefone e cpf com inputMaskModule
// Método onSubmit para criação de um novo hóspede ou edição de um existente
// Método createFormGuests criação das variávies e validators dos inputs do forms
// Método loadForm responsável de carregar os dados de um guest já existente ao editar (está no changes porque ao carregar a página guests é recebido por @Input() os id de cada guest da tabela para cada botão de editar, assim quando o @Input() guestId recebe um id ele já busca o primeiro, e depois quando é clicado no botão editar ele busca o referente ao botão)
// Método formValidation observa os valores do form e se estives algum inválido não consegue cadastrar/editar
// Método clearForm limpa os campos do form
export class FormGuestComponent implements OnInit, OnChanges {
  formGuests!: FormGroup;
  formInvalid: boolean = true;
  guests: Array<TGuests> = [];
  documentInvalid: boolean = false;
  emailInvalid: boolean = false;
  @Input() guestId!: string;
  @Input() add: boolean = false;
  @Output() openAlert = new EventEmitter<boolean>();

  constructor(private guestService: GuestsService) {}

  ngOnInit(): void {
    this.createFormGuests();
    this.formValidation();
    this.guestService.getGuests().subscribe({
      next: (guestsBd) => {
        this.guests = guestsBd;
      },
      error: (err) => console.error(err),
    });
  }

  // Carrega os dados da reserva para edição quando o ID muda
  ngOnChanges(changes: SimpleChanges): void {
    this.loadForm();
  }

  createFormGuests(): void {
    this.formGuests = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern(/\(\d{2}\) \d{5}-\d{4}/),
      ]),
      document: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
      ]),
    });
  }

  // Método loadForm
  // Carrega os dados de uma reserva existente para edição
  loadForm(): void {
    this.guestService.getGuestById(this.guestId).subscribe({
      next: (value) => {
        this.formGuestSwithValuesStarted(value);
      },
    });
  }

  // Método formGuestSwithValuesStarted
  // Preenche o formulário com os dados da reserva selecionada
  formGuestSwithValuesStarted(guest: TGuests): void {
    this.formGuests.patchValue(guest);
  }

  // Faz a validação se o email e o CPF já estão cadastrado
  validateCpfAndEmailSingle(): boolean {
    let documentForm = this.formGuests.get('document')?.value;
    let emailForm = this.formGuests.get('email')?.value;
    this.guests.forEach((element) => {
      if (element.id != this.guestId) {
        if (element.document == documentForm) this.documentInvalid = true;
        if (element.email == emailForm) this.emailInvalid = true;
      }
    });
    if (this.documentInvalid || this.emailInvalid) {
      this.formInvalid = true;
      return false;
    } else {
      this.formInvalid = false;
      return true;
    }
  }

  // Método onSubmit
  // Envia o formulário para criar ou atualizar um hóspede
  onSubmit(): void {
    if (!this.formInvalid && this.validateCpfAndEmailSingle()) {
      const operation = this.add
        ? this.guestService.insertGuest(this.formGuests.value)
        : this.guestService.updateGuest(this.guestId, this.formGuests.value);
      operation.subscribe({
        next: () => {
          this.clearForm();
          this.openAlert.emit(true);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  // Método formValidation
  // Valida o formulário em tempo real
  formValidation(): void {
    this.formGuests.valueChanges.subscribe({
      next: () => {
        if (this.formGuests.invalid) {
          this.formInvalid = true;
        } else {
          this.formInvalid = false;
        }
        if (this.formInvalid) {
          this.emailInvalid = true;
          this.documentInvalid = true;
        } else {
          this.emailInvalid = false;
          this.documentInvalid = false;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // Método clearForm
  // Limpa os campos do formulário após o envio
  clearForm(): void {
    this.formGuests.reset();
  }
}
