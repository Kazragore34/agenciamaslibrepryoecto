// Funciones de autenticación con username

/**
 * Verifica si un username ya existe
 * @param {string} username - Username a verificar
 * @returns {Promise<boolean>} - true si existe, false si no
 */
async function usernameExists(username) {
    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('username', '==', username).get();
        return !snapshot.empty;
    } catch (error) {
        console.error('Error verificando username:', error);
        throw error;
    }
}

/**
 * Registra un nuevo usuario
 * @param {string} nombre - Nombre del usuario
 * @param {string} apellido - Apellido del usuario
 * @param {string} username - Username único
 * @param {string} password - Contraseña (se hasheará)
 * @returns {Promise<Object>} - Datos del usuario creado
 */
async function registrarUsuario(nombre, apellido, username, password) {
    try {
        // Verificar que el username no exista
        const exists = await usernameExists(username);
        if (exists) {
            throw new Error('El username ya está en uso');
        }

        // Hashear la contraseña
        const passwordHash = await hashPassword(password);

        // Crear el usuario en Firestore
        const userData = {
            nombre: nombre,
            apellido: apellido,
            username: username,
            password: passwordHash,
            rol: 'empleado', // Rol por defecto
            fechaRegistro: firebase.firestore.FieldValue.serverTimestamp()
        };

        const docRef = await db.collection('users').add(userData);
        
        return {
            id: docRef.id,
            ...userData,
            password: undefined // No devolver la contraseña
        };
    } catch (error) {
        console.error('Error registrando usuario:', error);
        throw error;
    }
}

/**
 * Inicia sesión con username y contraseña
 * @param {string} username - Username
 * @param {string} password - Contraseña
 * @returns {Promise<Object>} - Datos del usuario si el login es exitoso
 */
async function login(username, password) {
    try {
        // Buscar usuario por username
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('username', '==', username).get();

        if (snapshot.empty) {
            throw new Error('Usuario o contraseña incorrectos');
        }

        // Obtener el documento del usuario
        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();

        // Verificar la contraseña
        const passwordMatch = await verifyPassword(password, userData.password);
        if (!passwordMatch) {
            throw new Error('Usuario o contraseña incorrectos');
        }

        // Preparar datos del usuario para la sesión
        const sessionData = {
            id: userDoc.id,
            username: userData.username,
            nombre: userData.nombre,
            apellido: userData.apellido,
            rol: userData.rol
        };

        // Guardar sesión en localStorage
        localStorage.setItem('userSession', JSON.stringify(sessionData));

        return sessionData;
    } catch (error) {
        console.error('Error en login:', error);
        throw error;
    }
}

/**
 * Cierra la sesión del usuario
 */
function logout() {
    localStorage.removeItem('userSession');
    window.location.href = 'registro.html';
}

/**
 * Obtiene la sesión actual del usuario
 * @returns {Object|null} - Datos del usuario o null si no hay sesión
 */
function getCurrentUser() {
    const session = localStorage.getItem('userSession');
    if (!session) {
        return null;
    }
    try {
        return JSON.parse(session);
    } catch (error) {
        console.error('Error parseando sesión:', error);
        return null;
    }
}

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean} - true si está autenticado, false si no
 */
function isAuthenticated() {
    return getCurrentUser() !== null;
}

/**
 * Requiere autenticación, redirige si no está autenticado
 */
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'registro.html';
    }
}

