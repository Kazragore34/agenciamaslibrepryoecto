# ⚠️ IMPORTANTE: Build Requerido para Hostinger

## El Problema

El `index.html` actual apunta a `/src/main.tsx` que es el archivo de **desarrollo**. 
En Hostinger necesitas los archivos **compilados** que apuntan a `assets/*.js`.

## Solución: Hacer Build LOCALMENTE

### Paso 1: En tu computadora local

```bash
cd portfolio
npm install
npm run build
```

### Paso 2: Verificar archivos generados

Después del build, debes tener:
- ✅ `dist/index.html` (con referencias a `assets/*.js`)
- ✅ `dist/assets/` (carpeta con JS y CSS compilados)

### Paso 3: Copiar a la raíz (para Hostinger)

El script `build-and-deploy.sh` hace esto automáticamente, o manualmente:

```bash
# Copiar index.html compilado
cp dist/index.html index.html

# Copiar assets
cp -r dist/assets assets
```

### Paso 4: Subir a Git

```bash
git add portfolio/index.html portfolio/assets/
git commit -m "Build para producción"
git push
```

## Verificación

Después de subir, el `index.html` debe tener:
```html
<script type="module" src="/assets/index-[hash].js"></script>
```

**NO** debe tener:
```html
<script type="module" src="/src/main.tsx"></script>
```

## Si sigue sin funcionar

1. Verifica que `.htaccess` esté en `portfolio/`
2. Accede a `portfolio.agenciamaslibre.com/debug.html` para ver logs
3. Revisa la consola del navegador (F12) para ver errores específicos
