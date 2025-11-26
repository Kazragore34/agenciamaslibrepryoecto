// Lógica del calculador de precios de tuneos

// Tabla de precios por categoría
const PRECIOS = {
    'compacts': {
        fullTuning: 4000,
        motor: 900,
        frenos: 900,
        transmision: 900,
        turbo: 900,
        suspension: 450,
        pieza: 200
    },
    'coupes': {
        fullTuning: 6000,
        motor: 1400,
        frenos: 1400,
        transmision: 1400,
        turbo: 1400,
        suspension: 700,
        pieza: 300
    },
    'motos taller regular': {
        fullTuning: 7000,
        motor: 1500,
        frenos: 1500,
        transmision: 1500,
        turbo: 1500,
        suspension: 1500,
        pieza: 500
    },
    'muscle': {
        fullTuning: 5000,
        motor: 1200,
        frenos: 1200,
        transmision: 1200,
        turbo: 1200,
        suspension: 600,
        pieza: 250
    },
    'off road': {
        fullTuning: 9000,
        motor: 2000,
        frenos: 2000,
        transmision: 2000,
        turbo: 2000,
        suspension: 1000,
        pieza: 300
    },
    'sedans': {
        fullTuning: 5000,
        motor: 1200,
        frenos: 1200,
        transmision: 1200,
        turbo: 1200,
        suspension: 600,
        pieza: 250
    },
    'sports': {
        fullTuning: 14000,
        motor: 3100,
        frenos: 3100,
        transmision: 3100,
        turbo: 3100,
        suspension: 1550,
        pieza: 500
    },
    'sports classics': {
        fullTuning: 10000,
        motor: 2300,
        frenos: 2300,
        transmision: 2300,
        turbo: 2300,
        suspension: 1150,
        pieza: 400
    },
    'super': {
        fullTuning: 22000,
        motor: 4900,
        frenos: 4900,
        transmision: 4900,
        turbo: 4900,
        suspension: 2450,
        pieza: 700
    },
    'suv\'s': {
        fullTuning: 10000,
        motor: 2300,
        frenos: 2300,
        transmision: 2300,
        turbo: 2300,
        suspension: 1150,
        pieza: 400
    },
    'motos taller de motor': {
        fullTuning: 4000,
        motor: 900,
        frenos: 900,
        transmision: 900,
        turbo: 900,
        suspension: 900,
        pieza: 200
    },
    'vans': {
        fullTuning: 8000,
        motor: 1800,
        frenos: 1800,
        transmision: 1800,
        turbo: 1800,
        suspension: 900,
        pieza: 350
    },
    'importación (sangre)': {
        fullTuning: 10000,
        motor: 1000,
        frenos: 1000,
        transmision: 1000,
        turbo: 1000,
        suspension: 1000,
        pieza: 1000
    }
};

// Entidades con descuento por convenio
const ENTIDADES_CONVENIO = [
    'Mecánicos',
    'Motor Club',
    'Puf Puf',
    'Médicos'
];

/**
 * Calcula el precio total según los servicios seleccionados
 * @param {string} categoria - Categoría del vehículo
 * @param {Object} servicios - Objeto con servicios seleccionados
 * @param {number} cantidadPiezas - Cantidad de piezas
 * @param {string} tipoDescuento - Tipo de descuento: 'convenio', 'amistad', o null
 * @param {number} porcentajeDescuento - Porcentaje de descuento (5-10 para amistad, 20 para convenio)
 * @returns {Object} - Objeto con precioBase, descuento, precioTotal
 */
function calcularPrecio(categoria, servicios, cantidadPiezas, tipoDescuento, porcentajeDescuento) {
    const preciosCategoria = PRECIOS[categoria];
    if (!preciosCategoria) {
        return { precioBase: 0, descuento: 0, precioTotal: 0 };
    }

    let precioBase = 0;

    // Si está seleccionado Full Tuning, solo cuenta ese (pack completo)
    if (servicios.fullTuning) {
        precioBase = preciosCategoria.fullTuning;
    } else {
        // Si NO hay Full Tuning, sumar servicios individuales de rendimiento
        if (servicios.motor) precioBase += preciosCategoria.motor;
        if (servicios.frenos) precioBase += preciosCategoria.frenos;
        if (servicios.transmision) precioBase += preciosCategoria.transmision;
        if (servicios.turbo) precioBase += preciosCategoria.turbo;
    }

    // Suspensión es independiente (siempre se puede agregar, incluso con Full Tuning)
    if (servicios.suspension) {
        precioBase += preciosCategoria.suspension;
    }

    // Agregar precio de piezas (estéticas, precio unitario × cantidad)
    precioBase += preciosCategoria.pieza * (cantidadPiezas || 0);

    // Calcular descuento
    let descuento = 0;
    if (tipoDescuento && porcentajeDescuento) {
        descuento = (precioBase * porcentajeDescuento) / 100;
    }

    const precioTotal = precioBase - descuento;

    return {
        precioBase: precioBase,
        descuento: descuento,
        precioTotal: precioTotal
    };
}

/**
 * Registra un tuneo en Firestore
 * @param {string} userId - ID del usuario que hizo el tuneo
 * @param {number} precioTotal - Precio total del tuneo
 * @param {string} modelo - Categoría del vehículo
 * @param {string} personaEntidad - Nombre de persona o entidad (opcional)
 * @param {string} tipoDescuento - Tipo de descuento aplicado
 * @param {number} porcentajeDescuento - Porcentaje de descuento
 * @param {Object} detalles - Detalles del tuneo (servicios, piezas, etc.)
 * @returns {Promise<string>} - ID del documento creado
 */
async function registrarTuneo(userId, precioTotal, modelo, personaEntidad, tipoDescuento, porcentajeDescuento, detalles) {
    try {
        const tuneoData = {
            userId: userId,
            precioTotal: precioTotal,
            modelo: modelo,
            fecha: firebase.firestore.FieldValue.serverTimestamp(),
            detalles: detalles
        };

        // Agregar campos opcionales solo si existen
        if (personaEntidad) {
            tuneoData.personaEntidad = personaEntidad;
        }
        if (tipoDescuento) {
            tuneoData.tipoDescuento = tipoDescuento;
        }
        if (porcentajeDescuento) {
            tuneoData.porcentajeDescuento = porcentajeDescuento;
        }

        const docRef = await db.collection('tuneos').add(tuneoData);
        return docRef.id;
    } catch (error) {
        console.error('Error registrando tuneo:', error);
        throw error;
    }
}

/**
 * Formatea un precio para mostrar
 * @param {number} precio - Precio a formatear
 * @returns {string} - Precio formateado con símbolo de dólar
 */
function formatPrecio(precio) {
    return `$${precio.toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

