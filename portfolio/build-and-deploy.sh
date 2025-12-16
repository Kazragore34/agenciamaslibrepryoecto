#!/bin/bash

# Script para hacer build local y preparar para Hostinger
# Este script se ejecuta LOCALMENTE, luego subes los archivos a Hostinger

echo "🔨 Build para Hostinger - Portfolio"
echo "===================================="
echo ""

# Verificar que estamos en la carpeta portfolio
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecuta este script desde la carpeta portfolio/"
    exit 1
fi

# Paso 1: Instalar dependencias
echo "📦 Paso 1: Instalando dependencias..."
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✅ Dependencias ya instaladas"
fi

# Paso 2: Hacer backup de archivos importantes
echo ""
echo "💾 Paso 2: Haciendo backup de archivos importantes..."
mkdir -p .backup
cp index.html .backup/index.html.backup 2>/dev/null || true
cp -r src .backup/src.backup 2>/dev/null || true
cp -r backend .backup/backend.backup 2>/dev/null || true

# Paso 3: Hacer build
echo ""
echo "🏗️  Paso 3: Compilando proyecto..."
npm run build

# Verificar que el build se completó
if [ ! -f "index.html" ] || [ ! -d "assets" ]; then
    echo "❌ Error: El build no generó los archivos esperados"
    echo "Verifica los errores arriba"
    exit 1
fi

# Paso 4: Verificar estructura
echo ""
echo "📋 Paso 4: Verificando estructura de archivos..."
echo "Archivos generados:"
ls -la | grep -E "(index.html|assets)" || echo "⚠️  No se encontraron archivos esperados"

# Paso 5: Crear archivo de verificación
echo ""
echo "✅ Paso 5: Creando archivo de verificación..."
cat > build-info.txt << EOF
Build completado: $(date)
Node version: $(node --version)
NPM version: $(npm --version)
Archivos generados:
- index.html: $([ -f index.html ] && echo "✅" || echo "❌")
- assets/: $([ -d assets ] && echo "✅" || echo "❌")
EOF

cat build-info.txt

echo ""
echo "✅ Build completado!"
echo ""
echo "📤 Próximos pasos:"
echo "1. Sube TODA la carpeta portfolio/ a Hostinger (vía FTP/Git)"
echo "2. Asegúrate de que estos archivos estén en portfolio/:"
echo "   - index.html"
echo "   - assets/ (carpeta completa)"
echo "3. Accede a: portfolio.agenciamaslibre.com"
echo "4. Si hay problemas, accede a: portfolio.agenciamaslibre.com/debug.html"
echo ""
