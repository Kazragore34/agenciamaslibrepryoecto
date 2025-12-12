// Funciones para gestión de metas diarias y semanales

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD (zona horaria Perú)
 * @returns {string} - Fecha en formato YYYY-MM-DD
 */
function getFechaActualPeru() {
    const ahora = new Date();
    const peruOffset = -5 * 60; // UTC-5
    const utc = ahora.getTime() + (ahora.getTimezoneOffset() * 60000);
    const fechaPeru = new Date(utc + (peruOffset * 60000));
    
    const año = fechaPeru.getFullYear();
    const mes = String(fechaPeru.getMonth() + 1).padStart(2, '0');
    const dia = String(fechaPeru.getDate()).padStart(2, '0');
    
    return `${año}-${mes}-${dia}`;
}

/**
 * Obtiene el número de semana del año (formato YYYY-WW)
 * @param {Date} fecha - Fecha (opcional, usa hoy si no se proporciona)
 * @returns {string} - Semana en formato YYYY-WW
 */
function getSemanaActual(fecha = null) {
    const fechaUsar = fecha || new Date();
    const peruOffset = -5 * 60;
    const utc = fechaUsar.getTime() + (fechaUsar.getTimezoneOffset() * 60000);
    const fechaPeru = new Date(utc + (peruOffset * 60000));
    
    const año = fechaPeru.getFullYear();
    const inicioAño = new Date(año, 0, 1);
    const dias = Math.floor((fechaPeru - inicioAño) / (24 * 60 * 60 * 1000));
    const semana = Math.ceil((dias + inicioAño.getDay() + 1) / 7);
    
    return `${año}-${String(semana).padStart(2, '0')}`;
}

/**
 * Calcula el progreso de la meta diaria
 * @param {string} userId - ID del usuario
 * @param {string} fecha - Fecha en formato YYYY-MM-DD (opcional)
 * @returns {Promise<Object>} - Objeto con meta, dineroRecibido, dineroFaltante
 */
async function calcularMetaDiaria(userId, fecha = null) {
    await ensureDb();
    const fechaUsar = fecha || getFechaActualPeru();
    
    try {
        // Obtener todos los tickets confirmados del usuario para esta fecha
        const ticketsRef = db.collection('tickets_dinero');
        const snapshot = await ticketsRef
            .where('vendedorId', '==', userId)
            .where('estado', '==', 'confirmado')
            .get();
        
        let dineroRecibido = 0;
        const fechaInicio = new Date(fechaUsar + 'T00:00:00-05:00');
        const fechaFin = new Date(fechaUsar + 'T23:59:59-05:00');
        
        snapshot.forEach(doc => {
            const ticket = doc.data();
            const fechaConfirmacion = ticket.fechaConfirmacion?.toDate();
            if (fechaConfirmacion && fechaConfirmacion >= fechaInicio && fechaConfirmacion <= fechaFin) {
                dineroRecibido += ticket.montoEntregado || 0;
            }
        });
        
        const meta = META_DIARIA;
        const dineroFaltante = Math.max(0, meta - dineroRecibido);
        
        return {
            tipo: 'diaria',
            fecha: fechaUsar,
            meta,
            dineroRecibido,
            dineroFaltante,
            porcentaje: (dineroRecibido / meta) * 100
        };
    } catch (error) {
        console.error('Error calculando meta diaria:', error);
        throw error;
    }
}

/**
 * Calcula el progreso de la meta semanal
 * @param {string} userId - ID del usuario
 * @param {string} semana - Semana en formato YYYY-WW (opcional)
 * @returns {Promise<Object>} - Objeto con meta, dineroRecibido, dineroFaltante
 */
