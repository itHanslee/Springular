export interface LoginCiudadanoResquest {
  usuario: string;
  ultimos4: string;
}

export interface LoginStaffResquest {
  usuario: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  tipoToken: string;
  email: string;
  rol: string;
}
