import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginCiudadano } from './login-ciudadano';

describe('LoginCiudadano', () => {
  let component: LoginCiudadano;
  let fixture: ComponentFixture<LoginCiudadano>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginCiudadano],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginCiudadano);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
