import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalSalud } from './personal-salud';

describe('PersonalSalud', () => {
  let component: PersonalSalud;
  let fixture: ComponentFixture<PersonalSalud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalSalud],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalSalud);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
