# Migración de Solicitudes de Balas

## Problema
Algunas armas en la base de datos pueden no tener el campo `solicitudesBalas` inicializado correctamente, o las solicitudes existentes pueden tener un formato incorrecto.

## Solución

### Opción 1: Ejecutar desde la consola del navegador (RECOMENDADO)

1. Abre cualquier página de la aplicación en el navegador
2. Presiona `F12` para abrir las herramientas de desarrollador
3. Ve a la pestaña **Console**
4. Copia y pega el contenido completo del archivo `migracion_solicitudes_balas.js`
5. Presiona `Enter` para ejecutar
6. Espera a que termine (verás mensajes en la consola)
7. Verás un alert cuando termine indicando cuántas armas se actualizaron

### Opción 2: Ejecutar desde Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Firestore Database**
4. Haz clic en el menú de tres puntos (⋮) y selecciona **Scripts**
5. Crea un nuevo script con el contenido de `migracion_solicitudes_balas.js`
6. Ejecuta el script

## Qué hace el script

1. **Obtiene todas las armas** de la colección `entregas_armas`
2. **Verifica cada arma**:
   - Si falta el campo `solicitudesBalas`, lo agrega como array vacío `[]`
   - Si el campo no es un array, lo convierte a array vacío
   - Si hay solicitudes sin el campo `estado`, les agrega `estado: 'pendiente'`
   - Si el estado no es string, lo convierte correctamente
3. **Actualiza las armas** que necesitan corrección
4. **Muestra un resumen** de cuántas armas se actualizaron

## Verificación

Después de ejecutar la migración:

1. Ve a la página de **Entregas** como sargento/admin
2. Deberías ver las solicitudes de balas pendientes si existen
3. Si aún no aparecen, solicita nuevas balas desde la página de **Armas** como prospect
4. Verifica en la consola que aparezcan los mensajes de "SOLICITANDO BALAS"

## Notas

- El script es seguro: solo agrega campos faltantes, no elimina datos
- Puedes ejecutarlo múltiples veces sin problemas
- Si hay muchas armas, puede tardar unos minutos

