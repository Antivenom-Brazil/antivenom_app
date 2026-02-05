# 05 - Guia de Integração

## 1. Setup Inicial

```tsx
// src/main.tsx
import { I18nProvider } from './shared/i18n';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>
);
```

## 2. Refatoração dos Componentes

### Header.tsx
```diff
+ const t = useT();
- <h1>🐍 Mapa de Soro Antiveneno</h1>
+ <h1>{t.ui.appTitle}</h1>
```

### FiltersPanel.tsx
```diff
+ const t = useT();
- <label>Buscar (nome ou município)</label>
+ <label>{t.filters.search}</label>
- placeholder="Digite para buscar..."
+ placeholder={t.filters.searchPlaceholder}
```

### MapPanel.tsx
```diff
+ const t = useT();
- 📍 Pontos
+ {t.map.points}
```

### ResultsTable.tsx
```diff
+ const t = useT();
- <th>Nome</th>
+ <th>{t.table.name}</th>
- {centros.length} centros encontrados
+ {t.table.resultsCount(centros.length)}
```

## 3. Seletor de Idioma (Header)

```tsx
function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();
  const toggle = () => setLocale(locale === 'pt-BR' ? 'en-US' : 'pt-BR');
  
  return (
    <button onClick={toggle} className="locale-switcher">
      {locale === 'pt-BR' ? '🇺🇸' : '🇧🇷'}
    </button>
  );
}
```

## 4. Pontos de Atenção

| Item | Nota |
|------|------|
| Dados do mapa | Vêm do tileset, não são traduzidos |
| UFs/Estados | Manter siglas (SP, RJ) |
| Tipos de soro | Considerar tradução futura se necessário |
| SEO | Adicionar `<html lang={locale}>` dinamicamente |

## 5. Migração Incremental

1. Criar `src/shared/i18n/` com os arquivos
2. Envolver App com `I18nProvider`
3. Refatorar um componente por vez
4. Adicionar `LocaleSwitcher` no Header
