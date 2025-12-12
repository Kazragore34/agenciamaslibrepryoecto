# Sistema de Gestión de Stock y Entregas

Sistema completo para gestión de entregas de productos, tickets de dinero, armas y seguimiento de metas para una banda de GTA V.

## Características

- ✅ Registro y autenticación con username (sin email)
- ✅ Sistema de roles (dealer, vendedor)
- ✅ Gestión de entregas de productos (dealer → vendedor)
- ✅ Sistema de tickets de dinero con montos aproximados
- ✅ Gestión de armas con solicitudes de balas
- ✅ Metas diarias (100k) y semanales (1M)
- ✅ Estadísticas de ventas y entregas
- ✅ Panel de administración (solo dealers)

## Configuración Inicial

### 1. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o usa uno existente
3. Habilita **Firestore Database** (modo de prueba inicialmente)
4. Ve a **Project Settings** > **General**
5. En "Your apps", selecciona **Web** (</>)
6. Copia la configuración y pégala en `firebase-config.js`

### 2. Configurar Firestore Rules

1. Ve a **Firestore Database** > **Rules**
2. Copia el contenido de `firestore-rules.txt`
3. Pégalo en las reglas de Firestore
4. Publica las reglas

**Nota:** Las reglas están configuradas para autenticación manual. En producción, considera implementar Firebase Authentication para mayor seguridad.

### 3. Estructura de Colecciones

El sistema creará automáticamente estas colecciones:

- **users**: Usuarios registrados (roles: dealer, vendedor)
- **entregas_productos**: Entregas de productos de dealer a vendedor
- **tickets_dinero**: Tickets de dinero que los vendedores deben entregar
- **entregas_armas**: Entregas de armas con solicitudes de balas
- **metas**: Metas diarias y semanales de cada usuario

## Uso

### Registro de Usuarios

1. Abre `registro.html` o `menu.html`
2. Completa el formulario de registro:
   - Nombre
   - Apellido
   - Username
   - Contraseña
3. Inicia sesión con tu username y contraseña
4. Serás redirigido a `menu.html`

### Roles del Sistema

#### Dealer
- Puede crear entregas de productos
- Puede crear tickets de dinero
- Puede entregar armas
- Puede gestionar usuarios (cambiar roles, restablecer contraseñas)
- Ve montos aproximados en tickets

#### Vendedor
- Recibe y confirma entregas de productos
- Confirma tickets de dinero
- Solicita recarga de balas
- Ve sus metas diarias y semanales
- No ve montos aproximados (solo confirma lo que entregó)

### Entregas de Productos

1. **Dealer**: Accede a `entregas.html`
   - Selecciona un vendedor
   - Agrega productos y cantidades
   - El sistema calcula precio aproximado (solo visible para dealer)
   - Crea la entrega

2. **Vendedor**: Ve la entrega en `menu.html` o `entregas.html`
   - Confirma o rechaza la entrega
   - Si confirma, la entrega queda registrada

### Tickets de Dinero

1. **Dealer**: Accede a `tickets_dinero.html`
   - Crea un ticket para un vendedor
   - Ingresa monto aproximado (opcional, solo visible para dealer)
   - Relaciona entregas si es necesario

2. **Vendedor**: Ve el ticket en `menu.html` o `tickets_dinero.html`
   - Confirma el monto que entregó
   - El sistema actualiza sus metas automáticamente

### Gestión de Armas

1. **Dealer**: Accede a `armas.html`
   - Crea entrega de arma (tipo, chaleco opcional)
   - Ve solicitudes de balas pendientes
   - Marca armas como perdidas (con motivo)

2. **Vendedor**: Ve sus armas en `menu.html` o `armas.html`
   - Solicita recarga de balas cuando sea necesario
   - Ve historial de armas perdidas

### Metas

- **Meta Diaria**: $100,000
- **Meta Semanal**: $1,000,000

Los vendedores pueden ver su progreso en `menu.html`. Las metas se actualizan automáticamente cuando confirman tickets de dinero.

### Estadísticas

