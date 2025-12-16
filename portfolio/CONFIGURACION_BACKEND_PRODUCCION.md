# Configuración del Backend en Producción

## Problema Actual

El frontend está intentando conectarse a `localhost:3000`, pero el sitio está hosteado en `https://portfolio.agenciamaslibre.com/`. El backend necesita estar hosteado en la nube.

## Soluciones Posibles

### Opción 1: Hostear Backend en Render (Recomendado - Gratis)

1. **Crear cuenta en Render**: https://render.com
2. **Crear nuevo Web Service**:
   - Conecta tu repositorio de GitHub
   - Directorio raíz: `portfolio/backend`
   - Comando de build: `npm install`
   - Comando de inicio: `npm start`
   - Puerto: `3000`
3. **Configurar variables de entorno en Render**:
   ```
   RETELL_API_KEY=key_57585684f15a8c742487f38bdef5
   RETELL_AGENT_ID=agent_b3d667fee19fd64018b0257518
   PORT=3000
   NODE_ENV=production
   ```
4. **Obtener la URL del backend** (ej: `https://portfolio-backend.onrender.com`)
5. **Configurar en el frontend**:
   - Crear archivo `.env` en `portfolio/`:
     ```
     VITE_API_URL=https://portfolio-backend.onrender.com
     ```
   - O actualizar `vite.config.ts` para usar esta URL en producción

### Opción 2: Hostear Backend en Railway

1. **Crear cuenta en Railway**: https://railway.app
2. **Nuevo proyecto** → **Deploy from GitHub repo**
3. **Seleccionar** `portfolio/backend`
4. **Configurar variables de entorno** (igual que Render)
5. **Obtener URL** y configurar en frontend

### Opción 3: Hostear Backend en Vercel (Serverless)

1. **Crear cuenta en Vercel**: https://vercel.com
2. **Importar proyecto** desde GitHub
3. **Configurar**:
   - Root Directory: `portfolio/backend`
   - Build Command: `npm install`
   - Output Directory: (dejar vacío)
4. **Crear `vercel.json`** en `portfolio/backend/`:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "server.js"
       }
     ]
   }
   ```
5. **Configurar variables de entorno** en Vercel
6. **Obtener URL** y configurar en frontend

### Opción 4: Subdominio en Hostinger (Si tienes acceso)

Si Hostinger te permite configurar un subdominio para Node.js:

1. **Crear subdominio**: `api.agenciamaslibre.com`
2. **Configurar Node.js** en Hostinger (si está disponible)
3. **Subir backend** al subdominio
4. **Configurar en frontend**:
   ```
   VITE_API_URL=https://api.agenciamaslibre.com
   ```

## Configuración del Frontend

Una vez que tengas la URL del backend, actualiza el frontend:

### Método 1: Variable de Entorno (Recomendado)

1. **Crear `.env`** en `portfolio/`:
   ```env
   VITE_API_URL=https://tu-backend-url.com
   ```

2. **Rebuild**:
   ```bash
   cd portfolio
   npm run build:hostinger
   ```

### Método 2: Actualizar Código Directamente

El código ya detecta automáticamente si está en producción y usa:
- `https://api.agenciamaslibre.com` (si el dominio es `portfolio.agenciamaslibre.com`)
- O el mismo dominio con `/api`

## Verificación

1. **Abre la consola del navegador** (F12)
2. **Intenta hacer una llamada** en `/ia-demo`
3. **Revisa la consola** para ver qué URL está intentando usar
4. **Verifica que el backend responda**:
   ```bash
   curl https://tu-backend-url.com/health
   ```

## Notas Importantes

- **HTTPS es obligatorio** en producción para Retell.ai (requiere acceso al micrófono)
- **CORS** debe estar configurado en el backend para permitir requests desde `portfolio.agenciamaslibre.com`
- El backend debe tener el endpoint `/api/retell/create-call` funcionando
- Verifica que las variables de entorno estén configuradas correctamente en el servicio de hosting