async function calcularMetaSemanal(userId, semana = null) {
    await ensureDb();
    const semanaUsar = semana || getSemanaActual();
    
    try {
        // Obtener todos los tickets confirmados del usuario para esta semana
        const ticketsRef = db.collection('tickets_dinero');
        const snapshot = await ticketsRef
            .where('vendedorId', '==', userId)
            .where('estado', '==', 'confirmado')
            .get();
        
        let dineroRecibido = 0;
        const [año, numSemana] = semanaUsar.split('-');
        const fechaInicio = getFechaInicioSemana(parseInt(año), parseInt(numSemana));
        const fechaFin = new Date(fechaInicio);
        fechaFin.setDate(fechaFin.getDate() + 6);
        fechaFin.setHours(23, 59, 59, 999);
        
        snapshot.forEach(doc => {
            const ticket = doc.data();
            const fechaConfirmacion = ticket.fechaConfirmacion?.toDate();
            if (fechaConfirmacion && fechaConfirmacion >= fechaInicio && fechaConfirmacion <= fechaFin) {
                dineroRecibido += ticket.montoEntregado || 0;
            }
        });
        
        const meta = META_SEMANAL;
        const dineroFaltante = Math.max(0, meta - dineroRecibido);
        
        return {
            tipo: 'semanal',
            fecha: semanaUsar,
            meta,
            dineroRecibido,
            dineroFaltante,
            porcentaje: (dineroRecibido / meta) * 100
        };
    } catch (error) {
        console.error('Error calculando meta semanal:', error);
        throw error;
    }
}

/**
 * Obtiene la fecha de inicio de una semana
 * @param {number} año - Año
 * @param {number} semana - Número de semana
 * @returns {Date} - Fecha de inicio de la semana
 */
function getFechaInicioSemana(año, semana) {
    const fecha = new Date(año, 0, 1);
    const dias = (semana - 1) * 7;
    fecha.setDate(fecha.getDate() + dias - fecha.getDay());
    return fecha;
}

/**
 * Actualiza la meta cuando se confirma un ticket
 * @param {string} userId - ID del usuario
 * @param {number} montoEntregado - Monto del ticket confirmado
 * @returns {Promise<void>}
 */
async function actualizarMeta(userId, montoEntregado) {
    await ensureDb();
    const fechaDiaria = getFechaActualPeru();
    const semanaActual = getSemanaActual();
    
    try {
        // Actualizar meta diaria
        const metaDiariaRef = db.collection('metas').doc(`${userId}_diaria_${fechaDiaria}`);
        const metaDiariaDoc = await metaDiariaRef.get();
        
        if (metaDiariaDoc.exists) {
            const data = metaDiariaDoc.data();
            await metaDiariaRef.update({
                dineroRecibido: (data.dineroRecibido || 0) + montoEntregado,
                dineroFaltante: Math.max(0, META_DIARIA - ((data.dineroRecibido || 0) + montoEntregado))
            });
        } else {
            await metaDiariaRef.set({
                userId,
                tipo: 'diaria',
                fecha: fechaDiaria,
                meta: META_DIARIA,
                dineroRecibido: montoEntregado,
                dineroFaltante: Math.max(0, META_DIARIA - montoEntregado)
            });
        }
        
        // Actualizar meta semanal
        const metaSemanalRef = db.collection('metas').doc(`${userId}_semanal_${semanaActual}`);
        const metaSemanalDoc = await metaSemanalRef.get();
        
        if (metaSemanalDoc.exists) {
            const data = metaSemanalDoc.data();
            await metaSemanalRef.update({
                dineroRecibido: (data.dineroRecibido || 0) + montoEntregado,
                dineroFaltante: Math.max(0, META_SEMANAL - ((data.dineroRecibido || 0) + montoEntregado))
            });
        } else {
            await metaSemanalRef.set({
                userId,
                tipo: 'semanal',
                fecha: semanaActual,
                meta: META_SEMANAL,
                dineroRecibido: montoEntregado,
                dineroFaltante: Math.max(0, META_SEMANAL - montoEntregado)
            });
        }
    } catch (error) {
        console.error('Error actualizando meta:', error);
        throw error;
    }
}

/**
 * Obtiene el dinero faltante para las metas del usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object>} - Objeto con dineroFaltanteDiario y dineroFaltanteSemanal
 */
async function obtenerDineroFaltante(userId) {
    try {
        const metaDiaria = await calcularMetaDiaria(userId);
        const metaSemanal = await calcularMetaSemanal(userId);
        
        return {
            diaria: metaDiaria.dineroFaltante,
            semanal: metaSemanal.dineroFaltante,
            porcentajeDiario: metaDiaria.porcentaje,
            porcentajeSemanal: metaSemanal.porcentaje
        };
    } catch (error) {
        console.error('Error obteniendo dinero faltante:', error);
        throw error;
    }
}

