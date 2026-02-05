# 🐍 Mapa de Soro Antiveneno - MVP

Aplicação React para localização de centros de atendimento com soros antiofídicos disponíveis no Brasil.

## 🚀 Stack

- **Runtime:** Node 18+
- **Bundler:** Vite
- **Framework:** React 18
- **Language:** TypeScript
- **Map:** Mapbox GL JS

## 📁 Arquitetura

```
src/
├── app/                    # Componente principal
│   └── App.tsx
├── ui/                     # Camada de apresentação
│   ├── components/
│   │   ├── Header/
│   │   ├── MapPanel/
│   │   ├── FiltersPanel/
│   │   └── ResultsTable/
│   └── styles/
├── domain/                 # Regras de negócio puras
│   ├── models/
│   │   ├── Centro.ts
│   │   └── Filtros.ts
│   └── filters/
│       └── applyFilters.ts
├── application/            # Use cases
│   └── usecases/
│       ├── buildGeoJson.ts
│       └── getFilteredCentros.ts
└── infrastructure/         # Adapters externos
    ├── data/
    │   └── centros.mock.ts
    └── mapbox/
        ├── MapboxMapAdapter.ts
        └── layers.ts
```

## ⚙️ Configuração

1. Clone o repositório
2. Copie `.env.example` para `.env`
3. Configure seu token do Mapbox em `VITE_MAPBOX_TOKEN`

```bash
cp .env.example .env
```

## 🏃 Comandos

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## ✅ Funcionalidades

- [x] Mapa interativo com Mapbox GL JS
- [x] Toggle entre visualização de Pontos e Heatmap
- [x] Filtro por UF (estado)
- [x] Filtro por tipo de soro
- [x] Busca por nome ou município
- [x] Tabela de resultados filtrados
- [x] Popup com informações ao passar o mouse nos pontos
- [x] Layout responsivo

## 🔐 Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `VITE_MAPBOX_TOKEN` | ✅ | Token público do Mapbox |
| `VITE_MAPBOX_STYLE` | ❌ | Style URL (padrão: streets-v12) |

## 📝 Notas Técnicas

- O toggle Pontos/Heatmap usa `layout.visibility` (não recria o mapa)
- Filtros atualizam o GeoJSON via `setData()` 
- O mapa é criado uma única vez com `useRef` (compatível com StrictMode)
- Dados mockados com 25 centros de todas as regiões do Brasil
