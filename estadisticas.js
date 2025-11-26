// Funciones para estadísticas de tuneos

// Zona horaria de Perú
const TIMEZONE_PERU = 'America/Lima';

/**
 * Verifica que db esté disponible
 */
async function ensureDb() {
    if (typeof waitForFirebase !== 'undefined') {
        await waitForFirebase();
    }
    if (typeof db === 'undefined' || !db) {
        throw new Error('Firebase no está inicializado. Por favor, recarga la página.');
    }
    return db;
}

/**
 * Obtiene estadísticas de quién tuneó más (contador de tuneos)
 * @returns {Promise<Array>} - Array de objetos con userId, nombre, apellido, username, cantidad
 */
async function obtenerQuienTuneoMas() {
    await ensureDb();
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
    await ensureDb();
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

/**
 * Obtiene datos de actividad agrupados por días y horas
 * @returns {Promise<Object>} - Objeto con porDias y porHoras
 */
async function obtenerDatosActividad() {
    await ensureDb();
    try {
        const fichajesRef = db.collection('fichajes');
        const snapshot = await fichajesRef
            .where('completado', '==', true)
            .get();
        
        const TIMEZONE_PERU = 'America/Lima';
        
        // Función para convertir timestamp a fecha de Perú
        function toPeruDate(timestamp) {
            if (timestamp && timestamp.toDate) {
                const date = timestamp.toDate();
                // Obtener componentes en hora de Perú
                const peruString = date.toLocaleString('en-US', { 
                    timeZone: TIMEZONE_PERU,
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                });
                const [datePart, timePart] = peruString.split(', ');
                const [month, day, year] = datePart.split('/');
                const [hour, minute, second] = timePart.split(':');
                return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second));
            }
            return new Date(timestamp);
        }
        
        // Obtener fecha de hace 30 días
        const hoy = new Date();
        const hace30Dias = new Date(hoy);
        hace30Dias.setDate(hace30Dias.getDate() - 30);
        
        // Agrupar por días (últimos 30 días)
        const porDiasMap = {};
        const porHorasMap = {};
        
        // Inicializar arrays para los últimos 30 días
        for (let i = 29; i >= 0; i--) {
            const fecha = new Date(hoy);
            fecha.setDate(fecha.getDate() - i);
            fecha.setHours(0, 0, 0, 0);
            const fechaKey = fecha.toLocaleDateString('es-PE', { 
                timeZone: TIMEZONE_PERU,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
            porDiasMap[fechaKey] = {
                fecha: fecha.toLocaleDateString('es-PE', { 
                    timeZone: TIMEZONE_PERU,
                    month: 'short',
                    day: 'numeric'
                }),
                horas: 0
            };
        }
        
        // Inicializar horas del día (0-23)
        for (let h = 0; h < 24; h++) {
            porHorasMap[h] = {
                hora: h,
                horas: 0
            };
        }
        
        // Procesar fichajes
        snapshot.docs.forEach(doc => {
            const fichaje = doc.data();
            
            if (!fichaje.entrada || !fichaje.salida) return;
            
            const entrada = toPeruDate(fichaje.entrada);
            const salida = toPeruDate(fichaje.salida);
            
            // Calcular horas totales del fichaje
            const horasTotales = (salida - entrada) / (1000 * 60 * 60);
            
            // Agregar a días
            const fechaEntradaKey = entrada.toLocaleDateString('es-PE', { 
                timeZone: TIMEZONE_PERU,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
            
            if (porDiasMap[fechaEntradaKey]) {
                porDiasMap[fechaEntradaKey].horas += horasTotales;
            }
            
            // Si el fichaje cruza días, distribuir las horas
            const fechaEntrada = new Date(entrada.getFullYear(), entrada.getMonth(), entrada.getDate());
            const fechaSalida = new Date(salida.getFullYear(), salida.getMonth(), salida.getDate());
            
            if (fechaEntrada.getTime() !== fechaSalida.getTime()) {
                // Fichaje que cruza días
                const horasDia1 = (24 - entrada.getHours() - entrada.getMinutes() / 60 - entrada.getSeconds() / 3600);
                const horasDia2 = horasTotales - horasDia1;
                
                const fechaDia2Key = fechaSalida.toLocaleDateString('es-PE', { 
                    timeZone: TIMEZONE_PERU,
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                });
                
                if (porDiasMap[fechaEntradaKey]) {
                    porDiasMap[fechaEntradaKey].horas -= horasTotales;
                    porDiasMap[fechaEntradaKey].horas += horasDia1;
                }
                
                if (porDiasMap[fechaDia2Key]) {
                    porDiasMap[fechaDia2Key].horas += horasDia2;
                }
            }
            
            // Agrupar por horas del día (usar hora de entrada)
            const horaEntrada = entrada.getHours();
            if (porHorasMap[horaEntrada]) {
                porHorasMap[horaEntrada].horas += horasTotales;
            }
        });
        
        // Convertir a arrays ordenados
        const porDias = Object.values(porDiasMap).sort((a, b) => {
            // Ordenar por fecha (más antiguo primero)
            return 0; // Ya están ordenados por fecha
        });
        
        const porHoras = Object.values(porHorasMap).sort((a, b) => a.hora - b.hora);
        
        return {
            porDias: porDias,
            porHoras: porHoras
        };
    } catch (error) {
        console.error('Error obteniendo datos de actividad:', error);
        throw error;
    }
}

