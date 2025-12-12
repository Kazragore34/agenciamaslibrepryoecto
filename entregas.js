// Funciones para gestión de entregas de productos

/**
 * Crea una nueva entrega de productos
 * @param {string} dealerId - ID del dealer
 * @param {string} vendedorId - ID del vendedor
 * @param {Array} productos - Array de objetos {tipo, cantidad}
 * @param {Array} itemsAdicionales - Array de objetos {tipo, cantidad} (fertilizante, maceta, regadera)
 * @param {string} notas - Notas opcionales
 * @returns {Promise<string>} - ID de la entrega creada
 */
async function crearEntregaProductos(dealerId, vendedorId, productos, itemsAdicionales = [], notas = '') {
    await ensureDb();
    
    if (!esDealer()) {
        throw new Error('Solo los dealers pueden crear entregas');
    }
    
    const currentUser = getCurrentUser();
    if (currentUser.id !== dealerId) {
        throw new Error('No puedes crear entregas en nombre de otro dealer');
    }
    
    try {
        // Obtener datos del vendedor
        const vendedorDoc = await db.collection('users').doc(vendedorId).get();
        if (!vendedorDoc.exists) {
            throw new Error('Vendedor no encontrado');
        }
        const vendedorData = vendedorDoc.data();
        
        // Calcular precio aproximado
        const precioAprox = calcularPrecioAprox(productos);
        
        // Agregar precioAprox a cada producto
        const productosConPrecio = productos.map(p => ({
            ...p,
            precioAprox: obtenerPrecioMinimo(p.tipo)
        }));
        
        const entregaData = {
            dealerId,
            dealerNombre: `${currentUser.nombre} ${currentUser.apellido}`,
            vendedorId,
            vendedorNombre: `${vendedorData.nombre} ${vendedorData.apellido}`,
            productos: productosConPrecio,
            itemsAdicionales,
            estado: 'pendiente',
            fechaCreacion: firebase.firestore.FieldValue.serverTimestamp(),
            precioAprox,
            notas: notas || ''
        };
        
        const docRef = await db.collection('entregas_productos').add(entregaData);
        return docRef.id;
    } catch (error) {
        console.error('Error creando entrega:', error);
        throw error;
    }
}

/**
 * Confirma una entrega (vendedor)
 * @param {string} entregaId - ID de la entrega
 * @returns {Promise<void>}
 */
async function confirmarEntrega(entregaId) {
    await ensureDb();
    
    // Tanto dealers como vendedores pueden confirmar entregas
    const currentUser = getCurrentUser();
    if (!currentUser) {
        throw new Error('No hay usuario autenticado');
    }
    
    try {
        const entregaRef = db.collection('entregas_productos').doc(entregaId);
        const entregaDoc = await entregaRef.get();
        
        if (!entregaDoc.exists) {
            throw new Error('Entrega no encontrada');
        }
        
        const entregaData = entregaDoc.data();
        
        if (entregaData.vendedorId !== currentUser.id) {
            throw new Error('Esta entrega no es para ti');
        }
        
        if (entregaData.estado !== 'pendiente') {
            throw new Error('Esta entrega ya fue procesada');
        }
        
        await entregaRef.update({
            estado: 'confirmado',
            fechaConfirmacion: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error('Error confirmando entrega:', error);
        throw error;
    }
}

/**
 * Rechaza una entrega (vendedor)
 * @param {string} entregaId - ID de la entrega
 * @param {string} motivo - Motivo del rechazo
 * @returns {Promise<void>}
 */
async function rechazarEntrega(entregaId, motivo) {
    await ensureDb();
    
    // Tanto dealers como vendedores pueden rechazar entregas
    const currentUser = getCurrentUser();
    if (!currentUser) {
        throw new Error('No hay usuario autenticado');
    }
    
    try {
        const entregaRef = db.collection('entregas_productos').doc(entregaId);
        const entregaDoc = await entregaRef.get();
        
        if (!entregaDoc.exists) {
            throw new Error('Entrega no encontrada');
        }
        
        const entregaData = entregaDoc.data();
        
        if (entregaData.vendedorId !== currentUser.id) {
            throw new Error('Esta entrega no es para ti');
        }
        
        if (entregaData.estado !== 'pendiente') {
            throw new Error('Esta entrega ya fue procesada');
        }
        
        await entregaRef.update({
            estado: 'rechazado',
            fechaConfirmacion: firebase.firestore.FieldValue.serverTimestamp(),
            motivoRechazo: motivo
        });
    } catch (error) {
        console.error('Error rechazando entrega:', error);
        throw error;
    }
}

/**
 * Elimina una entrega pendiente (dealer)
 * @param {string} entregaId - ID de la entrega
 * @returns {Promise<void>}
 */
async function eliminarEntrega(entregaId) {
    await ensureDb();
    
    if (!esDealer()) {
        throw new Error('Solo los dealers pueden eliminar entregas');
    }
    
    const currentUser = getCurrentUser();
    
    try {
        const entregaRef = db.collection('entregas_productos').doc(entregaId);
        const entregaDoc = await entregaRef.get();
        
        if (!entregaDoc.exists) {
            throw new Error('Entrega no encontrada');
        }
        
        const entregaData = entregaDoc.data();
        
        if (entregaData.dealerId !== currentUser.id) {
            throw new Error('No puedes eliminar entregas de otros dealers');
        }
        
        if (entregaData.estado !== 'pendiente') {
            throw new Error('Solo se pueden eliminar entregas pendientes');
        }
        
        await entregaRef.delete();
    } catch (error) {
        console.error('Error eliminando entrega:', error);
        throw error;
    }
}

/**
 * Obtiene todas las entregas creadas por un dealer
 * @param {string} dealerId - ID del dealer
 * @returns {Promise<Array>} - Array de entregas
 */
async function obtenerEntregasPorDealer(dealerId) {
    await ensureDb();
    
    try {
        const snapshot = await db.collection('entregas_productos')
            .where('dealerId', '==', dealerId)
            .orderBy('fechaCreacion', 'desc')
            .get();
        
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error obteniendo entregas por dealer:', error);
        throw error;
    }
}

/**
 * Obtiene todas las entregas recibidas por un vendedor
 * @param {string} vendedorId - ID del vendedor
 * @returns {Promise<Array>} - Array de entregas
 */
async function obtenerEntregasPorVendedor(vendedorId) {
    await ensureDb();
    
    try {
        const snapshot = await db.collection('entregas_productos')
            .where('vendedorId', '==', vendedorId)
            .orderBy('fechaCreacion', 'desc')
            .get();
        
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error obteniendo entregas por vendedor:', error);
        throw error;
    }
}

/**
 * Obtiene todas las entregas pendientes de un vendedor
 * @param {string} vendedorId - ID del vendedor
 * @returns {Promise<Array>} - Array de entregas pendientes
 */
async function obtenerEntregasPendientesVendedor(vendedorId) {
    await ensureDb();
    
    try {
        // Primero obtener todas las entregas del vendedor y filtrar por estado en el cliente
        // para evitar problemas con índices compuestos
        const snapshot = await db.collection('entregas_productos')
            .where('vendedorId', '==', vendedorId)
            .get();
        
        const entregas = snapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            .filter(entrega => entrega.estado === 'pendiente')
            .sort((a, b) => {
                const fechaA = a.fechaCreacion?.toDate() || new Date(0);
                const fechaB = b.fechaCreacion?.toDate() || new Date(0);
                return fechaB - fechaA; // Orden descendente
            });
        
        return entregas;
    } catch (error) {
        console.error('Error obteniendo entregas pendientes:', error);
        throw error;
    }
}

