# Instrucciones para Desplegar el Portfolio

## Problema Actual
El error `ERR_CONNECTION_TIMED_OUT` indica que el servidor no está respondiendo. Esto puede deberse a:
1. No se ha hecho el build del proyecto
2. El servidor web no está apuntando a la carpeta correcta
3. El servidor web no está corriendo

## Solución Paso a Paso

### 1. Verificar que el servidor web funciona
Primero, verifica que puedes acceder a `portfolio/test.html`:
- Si `portfolio.agenciamaslibre.com/test.html` carga, el servidor está funcionando
- Si no carga, el problema es de configuración del servidor web

### 2. Hacer el Build del Proyecto

En el servidor, ejecuta:

```bash
cd /ruta/a/tu/proyecto/portfolio
npm install
npm run build
```

Esto generará la carpeta `dist/` con los archivos compilados.

### 3. Configurar el Servidor Web

El servidor web (Apache/Nginx) debe apuntar a la carpeta `portfolio/dist/`

#### Para Apache (.htaccess ya está creado):
- Asegúrate de que el DocumentRoot apunte a `portfolio/dist/`
- O crea un VirtualHost que apunte a esa carpeta

#### Para Nginx:
```nginx
server {
    listen 80;
    server_name portfolio.agenciamaslibre.com;
    root /ruta/completa/a/portfolio/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 4. Verificar Permisos

```bash
chmod -R 755 portfolio/dist/
```

### 5. Verificar que dist/ existe y tiene contenido

```bash
ls -la portfolio/dist/
```

Debes ver:
- index.html
- assets/ (carpeta con JS y CSS)

### 6. Reiniciar el Servidor Web

```bash
# Apache
sudo systemctl restart apache2
# o
sudo service apache2 restart

# Nginx
sudo systemctl restart nginx
# o
sudo service nginx restart
```

## Verificación Rápida

1. ¿`portfolio/test.html` carga? → Si NO: problema de servidor web
2. ¿Existe `portfolio/dist/index.html`? → Si NO: hacer `npm run build`
3. ¿El servidor apunta a `portfolio/dist/`? → Si NO: configurar servidor

## Comandos Útiles

```bash
# Ver logs de Apache
tail -f /var/log/apache2/error.log

# Ver logs de Nginx
tail -f /var/log/nginx/error.log

# Verificar configuración de Apache
apache2ctl -S

# Verificar configuración de Nginx
nginx -t
```
