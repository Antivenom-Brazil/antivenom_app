/**
 * 03 - I18n Provider (Context)
 * 
 * Exemplo de implementação.
 * Copiar para src/shared/i18n/I18nProvider.tsx
 */

// --- Pseudo-código / Estrutura ---

/*
import { createContext, useState, useEffect, ReactNode } from 'react';
import { Locale, Translations } from './types';
import { locales } from './locales';

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Translations;
}

const STORAGE_KEY = 'app-locale';
const DEFAULT_LOCALE: Locale = 'pt-BR';

export const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return (saved as Locale) || DEFAULT_LOCALE;
  });

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
  };

  const t = locales[locale];

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}
*/

// Exportar no index.ts:
// export { I18nProvider, I18nContext } from './I18nProvider';
