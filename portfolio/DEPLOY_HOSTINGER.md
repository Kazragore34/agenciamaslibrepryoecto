# Instrucciones para Desplegar en Hostinger

## ⚠️ IMPORTANTE: Hostinger funciona diferente

En Hostinger, la carpeta `portfolio/` funciona como si fuera `public_html/`. Esto significa:
- Cuando accedes a `portfolio.agenciamaslibre.com`, Hostinger sirve archivos desde `portfolio/`
- NO puedes ejecutar comandos en el servidor
- Solo puedes subir archivos vía FTP/Git

## 🔧 Proceso de Despliegue

### Paso 1: Hacer Build LOCALMENTE

En tu computadora local, ejecuta:

```bash
cd portfolio
npm install
npm run build:hostinger
```

O usa el script automatizado:

```bash
chmod +x build-and-deploy.sh
./build-and-deploy.sh
```

### Paso 2: Verificar Archivos Generados

Después del build, debes tener en `portfolio/`:
- ✅ `index.html` (actualizado con referencias a assets/)
- ✅ `assets/` (carpeta con JS y CSS compilados)
- ✅ `src/` (se mantiene para desarrollo)
- ✅ `backend/` (se mantiene)

### Paso 3: Subir a Git

```bash
git add .
git commit -m "Build para producción - Hostinger"
git push
```

### Paso 4: En Hostinger

1. Haz `git pull` en el servidor (si tienes acceso)
2. O sube los archivos vía FTP:
   - `portfolio/index.html`
   - `portfolio/assets/` (carpeta completa)
   - `portfolio/.htaccess` (para routing SPA)

### Paso 5: Verificar

1. Accede a: `portfolio.agenciamaslibre.com`
2. Si hay problemas, accede a: `portfolio.agenciamaslibre.com/debug.html`
3. Revisa la consola del navegador (F12) para ver los logs

## 🐛 Debugging

Si la página no carga:

1. **Verifica que `index.html` existe** en `portfolio/`
2. **Verifica que `assets/` existe** y tiene archivos JS/CSS
3. **Revisa la consola del navegador** (F12) para ver errores
4. **Accede a `/debug.html`** para ver información del sistema
5. **Verifica `.htaccess`** está presente para routing SPA

## 📝 Notas

- El build genera archivos en la **raíz de `portfolio/`**, no en `portfolio/dist/`
- Los archivos `src/` y `backend/` se mantienen (no se borran)
- Solo `index.html` y `assets/` se actualizan en cada build
