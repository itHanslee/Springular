import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Esquema } from './esquema';

describe('Esquema', () => {
  let component: Esquema;
  let fixture: ComponentFixture<Esquema>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Esquema],
    }).compileComponents();

    fixture = TestBed.createComponent(Esquema);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});