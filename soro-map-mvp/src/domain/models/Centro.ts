/**
 * Centro de distribuição de soro antiveneno.
 * @module domain/models/Centro
 */
export interface Centro {
  /** Unique identifier */
  readonly id: string;
  /** Nome da unidade de saúde */
  readonly nome: string;
  /** Município */
  readonly municipio: string;
  /** Unidade federativa (sigla do estado) */
  readonly uf: string;
  /** Região geográfica */
  readonly regiao?: string;
  /** Latitude */
  readonly latitude: number;
  /** Longitude */
  readonly longitude: number;
  /** Tipos de soro disponíveis */
  readonly tiposSoro: string[];
  /** Endereço completo ou referência */
  readonly endereco?: string;
  /** Telefone de contato */
  readonly telefone?: string;
  /** Código CNES */
  readonly cnes?: string;
  /** Tipo de atendimento */
  readonly atendimentoTipo?: string;
  /** Informações adicionais de atendimento */
  readonly atendimentoInfo?: string;
}

