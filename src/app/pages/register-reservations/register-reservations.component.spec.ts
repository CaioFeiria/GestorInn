import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterReservationsComponent } from './register-reservations.component';

describe('RegisterReservationsComponent', () => {
  let component: RegisterReservationsComponent;
  let fixture: ComponentFixture<RegisterReservationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterReservationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterReservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
