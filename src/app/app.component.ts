import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { GuestsService } from './services/guests.service';
import { AlertComponent } from './components/alert/alert.component';
import { LayoutComponent } from './components/layout/layout.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule, AlertComponent, LayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'GestorInn';
  formGuests!: FormGroup;
  formInvalid: boolean = false;
  viewOrNo: boolean = false;

  constructor(private guestService: GuestsService) {}

  ngOnInit(): void {
    this.createFormGuests();
  }

  createFormGuests(): void {
    this.formGuests = new FormGroup({
      fullName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      telephone: new FormControl('', [Validators.required]),
      cpf: new FormControl('', [Validators.required]),
      passport: new FormControl('', [Validators.required]),
    });
  }

  onSubmit(): void {
    this.guestService.insertGuest(this.formGuests.value).subscribe({
      next: (value) => {
        console.log(value);
        this.viewOrNo = true;
        this.clearForm();
      },
      error: (err) => {
        console.log(err);
      },
    });
    setTimeout(() => {
      this.viewOrNo = false;
    }, 3000);
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
    this.formGuests.get('fullName')?.reset();
    this.formGuests.get('email')?.reset();
    this.formGuests.get('telephone')?.reset();
    this.formGuests.get('cpf')?.reset();
    this.formGuests.get('passport')?.reset();
  }
}
