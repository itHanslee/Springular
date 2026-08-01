import { TestBed } from '@angular/core/testing';

import { Ciudadano } from './ciudadano';

describe('Ciudadano', () => {
  let service: Ciudadano;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ciudadano);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
