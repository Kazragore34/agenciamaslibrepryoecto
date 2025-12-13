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
async function crearTicketDinero(sargentoId, prospectId, montoAprox = null, entregasRelacionadas = []) {
    await ensureDb();
    
    const currentUser = getCurrentUser();
    
    // Permitir que sargentos y admins creen tickets normalmente
    if (esSargentoOAdmin()) {
        if (currentUser.id !== sargentoId) {
            throw new Error('No puedes crear tickets en nombre de otro sargento');
        }
    } else {
        // Permitir que prospects crean tickets para sí mismos
        if (currentUser.id !== prospectId) {
            throw new Error('No puedes crear tickets en nombre de otro prospect');
        }
    }
    
    try {
        // Obtener datos del prospect
        const prospectDoc = await db.collection('users').doc(prospectId).get();
        if (!prospectDoc.exists) {
            throw new Error('Prospect no encontrado');
        }
        const prospectData = prospectDoc.data();
        
        const ticketId = await generarTicketId();
        
        const ticketData = {
            ticketId,
            dealerId: sargentoId, // Mantener nombre de campo para compatibilidad
            dealerNombre: `${currentUser.nombre} ${currentUser.apellido}`,
            vendedorId: prospectId, // Mantener nombre de campo para compatibilidad
            vendedorNombre: `${prospectData.nombre} ${prospectData.apellido}`,
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
 * Crea un ticket de dinero desde el vendedor (y lo confirma automáticamente)
 * @param {string} dealerId - ID del dealer
 * @param {string} vendedorId - ID del vendedor
 * @param {number} montoEntregado - Monto que el vendedor entrega
 * @param {Array} entregasRelacionadas - IDs de entregas relacionadas
 * @returns {Promise<string>} - ID del ticket creado
 */
async function crearTicketDineroVendedorConAprox(sargentoId, prospectId, montoEntregado, montoAprox = null, entregasRelacionadas = []) {
    await ensureDb();
    
    if (!esProspect()) {
        throw new Error('Solo los prospects pueden crear tickets de dinero');
    }
    
    const currentUser = getCurrentUser();
    if (currentUser.id !== prospectId) {
        throw new Error('No puedes crear tickets en nombre de otro prospect');
    }
    
    try {
        // Obtener datos del sargento
        const sargentoDoc = await db.collection('users').doc(sargentoId).get();
        if (!sargentoDoc.exists) {
            throw new Error('Sargento no encontrado');
        }
        const sargentoData = sargentoDoc.data();
        
        const ticketId = await generarTicketId();
        
        const ticketData = {
            ticketId,
            dealerId: sargentoId, // Mantener nombre de campo para compatibilidad
            dealerNombre: `${sargentoData.nombre} ${sargentoData.apellido}`,
            vendedorId: prospectId, // Mantener nombre de campo para compatibilidad
            vendedorNombre: `${currentUser.nombre} ${currentUser.apellido}`,
            montoAprox: montoAprox,
            montoEntregado,
            estado: 'pendiente_dealer', // El dealer debe confirmar
            fechaCreacion: firebase.firestore.FieldValue.serverTimestamp(),
            fechaConfirmacionVendedor: firebase.firestore.FieldValue.serverTimestamp(),
            entregasRelacionadas: entregasRelacionadas || []
        };
        
        const docRef = await db.collection('tickets_dinero').add(ticketData);
        
        // NO actualizar metas todavía, esperar confirmación del dealer
        
        return docRef.id;
    } catch (error) {
        console.error('Error creando ticket de dinero desde vendedor:', error);
        throw error;
    }
}

async function crearTicketDineroVendedor(sargentoId, prospectId, montoEntregado, entregasRelacionadas = []) {
    await ensureDb();
    
    const currentUser = getCurrentUser();
    if (currentUser.id !== prospectId) {
        throw new Error('No puedes crear tickets en nombre de otro prospect');
    }
    
    if (!montoEntregado || montoEntregado <= 0) {
        throw new Error('El monto debe ser mayor a 0');
    }
    
    try {
        // Obtener datos del sargento
        const sargentoDoc = await db.collection('users').doc(sargentoId).get();
        if (!sargentoDoc.exists) {
            throw new Error('Sargento no encontrado');
        }
        const sargentoData = sargentoDoc.data();
        
        const ticketId = await generarTicketId();
        
        const ticketData = {
            ticketId,
            dealerId: sargentoId, // Mantener nombre de campo para compatibilidad
            dealerNombre: `${sargentoData.nombre} ${sargentoData.apellido}`,
            vendedorId: prospectId, // Mantener nombre de campo para compatibilidad
            vendedorNombre: `${currentUser.nombre} ${currentUser.apellido}`,
            montoAprox: null,
            montoEntregado,
            estado: 'pendiente_dealer', // El dealer debe confirmar
            fechaCreacion: firebase.firestore.FieldValue.serverTimestamp(),
            fechaConfirmacionVendedor: firebase.firestore.FieldValue.serverTimestamp(),
            entregasRelacionadas: entregasRelacionadas || []
        };
        
        const docRef = await db.collection('tickets_dinero').add(ticketData);
        
        // NO actualizar metas todavía, esperar confirmación del dealer
        
        return docRef.id;
    } catch (error) {
        console.error('Error creando ticket de dinero desde vendedor:', error);
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
    
    // Tanto dealers como vendedores pueden confirmar tickets
    const currentUser = getCurrentUser();
    if (!currentUser) {
        throw new Error('No hay usuario autenticado');
    }
    
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
            estado: 'pendiente_dealer', // Primero el vendedor confirma, luego el dealer debe confirmar
            fechaConfirmacionVendedor: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // NO actualizar metas todavía, esperar confirmación del dealer
    } catch (error) {
        console.error('Error confirmando ticket:', error);
        throw error;
    }
}

/**
 * Confirma un ticket de dinero (sargento/dealer)
 * Esta función es llamada cuando un sargento confirma que recibió el dinero del prospect
 * @param {string} ticketId - ID del ticket
 * @returns {Promise<void>}
 */
async function confirmarTicketDineroDealer(ticketId) {
    await ensureDb();
    
    if (!esSargentoOAdmin()) {
        throw new Error('Solo los sargentos y administradores pueden confirmar tickets de dinero');
    }
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
        throw new Error('No hay usuario autenticado');
    }
    
    try {
        const ticketRef = db.collection('tickets_dinero').doc(ticketId);
        const ticketDoc = await ticketRef.get();
        
        if (!ticketDoc.exists) {
            throw new Error('Ticket no encontrado');
        }
        
        const ticketData = ticketDoc.data();
        
        // Verificar que el ticket es para este sargento
        if (ticketData.dealerId !== currentUser.id) {
            throw new Error('Este ticket no es para ti');
        }
        
        // Verificar que el ticket está pendiente de confirmación del dealer
        if (ticketData.estado !== 'pendiente_dealer') {
            throw new Error('Este ticket ya fue procesado o no está pendiente de tu confirmación');
        }
        
        // Actualizar el ticket a confirmado
        await ticketRef.update({
            estado: 'confirmado',
            fechaConfirmacion: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Actualizar metas del prospect (vendedor)
        if (ticketData.montoEntregado && ticketData.montoEntregado > 0) {
            await actualizarMeta(ticketData.vendedorId, 'diaria', ticketData.montoEntregado);
            await actualizarMeta(ticketData.vendedorId, 'semanal', ticketData.montoEntregado);
        }
        
    } catch (error) {
        console.error('Error confirmando ticket de dinero (dealer):', error);
        throw error;
    }
}

/**
 * Rechaza un ticket de dinero (sargento/dealer)
 * Esta función es llamada cuando un sargento rechaza el monto entregado por el prospect
 * @param {string} ticketId - ID del ticket
 * @param {string} motivo - Motivo del rechazo (opcional)
 * @returns {Promise<void>}
 */
async function rechazarTicketDineroDealer(ticketId, motivo = '') {
    await ensureDb();
    
    if (!esSargentoOAdmin()) {
        throw new Error('Solo los sargentos y administradores pueden rechazar tickets de dinero');
    }
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
        throw new Error('No hay usuario autenticado');
    }
    
    try {
        const ticketRef = db.collection('tickets_dinero').doc(ticketId);
        const ticketDoc = await ticketRef.get();
        
        if (!ticketDoc.exists) {
            throw new Error('Ticket no encontrado');
        }
        
        const ticketData = ticketDoc.data();
        
        // Verificar que el ticket es para este sargento
        if (ticketData.dealerId !== currentUser.id) {
            throw new Error('Este ticket no es para ti');
        }
        
        // Verificar que el ticket está pendiente de confirmación del dealer
        if (ticketData.estado !== 'pendiente_dealer') {
            throw new Error('Este ticket ya fue procesado o no está pendiente de tu confirmación');
        }
        
        // Actualizar el ticket a rechazado
        await ticketRef.update({
            estado: 'rechazado',
            motivoRechazo: motivo || null,
            fechaRechazo: firebase.firestore.FieldValue.serverTimestamp()
        });
        
    } catch (error) {
        console.error('Error rechazando ticket de dinero (dealer):', error);
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
        // Obtener todos los tickets del dealer y ordenar en el cliente
        // para evitar problemas con índices compuestos
        const snapshot = await db.collection('tickets_dinero')
            .where('dealerId', '==', dealerId)
            .get();
        
        const tickets = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        // Ordenar por fecha de creación (más recientes primero)
        tickets.sort((a, b) => {
            const fechaA = a.fechaCreacion?.toDate() || new Date(0);
            const fechaB = b.fechaCreacion?.toDate() || new Date(0);
            return fechaB - fechaA;
        });
        
        return tickets;
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
        // Obtener todos los tickets del vendedor y ordenar en el cliente
        // para evitar problemas con índices compuestos
        const snapshot = await db.collection('tickets_dinero')
            .where('vendedorId', '==', vendedorId)
            .get();
        
        const tickets = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        // Ordenar por fecha de creación (más recientes primero)
        tickets.sort((a, b) => {
            const fechaA = a.fechaCreacion?.toDate() || new Date(0);
            const fechaB = b.fechaCreacion?.toDate() || new Date(0);
            return fechaB - fechaA;
        });
        
        return tickets;
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

/**
 * Crea un depósito de dinero negro
 * @param {Object} importes - Objeto con los importes por tipo de dinero negro { tipoId: importe }
 * @returns {Promise<string>} - ID del depósito creado
 */
async function crearDepositoDineroNegro(importes) {
    await ensureDb();
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
        throw new Error('No hay usuario autenticado');
    }
    
    // Verificar que haya al menos un importe mayor a 0
    const tieneImportes = Object.values(importes).some(importe => importe > 0);
    if (!tieneImportes) {
        throw new Error('Debes agregar al menos un importe para registrar el depósito');
    }
    
    try {
        console.log('=== crearDepositoDineroNegro ===');
        console.log('importes recibidos:', importes);
        console.log('TIPOS_DINERO_NEGRO disponible?:', typeof TIPOS_DINERO_NEGRO !== 'undefined');
        
        if (typeof TIPOS_DINERO_NEGRO === 'undefined') {
            throw new Error('TIPOS_DINERO_NEGRO no está definido. Asegúrate de que productos.js esté cargado antes de tickets.js');
        }
        
        // Convertir importes a array de objetos con tipo y monto
        const detallesDeposito = [];
        Object.keys(importes).forEach(tipoId => {
            if (importes[tipoId] > 0) {
                const tipo = TIPOS_DINERO_NEGRO.find(t => t.id === tipoId);
                console.log(`Buscando tipo ${tipoId}:`, tipo);
                if (tipo) {
                    detallesDeposito.push({
                        tipoId: tipoId,
                        tipoNombre: tipo.nombre,
                        monto: parseFloat(importes[tipoId])
                    });
                } else {
                    console.warn(`Tipo ${tipoId} no encontrado en TIPOS_DINERO_NEGRO`);
                }
            }
        });
        
        console.log('detallesDeposito:', detallesDeposito);
        
        // Calcular monto total
        const montoTotal = detallesDeposito.reduce((sum, detalle) => sum + detalle.monto, 0);
        
        const depositoData = {
            usuarioId: currentUser.id,
            usuarioNombre: `${currentUser.nombre} ${currentUser.apellido}`,
            usuarioRol: currentUser.rol,
            detalles: detallesDeposito,
            montoTotal,
            estado: 'pendiente',
            fechaCreacion: firebase.firestore.FieldValue.serverTimestamp(),
            fechaAprobacion: null,
            sargentoAprobo: null,
            sargentoNombreAprobo: null,
            motivoRechazo: null,
            sargentoRechazo: null,
            sargentoNombreRechazo: null,
            fechaRechazo: null
        };
        
        const docRef = await db.collection('depositos_dinero_negro').add(depositoData);
        return docRef.id;
    } catch (error) {
        console.error('Error creando depósito de dinero negro:', error);
        throw error;
    }
}

/**
 * Obtiene todos los depósitos de dinero negro pendientes
 * @returns {Promise<Array>} - Array de depósitos pendientes
 */
async function obtenerDepositosPendientes() {
    await ensureDb();
    
    if (!esSargentoOAdmin()) {
        throw new Error('Solo los sargentos y administradores pueden ver depósitos pendientes');
    }
    
    try {
        const snapshot = await db.collection('depositos_dinero_negro')
            .where('estado', '==', 'pendiente')
            .orderBy('fechaCreacion', 'desc')
            .get();
        
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error obteniendo depósitos pendientes:', error);
        throw error;
    }
}

/**
 * Aprueba un depósito de dinero negro
 * @param {string} depositoId - ID del depósito
 * @returns {Promise<void>}
 */
async function aprobarDepositoDineroNegro(depositoId) {
    await ensureDb();
    
    if (!esSargentoOAdmin()) {
        throw new Error('Solo los sargentos y administradores pueden aprobar depósitos');
    }
    
    const currentUser = getCurrentUser();
    
    try {
        const depositoRef = db.collection('depositos_dinero_negro').doc(depositoId);
        const depositoDoc = await depositoRef.get();
        
        if (!depositoDoc.exists) {
            throw new Error('Depósito no encontrado');
        }
        
        const depositoData = depositoDoc.data();
        
        if (depositoData.estado !== 'pendiente') {
            throw new Error('Este depósito ya fue procesado');
        }
        
        await depositoRef.update({
            estado: 'aprobado',
            fechaAprobacion: firebase.firestore.FieldValue.serverTimestamp(),
            sargentoAprobo: currentUser.id,
            sargentoNombreAprobo: `${currentUser.nombre} ${currentUser.apellido}`
        });
        
        // Actualizar metas del usuario
        await actualizarMeta(depositoData.usuarioId, depositoData.montoTotal);
    } catch (error) {
        console.error('Error aprobando depósito:', error);
        throw error;
    }
}

/**
 * Rechaza un depósito de dinero negro
 * @param {string} depositoId - ID del depósito
 * @param {string} motivo - Motivo del rechazo
 * @returns {Promise<void>}
 */
async function rechazarDepositoDineroNegro(depositoId, motivo = '') {
    await ensureDb();
    
    if (!esSargentoOAdmin()) {
        throw new Error('Solo los sargentos y administradores pueden rechazar depósitos');
    }
    
    const currentUser = getCurrentUser();
    
    try {
        const depositoRef = db.collection('depositos_dinero_negro').doc(depositoId);
        const depositoDoc = await depositoRef.get();
        
        if (!depositoDoc.exists) {
            throw new Error('Depósito no encontrado');
        }
        
        const depositoData = depositoDoc.data();
        
        if (depositoData.estado !== 'pendiente') {
            throw new Error('Este depósito ya fue procesado');
        }
        
        await depositoRef.update({
            estado: 'rechazado',
            fechaRechazo: firebase.firestore.FieldValue.serverTimestamp(),
            sargentoRechazo: currentUser.id,
            sargentoNombreRechazo: `${currentUser.nombre} ${currentUser.apellido}`,
            motivoRechazo: motivo || 'Sin motivo especificado'
        });
    } catch (error) {
        console.error('Error rechazando depósito:', error);
        throw error;
    }
}

