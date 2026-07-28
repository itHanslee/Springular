import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarVacunas } from './gestionar-vacunas';

describe('GestionarVacunas', () => {
  let component: GestionarVacunas;
  let fixture: ComponentFixture<GestionarVacunas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarVacunas],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionarVacunas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
