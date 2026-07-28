import { TestBed } from '@angular/core/testing';

import { EsquemaVacunacion } from './esquema-vacunacion';

describe('EsquemaVacunacion', () => {
  let service: EsquemaVacunacion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EsquemaVacunacion);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
