// Lógica de fichaje con cálculo de horas y división de semanas

// Zona horaria de Perú
const TIMEZONE_PERU = 'America/Lima';

/**
 * Obtiene la fecha actual en hora de Perú
 * @returns {Date} - Fecha en hora de Perú
 */
function getCurrentDatePeru() {
    const now = new Date();
    const peruTime = new Date(now.toLocaleString('en-US', { timeZone: TIMEZONE_PERU }));
    return peruTime;
}

/**
 * Convierte un timestamp a hora de Perú
 * @param {Date|Timestamp} timestamp - Timestamp a convertir
 * @returns {Date} - Fecha en hora de Perú
 */
function toPeruTime(timestamp) {
    if (timestamp && timestamp.toDate) {
        timestamp = timestamp.toDate();
    }
    return new Date(timestamp.toLocaleString('en-US', { timeZone: TIMEZONE_PERU }));
}

/**
 * Obtiene el inicio de la semana (lunes 00:00) en hora de Perú
 * @param {Date} date - Fecha de referencia
 * @returns {Date} - Lunes 00:00 de esa semana
 */
function getWeekStart(date) {
    const peruDate = toPeruTime(date);
    const day = peruDate.getDay();
    const diff = peruDate.getDate() - day + (day === 0 ? -6 : 1); // Ajustar para que lunes sea 0
    const monday = new Date(peruDate.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
}

/**
 * Obtiene el fin de la semana (domingo 23:59:59) en hora de Perú
 * @param {Date} date - Fecha de referencia
 * @returns {Date} - Domingo 23:59:59 de esa semana
 */
function getWeekEnd(date) {
    const weekStart = getWeekStart(date);
    const sunday = new Date(weekStart);
    sunday.setDate(sunday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    return sunday;
}

/**
 * Calcula las horas trabajadas dividiendo entre semanas si cruza domingo
 * @param {Date|Timestamp} entrada - Fecha de entrada
 * @param {Date|Timestamp} salida - Fecha de salida
 * @returns {Object} - Objeto con horasSemanaActual y horasSemanaSiguiente
 */
function calcularHorasConDivision(entrada, salida) {
    const entradaPeru = toPeruTime(entrada);
    const salidaPeru = toPeruTime(salida);
    
    const semanaInicio = getWeekStart(entradaPeru);
    const semanaFin = getWeekEnd(entradaPeru);
    
    // Verificar si cruza el domingo
    if (salidaPeru > semanaFin) {
        // Dividir las horas
        const horasHastaDomingo = (semanaFin - entradaPeru) / (1000 * 60 * 60);
        const horasDesdeLunes = (salidaPeru - semanaFin) / (1000 * 60 * 60);
        
        return {
            horasSemanaActual: horasHastaDomingo,
            horasSemanaSiguiente: horasDesdeLunes,
            cruzaSemana: true
        };
    } else {
        // Todo en la misma semana
        const horasTotales = (salidaPeru - entradaPeru) / (1000 * 60 * 60);
        return {
            horasSemanaActual: horasTotales,
            horasSemanaSiguiente: 0,
            cruzaSemana: false
        };
    }
}

/**
 * Obtiene el fichaje activo del usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object|null>} - Fichaje activo o null
 */
async function getFichajeActivo(userId) {
    try {
        const fichajesRef = db.collection('fichajes');
        const snapshot = await fichajesRef
            .where('userId', '==', userId)
            .where('completado', '==', false)
            .orderBy('entrada', 'desc')
            .limit(1)
            .get();
        
        if (snapshot.empty) {
            return null;
        }
        
        const doc = snapshot.docs[0];
        return {
            id: doc.id,
            ...doc.data()
        };
    } catch (error) {
        console.error('Error obteniendo fichaje activo:', error);
        throw error;
    }
}

/**
 * Ficha la entrada del usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object>} - Datos del fichaje creado
 */
async function ficharEntrada(userId) {
    try {
        // Verificar que no tenga un fichaje activo
        const fichajeActivo = await getFichajeActivo(userId);
        if (fichajeActivo) {
            throw new Error('Ya tienes un fichaje activo. Debes fichar la salida primero.');
        }
        
        const ahora = getCurrentDatePeru();
        const semanaInicio = getWeekStart(ahora);
        const semanaFin = getWeekEnd(ahora);
        
        const fichajeData = {
            userId: userId,
            entrada: firebase.firestore.Timestamp.fromDate(ahora),
            salida: null,
            semanaInicio: firebase.firestore.Timestamp.fromDate(semanaInicio),
            semanaFin: firebase.firestore.Timestamp.fromDate(semanaFin),
            horasSemanaActual: 0,
            horasSemanaSiguiente: 0,
            completado: false
        };
        
        const docRef = await db.collection('fichajes').add(fichajeData);
        
        return {
            id: docRef.id,
            ...fichajeData
        };
    } catch (error) {
        console.error('Error fichando entrada:', error);
        throw error;
    }
}

/**
 * Ficha la salida del usuario
 * @param {string} fichajeId - ID del fichaje activo
 * @returns {Promise<Object>} - Datos del fichaje completado
 */
async function ficharSalida(fichajeId) {
    try {
        const fichajeRef = db.collection('fichajes').doc(fichajeId);
        const fichajeDoc = await fichajeRef.get();
        
        if (!fichajeDoc.exists) {
            throw new Error('Fichaje no encontrado');
        }
        
        const fichajeData = fichajeDoc.data();
        if (fichajeData.completado) {
            throw new Error('Este fichaje ya está completado');
        }
        
        const ahora = getCurrentDatePeru();
        const entrada = fichajeData.entrada.toDate();
        
        // Calcular horas con división
        const horasCalculadas = calcularHorasConDivision(entrada, ahora);
        
        // Actualizar el fichaje
        await fichajeRef.update({
            salida: firebase.firestore.Timestamp.fromDate(ahora),
            horasSemanaActual: horasCalculadas.horasSemanaActual,
            horasSemanaSiguiente: horasCalculadas.horasSemanaSiguiente,
            completado: true
        });
        
        // Actualizar o crear resumen de semanas
        await actualizarResumenSemanas(fichajeData.userId, fichajeData.semanaInicio.toDate(), horasCalculadas, fichajeDoc.id);
        
        return {
            id: fichajeDoc.id,
            ...fichajeData,
            salida: ahora,
            horasSemanaActual: horasCalculadas.horasSemanaActual,
            horasSemanaSiguiente: horasCalculadas.horasSemanaSiguiente,
            completado: true
        };
    } catch (error) {
        console.error('Error fichando salida:', error);
        throw error;
    }
}

/**
 * Actualiza el resumen de horas por semana
 * @param {string} userId - ID del usuario
 * @param {Date} semanaInicio - Inicio de la semana
 * @param {Object} horasCalculadas - Horas calculadas
 * @param {string} fichajeId - ID del fichaje
 */
async function actualizarResumenSemanas(userId, semanaInicio, horasCalculadas, fichajeId) {
    try {
        const semanaInicioTimestamp = firebase.firestore.Timestamp.fromDate(semanaInicio);
        const semanaFin = getWeekEnd(semanaInicio);
        const semanaFinTimestamp = firebase.firestore.Timestamp.fromDate(semanaFin);
        
        // Actualizar semana actual
        const semanaRef = db.collection('semanas').doc(`${userId}_${semanaInicioTimestamp.toMillis()}`);
        const semanaDoc = await semanaRef.get();
        
        if (semanaDoc.exists) {
            await semanaRef.update({
                horasTotales: firebase.firestore.FieldValue.increment(horasCalculadas.horasSemanaActual),
                fichajes: firebase.firestore.FieldValue.arrayUnion(fichajeId)
            });
        } else {
            await semanaRef.set({
                userId: userId,
                semanaInicio: semanaInicioTimestamp,
                semanaFin: semanaFinTimestamp,
                horasTotales: horasCalculadas.horasSemanaActual,
                fichajes: [fichajeId]
            });
        }
        
        // Si cruza semana, actualizar semana siguiente
        if (horasCalculadas.horasSemanaSiguiente > 0) {
            const siguienteSemanaInicio = new Date(semanaFin);
            siguienteSemanaInicio.setDate(siguienteSemanaInicio.getDate() + 1);
            siguienteSemanaInicio.setHours(0, 0, 0, 0);
            const siguienteSemanaFin = getWeekEnd(siguienteSemanaInicio);
            
            const siguienteSemanaRef = db.collection('semanas').doc(`${userId}_${firebase.firestore.Timestamp.fromDate(siguienteSemanaInicio).toMillis()}`);
            const siguienteSemanaDoc = await siguienteSemanaRef.get();
            
            if (siguienteSemanaDoc.exists) {
                await siguienteSemanaRef.update({
                    horasTotales: firebase.firestore.FieldValue.increment(horasCalculadas.horasSemanaSiguiente)
                });
            } else {
                await siguienteSemanaRef.set({
                    userId: userId,
                    semanaInicio: firebase.firestore.Timestamp.fromDate(siguienteSemanaInicio),
                    semanaFin: firebase.firestore.Timestamp.fromDate(siguienteSemanaFin),
                    horasTotales: horasCalculadas.horasSemanaSiguiente,
                    fichajes: []
                });
            }
        }
    } catch (error) {
        console.error('Error actualizando resumen de semanas:', error);
        // No lanzar error para no interrumpir el fichaje
    }
}

/**
 * Obtiene los fichajes del día actual
 * @param {string} userId - ID del usuario
 * @returns {Promise<Array>} - Array de fichajes del día
 */
async function getFichajesHoy(userId) {
    try {
        const hoy = getCurrentDatePeru();
        hoy.setHours(0, 0, 0, 0);
        const manana = new Date(hoy);
        manana.setDate(manana.getDate() + 1);
        
        const fichajesRef = db.collection('fichajes');
        const snapshot = await fichajesRef
            .where('userId', '==', userId)
            .where('entrada', '>=', firebase.firestore.Timestamp.fromDate(hoy))
            .where('entrada', '<', firebase.firestore.Timestamp.fromDate(manana))
            .orderBy('entrada', 'desc')
            .get();
        
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error obteniendo fichajes de hoy:', error);
        throw error;
    }
}

/**
 * Formatea una fecha para mostrar
 * @param {Date|Timestamp} date - Fecha a formatear
 * @returns {string} - Fecha formateada
 */
function formatDate(date) {
    if (date && date.toDate) {
        date = date.toDate();
    }
    return date.toLocaleString('es-PE', { 
        timeZone: TIMEZONE_PERU,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Formatea horas para mostrar
 * @param {number} horas - Horas a formatear
 * @returns {string} - Horas formateadas
 */
function formatHoras(horas) {
    const h = Math.floor(horas);
    const m = Math.floor((horas - h) * 60);
    return `${h}h ${m}m`;
}

