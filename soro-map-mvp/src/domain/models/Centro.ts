export interface Centro {
  id: string;
  nome: string;
  municipio: string;
  uf: string;
  latitude: number;
  longitude: number;
  tiposSoro: string[];
  referencia?: string;
}
