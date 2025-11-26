// Funciones de administración para asignar roles

/**
 * Obtiene todos los usuarios
 * @returns {Promise<Array>} - Array de usuarios
 */
async function obtenerTodosUsuarios() {
    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.orderBy('nombre').get();
        
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error obteniendo usuarios:', error);
        throw error;
    }
}

/**
 * Actualiza el rol de un usuario
 * @param {string} userId - ID del usuario
 * @param {string} nuevoRol - Nuevo rol ('jefe', 'encargado', 'empleado')
 * @returns {Promise<void>}
 */
async function actualizarRolUsuario(userId, nuevoRol) {
    try {
        const rolesValidos = ['jefe', 'encargado', 'empleado'];
        if (!rolesValidos.includes(nuevoRol)) {
            throw new Error('Rol inválido');
        }

        const userRef = db.collection('users').doc(userId);
        await userRef.update({
            rol: nuevoRol
        });
    } catch (error) {
        console.error('Error actualizando rol:', error);
        throw error;
    }
}

/**
 * Verifica si el usuario actual tiene permisos de administración
 * @returns {boolean} - true si es jefe o encargado
 */
function tienePermisosAdmin() {
    const user = getCurrentUser();
    return user && (user.rol === 'jefe' || user.rol === 'encargado');
}

/**
 * Verifica si el usuario actual es jefe
 * @returns {boolean} - true si es jefe
 */
function esJefe() {
    const user = getCurrentUser();
    return user && user.rol === 'jefe';
}

