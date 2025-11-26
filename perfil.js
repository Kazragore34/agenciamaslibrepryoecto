// Funciones para gestión de perfil de usuario

/**
 * Verifica que db esté disponible
 */
async function ensureDb() {
    let attempts = 0;
    while (typeof db === 'undefined' && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
    }
    if (typeof db === 'undefined') {
        throw new Error('Firebase no está inicializado. Por favor, recarga la página.');
    }
}

/**
 * Cambia la contraseña del usuario actual
 * @param {string} passwordActual - Contraseña actual del usuario
 * @param {string} nuevaPassword - Nueva contraseña
 * @returns {Promise<void>}
 */
async function cambiarMiContrasena(passwordActual, nuevaPassword) {
    await ensureDb();
    
    const user = getCurrentUser();
    if (!user) {
        throw new Error('No hay sesión activa');
    }

    try {
        // Obtener el usuario de Firestore para verificar la contraseña actual
        const userRef = db.collection('users').doc(user.id);
        const userDoc = await userRef.get();
        
        if (!userDoc.exists) {
            throw new Error('Usuario no encontrado');
        }

        const userData = userDoc.data();

        // Verificar que la contraseña actual sea correcta
        const passwordMatch = await verifyPassword(passwordActual, userData.password);
        if (!passwordMatch) {
            throw new Error('La contraseña actual es incorrecta');
        }

        // Hashear la nueva contraseña
        const nuevaPasswordHash = await hashPassword(nuevaPassword);

        // Actualizar la contraseña en Firestore
        await userRef.update({
            password: nuevaPasswordHash
        });
    } catch (error) {
        console.error('Error cambiando contraseña:', error);
        throw error;
    }
}

/**
 * Maneja el evento de cambio de contraseña desde el formulario
 */
async function cambiarContrasena(event) {
    event.preventDefault();

    const passwordActual = document.getElementById('passwordActual').value;
    const nuevaPassword = document.getElementById('nuevaPassword').value;
    const confirmarPassword = document.getElementById('confirmarPassword').value;

    const mensajeEl = document.getElementById('mensajeCambio');

    // Validar que las nuevas contraseñas coincidan
    if (nuevaPassword !== confirmarPassword) {
        mensajeEl.textContent = 'Las nuevas contraseñas no coinciden';
        mensajeEl.className = 'auth-message error';
        mensajeEl.style.display = 'block';
        return;
    }

    // Validar longitud mínima
    if (nuevaPassword.length < 4) {
        mensajeEl.textContent = 'La nueva contraseña debe tener al menos 4 caracteres';
        mensajeEl.className = 'auth-message error';
        mensajeEl.style.display = 'block';
        return;
    }

    try {
        mensajeEl.textContent = 'Cambiando contraseña...';
        mensajeEl.className = 'auth-message info';
        mensajeEl.style.display = 'block';

        await cambiarMiContrasena(passwordActual, nuevaPassword);

        mensajeEl.textContent = 'Contraseña cambiada correctamente';
        mensajeEl.className = 'auth-message success';
        mensajeEl.style.display = 'block';

        // Limpiar el formulario
        document.getElementById('formCambioContrasena').reset();

        // Ocultar mensaje después de 3 segundos
        setTimeout(() => {
            mensajeEl.style.display = 'none';
        }, 3000);
    } catch (error) {
        console.error('Error cambiando contraseña:', error);
        mensajeEl.textContent = error.message || 'Error al cambiar la contraseña';
        mensajeEl.className = 'auth-message error';
        mensajeEl.style.display = 'block';
    }
}

