import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacunasPendientes } from './vacunas-pendientes';

describe('VacunasPendientes', () => {
  let component: VacunasPendientes;
  let fixture: ComponentFixture<VacunasPendientes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacunasPendientes],
    }).compileComponents();

    fixture = TestBed.createComponent(VacunasPendientes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
