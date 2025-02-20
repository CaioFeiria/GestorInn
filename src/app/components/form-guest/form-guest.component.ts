import {
  AfterViewInit,
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

@Component({
  selector: 'app-form-guest',
  imports: [CommonModule, ReactiveFormsModule, CommomButtonComponent],
  templateUrl: './form-guest.component.html',
  styleUrl: './form-guest.component.scss',
})
export class FormGuestComponent implements OnInit, OnChanges {
  formGuests!: FormGroup;
  formInvalid: boolean = true;
  @Input() guestId!: string;
  @Input() add: boolean = false;
  @Output() openAlert = new EventEmitter<boolean>();

  constructor(private guestService: GuestsService) {}

  ngOnInit(): void {
    this.createFormGuests();
    this.formValidation();
  }

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

  loadForm(): void {
    this.guestService.getGuestById(this.guestId).subscribe({
      next: (value) => {
        this.formGuestSwithValuesStarted(value);
      },
    });
  }

  formGuestSwithValuesStarted(guest: TGuests): void {
    this.formGuests.get('name')?.setValue(guest.name);
    this.formGuests.get('email')?.setValue(guest.email);
    this.formGuests.get('phone')?.setValue(guest.phone);
    this.formGuests.get('document')?.setValue(guest.document);
  }

  onSubmit(): void {
    if (!this.formInvalid) {
      if (this.add) {
        this.guestService.insertGuest(this.formGuests.value).subscribe({
          next: (value) => {
            this.clearForm();
            this.openAlert.emit(true);
          },
          error: (err) => {
            console.log(err);
          },
        });
      } else {
        this.guestService
          .updateGuest(this.guestId, this.formGuests.value)
          .subscribe({
            next: (value) => {
              console.log(value);
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
    this.formGuests.valueChanges.subscribe({
      next: () => {
        if (this.formGuests.invalid) {
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
    this.formGuests.get('name')?.reset();
    this.formGuests.get('email')?.reset();
    this.formGuests.get('phone')?.reset();
    this.formGuests.get('document')?.reset();
  }
}
