# INSTRUCCIONES PARA ACTUALIZAR REGLAS DE FIRESTORE

## ⚠️ IMPORTANTE: Debes actualizar las reglas en Firebase Console

El error "Missing or insufficient permissions" aparece porque falta agregar las reglas para la nueva colección `solicitudes_chalecos`.

## Pasos para actualizar las reglas:

1. **Ve a Firebase Console:**
   - Abre: https://console.firebase.google.com/
   - Selecciona tu proyecto (FichayTuning o el nombre de tu proyecto)

2. **Navega a Firestore Database:**
   - En el menú lateral izquierdo, haz clic en "Firestore Database"
   - Haz clic en la pestaña **"Reglas"** (Rules) en la parte superior

3. **Copia las reglas actualizadas:**
   - Abre el archivo `REGLAS_FIRESTORE_COPIAR.txt` en este proyecto
   - Copia **TODO** el contenido del archivo

4. **Pega las reglas en Firebase:**
   - Pega el contenido completo en el editor de reglas de Firebase
   - Asegúrate de que incluya la nueva sección para `solicitudes_chalecos`:

```
// Colección de solicitudes de chalecos independientes
match /solicitudes_chalecos/{solicitudId} {
  // Permitir lectura a todos (la validación de rol sargento/admin se hace en el código)
  allow read: if true;
  // Permitir creación (la validación de rol prospect se hace en el código)
  allow create: if true;
  // Permitir actualización (la validación de rol sargento/admin se hace en el código)
  allow update: if true;
}
```

5. **Publica las reglas:**
   - Haz clic en el botón **"Publicar"** (Publish) en la parte superior derecha
   - Espera a que se confirme la publicación

6. **Verifica:**
   - Después de publicar, espera unos segundos
   - Recarga la página de la aplicación
   - Intenta solicitar un chaleco nuevamente

## Nota:
Las reglas pueden tardar unos segundos en aplicarse después de publicarlas. Si el error persiste después de unos minutos, verifica que hayas copiado todas las reglas correctamente.

