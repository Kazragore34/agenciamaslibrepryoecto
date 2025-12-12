# Migración de Roles en Base de Datos

## Cambios de Roles

Los roles han cambiado de:
- `dealer` → `sargento`
- `vendedor` → `prospect`
- Nuevo rol: `admin` (único que puede asignar roles)

## Script de Migración para Firestore

Ejecuta este script en la consola de Firebase o crea una función Cloud para migrar los datos:

```javascript
// Script para migrar roles en Firestore
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

async function migrarRoles() {
    try {
        // Migrar roles en la colección 'users'
        const usersSnapshot = await db.collection('users').get();
        
        const batch = db.batch();
        let count = 0;
        
        usersSnapshot.forEach((doc) => {
            const userData = doc.data();
            const nuevoRol = userData.rol === 'dealer' ? 'sargento' : 
                           userData.rol === 'vendedor' ? 'prospect' : 
                           userData.rol;
            
            if (userData.rol !== nuevoRol) {
                batch.update(doc.ref, { rol: nuevoRol });
                count++;
                console.log(`Usuario ${doc.id}: ${userData.rol} → ${nuevoRol}`);
            }
        });
        
        await batch.commit();
        console.log(`Migración completada: ${count} usuarios actualizados`);
    } catch (error) {
        console.error('Error en migración:', error);
    }
}

migrarRoles();
```

## Notas Importantes

1. **Los nombres de campos en las colecciones NO cambian**: 
   - `dealerId` y `vendedorId` en `entregas_productos`, `tickets_dinero`, `entregas_armas` se mantienen para compatibilidad
   - Solo los roles en la colección `users` cambian

2. **Asignar rol admin manualmente**:
   - Después de la migración, asigna el rol `admin` manualmente a los usuarios que deben tener permisos de administración
   - Solo los usuarios con rol `admin` pueden cambiar roles de otros usuarios

3. **Verificación**:
   - Verifica que todos los usuarios tengan un rol válido: `admin`, `sargento`, o `prospect`
   - Asegúrate de que al menos un usuario tenga rol `admin` para poder gestionar roles

