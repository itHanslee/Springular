import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarVacunacion } from './registrar-vacunacion';

describe('RegistrarVacunacion', () => {
  let component: RegistrarVacunacion;
  let fixture: ComponentFixture<RegistrarVacunacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarVacunacion],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrarVacunacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