Accede a `estadisticas.html` para ver:
- Top vendedores (por dinero entregado)
- Top dealers (por entregas realizadas)
- Productos más entregados
- Estado de entregas (confirmadas, pendientes, rechazadas)
- Gráficas de dinero por día y semana
- Gráficas de entregas por día

### Administración (Solo Dealers)

1. Accede a `admin.html`
2. Verás la lista de todos los usuarios
3. Cambia el rol de cada usuario (dealer/vendedor)
4. Restablece contraseñas cuando sea necesario

## Productos Disponibles

- Coca
- Meta
- Crack
- Weed
- Semilla Maleza (precio: $170)
- Semilla Amarillo (precio: $180)
- Semilla Azul (precio: $220)
- Semilla Morado (precio: $210)

**Nota:** Las semillas incluyen automáticamente fertilizante, maceta y regadera en la misma cantidad.

## Tipos de Armas

- SNS
- MK2
- VINTAGE
- .50
- AP PISTOL

## Motivos de Pérdida de Armas

- Pérdida por Robo o Corte
- Pérdida en Enfrentamiento
- Pérdida por Policía
- Pérdida por Full Muerte
- Pérdida por Bug

## Zona Horaria

El sistema usa la zona horaria de Perú (America/Lima, UTC-5) para todos los cálculos de tiempo y fechas.

## Seguridad

- Las contraseñas se hashean usando SHA-256
- La sesión se almacena en localStorage
- Cada página verifica la autenticación antes de cargar
- Los roles determinan los permisos de acceso
- Los dealers ven información adicional (montos aproximados)

## Archivos Principales

### Páginas HTML
- `menu.html` - Página principal (incluye login si no estás autenticado)
- `registro.html` - Registro y login
- `entregas.html` - Gestión de entregas de productos
- `tickets_dinero.html` - Gestión de tickets de dinero
- `armas.html` - Gestión de armas
- `estadisticas.html` - Estadísticas de ventas
- `admin.html` - Administración de usuarios (solo dealers)
- `perfil.html` - Perfil del usuario y cambio de contraseña

### Archivos JavaScript
- `firebase-config.js` - Configuración de Firebase
- `auth.js` - Funciones de autenticación
- `productos.js` - Configuración de productos y precios
- `entregas.js` - Lógica de entregas
- `tickets.js` - Lógica de tickets de dinero
- `armas.js` - Lógica de armas
- `metas.js` - Sistema de metas
- `menu.js` - Funciones del menú principal
- `admin.js` - Gestión de usuarios

### Estilos
- `styles-fichaje.css` - Estilos del sistema
- `styles.css` - Estilos generales

## Notas Importantes

1. **Primer Usuario**: El primer usuario registrado tendrá rol "vendedor" por defecto. Para convertirlo en dealer, accede a `admin.html` (si ya tienes un dealer) o modifica directamente en Firestore.

2. **Configuración de Firebase**: Asegúrate de reemplazar los valores en `firebase-config.js` con los de tu proyecto.

3. **Reglas de Firestore**: Las reglas proporcionadas son permisivas para autenticación manual. Ajusta según tus necesidades de seguridad en producción.

4. **Backup**: Realiza backups regulares de tu base de datos Firestore.

5. **Montos Aproximados**: Solo los dealers pueden ver los montos aproximados en los tickets. Los vendedores solo ven el ticket vacío esperando su confirmación.

## Flujo de Trabajo

### Entrega de Productos
1. Dealer crea entrega → Vendedor recibe notificación
2. Vendedor confirma → Entrega registrada
3. Dealer puede crear ticket de dinero relacionado

### Ticket de Dinero
1. Dealer crea ticket (con monto aproximado opcional)
2. Vendedor ve ticket pendiente
3. Vendedor confirma monto entregado
4. Sistema actualiza metas del vendedor

### Entrega de Arma
1. Dealer entrega arma
2. Vendedor puede solicitar balas
3. Dealer entrega balas
4. Si se pierde, dealer marca con motivo

## Soporte

Para problemas o preguntas, revisa la configuración de Firebase y asegúrate de que todas las colecciones estén correctamente configuradas.
