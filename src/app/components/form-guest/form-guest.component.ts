import { Component, EventEmitter, Output } from '@angular/core';
import { GuestsService } from '../../services/guests.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-form-guest',
  imports: [ReactiveFormsModule],
  templateUrl: './form-guest.component.html',
  styleUrl: './form-guest.component.scss',
})
export class FormGuestComponent {
  formGuests!: FormGroup;
  formInvalid: boolean = false;
  @Output() openAlert = new EventEmitter<boolean>();

  constructor(private guestService: GuestsService) {}

  ngOnInit(): void {
    this.createFormGuests();
  }

  createFormGuests(): void {
    this.formGuests = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required]),
      document: new FormControl('', [Validators.required]),
    });
  }

  onSubmit(): void {
    this.guestService.insertGuest(this.formGuests.value).subscribe({
      next: (value) => {
        this.clearForm();
        this.openAlert.emit(true);
      },
      error: (err) => {
        console.log(err);
      },
    });
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
    });
  }

  clearForm(): void {
    this.formGuests.get('name')?.reset();
    this.formGuests.get('email')?.reset();
    this.formGuests.get('phone')?.reset();
    this.formGuests.get('document')?.reset();
  }
}
