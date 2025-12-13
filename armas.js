// Funciones para gestión de entregas de armas

/**
 * Crea una nueva entrega de arma
 * @param {string} sargentoId - ID del sargento que entrega
 * @param {string} prospectId - ID del prospect que recibe
 * @param {string} tipoArma - Tipo de arma (SNS, MK2, VINTAGE, .50, AP_PISTOL)
 * @param {boolean} chaleco - Si se entrega chaleco
 * @param {number} cantidadBalas - Cantidad de balas iniciales
 * @returns {Promise<string>} - ID de la entrega de arma creada
 */
async function crearEntregaArma(sargentoId, prospectId, tipoArma, chaleco = false, cantidadBalas = 0) {
    await ensureDb();
    
    if (!esSargentoOAdmin()) {
        throw new Error('Solo los sargentos y administradores pueden crear entregas de armas');
    }
    
    const currentUser = getCurrentUser();
    if (currentUser.id !== sargentoId) {
        throw new Error('No puedes crear entregas en nombre de otro sargento');
    }
    
    // Un sargento no puede darse armas a sí mismo
    if (sargentoId === prospectId) {
        throw new Error('Un sargento no puede darse armas a sí mismo. Otro sargento debe entregártelas.');
    }
    
    if (!TIPOS_ARMAS.includes(tipoArma)) {
        throw new Error('Tipo de arma inválido');
    }
    
    try {
        // Obtener datos del prospect
        const prospectDoc = await db.collection('users').doc(prospectId).get();
        if (!prospectDoc.exists) {
            throw new Error('Prospect no encontrado');
        }
        const prospectData = prospectDoc.data();
        
        const entregaData = {
            dealerId: sargentoId, // Mantener nombre de campo para compatibilidad
            dealerNombre: `${currentUser.nombre} ${currentUser.apellido}`,
            vendedorId: prospectId, // Mantener nombre de campo para compatibilidad
            vendedorNombre: `${prospectData.nombre} ${prospectData.apellido}`,
            tipoArma,
            chaleco,
            cantidadBalasInicial: cantidadBalas || 0,
            cantidadBalasActual: cantidadBalas || 0,
            estado: 'activa',
            motivoPerdida: null,
            solicitudesBalas: [],
            fechaCreacion: firebase.firestore.FieldValue.serverTimestamp(),
            fechaPerdida: null
        };
        
        const docRef = await db.collection('entregas_armas').add(entregaData);
        return docRef.id;
    } catch (error) {
        console.error('Error creando entrega de arma:', error);
        throw error;
    }
}

/**
 * Solicita recarga de balas (vendedor)
 * @param {string} armaId - ID de la entrega de arma
 * @param {number} cantidad - Cantidad de balas solicitadas
 * @returns {Promise<void>}
 */
async function solicitarRecargaBalas(armaId, cantidad) {
    await ensureDb();
    
    if (!esProspect()) {
        throw new Error('Solo los prospects pueden solicitar recarga de balas');
    }
    
    const currentUser = getCurrentUser();
    
    if (!cantidad || cantidad <= 0) {
        throw new Error('La cantidad debe ser mayor a 0');
    }
    
    try {
        const armaRef = db.collection('entregas_armas').doc(armaId);
        const armaDoc = await armaRef.get();
        
        if (!armaDoc.exists) {
            throw new Error('Arma no encontrada');
        }
        
        const armaData = armaDoc.data();
        
        if (armaData.vendedorId !== currentUser.id) {
            throw new Error('Esta arma no es tuya');
        }
        
        if (armaData.estado !== 'activa') {
            throw new Error('No puedes solicitar balas para un arma perdida');
        }
        
        const solicitud = {
            fecha: firebase.firestore.FieldValue.serverTimestamp(),
            cantidad,
            estado: 'pendiente'
        };
        
        const solicitudesBalas = armaData.solicitudesBalas || [];
        solicitudesBalas.push(solicitud);
        
        await armaRef.update({
            solicitudesBalas
        });
    } catch (error) {
        console.error('Error solicitando recarga de balas:', error);
        throw error;
    }
}

