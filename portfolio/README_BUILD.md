# ⚠️ IMPORTANTE: Build Requerido para Hostinger

## El Problema

El `index.html` actual apunta a `/src/main.tsx` que es el archivo de **desarrollo**. 
En Hostinger necesitas los archivos **compilados** que apuntan a `assets/*.js`.

## Solución: Hacer Build LOCALMENTE

### Paso 1: Instalar dependencias (IMPORTANTE)

**Primero, asegúrate de estar en la carpeta portfolio:**

```powershell
cd C:\Users\lobo6\agencia\portfolio
```

**Luego instala todas las dependencias (incluye terser):**

```powershell
npm install
```

Esto instalará todas las dependencias necesarias, incluyendo `terser` que es requerido para minificar el código.

### Paso 2: Hacer Build

**Usa el script especial para Hostinger que copia automáticamente los archivos:**

```powershell
npm run build:hostinger
```

Este comando:
1. Compila el proyecto (genera `dist/`)
2. Copia automáticamente `index.html` y `assets/` a la raíz de `portfolio/`

**O si prefieres hacerlo manualmente:**

```powershell
npm run build
# Luego copia manualmente:
copy dist\index.html index.html
xcopy /E /I /Y dist\assets assets
```

### Paso 3: Verificar archivos generados

Después del build, debes tener en la raíz de `portfolio/`:
- ✅ `index.html` (con referencias a `/assets/*.js`)
- ✅ `assets/` (carpeta con JS y CSS compilados)

**Verifica que `index.html` tenga:**
```html
<script type="module" src="/assets/index-[hash].js"></script>
```

**NO debe tener:**
```html
<script type="module" src="/src/main.tsx"></script>
```

### Paso 4: Subir a Git

```powershell
cd C:\Users\lobo6\agencia
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
