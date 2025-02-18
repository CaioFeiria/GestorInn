import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterGuestsComponent } from './pages/register-guests/register-guests.component';
import { RegisterReservationsComponent } from './pages/register-reservations/register-reservations.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        data: { breadcrumb: 'Início' },
      },
      {
        path: 'registerGuests',
        component: RegisterGuestsComponent,
        data: { breadcrumb: 'Hóspedes' },
      },
      {
        path: 'movie/:id',
        component: RegisterReservationsComponent,
        data: { breadcrumb: 'Reservas' },
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
