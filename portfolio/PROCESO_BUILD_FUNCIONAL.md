# Proceso de Build que Funciona Correctamente

## ⚠️ IMPORTANTE: Sigue este proceso exacto para cada cambio

Este documento describe el proceso que **SÍ FUNCIONA** para hacer builds y desplegar cambios en Hostinger.

## Proceso Completo (Paso a Paso)

### 1. Restaurar index.html Original

**ANTES de hacer el build**, asegúrate de que `portfolio/index.html` tenga este contenido:

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <title>Portfolio - Desarrollador Web Profesional</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**CRÍTICO**: El `index.html` debe apuntar a `/src/main.tsx`, NO a archivos compilados.

### 2. Limpiar Builds Anteriores

```bash
cd portfolio
Remove-Item -Recurse -Force dist\ -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force assets\* -ErrorAction SilentlyContinue
```

### 3. Ejecutar Build

```bash
npm run build:hostinger
```

Este comando:
- Ejecuta `vite build` (genera `dist/` con archivos compilados)
- Ejecuta `node scripts/copy-to-root.js` (copia `dist/index.html` y `dist/assets/` a la raíz)

### 4. Verificar que se Copiaron los Archivos

Después del build, verifica:
- `portfolio/index.html` debe tener referencias a archivos en `/assets/` (ej: `index.XXXXX.js`)
- `portfolio/assets/` debe contener los archivos JS y CSS compilados

### 5. Subir a Git

```bash
cd ..
git add portfolio/index.html portfolio/assets/
git commit -m "Descripción del cambio"
git push
```

### 6. Esperar y Verificar

- Espera 30-60 segundos para que Hostinger sincronice
- Recarga con `Ctrl + Shift + R`
- Verifica en la consola que se carga el archivo correcto

## Comandos Rápidos (PowerShell)

```powershell
# Proceso completo en un solo comando
cd portfolio
Remove-Item -Recurse -Force dist\ -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force assets\* -ErrorAction SilentlyContinue
npm run build:hostinger
cd ..
git add portfolio/index.html portfolio/assets/
git commit -m "Cambio realizado"
git push
```

## Errores Comunes y Soluciones

### Error: "Rollup failed to resolve import"
**Causa**: El `index.html` tiene referencias a archivos que no existen.
**Solución**: Restaura el `index.html` original (paso 1).

### Error: "No se encuentra dist/index.html"
**Causa**: El build falló o no se ejecutó.
**Solución**: Ejecuta `npm run build:hostinger` de nuevo.

### Los cambios no se ven en el servidor
**Causa**: Caché del servidor o archivos no subidos.
**Solución**: 
1. Verifica que los archivos estén en Git: `git status`
2. Espera 2-3 minutos más
3. Prueba en modo incógnito

## Estructura Correcta Después del Build

```
portfolio/
├── index.html          ← Copiado desde dist/index.html (con referencias a assets/)
├── assets/             ← Copiado desde dist/assets/
│   ├── index.XXXXX.js
│   ├── react-vendor.XXXXX.js
│   ├── framer-motion.XXXXX.js
│   └── index.XXXXX.css
└── dist/               ← Generado por Vite (no se sube a Git)
    ├── index.html
    └── assets/
```

## Recordatorio

**SIEMPRE**:
1. ✅ Restaurar `index.html` original antes del build
2. ✅ Limpiar `dist/` y `assets/` antes del build
3. ✅ Ejecutar `npm run build:hostinger`
4. ✅ Verificar que los archivos se copiaron
5. ✅ Subir a Git

**NUNCA**:
- ❌ Editar manualmente `index.html` con nombres de archivos compilados antes del build
- ❌ Hacer build sin limpiar primero
- ❌ Subir solo algunos archivos (siempre sube `index.html` y `assets/` juntos)
