# Guia de Deploy - Mapa Antiveneno

Este documento fornece instruções completas para configurar e fazer deploy da aplicação Mapa de Soro Antiveneno.

## 📋 Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Conta no [Mapbox](https://www.mapbox.com/) (gratuita)
- Git configurado

## 🔧 Configuração das Variáveis de Ambiente

### 1. Criar Conta no Mapbox

1. Acesse [https://www.mapbox.com/](https://www.mapbox.com/)
2. Crie uma conta gratuita
3. Após login, acesse [https://account.mapbox.com/](https://account.mapbox.com/)
4. Na seção **Access tokens**, copie seu **Default public token**

### 2. Configurar Arquivo `.env`

Na raiz do projeto `soro-map-mvp`, crie um arquivo `.env` com as seguintes variáveis:

```bash
# Token público do Mapbox (obrigatório)
VITE_MAPBOX_TOKEN=seu_token_publico_aqui

# Style URL do Mapbox (opcional - padrão: streets-v12)
VITE_MAPBOX_STYLE=mapbox://styles/mapbox/streets-v12
```

#### Variáveis Explicadas:

**`VITE_MAPBOX_TOKEN`** (obrigatório)
- Token de acesso público do Mapbox
- Usado para renderizar o mapa interativo
- Obtido em: https://account.mapbox.com/
- Exemplo: `pk.eyJ1IjoibXl1c2VyIiwiYSI6ImNtNnBoczFtdTFmajYya3B4azBwNnVmN20ifQ.XXX`

**`VITE_MAPBOX_STYLE`** (opcional)
- URL do estilo personalizado do mapa
- Se não especificado, usa o estilo padrão `streets-v12`
- Para criar estilo customizado: https://studio.mapbox.com/
- Formato: `mapbox://styles/seu-usuario/seu-estilo-id`

### 3. Arquivo `.env.example`

O repositório já contém um arquivo `.env.example` como template. Para usá-lo:

```bash
# Copie o template
cp .env.example .env

# Edite o arquivo .env e adicione seus tokens reais
```

> ⚠️ **IMPORTANTE**: O arquivo `.env` está no `.gitignore` e **NÃO deve ser commitado** ao repositório por conter informações sensíveis.

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/Antivenom-Brazil/antivenom_app.git
cd antivenom_app/soro-map-mvp

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com seus tokens

# Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## 🏗️ Build para Produção

```bash
# Build otimizado para produção
npm run build

# Preview do build de produção
npm run preview

# Verificar tipos TypeScript
npm run type-check

# Lint do código
npm run lint
```

Os arquivos otimizados estarão em `dist/`

## 🚀 Deploy

### Opção 1: Vercel (Recomendado)

1. Faça login no [Vercel](https://vercel.com/)
2. Importe o repositório do GitHub
3. Configure as variáveis de ambiente:
   - `VITE_MAPBOX_TOKEN`: Seu token público do Mapbox
   - `VITE_MAPBOX_STYLE`: (opcional) Seu estilo customizado
4. Deploy automático!

### Opção 2: Netlify

1. Faça login no [Netlify](https://www.netlify.com/)
2. Conecte seu repositório GitHub
3. Configurações de build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Adicione variáveis de ambiente em **Site settings → Environment variables**
5. Deploy!

### Opção 3: GitHub Pages

```bash
# Build para produção
npm run build

# Deploy para GitHub Pages (configure o script no package.json)
npm run deploy
```

### Opção 4: Servidor Próprio

```bash
# Build
npm run build

# Copie a pasta dist/ para seu servidor
# Configure servidor HTTP (Nginx, Apache, etc.) para servir os arquivos estáticos
```

#### Exemplo Nginx:

```nginx
server {
    listen 80;
    server_name seudominio.com;
    root /var/www/mapa-antiveneno/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🔒 Segurança

### Tokens Públicos vs. Secretos

- **VITE_MAPBOX_TOKEN**: Token **público** do Mapbox
  - ✅ Seguro expor no frontend
  - ✅ Pode ser commitado em variáveis de ambiente do CI/CD
  - ❌ Não commitar o arquivo `.env` com valores reais

### Proteção de Tokens

1. Use **URL restrictions** no Mapbox:
   - Acesse https://account.mapbox.com/
   - Edite seu token
   - Adicione seus domínios permitidos (ex: `*.vercel.app`, `seudominio.com`)

2. Nunca exponha tokens **secretos** no código frontend

## 🌍 Variáveis de Ambiente por Plataforma

### Vercel
```
Dashboard → Settings → Environment Variables
```

### Netlify
```
Site settings → Build & deploy → Environment variables
```

### GitHub Actions (CI/CD)
```yaml
env:
  VITE_MAPBOX_TOKEN: ${{ secrets.VITE_MAPBOX_TOKEN }}
  VITE_MAPBOX_STYLE: ${{ secrets.VITE_MAPBOX_STYLE }}
```

Adicione os secrets em: `Repository → Settings → Secrets and variables → Actions`

## 🧪 Testando o Deploy

Após deploy, verifique:

- ✅ Mapa carrega corretamente
- ✅ Pontos de centros aparecem no mapa
- ✅ Geolocalização funciona
- ✅ Busca de centros próximos funciona
- ✅ Navegação entre páginas funciona
- ✅ Dados carregam corretamente

## 📚 Estrutura de Diretórios

```
soro-map-mvp/
├── .env                    # Variáveis de ambiente (NÃO COMMITAR)
├── .env.example            # Template de variáveis
├── public/                 # Arquivos estáticos
│   └── data/
│       └── centros-db.json # Database de centros
├── src/                    # Código fonte
├── dist/                   # Build de produção (gerado)
└── DEPLOY.md              # Este arquivo
```

## ❓ Troubleshooting

### Mapa não carrega
- Verifique se `VITE_MAPBOX_TOKEN` está configurado
- Verifique se o token é válido no Mapbox Dashboard
- Verifique console do navegador para erros

### Build falha
```bash
# Limpe cache e reinstale dependências
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Erros de tipo TypeScript
```bash
# Verifique tipos
npm run type-check
```

## 📞 Suporte

Em caso de dúvidas ou problemas:
- Abra uma issue no GitHub
- Consulte a documentação do Mapbox: https://docs.mapbox.com/