/**
 * Marca una solicitud de balas como entregada (dealer)
 * @param {string} armaId - ID de la entrega de arma
 * @param {number} solicitudIndex - Índice de la solicitud en el array
 * @returns {Promise<void>}
 */
async function entregarBalas(armaId, solicitudIndex) {
    await ensureDb();
    
    if (!esSargentoOAdmin()) {
        throw new Error('Solo los sargentos y administradores pueden entregar balas');
    }
    
    const currentUser = getCurrentUser();
    
    try {
        const armaRef = db.collection('entregas_armas').doc(armaId);
        const armaDoc = await armaRef.get();
        
        if (!armaDoc.exists) {
            throw new Error('Arma no encontrada');
        }
        
        const armaData = armaDoc.data();
        
        // Cualquier sargento puede confirmar solicitudes de balas, no solo el que entregó el arma
        // Removida la validación: if (armaData.dealerId !== currentUser.id)
        
        const solicitudesBalas = armaData.solicitudesBalas || [];
        
        if (solicitudIndex < 0 || solicitudIndex >= solicitudesBalas.length) {
            throw new Error('Índice de solicitud inválido');
        }
        
        if (solicitudesBalas[solicitudIndex].estado === 'entregada') {
            throw new Error('Esta solicitud ya fue entregada');
        }
        
        // Actualizar la solicitud con información del sargento que confirmó
        solicitudesBalas[solicitudIndex].estado = 'entregada';
        solicitudesBalas[solicitudIndex].sargentoConfirmo = currentUser.id;
        solicitudesBalas[solicitudIndex].sargentoNombre = `${currentUser.nombre} ${currentUser.apellido}`;
        solicitudesBalas[solicitudIndex].fechaConfirmacion = firebase.firestore.FieldValue.serverTimestamp();
        
        const cantidadEntregada = solicitudesBalas[solicitudIndex].cantidad || 0;
        
        // Actualizar cantidad de balas actual
        const cantidadBalasActual = (armaData.cantidadBalasActual || armaData.cantidadBalasInicial || 0) + cantidadEntregada;
        
        await armaRef.update({
            solicitudesBalas,
            cantidadBalasActual
        });
    } catch (error) {
        console.error('Error entregando balas:', error);
        throw error;
    }
}

/**
 * Marca un arma como perdida (dealer)
 * @param {string} armaId - ID de la entrega de arma
 * @param {string} motivo - Motivo de la pérdida
 * @returns {Promise<void>}
 */
