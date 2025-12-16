# 🔨 CÓMO HACER BUILD PARA HOSTINGER

## ⚠️ PROBLEMA ACTUAL

El `index.html` en Hostinger apunta a `/src/main.tsx` (archivo de desarrollo).
**Esto NO funciona en producción** porque:
- Los archivos `.tsx` no están compilados
- El servidor los sirve como "text/plain" (error MIME type)
- Necesitas los archivos `.js` compilados en `assets/`

## ✅ SOLUCIÓN: Build Local

### Paso 1: En tu computadora (Windows)

Abre PowerShell o CMD y ejecuta:

```powershell
cd C:\Users\lobo6\agencia\portfolio
npm install
npm run build
```

### Paso 2: Copiar archivos compilados

Después del build, ejecuta el script:

**Windows:**
```powershell
.\build-for-hostinger.bat
```

**Linux/Mac:**
```bash
chmod +x build-and-deploy.sh
./build-and-deploy.sh
```

O manualmente:
```powershell
# Copiar index.html compilado
copy dist\index.html index.html

# Copiar assets
xcopy /E /I /Y dist\assets assets
```

### Paso 3: Verificar

Abre `index.html` y verifica que tenga:
```html
<script type="module" src="/assets/index-[hash].js"></script>
```

**NO debe tener:**
```html
<script type="module" src="/src/main.tsx"></script>
```

### Paso 4: Subir a Git

```powershell
git add portfolio/index.html portfolio/assets/ portfolio/.htaccess
git commit -m "Build para producción - archivos compilados"
git push
```

## 📋 Archivos que DEBEN estar en portfolio/ después del build:

- ✅ `index.html` (con referencias a `assets/*.js`)
- ✅ `assets/` (carpeta con JS y CSS compilados)
- ✅ `.htaccess` (para MIME types y routing)
- ✅ `src/` (se mantiene, no se borra)
- ✅ `backend/` (se mantiene, no se borra)

## 🐛 Si sigue sin funcionar

1. Verifica que `.htaccess` esté en `portfolio/`
2. Accede a `portfolio.agenciamaslibre.com/debug.html`
3. Revisa la consola del navegador (F12)
4. Verifica que los archivos en `assets/` tengan extensión `.js`
