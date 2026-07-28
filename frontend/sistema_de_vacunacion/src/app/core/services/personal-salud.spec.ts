import { TestBed } from '@angular/core/testing';

import { PersonalSalud } from './personal-salud';

describe('PersonalSalud', () => {
  let service: PersonalSalud;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonalSalud);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
