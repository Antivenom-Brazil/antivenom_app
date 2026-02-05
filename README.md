# Mapa Antiveneno

> Plataforma web para localização rápida de centros de distribuição de soro antiofídico em todo o Brasil.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Mapbox](https://img.shields.io/badge/Mapbox-000000?style=flat&logo=mapbox&logoColor=white)](https://www.mapbox.com/)

## 📋 Sobre o Projeto

O **Mapa Antiveneno** é uma ferramenta web para localizar centros de atendimento com soros antiofídicos disponíveis no Brasil. Em casos de acidentes com animais peçonhentos, nossa plataforma permite encontrar rapidamente o centro mais próximo com informações detalhadas de contato e tipos de soro disponíveis.

### 🎯 Funcionalidades

-  **Mapa Interativo** - Visualização de todos os centros em mapa com Mapbox
-  **Geolocalização** - Encontre os 5 centros mais próximos da sua localização
-  **Estatísticas** - Métricas detalhadas por região e estado
-  **Responsivo** - Interface otimizada para mobile, tablet e desktop
-  **Modos de Visualização** - Alternar entre pontos e heatmap no mapa

## 🚀 Quick Start

```bash
# Clone o repositório
git clone https://github.com/Antivenom-Brazil/antivenom_app.git
cd antivenom_app/soro-map-mvp

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env e adicione seu token do Mapbox

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse em: `http://localhost:5173`

## 🛠️ Tech Stack

### Core
- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server

### UI & Styling
- **CSS Modules** - Estilos com escopo
- **Lucide React** - Ícones modernos

### Mapa & Geolocalização
- **Mapbox GL JS** - Renderização de mapas interativos
- **Geolocation API** - Localização do usuário

### Code Quality
- **ESLint** - Linting
- **TypeScript Compiler** - Verificação de tipos

## 📁 Estrutura do Projeto

```
soro-map-mvp/
├── public/
│   └── data/
│       └── centros-db.json      # Database de centros
├── src/
│   ├── domain/                  # Modelos de domínio
│   ├── infrastructure/          # Serviços e dados
│   │   ├── content/            # Conteúdo declarativo (YAML)
│   │   ├── data/               # Dados e métricas
│   │   ├── mapbox/             # Integração Mapbox
│   │   └── logging/            # Sistema de logs
│   ├── ui/
│   │   ├── components/         # Componentes reutilizáveis
│   │   └── pages/              # Páginas da aplicação
│   └── index.css               # Estilos globais
├── .env.example                # Template de variáveis

```

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# Token público do Mapbox (obrigatório)
VITE_MAPBOX_TOKEN=seu_token_aqui

# Style URL do Mapbox (opcional)
VITE_MAPBOX_STYLE=mapbox://styles/mapbox/streets-v12
```


## 📦 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
npm run type-check   # Verificar tipos TypeScript
npm run lint         # Executar ESLint
```


## 🗃️ Dados

Os dados dos centros de distribuição são obtidos de fontes oficiais:

- **Ministério da Saúde** - Dados de imunobiológicos
- **CNES** - Cadastro Nacional de Estabelecimentos de Saúde
- **Secretarias Estaduais** - Informações complementares

## 🧪 Desenvolvimento

### Arquitetura

O projeto segue princípios de **Clean Architecture**:

- **Domain Layer** - Modelos de negócio puros
- **Infrastructure Layer** - Serviços externos, dados, APIs
- **UI Layer** - Componentes React e páginas

### Padrões de Código

- ✅ Componentes funcionais com hooks
- ✅ TypeScript strict mode
- ✅ Props readonly por padrão
- ✅ Semantic HTML
- ✅ Acessibilidade (ARIA labels)

## ⚠️ Aviso Importante

Esta ferramenta tem **caráter informativo** e não substitui atendimento médico profissional.

**Em caso de acidente com animais peçonhentos:**
- 🚨 Procure imediatamente o serviço de saúde mais próximo
- 📞 Ligue 192 (SAMU) em emergências

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- 📧 Email: [contato@exemplo.com]()
- 🐛 Issues: [GitHub Issues](https://github.com/Antivenom-Brazil/antivenom_app/issues)

