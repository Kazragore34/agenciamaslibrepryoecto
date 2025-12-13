# Instrucciones para Borrar la Base de Datos de Firebase

## ⚠️ ADVERTENCIA
**Borrar la base de datos eliminará TODOS los datos permanentemente. Esta acción NO se puede deshacer.**

## Método 1: Borrar desde Firebase Console (Recomendado)

### Paso 1: Acceder a Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: `fichaytuning`

### Paso 2: Borrar Colecciones Individuales
1. Ve a **Firestore Database** en el menú lateral
2. Verás todas las colecciones (users, entregas_productos, tickets_dinero, etc.)
3. Para cada colección:
   - Haz clic en el nombre de la colección
   - Haz clic en los tres puntos (⋮) junto al nombre
   - Selecciona **"Delete collection"** o **"Eliminar colección"**
   - Confirma la eliminación

### Paso 3: Borrar Todas las Colecciones
Si quieres borrar todo de una vez:
1. En **Firestore Database**, verás todas las colecciones
2. Repite el proceso del Paso 2 para cada colección:
   - `users`
   - `entregas_productos`
   - `tickets_dinero`
   - `entregas_armas`
   - `metas`
   - `depositos_dinero_negro`

## Método 2: Usar Firebase CLI (Avanzado)

Si tienes Firebase CLI instalado:

```bash
# Instalar Firebase CLI (si no lo tienes)
npm install -g firebase-tools

# Iniciar sesión
firebase login

# Seleccionar proyecto
firebase use fichaytuning

# Borrar todas las colecciones (requiere confirmación)
firebase firestore:delete --all-collections
```

## Método 3: Borrar Base de Datos Completa (Extremo)

**⚠️ Esto borrará TODO, incluyendo la configuración de Firestore**

1. Ve a Firebase Console
2. Selecciona tu proyecto
3. Ve a **Project Settings** (Configuración del proyecto)
4. Desplázate hasta la parte inferior
5. Haz clic en **"Delete project"** o **"Eliminar proyecto"**
6. Confirma la eliminación

**Nota:** Esto eliminará todo el proyecto, no solo la base de datos.

## Recomendación

**Para empezar limpio con el nuevo sistema:**

1. **Mantén la colección `users`** si quieres conservar los usuarios registrados (solo necesitarás actualizar sus roles a `sargento` o `prospect`)

2. Las colecciones se crearán automáticamente cuando uses el sistema:
   - `entregas_productos`
   - `tickets_dinero`
   - `entregas_armas`
   - `metas`
   - `depositos_dinero_negro`

## Actualizar Roles de Usuarios Existentes

Si mantienes la colección `users`, necesitarás actualizar los roles:

1. Ve a **Firestore Database** > **users**
2. Para cada usuario:
   - Haz clic en el documento del usuario
   - Edita el campo `rol`
   - Cambia según corresponda a:
     - `admin` (para administradores)
     - `sargento` (para sargentos)
     - `prospect` (para prospects/usuarios normales)
   - Guarda los cambios

## Verificar que Todo Está Limpio

Después de borrar:
1. Ve a **Firestore Database**
2. Deberías ver solo las colecciones que quieres mantener
3. Si borraste todo, deberías ver un mensaje indicando que no hay datos

