#!/bin/bash

# Script para hacer build del portfolio

echo "🔨 Iniciando build del portfolio..."

# Verificar que estamos en la carpeta correcta
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Asegúrate de estar en la carpeta portfolio/"
    exit 1
fi

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Hacer build
echo "🏗️  Compilando proyecto..."
npm run build

# Verificar que el build se completó
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    echo "✅ Build completado exitosamente!"
    echo "📁 Archivos generados en: dist/"
    echo ""
    echo "📋 Próximos pasos:"
    echo "1. Verifica que el servidor web apunta a: portfolio/dist/"
    echo "2. Reinicia el servidor web (Apache/Nginx)"
    echo "3. Accede a: portfolio.agenciamaslibre.com"
else
    echo "❌ Error: El build no se completó correctamente"
    echo "Verifica los errores arriba"
    exit 1
fi
