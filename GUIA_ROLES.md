# Guía: Cómo Asignar Roles de Jefes y Encargados

## 📋 Sistema de Roles

El sistema tiene **3 tipos de roles**:

1. **Empleado** (por defecto): Puede fichar, ver sus propias horas y usar el calculador
2. **Encargado**: Puede ver las horas de todos los empleados + todo lo de empleado
3. **Jefe**: Puede asignar roles + todo lo de encargado

---

## 🔐 Cómo Asignar Roles (Solo para Jefes)

### Paso 1: Acceder a la Página de Administración

1. **Inicia sesión** con una cuenta que tenga rol de **"jefe"**
2. Haz clic en el botón **"Admin"** en el menú superior (botón verde)
   - O ve directamente a: `admin.html`

### Paso 2: Ver Lista de Usuarios

En la página de administración verás una tabla con:
- **Usuario**: Nombre completo y username
- **Rol Actual**: El rol que tiene actualmente
- **Cambiar Rol**: Un menú desplegable para seleccionar el nuevo rol
- **Acción**: Botón "Actualizar"

### Paso 3: Cambiar el Rol de un Usuario

1. Encuentra el usuario en la tabla
2. Selecciona el nuevo rol en el menú desplegable:
   - `empleado`
   - `encargado`
   - `jefe`
3. Haz clic en el botón **"Actualizar"**
4. Confirma el cambio en el diálogo que aparece

### Paso 4: Verificar el Cambio

El rol se actualiza inmediatamente en la base de datos. El usuario verá los nuevos permisos la próxima vez que inicie sesión.

---

## ⚠️ Importante

- **Solo los jefes** pueden acceder a `admin.html`
- Si intentas acceder sin ser jefe, verás un mensaje de "Acceso Denegado"
- Los **encargados** pueden ver las horas de todos, pero **NO pueden cambiar roles**
- Por defecto, todos los usuarios nuevos se registran como **"empleado"**

---

## 🚀 Primer Jefe del Sistema

Si no tienes ningún jefe aún, necesitas crear uno manualmente en Firebase:

### Opción 1: Desde Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: `fichaytuning`
3. Ve a **Firestore Database**
4. Busca la colección `users`
5. Encuentra el documento del usuario que quieres hacer jefe
6. Edita el campo `rol` y cámbialo de `"empleado"` a `"jefe"`

### Opción 2: Desde el Código (Temporal)

Puedes modificar temporalmente `auth.js` para que el primer usuario se registre como jefe, pero **NO es recomendable** para producción.

---

## 📊 Permisos por Rol

| Funcionalidad | Empleado | Encargado | Jefe |
|--------------|----------|-----------|------|
| Fichar entrada/salida | ✅ | ✅ | ✅ |
| Ver sus propias horas | ✅ | ✅ | ✅ |
| Ver horas de otros | ❌ | ✅ | ✅ |
| Usar calculador | ✅ | ✅ | ✅ |
| Ver estadísticas | ✅ | ✅ | ✅ |
| Asignar roles | ❌ | ❌ | ✅ |

---

## 🔧 Solución de Problemas

### "No tengo acceso a admin.html"
- Verifica que tu usuario tenga rol `"jefe"` en Firestore
- Cierra sesión y vuelve a iniciar sesión después de cambiar el rol

### "No puedo ver las horas de otros usuarios"
- Verifica que tu rol sea `"encargado"` o `"jefe"`
- Los empleados solo ven sus propias horas

### "El botón Admin no aparece"
- Solo aparece si eres jefe
- Verifica tu rol en Firestore o contacta a un jefe para que te asigne el rol

---

## 💡 Recomendaciones

1. **Solo asigna rol de "jefe" a usuarios de confianza**
2. **Mantén al menos 2 jefes** en el sistema por seguridad
3. **Los encargados son útiles** para supervisar sin dar permisos completos
4. **Revisa periódicamente** los roles asignados desde admin.html

