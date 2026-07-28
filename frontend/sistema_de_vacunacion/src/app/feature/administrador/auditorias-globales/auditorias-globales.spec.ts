import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriasGlobales } from './auditorias-globales';

describe('AuditoriasGlobales', () => {
  let component: AuditoriasGlobales;
  let fixture: ComponentFixture<AuditoriasGlobales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditoriasGlobales],
    }).compileComponents();

    fixture = TestBed.createComponent(AuditoriasGlobales);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
