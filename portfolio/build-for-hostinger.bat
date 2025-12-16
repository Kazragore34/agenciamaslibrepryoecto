@echo off
REM Script para Windows - Build para Hostinger

echo ====================================
echo Build para Hostinger - Portfolio
echo ====================================
echo.

REM Verificar que estamos en la carpeta portfolio
if not exist "package.json" (
    echo Error: Ejecuta este script desde la carpeta portfolio/
    pause
    exit /b 1
)

REM Paso 1: Instalar dependencias
echo Paso 1: Instalando dependencias...
if not exist "node_modules" (
    call npm install
) else (
    echo Dependencias ya instaladas
)

REM Paso 2: Hacer build
echo.
echo Paso 2: Compilando proyecto...
call npm run build

REM Verificar que el build se completó
if not exist "dist\index.html" (
    echo Error: El build no generó dist\index.html
    pause
    exit /b 1
)

REM Paso 3: Copiar archivos a la raíz
echo.
echo Paso 3: Copiando archivos para Hostinger...
copy /Y dist\index.html index.html
if exist "dist\assets" (
    if exist "assets" rmdir /S /Q assets
    xcopy /E /I /Y dist\assets assets
    echo Archivos copiados a la raiz
) else (
    echo Advertencia: No se encontró dist\assets\
)

echo.
echo ====================================
echo Build completado!
echo ====================================
echo.
echo Proximos pasos:
echo 1. Sube estos archivos a Hostinger:
echo    - index.html
echo    - assets\ (carpeta completa)
echo    - .htaccess
echo 2. Accede a: portfolio.agenciamaslibre.com
echo.
pause
