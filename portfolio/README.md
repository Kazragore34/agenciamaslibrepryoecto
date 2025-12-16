# Portfolio Profesional - Desarrollador Web

Portfolio completo con integraciones de IA, automatizaciones y APIs externas.

## 🚀 Características

- **Frontend Moderno**: React 18 + Vite + Tailwind CSS
- **Backend API**: Node.js + Express
- **IA Conversacional**: Chatbot IAN con n8n
- **Llamadas de Voz**: Integración Retell.ai
- **Analytics**: Google Analytics 4
- **Lead Scoring**: Sistema predictivo de leads
- **Integraciones API**: Demostración de APIs externas
- **Docker**: Containerización completa
- **Testing**: Vitest + Playwright

## 📁 Estructura

```
portfolio/
├── src/              # Frontend React
├── backend/          # Backend Node.js
├── tests/            # Tests E2E
└── dist/             # Build output
```

## 🛠️ Instalación

### Frontend

```bash
cd portfolio
npm install
npm run dev
```

### Backend

```bash
cd portfolio/backend
npm install
npm run dev
```

## 🔧 Configuración

### Variables de Entorno

**Frontend** (`.env`):
```
VITE_API_URL=http://localhost:3000
VITE_GA4_ID=your-ga4-id
VITE_SENTRY_DSN=your-sentry-dsn
```

**Backend** (`backend/.env`):
```
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
RETELL_API_KEY=your-retell-key
RETELL_AGENT_ID=your-retell-agent-id
N8N_WEBHOOK_URL=your-n8n-webhook
JWT_SECRET=your-jwt-secret
LOG_LEVEL=info
```

## 🐳 Docker

```bash
docker-compose up -d
```

## 📝 Scripts

- `npm run dev` - Desarrollo frontend
- `npm run build` - Build producción
- `npm run test` - Tests unitarios
- `npm run test:e2e` - Tests E2E

## 🎯 Páginas

- `/` - Home
- `/servicios` - Servicios ofrecidos
- `/proyectos` - Portfolio de proyectos
- `/tecnologias` - Stack tecnológico
- `/integraciones` - Demostración de APIs
- `/ia-demo` - Demo de Retell.ai
- `/contacto` - Formulario de contacto

## 🤖 IAN - Chatbot

El chatbot IAN está presente en todas las páginas y mantiene el historial del chat al navegar.

## 📊 Integraciones

- **Retell.ai**: Llamadas de voz con IA
- **n8n**: Automatizaciones y chatbot
- **Google Analytics 4**: Analytics y tracking
- **APIs Externas**: Demostración de integraciones

## 🔒 Seguridad

- Helmet para headers de seguridad
- Validación de inputs con Joi
- CORS configurado
- Autenticación JWT (preparado)

## 📦 Build

```bash
npm run build
```

El build genera `dist/` que es el directorio que se sirve en producción.

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

## 📄 Licencia

ISC
