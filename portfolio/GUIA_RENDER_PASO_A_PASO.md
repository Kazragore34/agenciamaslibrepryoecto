# 🚀 Guía Paso a Paso: Hostear Backend en Render

## Paso 1: Preparar el Repositorio

Asegúrate de que tu código esté en GitHub:

1. **Verifica que `portfolio/backend/` esté en tu repositorio**
2. **Verifica que `portfolio/backend/package.json` exista**
3. **Verifica que `portfolio/backend/server.js` exista**

## Paso 2: Crear el Web Service en Render

### 2.1 Acceder a Render

1. Ve a https://render.com
2. Inicia sesión con tu cuenta
3. En el dashboard, haz clic en **"New +"** (botón azul en la esquina superior derecha)
4. Selecciona **"Web Service"**

### 2.2 Conectar el Repositorio

1. Si es la primera vez, Render te pedirá conectar tu cuenta de GitHub
2. Haz clic en **"Connect GitHub"** o **"Connect GitLab"** (según donde tengas tu código)
3. Autoriza a Render para acceder a tus repositorios
4. Selecciona el repositorio: `agenciamaslibrepryoecto` (o el nombre de tu repo)

### 2.3 Configurar el Servicio

Llena los siguientes campos:

**Nombre del Servicio:**
```
portfolio-backend
```
(o el nombre que prefieras)

**Región:**
```
Oregon (US West)
```
(o la más cercana a ti)

**Rama:**
```
main
```
(o la rama donde está tu código)

**Runtime:**
```
Node
```

**Build Command:**
```
npm install
```

**Start Command:**
```
node server.js
```

**Root Directory:**
```
portfolio/backend
```
⚠️ **MUY IMPORTANTE**: Este campo debe ser `portfolio/backend` para que Render sepa dónde está el backend.

### 2.4 Configurar Variables de Entorno

Haz clic en **"Advanced"** → **"Add Environment Variable"** y agrega estas 4 variables:

**Variable 1:**
- **Key:** `RETELL_API_KEY`
- **Value:** `key_57585684f15a8c742487f38bdef5`

**Variable 2:**
- **Key:** `RETELL_AGENT_ID`
- **Value:** `agent_b3d667fee19fd64018b0257518`

**Variable 3:**
- **Key:** `PORT`
- **Value:** `3000`

**Variable 4:**
- **Key:** `NODE_ENV`
- **Value:** `production`

### 2.5 Configurar el Plan

1. En **"Plan"**, selecciona **"Free"** (gratis)
2. ⚠️ **Nota**: El plan gratis puede "dormir" después de 15 minutos de inactividad. La primera petición puede tardar unos segundos en despertar.

### 2.6 Crear el Servicio

1. Haz clic en **"Create Web Service"** (botón azul al final)
2. Render comenzará a construir y desplegar tu backend
3. Esto puede tardar 2-5 minutos

## Paso 3: Obtener la URL del Backend

1. Una vez que el despliegue termine (verás un check verde ✅)
2. En la parte superior de la página verás una URL como:
   ```
   https://portfolio-backend-xxxx.onrender.com
   ```
3. **Copia esta URL completa** (será algo como `https://portfolio-backend-xxxx.onrender.com`)

## Paso 4: Probar el Backend

1. Abre una nueva pestaña en tu navegador
2. Ve a: `https://tu-url.onrender.com/health`
3. Deberías ver: `{"status":"ok"}`
4. Si ves esto, ¡el backend está funcionando! ✅

## Paso 5: Configurar el Frontend

Ahora necesitas decirle al frontend dónde está el backend:

### Opción A: Usar Variable de Entorno (Recomendado)

1. En tu computadora, ve a la carpeta `portfolio/`
2. Crea un archivo llamado `.env` (sin extensión)
3. Dentro del archivo, escribe:
   ```
   VITE_API_URL=https://tu-url.onrender.com
   ```
   (Reemplaza `tu-url.onrender.com` con la URL real que obtuviste en el Paso 3)

4. Guarda el archivo

### Opción B: Actualizar el Código Directamente

Si prefieres, puedo actualizar el código para que use la URL directamente.

## Paso 6: Rebuild y Subir el Frontend

1. Abre una terminal en `portfolio/`
2. Ejecuta:
   ```bash
   npm run build:hostinger
   ```
3. Sube los cambios a Git:
   ```bash
   git add .
   git commit -m "Configurar backend en Render"
   git push
   ```

## Paso 7: Verificar que Funciona

1. Espera 30-60 segundos para que Hostinger sincronice
2. Ve a: `https://portfolio.agenciamaslibre.com/ia-demo`
3. Abre la consola del navegador (F12)
4. Intenta hacer una llamada
5. En la consola deberías ver la URL que está intentando usar
6. Debería ser: `https://tu-url.onrender.com/api/retell/create-call`

## 🐛 Solución de Problemas

### El backend no inicia
- Verifica que `Root Directory` sea `portfolio/backend`
- Verifica que `Start Command` sea `node server.js`
- Revisa los logs en Render (pestaña "Logs")

### Error 404 al probar /health
- Verifica que el backend esté "Live" (no "Sleeping")
- Espera unos segundos y recarga
- Verifica que la URL sea correcta

### El frontend no se conecta
- Verifica que la variable `VITE_API_URL` esté correcta en `.env`
- Verifica que hayas hecho `npm run build:hostinger` después de crear `.env`
- Revisa la consola del navegador para ver qué URL está intentando usar

### CORS Error
- El backend ya está configurado para permitir CORS
- Si persiste, verifica que el backend esté usando la última versión del código

## 📝 Notas Importantes

1. **Plan Gratis**: El backend puede "dormir" después de 15 minutos sin uso. La primera petición puede tardar 10-30 segundos en despertar.

2. **URL Pública**: La URL de Render es pública y accesible desde cualquier lugar.

3. **Variables de Entorno**: Nunca subas el archivo `.env` a Git si contiene información sensible. Render ya tiene las variables configuradas.

4. **Actualizaciones**: Cada vez que hagas `git push`, Render automáticamente reconstruirá y redesplegará el backend.

## ✅ Checklist Final

- [ ] Backend creado en Render
- [ ] Variables de entorno configuradas (4 variables)
- [ ] Backend desplegado y funcionando (verifica `/health`)
- [ ] URL del backend copiada
- [ ] Archivo `.env` creado en `portfolio/` con `VITE_API_URL`
- [ ] Frontend reconstruido (`npm run build:hostinger`)
- [ ] Cambios subidos a Git
- [ ] Probado en producción (`/ia-demo`)

¡Listo! Si tienes algún problema en algún paso, avísame y te ayudo.
