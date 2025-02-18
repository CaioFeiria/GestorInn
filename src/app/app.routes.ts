import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterGuestsComponent } from './pages/register-guests/register-guests.component';
import { RegisterReservationsComponent } from './pages/register-reservations/register-reservations.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { GuestsComponent } from './pages/guests/guests.component';
import { Component } from '@angular/core';
import { ReservationsComponent } from './pages/reservations/reservations.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'guests',
        component: GuestsComponent,
      },
      {
        path: 'registerGuests',
        component: RegisterGuestsComponent,
      },
      {
        path: 'reservations',
        component: ReservationsComponent,
      },
      {
        path: 'registerReservations',
        component: RegisterReservationsComponent,
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
