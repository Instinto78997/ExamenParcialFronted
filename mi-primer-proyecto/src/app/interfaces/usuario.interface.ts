export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
}

export interface CreateUsuarioDto {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
}
