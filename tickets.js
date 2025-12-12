// Funciones para gestión de tickets de dinero

/**
 * Genera un ID único para un ticket (TICKET001, TICKET002, etc.)
 * @returns {Promise<string>} - ID del ticket
 */
async function generarTicketId() {
    await ensureDb();
    
    try {
        // Obtener el último ticket para generar el siguiente número
        const snapshot = await db.collection('tickets_dinero')
            .orderBy('fechaCreacion', 'desc')
            .limit(1)
            .get();
        
        let siguienteNumero = 1;
        
        if (!snapshot.empty) {
            const ultimoTicket = snapshot.docs[0].data();
            const ultimoId = ultimoTicket.ticketId || '';
            const match = ultimoId.match(/TICKET(\d+)/);
            if (match) {
                siguienteNumero = parseInt(match[1]) + 1;
            }
        }
        
        return `TICKET${String(siguienteNumero).padStart(3, '0')}`;
    } catch (error) {
        console.error('Error generando ticket ID:', error);
        throw error;
    }
}

/**
 * Crea un nuevo ticket de dinero
 * @param {string} dealerId - ID del dealer
 * @param {string} vendedorId - ID del vendedor
 * @param {number} montoAprox - Monto aproximado (opcional)
 * @param {Array} entregasRelacionadas - IDs de entregas relacionadas (opcional)
 * @returns {Promise<string>} - ID del ticket creado
 */
async function crearTicketDinero(dealerId, vendedorId, montoAprox = null, entregasRelacionadas = []) {
    await ensureDb();
    
    if (!esDealer()) {
        throw new Error('Solo los dealers pueden crear tickets de dinero');
    }
    
    const currentUser = getCurrentUser();
    if (currentUser.id !== dealerId) {
        throw new Error('No puedes crear tickets en nombre de otro dealer');
    }
    
    try {
        // Obtener datos del vendedor
        const vendedorDoc = await db.collection('users').doc(vendedorId).get();
        if (!vendedorDoc.exists) {
            throw new Error('Vendedor no encontrado');
        }
        const vendedorData = vendedorDoc.data();
        
        const ticketId = await generarTicketId();
        
        const ticketData = {
            ticketId,
            dealerId,
            dealerNombre: `${currentUser.nombre} ${currentUser.apellido}`,
            vendedorId,
            vendedorNombre: `${vendedorData.nombre} ${vendedorData.apellido}`,
            montoAprox: montoAprox || null,
            montoEntregado: null,
            estado: 'pendiente',
            fechaCreacion: firebase.firestore.FieldValue.serverTimestamp(),
            fechaConfirmacion: null,
            entregasRelacionadas: entregasRelacionadas || []
        };
        
        const docRef = await db.collection('tickets_dinero').add(ticketData);
        return docRef.id;
    } catch (error) {
        console.error('Error creando ticket de dinero:', error);
        throw error;
    }
}

/**
 * Confirma un ticket de dinero (vendedor)
 * @param {string} ticketId - ID del ticket
 * @param {number} montoEntregado - Monto que el vendedor confirma haber entregado
 * @returns {Promise<void>}
 */
