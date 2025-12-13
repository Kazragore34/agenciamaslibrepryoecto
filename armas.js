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
    console.log('=== solicitarRecargaBalas INICIADO ===');
    console.log('Parámetros:', { armaId, cantidad });
    
    await ensureDb();
    console.log('Firebase db disponible');
    
    if (!esProspect()) {
        const error = new Error('Solo los prospects pueden solicitar recarga de balas');
        console.error('Error de permisos:', error);
        throw error;
    }
    console.log('Permisos verificados: es prospect');
    
    const currentUser = getCurrentUser();
    console.log('Usuario actual:', currentUser);
    
    if (!currentUser) {
        const error = new Error('No hay usuario autenticado');
        console.error('Error de autenticación:', error);
        throw error;
    }
    
    if (!cantidad || cantidad <= 0) {
        const error = new Error('La cantidad debe ser mayor a 0');
        console.error('Error de validación:', error);
        throw error;
    }
    
    try {
        console.log('Obteniendo documento del arma...');
        const armaRef = db.collection('entregas_armas').doc(armaId);
        const armaDoc = await armaRef.get();
        
        if (!armaDoc.exists) {
            const error = new Error('Arma no encontrada');
            console.error('Error:', error);
            throw error;
        }
        console.log('Arma encontrada en base de datos');
        
        const armaData = armaDoc.data();
        console.log('Datos del arma:', {
            id: armaId,
            vendedorId: armaData.vendedorId,
            estado: armaData.estado,
            solicitudesBalas: armaData.solicitudesBalas
        });
        
        if (armaData.vendedorId !== currentUser.id) {
            const error = new Error('Esta arma no es tuya');
            console.error('Error de propiedad:', error);
            throw error;
        }
        console.log('Propiedad del arma verificada');
        
        if (armaData.estado !== 'activa') {
            const error = new Error('No puedes solicitar balas para un arma perdida');
            console.error('Error de estado:', error);
            throw error;
        }
        console.log('Estado del arma verificado: activa');
        
        // Verificar estado actual de las solicitudes
        console.log('=== SOLICITANDO BALAS ===');
        console.log('Estado actual del arma:', {
            id: armaId,
            solicitudesBalasActuales: armaData.solicitudesBalas,
            cantidadSolicitudesActuales: (armaData.solicitudesBalas || []).length,
            tipoSolicitudesBalas: typeof armaData.solicitudesBalas,
            esArray: Array.isArray(armaData.solicitudesBalas)
        });
        
        // Crear la solicitud sin serverTimestamp (lo agregaremos después)
        const solicitud = {
            fecha: new Date(), // Usar fecha de JavaScript en lugar de serverTimestamp
            cantidad: parseInt(cantidad),
            estado: 'pendiente' // Asegurar que el estado sea exactamente 'pendiente'
        };
        
        const solicitudesBalas = Array.isArray(armaData.solicitudesBalas) 
            ? [...armaData.solicitudesBalas] 
            : [];
        solicitudesBalas.push(solicitud);
        
        console.log('Agregando solicitud de balas:', {
            cantidad: solicitud.cantidad,
            estado: solicitud.estado,
            fecha: solicitud.fecha
        });
        console.log('Total solicitudes después de agregar:', solicitudesBalas.length);
        
        // Actualizar el array completo (sin serverTimestamp dentro del array)
        await armaRef.update({
            solicitudesBalas: solicitudesBalas
        });
        
        // Ahora actualizar la fecha de la última solicitud usando serverTimestamp
        // Pero como no podemos usar serverTimestamp en arrays, usamos la fecha de JavaScript
        // que ya pusimos arriba
        
        console.log('✅ Solicitud de balas guardada correctamente');
        
        // Verificar que se guardó correctamente leyendo de nuevo
        console.log('Esperando 1 segundo antes de verificar...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const armaDocVerificacion = await armaRef.get();
        const armaDataVerificacion = armaDocVerificacion.data();
        const solicitudesGuardadas = armaDataVerificacion.solicitudesBalas || [];
        
        console.log('=== VERIFICACIÓN DESPUÉS DE GUARDAR ===');
        console.log('Cantidad de solicitudes guardadas:', solicitudesGuardadas.length);
        console.log('Última solicitud:', solicitudesGuardadas[solicitudesGuardadas.length - 1]);
        console.log('Todas las solicitudes:', JSON.stringify(solicitudesGuardadas, null, 2));
        
        if (solicitudesGuardadas.length === 0) {
            console.warn('⚠️ ADVERTENCIA: No se encontraron solicitudes después de guardar');
        } else {
            const ultimaSolicitud = solicitudesGuardadas[solicitudesGuardadas.length - 1];
            if (ultimaSolicitud.estado !== 'pendiente') {
                console.warn('⚠️ ADVERTENCIA: La última solicitud no tiene estado pendiente:', ultimaSolicitud.estado);
            } else {
                console.log('✅ Verificación exitosa: La solicitud se guardó correctamente con estado pendiente');
            }
        }
        
        console.log('=== solicitarRecargaBalas COMPLETADO ===');
    } catch (error) {
        console.error('❌ ERROR en solicitarRecargaBalas:', error);
        console.error('Stack trace:', error.stack);
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
            
            // Debug: ver todas las solicitudes con más detalle
            console.log(`Arma ${doc.id}: Total solicitudes: ${todasLasSolicitudes.length}`);
            console.log(`Arma ${doc.id}: Tipo de solicitudesBalas:`, typeof todasLasSolicitudes);
            console.log(`Arma ${doc.id}: Es array?:`, Array.isArray(todasLasSolicitudes));
            console.log(`Arma ${doc.id}: Contenido completo:`, JSON.stringify(todasLasSolicitudes, null, 2));
            
            todasLasSolicitudes.forEach((s, idx) => {
                console.log(`  Solicitud ${idx}:`, {
                    estado: s?.estado,
                    cantidad: s?.cantidad,
                    fecha: s?.fecha,
                    tipoEstado: typeof s?.estado,
                    esPendiente: s?.estado === 'pendiente',
                    objetoCompleto: s
                });
            });
            
            // Filtrar solo las pendientes (verificar que el estado sea exactamente 'pendiente')
            const solicitudesPendientes = todasLasSolicitudes.filter(
                s => {
                    if (!s) {
                        console.log(`  Solicitud es null/undefined`);
                        return false;
                    }
                    const esPendiente = s.estado === 'pendiente';
                    if (!esPendiente) {
                        console.log(`  Solicitud NO pendiente: estado="${s.estado}" (tipo: ${typeof s.estado})`);
                    }
                    return esPendiente;
                }
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

