export const API_BASE_URL = { production: false, apiUrl: 'http://localhost:8080' };

export const API = {

  AUTH: {
    LOGIN: `${API_BASE_URL.apiUrl}/api/auth/login`
  },

  USUARIOS: {
    BASE: `${API_BASE_URL.apiUrl}/api/usuarios`,
    ME: `${API_BASE_URL.apiUrl}/api/usuarios/me`,
    POR_ID: (id: number) => `${API_BASE_URL.apiUrl}/api/usuarios/${id}`
  },



  CIUDADANOS: {
    PERFIL: (id: number) => `${API_BASE_URL.apiUrl}/api/ciudadanos/${id}/perfil`,
    CARNE: (id: number) => `${API_BASE_URL.apiUrl}/api/ciudadanos/${id}/carne`
  },

  ADMIN: {
    PERSONAL_SALUD: `${API_BASE_URL.apiUrl}/api/admin/personal-salud`,

    ACTUALIZAR_PERSONAL_SALUD: (id: number) =>
      `${API_BASE_URL.apiUrl}/api/admin/personal-salud/${id}`

  },

  PERSONAL_SALUD: {
    CIUDADANOS: `${API_BASE_URL.apiUrl}/api/personal-salud/ciudadanos`,
    CIUDADANO_POR_ID: (id: number) =>
      `${API_BASE_URL.apiUrl}/api/personal-salud/ciudadanos/${id}`
  },

  VACUNAS: {
    BASE: `${API_BASE_URL.apiUrl}/api/vacunas`,
    POR_ID: (id: number) =>
      `${API_BASE_URL.apiUrl}/api/vacunas/${id}`,

    ESTADO: (id: number) =>
      `${API_BASE_URL.apiUrl}/api/vacunas/${id}/estado`,

    LOTES: `${API_BASE_URL.apiUrl}/api/vacunas/lotes`,

    LOTES_POR_VACUNA: (id: number) =>
      `${API_BASE_URL.apiUrl}/api/vacunas/${id}/lotes`,

    ESQUEMAS: (id: number) =>
      `${API_BASE_URL.apiUrl}/api/vacunas/${id}/esquemas`,

    ELIMINAR_ESQUEMA: (idEsquema: number) =>
      `${API_BASE_URL.apiUrl}/api/vacunas/esquemas/${idEsquema}`
  },

  VACUNACIONES: {
    BASE: `${API_BASE_URL.apiUrl}/api/vacunaciones`,

    POR_CIUDADANO: (idCiudadano: number) =>
      `${API_BASE_URL.apiUrl}/api/vacunaciones/ciudadano/${idCiudadano}`,

    HISTORIAL: (idCiudadano: number) =>
      `${API_BASE_URL.apiUrl}/api/vacunaciones/ciudadano/${idCiudadano}/historial`
  },

  AUDITORIA: {
    BASE: `${API_BASE_URL.apiUrl}/api/auditoria`
  },

  RECORDATORIOS: {
    BASE: `${API_BASE_URL.apiUrl}/api/recordatorios`,

    POR_ID: (id: number) =>
      `${API_BASE_URL.apiUrl}/api/recordatorios/${id}`,

    POR_ESTADO: (estado: string) =>
      `${API_BASE_URL.apiUrl}/api/recordatorios/estado/${estado}`,

    ENVIADO: (id: number) =>
      `${API_BASE_URL.apiUrl}/api/recordatorios/${id}/enviado`
  }

};