async function confirmarTicketDinero(ticketId, montoEntregado) {
    await ensureDb();
    
    if (!esVendedor()) {
        throw new Error('Solo los vendedores pueden confirmar tickets');
    }
    
    const currentUser = getCurrentUser();
    
    if (!montoEntregado || montoEntregado <= 0) {
        throw new Error('El monto debe ser mayor a 0');
    }
    
    try {
        const ticketRef = db.collection('tickets_dinero').doc(ticketId);
        const ticketDoc = await ticketRef.get();
        
        if (!ticketDoc.exists) {
            throw new Error('Ticket no encontrado');
        }
        
        const ticketData = ticketDoc.data();
        
        if (ticketData.vendedorId !== currentUser.id) {
            throw new Error('Este ticket no es para ti');
        }
        
        if (ticketData.estado !== 'pendiente') {
            throw new Error('Este ticket ya fue procesado');
        }
        
        await ticketRef.update({
            montoEntregado,
            estado: 'confirmado',
            fechaConfirmacion: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Actualizar metas del vendedor
        await actualizarMeta(currentUser.id, montoEntregado);
    } catch (error) {
        console.error('Error confirmando ticket:', error);
        throw error;
    }
}

/**
 * Obtiene todos los tickets creados por un dealer
 * @param {string} dealerId - ID del dealer
 * @returns {Promise<Array>} - Array de tickets
 */
async function obtenerTicketsPorDealer(dealerId) {
    await ensureDb();
    
    try {
        const snapshot = await db.collection('tickets_dinero')
            .where('dealerId', '==', dealerId)
            .orderBy('fechaCreacion', 'desc')
            .get();
        
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error obteniendo tickets por dealer:', error);
        throw error;
    }
}

/**
 * Obtiene todos los tickets de un vendedor
 * @param {string} vendedorId - ID del vendedor
 * @returns {Promise<Array>} - Array de tickets
 */
async function obtenerTicketsPorVendedor(vendedorId) {
    await ensureDb();
    
    try {
        const snapshot = await db.collection('tickets_dinero')
            .where('vendedorId', '==', vendedorId)
            .orderBy('fechaCreacion', 'desc')
            .get();
        
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error obteniendo tickets por vendedor:', error);
        throw error;
    }
}

/**
 * Obtiene todos los tickets pendientes de un vendedor
 * @param {string} vendedorId - ID del vendedor
 * @returns {Promise<Array>} - Array de tickets pendientes
 */
async function obtenerTicketsPendientesVendedor(vendedorId) {
    await ensureDb();
    
    try {
        const snapshot = await db.collection('tickets_dinero')
            .where('vendedorId', '==', vendedorId)
            .where('estado', '==', 'pendiente')
            .orderBy('fechaCreacion', 'desc')
            .get();
        
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error obteniendo tickets pendientes:', error);
        throw error;
    }
}

/**
 * Obtiene el dinero entregado hoy por un vendedor
 * @param {string} vendedorId - ID del vendedor
 * @returns {Promise<number>} - Monto total entregado hoy
 */
async function obtenerDineroEntregadoHoy(vendedorId) {
    await ensureDb();
    
    try {
        const fechaActual = getFechaActualPeru();
        const fechaInicio = new Date(fechaActual + 'T00:00:00-05:00');
        const fechaFin = new Date(fechaActual + 'T23:59:59-05:00');
        
        const snapshot = await db.collection('tickets_dinero')
            .where('vendedorId', '==', vendedorId)
            .where('estado', '==', 'confirmado')
            .get();
        
        let total = 0;
        snapshot.forEach(doc => {
            const ticket = doc.data();
            const fechaConfirmacion = ticket.fechaConfirmacion?.toDate();
            if (fechaConfirmacion && fechaConfirmacion >= fechaInicio && fechaConfirmacion <= fechaFin) {
                total += ticket.montoEntregado || 0;
            }
        });
        
        return total;
    } catch (error) {
        console.error('Error obteniendo dinero entregado hoy:', error);
        throw error;
    }
}

/**
 * Obtiene el dinero entregado esta semana por un vendedor
 * @param {string} vendedorId - ID del vendedor
 * @returns {Promise<number>} - Monto total entregado esta semana
 */
async function obtenerDineroEntregadoSemana(vendedorId) {
    await ensureDb();
    
    try {
        const semanaActual = getSemanaActual();
        const [año, numSemana] = semanaActual.split('-');
        const fechaInicio = getFechaInicioSemana(parseInt(año), parseInt(numSemana));
        const fechaFin = new Date(fechaInicio);
        fechaFin.setDate(fechaFin.getDate() + 6);
        fechaFin.setHours(23, 59, 59, 999);
        
        const snapshot = await db.collection('tickets_dinero')
            .where('vendedorId', '==', vendedorId)
            .where('estado', '==', 'confirmado')
            .get();
        
        let total = 0;
        snapshot.forEach(doc => {
            const ticket = doc.data();
            const fechaConfirmacion = ticket.fechaConfirmacion?.toDate();
            if (fechaConfirmacion && fechaConfirmacion >= fechaInicio && fechaConfirmacion <= fechaFin) {
                total += ticket.montoEntregado || 0;
            }
        });
        
        return total;
    } catch (error) {
        console.error('Error obteniendo dinero entregado esta semana:', error);
        throw error;
    }
}

