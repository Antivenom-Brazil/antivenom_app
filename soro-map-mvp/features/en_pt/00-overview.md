# i18n - Suporte Multilíngue (PT/EN)

## Visão Geral

Sistema de internacionalização para a aplicação Mapa de Soro Antiveneno.

## Estrutura Proposta

```
src/
├── shared/
│   └── i18n/
│       ├── index.ts           # Provider + hook useTranslation
│       ├── types.ts           # Tipagem das chaves
│       └── locales/
│           ├── pt-BR.ts       # Traduções português
│           └── en-US.ts       # Traduções inglês
```

## Abordagem

- **React Context** para prover idioma atual
- **Hook `useT()`** para acessar traduções
- **Sem lib externa** (react-i18next é opcional para escalar)
- **Persistência** via `localStorage`

## Arquivos da Feature

| # | Arquivo | Descrição |
|---|---------|-----------|
| 01 | types.ts | Tipagem das chaves de tradução |
| 02 | locales.ts | Dicionários PT/EN |
| 03 | provider.ts | Context + Provider |
| 04 | hook.ts | useT() e useLocale() |
| 05 | integration.md | Guia de integração nos componentes |
