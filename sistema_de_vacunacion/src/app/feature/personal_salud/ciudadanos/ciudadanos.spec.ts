// ciudadanos.spec.ts (versión por defecto que genera el CLI)
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Ciudadanos } from './ciudadanos';

describe('Ciudadanos', () => {
  let component: Ciudadanos;
  let fixture: ComponentFixture<Ciudadanos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ciudadanos]
    }).compileComponents();

    fixture = TestBed.createComponent(Ciudadanos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});