import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GuestsService } from '../../services/guests.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommomButtonComponent } from '../commom-button/commom-button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-guest',
  imports: [CommonModule, ReactiveFormsModule, CommomButtonComponent],
  templateUrl: './form-guest.component.html',
  styleUrl: './form-guest.component.scss',
})
export class FormGuestComponent implements OnInit {
  formGuests!: FormGroup;
  formInvalid: boolean = true;
  @Output() openAlert = new EventEmitter<boolean>();

  constructor(private guestService: GuestsService) {}

  ngOnInit(): void {
    this.createFormGuests();
    this.formValidation();
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

  onSubmit(): void {
    if (!this.formInvalid) {
      this.guestService.insertGuest(this.formGuests.value).subscribe({
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

  formValidation(): void {
    this.formGuests.valueChanges.subscribe({
      next: (value) => {
        console.log(value);
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
