/**
 * 02 - Dicionários de Tradução
 * 
 * Português como idioma base.
 * Inglês como tradução secundária.
 */

import type { Translations } from './01-types';

export const ptBR: Translations = {
  ui: {
    appTitle: '🐍 Mapa de Soro Antiveneno',
    appSubtitle: 'Localize centros de atendimento com soros antiofídicos disponíveis no Brasil',
  },
  map: {
    points: '📍 Pontos',
    heatmap: '🔥 Heatmap',
  },
  filters: {
    title: '🔎 Filtros',
    search: 'Buscar (nome ou município)',
    searchPlaceholder: 'Digite para buscar...',
    state: 'Estado (UF)',
    allStates: 'Todos os estados',
    serumType: 'Tipo de Soro',
    allTypes: 'Todos os tipos',
  },
  table: {
    title: '📋 Centros de Atendimento',
    name: 'Nome',
    city: 'Município',
    state: 'UF',
    serumTypes: 'Tipos de Soro',
    noResults: 'Nenhum centro encontrado com os filtros selecionados.',
    resultsCount: (n) => `${n} ${n === 1 ? 'centro encontrado' : 'centros encontrados'}`,
  },
  errors: {
    tokenMissing: 'Token do Mapbox não configurado. Configure VITE_MAPBOX_TOKEN no arquivo .env',
    mapError: 'Erro ao criar o mapa',
  },
};

export const enUS: Translations = {
  ui: {
    appTitle: '🐍 Antivenom Serum Map',
    appSubtitle: 'Find healthcare centers with antivenom serums available in Brazil',
  },
  map: {
    points: '📍 Points',
    heatmap: '🔥 Heatmap',
  },
  filters: {
    title: '🔎 Filters',
    search: 'Search (name or city)',
    searchPlaceholder: 'Type to search...',
    state: 'State',
    allStates: 'All states',
    serumType: 'Serum Type',
    allTypes: 'All types',
  },
  table: {
    title: '📋 Healthcare Centers',
    name: 'Name',
    city: 'City',
    state: 'State',
    serumTypes: 'Serum Types',
    noResults: 'No centers found with the selected filters.',
    resultsCount: (n) => `${n} ${n === 1 ? 'center found' : 'centers found'}`,
  },
  errors: {
    tokenMissing: 'Mapbox token not configured. Set VITE_MAPBOX_TOKEN in your .env file',
    mapError: 'Error creating the map',
  },
};

export const locales = { 'pt-BR': ptBR, 'en-US': enUS };
