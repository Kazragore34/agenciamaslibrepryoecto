// Utilidades para hash de contraseñas usando Web Crypto API

/**
 * Hashea una contraseña usando SHA-256
 * @param {string} password - Contraseña a hashear
 * @returns {Promise<string>} - Hash de la contraseña en hexadecimal
 */
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

/**
 * Verifica si una contraseña coincide con un hash
 * @param {string} password - Contraseña a verificar
 * @param {string} hash - Hash almacenado
 * @returns {Promise<boolean>} - true si coinciden, false si no
 */
async function verifyPassword(password, hash) {
    const passwordHash = await hashPassword(password);
    return passwordHash === hash;
}

