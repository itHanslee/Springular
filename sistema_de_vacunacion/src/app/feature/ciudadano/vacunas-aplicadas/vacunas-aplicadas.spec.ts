import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacunasAplicadas } from './vacunas-aplicadas';

describe('VacunasAplicadas', () => {
  let component: VacunasAplicadas;
  let fixture: ComponentFixture<VacunasAplicadas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacunasAplicadas],
    }).compileComponents();

    fixture = TestBed.createComponent(VacunasAplicadas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
