# Sistema de Fichaje y Calculador de Precios

Sistema completo para gestión de fichaje de horas trabajadas y calculador de precios de tuneos para mecánica en FiveM.

## Características

- ✅ Registro y autenticación con username (sin email)
- ✅ Sistema de fichaje de entrada/salida
- ✅ Cálculo automático de horas con división de semanas (lunes 00:00 - domingo 23:59, hora Perú)
- ✅ Sistema de roles (jefe, encargado, empleado)
- ✅ Calculador de precios de tuneos con descuentos
- ✅ Estadísticas de tuneos y recaudación
- ✅ Gestión de roles (solo jefes)

## Configuración Inicial

### 1. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita **Firestore Database** (modo de prueba inicialmente)
4. Ve a **Project Settings** > **General**
5. En "Your apps", selecciona **Web** (</>)
6. Copia la configuración y pégala en `firebase-config.js`

### 2. Configurar Firestore Rules

1. Ve a **Firestore Database** > **Rules**
2. Copia el contenido de `firestore-rules.txt`
3. Pégalo en las reglas de Firestore
4. Publica las reglas

**Nota:** Las reglas están simplificadas para desarrollo. En producción, ajusta según tus necesidades de seguridad.

### 3. Estructura de Colecciones

El sistema creará automáticamente estas colecciones:

- **users**: Usuarios registrados
- **fichajes**: Registros de entrada/salida
- **semanas**: Resumen de horas por semana
- **tuneos**: Registro de tuneos realizados

## Uso

### Registro de Usuarios

1. Abre `registro.html`
2. Completa el formulario de registro:
   - Nombre
   - Apellido
   - Username (ejemplo: Kazragore34)
   - Contraseña
3. Inicia sesión con tu username y contraseña

### Fichaje de Horas

1. Accede a `fichaje.html` después de iniciar sesión
2. Haz clic en "Fichar Entrada" al comenzar tu jornada
3. Haz clic en "Fichar Salida" al terminar
4. El sistema calcula automáticamente las horas y las divide entre semanas si cruza el domingo

### Calculador de Precios

1. Accede a `calculador.html`
2. Selecciona la categoría del vehículo
3. Marca los servicios necesarios (Full Tuning, Motor, Frenos, etc.)
4. Ingresa la cantidad de piezas
5. Aplica descuentos si corresponde:
   - **Convenio (20%)**: Selecciona la entidad (Mecánicos, Motor Club, Puf Puf, Médicos)
   - **Amistad (5-10%)**: Usa el slider para seleccionar el porcentaje e ingresa el nombre
6. El precio se calcula automáticamente
7. Haz clic en "Registrar Tuneo" para guardar

### Ver Horas Trabajadas

1. Accede a `horas.html`
2. Selecciona la semana que deseas ver
3. Si eres jefe o encargado, puedes filtrar por usuario

### Estadísticas

1. Accede a `estadisticas.html`
2. Verás dos tablas:
   - **Quién Tuneó Más**: Ranking por cantidad de tuneos
   - **Quién Recaudó Más**: Ranking por recaudación total

### Administración (Solo Jefes)

1. Accede a `admin.html`
2. Verás la lista de todos los usuarios
3. Cambia el rol de cada usuario según necesites

## Tabla de Precios

El sistema incluye precios para las siguientes categorías:

- Compacts
- Coupes
- Motos Taller Regular
- Muscle
- Off Road
- Sedans
- Sports
- Sports Classics
- Super
- SUV's
- Motos Taller de Motor
- Vans
- Importación (Sangre)

Cada categoría tiene precios para:
- Full Tuning
- Motor
- Frenos
- Transmisión
- Turbo
- Suspensión
- Pieza (precio unitario)

## Descuentos

### Descuento por Convenio (20%)
Aplicable a:
- Mecánicos
- Motor Club
- Puf Puf
- Médicos

### Descuento de Amistad (5-10%)
Descuento variable seleccionable mediante slider. Requiere nombre de la persona.

## Zona Horaria

El sistema usa la zona horaria de Perú (America/Lima, UTC-5) para todos los cálculos de tiempo.

## Seguridad

- Las contraseñas se hashean usando SHA-256
- La sesión se almacena en localStorage
- Cada página verifica la autenticación antes de cargar
- Los roles determinan los permisos de acceso

## Archivos Principales

- `registro.html` - Registro y login
- `fichaje.html` - Fichaje de horas
- `horas.html` - Visualización de horas
- `calculador.html` - Calculador de precios
- `estadisticas.html` - Estadísticas
- `admin.html` - Administración de roles
- `firebase-config.js` - Configuración de Firebase
- `auth.js` - Funciones de autenticación
- `fichaje.js` - Lógica de fichaje
- `calculador.js` - Lógica del calculador
- `estadisticas.js` - Estadísticas
- `admin.js` - Gestión de roles
- `styles-fichaje.css` - Estilos del sistema

## Notas Importantes

1. **Primer Usuario**: El primer usuario registrado tendrá rol "empleado" por defecto. Para convertirlo en jefe, necesitarás acceder directamente a Firestore o crear un usuario jefe manualmente.

2. **Configuración de Firebase**: Asegúrate de reemplazar los valores en `firebase-config.js` con los de tu proyecto.

3. **Reglas de Firestore**: Las reglas proporcionadas son básicas. Ajusta según tus necesidades de seguridad en producción.

4. **Backup**: Realiza backups regulares de tu base de datos Firestore.

## Soporte

Para problemas o preguntas, revisa la configuración de Firebase y asegúrate de que todas las colecciones estén correctamente configuradas.