async function marcarArmaPerdida(armaId, motivo) {
    await ensureDb();
    
    if (!esSargentoOAdmin()) {
        throw new Error('Solo los sargentos y administradores pueden marcar armas como perdidas');
    }
    
    const currentUser = getCurrentUser();
    
    const motivosValidos = MOTIVOS_PERDIDA.map(m => m.valor);
    if (!motivosValidos.includes(motivo)) {
        throw new Error('Motivo de pérdida inválido');
    }
    
    try {
        const armaRef = db.collection('entregas_armas').doc(armaId);
        const armaDoc = await armaRef.get();
        
        if (!armaDoc.exists) {
            throw new Error('Arma no encontrada');
        }
        
        const armaData = armaDoc.data();
        
        if (armaData.dealerId !== currentUser.id) {
            throw new Error('No puedes marcar armas de otros dealers como perdidas');
        }
        
        if (armaData.estado === 'perdida') {
            throw new Error('Esta arma ya está marcada como perdida');
        }
        
        await armaRef.update({
            estado: 'perdida',
            motivoPerdida: motivo,
            fechaPerdida: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error('Error marcando arma como perdida:', error);
        throw error;
    }
}

/**
 * Obtiene todas las armas entregadas por un dealer
 * @param {string} dealerId - ID del dealer
 * @returns {Promise<Array>} - Array de armas
 */
async function obtenerArmasPorDealer(dealerId) {
    await ensureDb();
    
    try {
        // Obtener todas las armas del dealer y ordenar en el cliente
        // para evitar problemas con índices compuestos
        const snapshot = await db.collection('entregas_armas')
            .where('dealerId', '==', dealerId)
            .get();
        
        const armas = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        // Ordenar por fecha de creación (más recientes primero)
        armas.sort((a, b) => {
            const fechaA = a.fechaCreacion?.toDate() || new Date(0);
            const fechaB = b.fechaCreacion?.toDate() || new Date(0);
            return fechaB - fechaA;
        });
        
        return armas;
    } catch (error) {
        console.error('Error obteniendo armas por dealer:', error);
        throw error;
    }
}

/**
 * Obtiene todas las armas de un vendedor
 * @param {string} vendedorId - ID del vendedor
 * @returns {Promise<Array>} - Array de armas
 */
async function obtenerArmasPorVendedor(vendedorId) {
    await ensureDb();
    
    try {
        // Obtener todas las armas del vendedor y ordenar en el cliente
        // para evitar problemas con índices compuestos
        const snapshot = await db.collection('entregas_armas')
            .where('vendedorId', '==', vendedorId)
            .get();
        
        const armas = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        // Ordenar por fecha de creación (más recientes primero)
        armas.sort((a, b) => {
            const fechaA = a.fechaCreacion?.toDate() || new Date(0);
            const fechaB = b.fechaCreacion?.toDate() || new Date(0);
            return fechaB - fechaA;
        });
        
        return armas;
    } catch (error) {
        console.error('Error obteniendo armas por vendedor:', error);
        throw error;
    }
}

/**
 * Obtiene todas las armas activas de un vendedor
 * @param {string} vendedorId - ID del vendedor
 * @returns {Promise<Array>} - Array de armas activas
 */
async function obtenerArmasActivasVendedor(vendedorId) {
    await ensureDb();
    
    try {
        // Obtener todas las armas del vendedor y filtrar por estado en el cliente
        const snapshot = await db.collection('entregas_armas')
            .where('vendedorId', '==', vendedorId)
            .get();
        
        const armas = snapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            .filter(arma => arma.estado === 'activa')
            .sort((a, b) => {
                const fechaA = a.fechaCreacion?.toDate() || new Date(0);
                const fechaB = b.fechaCreacion?.toDate() || new Date(0);
                return fechaB - fechaA;
            });
        
        return armas;
    } catch (error) {
        console.error('Error obteniendo armas activas:', error);
        throw error;
    }
}

/**
 * Obtiene todas las solicitudes de balas pendientes para un dealer
 * @param {string} dealerId - ID del dealer
 * @returns {Promise<Array>} - Array de armas con solicitudes pendientes
 */
/**
 * Obtiene todas las solicitudes de balas pendientes (cualquier sargento puede confirmarlas)
 * @returns {Promise<Array>} - Array de armas con solicitudes pendientes
 */
async function obtenerSolicitudesBalasPendientes() {
    await ensureDb();
    
    try {
        // Obtener todas las armas activas con solicitudes pendientes
        // Cualquier sargento puede confirmar, no solo el que entregó el arma
        const snapshot = await db.collection('entregas_armas')
            .where('estado', '==', 'activa')
            .get();
        
        const armasConSolicitudes = [];
        
        snapshot.forEach(doc => {
            const armaData = doc.data();
            const todasLasSolicitudes = armaData.solicitudesBalas || [];
            
            // Debug: ver todas las solicitudes
            console.log(`Arma ${doc.id}: Total solicitudes: ${todasLasSolicitudes.length}`);
            todasLasSolicitudes.forEach((s, idx) => {
                console.log(`  Solicitud ${idx}: estado=${s.estado}, cantidad=${s.cantidad}`);
            });
            
            // Filtrar solo las pendientes (verificar que el estado sea exactamente 'pendiente')
            const solicitudesPendientes = todasLasSolicitudes.filter(
                s => s && s.estado === 'pendiente'
            );
            
            console.log(`Arma ${doc.id}: Solicitudes pendientes: ${solicitudesPendientes.length}`);
            
            if (solicitudesPendientes.length > 0) {
                armasConSolicitudes.push({
                    id: doc.id,
                    ...armaData,
                    solicitudesPendientes
                });
            }
        });
        
        console.log(`Total armas con solicitudes pendientes: ${armasConSolicitudes.length}`);
        return armasConSolicitudes;
    } catch (error) {
        console.error('Error obteniendo solicitudes de balas pendientes:', error);
        throw error;
    }
}

