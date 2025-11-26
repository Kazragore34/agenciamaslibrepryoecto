// Funciones para estadísticas de tuneos

/**
 * Obtiene estadísticas de quién tuneó más (contador de tuneos)
 * @returns {Promise<Array>} - Array de objetos con userId, nombre, apellido, username, cantidad
 */
async function obtenerQuienTuneoMas() {
    try {
        const tuneosRef = db.collection('tuneos');
        const snapshot = await tuneosRef.get();
        
        // Contar tuneos por usuario
        const conteo = {};
        snapshot.docs.forEach(doc => {
            const tuneo = doc.data();
            const userId = tuneo.userId;
            if (!conteo[userId]) {
                conteo[userId] = 0;
            }
            conteo[userId]++;
        });
        
        // Obtener información de usuarios
        const usuariosRef = db.collection('users');
        const usuariosSnapshot = await usuariosRef.get();
        const usuariosMap = {};
        usuariosSnapshot.docs.forEach(doc => {
            usuariosMap[doc.id] = {
                id: doc.id,
                ...doc.data()
            };
        });
        
        // Crear array de resultados
        const resultados = Object.keys(conteo).map(userId => ({
            userId: userId,
            nombre: usuariosMap[userId]?.nombre || 'Desconocido',
            apellido: usuariosMap[userId]?.apellido || '',
            username: usuariosMap[userId]?.username || 'N/A',
            cantidad: conteo[userId]
        }));
        
        // Ordenar por cantidad descendente
        resultados.sort((a, b) => b.cantidad - a.cantidad);
        
        return resultados;
    } catch (error) {
        console.error('Error obteniendo quién tuneó más:', error);
        throw error;
    }
}

/**
 * Obtiene estadísticas de quién recaudó más (suma de precios)
 * @returns {Promise<Array>} - Array de objetos con userId, nombre, apellido, username, recaudacion
 */
async function obtenerQuienRecaudoMas() {
    try {
        const tuneosRef = db.collection('tuneos');
        const snapshot = await tuneosRef.get();
        
        // Sumar precios por usuario
        const recaudacion = {};
        snapshot.docs.forEach(doc => {
            const tuneo = doc.data();
            const userId = tuneo.userId;
            const precio = tuneo.precioTotal || 0;
            if (!recaudacion[userId]) {
                recaudacion[userId] = 0;
            }
            recaudacion[userId] += precio;
        });
        
        // Obtener información de usuarios
        const usuariosRef = db.collection('users');
        const usuariosSnapshot = await usuariosRef.get();
        const usuariosMap = {};
        usuariosSnapshot.docs.forEach(doc => {
            usuariosMap[doc.id] = {
                id: doc.id,
                ...doc.data()
            };
        });
        
        // Crear array de resultados
        const resultados = Object.keys(recaudacion).map(userId => ({
            userId: userId,
            nombre: usuariosMap[userId]?.nombre || 'Desconocido',
            apellido: usuariosMap[userId]?.apellido || '',
            username: usuariosMap[userId]?.username || 'N/A',
            recaudacion: recaudacion[userId]
        }));
        
        // Ordenar por recaudación descendente
        resultados.sort((a, b) => b.recaudacion - a.recaudacion);
        
        return resultados;
    } catch (error) {
        console.error('Error obteniendo quién recaudó más:', error);
        throw error;
    }
}

/**
 * Formatea un precio para mostrar
 * @param {number} precio - Precio a formatear
 * @returns {string} - Precio formateado
 */
function formatPrecio(precio) {
    return `$${precio.toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

