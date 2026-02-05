/**
 * 01 - Tipagem i18n
 * 
 * Define as chaves de tradução com autocomplete.
 * Estrutura aninhada por namespace (ui, map, filters, table, errors).
 */

export type Locale = 'pt-BR' | 'en-US';

export interface Translations {
  ui: {
    appTitle: string;
    appSubtitle: string;
  };
  map: {
    points: string;
    heatmap: string;
  };
  filters: {
    title: string;
    search: string;
    searchPlaceholder: string;
    state: string;
    allStates: string;
    serumType: string;
    allTypes: string;
  };
  table: {
    title: string;
    name: string;
    city: string;
    state: string;
    serumTypes: string;
    noResults: string;
    resultsCount: (count: number) => string;
  };
  errors: {
    tokenMissing: string;
    mapError: string;
  };
}

// Chave flat para acesso simplificado (opcional)
export type TranslationKey = 
  | `ui.${keyof Translations['ui']}`
  | `map.${keyof Translations['map']}`
  | `filters.${keyof Translations['filters']}`
  | `table.${Exclude<keyof Translations['table'], 'resultsCount'>}`
  | `errors.${keyof Translations['errors']}`;
