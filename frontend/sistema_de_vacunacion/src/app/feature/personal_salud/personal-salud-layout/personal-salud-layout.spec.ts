import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalSaludLayout } from './personal-salud-layout';

describe('PersonalSaludLayout', () => {
  let component: PersonalSaludLayout;
  let fixture: ComponentFixture<PersonalSaludLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalSaludLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalSaludLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
