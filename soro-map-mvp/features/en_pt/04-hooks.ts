/**
 * 04 - Hooks de Tradução
 * 
 * useT()     - Acesso às traduções
 * useLocale() - Acesso/alteração do idioma
 */

// --- Pseudo-código / Estrutura ---

/*
import { useContext } from 'react';
import { I18nContext } from './I18nProvider';

// Hook principal - retorna objeto de traduções
export function useT() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useT must be used within I18nProvider');
  return ctx.t;
}

// Hook para controle de idioma
export function useLocale() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useLocale must be used within I18nProvider');
  return { locale: ctx.locale, setLocale: ctx.setLocale };
}
*/

// Uso nos componentes:
//
// function Header() {
//   const t = useT();
//   return <h1>{t.ui.appTitle}</h1>;
// }
//
// function LocaleSwitcher() {
//   const { locale, setLocale } = useLocale();
//   return (
//     <button onClick={() => setLocale(locale === 'pt-BR' ? 'en-US' : 'pt-BR')}>
//       {locale === 'pt-BR' ? '🇺🇸 EN' : '🇧🇷 PT'}
//     </button>
//   );
// }
