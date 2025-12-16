// Configuración de productos, precios y constantes del sistema

const PRODUCTOS = {
    coca: { nombre: 'Coca', precioTelefono: null, precioPersona: null },
    meta: { nombre: 'Meta', precioTelefono: null, precioPersona: null },
    crack: { nombre: 'Crack', precioTelefono: null, precioPersona: { min: 550, max: 600 } },
    weed: { nombre: 'Weed', precioTelefono: null, precioPersona: null },
    semilla_maleza: { nombre: 'Semilla Maleza', precioTelefono: 170, precioPersona: 230 },
    semilla_amarillo: { nombre: 'Semilla Amarillo', precioTelefono: { min: 175, max: 187 }, precioPersona: 250 },
    semilla_azul: { nombre: 'Semilla Azul', precioTelefono: { min: 200, max: 240 }, precioPersona: 320 },
    semilla_morado: { nombre: 'Semilla Morado', precioTelefono: { min: 230, max: 250 }, precioPersona: 350 },
    brote_maleza: { nombre: 'Brote Maleza', precioTelefono: 170, precioPersona: 230 },
    brote_amarillo: { nombre: 'Brote Amarillo (Kush)', precioTelefono: { min: 175, max: 187 }, precioPersona: 250 },
    brote_azul: { nombre: 'Brote Azul', precioTelefono: { min: 200, max: 240 }, precioPersona: 320 },
    brote_morado: { nombre: 'Brote Morado', precioTelefono: { min: 230, max: 250 }, precioPersona: 350 }
};

const ITEMS_ADICIONALES = ['fertilizante', 'maceta', 'regadera'];

const TIPOS_ARMAS = ['SNS', 'MK2', 'VINTAGE', '.50', 'AP_PISTOL'];

const MOTIVOS_PERDIDA = [
    { valor: 'robo_corte', nombre: 'Pérdida por Robo o Corte' },
    { valor: 'enfrentamiento', nombre: 'Pérdida en Enfrentamiento' },
    { valor: 'policia', nombre: 'Pérdida por Policía' },
    { valor: 'full_muerte', nombre: 'Pérdida por Full Muerte' },
    { valor: 'bug', nombre: 'Pérdida por Bug' }
];

// Metas del sistema
const META_DIARIA = 100000; // 100k
const META_SEMANAL = 1000000; // 1M

// Configuración de semillas: 1 semilla = 10 brotes
const BROTES_POR_SEMILLA = 10;

// Tipos de dinero negro para DEPOSITO
const TIPOS_DINERO_NEGRO = [
    { id: 'robo_casa', nombre: 'Dinero por robo de casa' },
    { id: 'ammus', nombre: 'Dinero por ammus' },
    { id: 'chop_chop', nombre: 'Dinero por chop chop' },
    { id: 'autos_importacion', nombre: 'Dinero por autos de importación' },
    { id: 'hongos', nombre: 'Dinero por hongos' },
    { id: 'amapolas', nombre: 'Dinero por amapolas' }
];

/**
 * Obtiene el precio mínimo de un producto (compatibilidad con código antiguo)
 * @param {string} tipoProducto - Tipo de producto
 * @returns {number|null} - Precio mínimo o null si no tiene
 */
function obtenerPrecioMinimo(tipoProducto) {
    if (PRODUCTOS[tipoProducto]) {
        const producto = PRODUCTOS[tipoProducto];
        // Si tiene precioTelefono, usar el mínimo de ese rango
        if (producto.precioTelefono) {
            if (typeof producto.precioTelefono === 'object' && producto.precioTelefono.min) {
                return producto.precioTelefono.min;
            }
            return producto.precioTelefono;
        }
        // Si tiene precioPersona, usar el mínimo de ese rango
        if (producto.precioPersona) {
            if (typeof producto.precioPersona === 'object' && producto.precioPersona.min) {
                return producto.precioPersona.min;
            }
            return producto.precioPersona;
        }
    }
    return null;
}

/**
 * Obtiene el precio por teléfono de un producto
 * @param {string} tipoProducto - Tipo de producto
 * @returns {number|null} - Precio por teléfono (mínimo si es rango) o null si no tiene
 */
function obtenerPrecioTelefono(tipoProducto) {
    if (PRODUCTOS[tipoProducto] && PRODUCTOS[tipoProducto].precioTelefono) {
        const precio = PRODUCTOS[tipoProducto].precioTelefono;
        if (typeof precio === 'object' && precio.min) {
            return precio.min;
        }
        return precio;
    }
    return null;
}

/**
 * Obtiene el precio por persona de un producto
 * @param {string} tipoProducto - Tipo de producto
 * @returns {number|null} - Precio por persona (mínimo si es rango) o null si no tiene
 */
function obtenerPrecioPersona(tipoProducto) {
    if (PRODUCTOS[tipoProducto] && PRODUCTOS[tipoProducto].precioPersona) {
        const precio = PRODUCTOS[tipoProducto].precioPersona;
        if (typeof precio === 'object' && precio.min) {
            return precio.min;
        }
        return precio;
    }
    return null;
}

/**
 * Calcula el precio aproximado total de una lista de productos (compatibilidad con código antiguo)
 * @param {Array} productos - Array de objetos {tipo, cantidad}
 * @returns {number} - Precio aproximado total (usa precio por teléfono)
 */
function calcularPrecioAprox(productos) {
    const precios = calcularPreciosAprox(productos);
    return precios.telefono;
}

/**
 * Calcula los precios aproximados totales (por teléfono y por persona) de una lista de productos
 * @param {Array} productos - Array de objetos {tipo, cantidad}
 * @returns {Object} - Objeto con {telefono: number, persona: number}
 */
function calcularPreciosAprox(productos) {
    let totalTelefono = 0;
    let totalPersona = 0;
    
    productos.forEach(producto => {
        const precioTelefono = obtenerPrecioTelefono(producto.tipo);
        const precioPersona = obtenerPrecioPersona(producto.tipo);
        
        // Si es una semilla, el precio es por brote, y 1 semilla = 10 brotes
        if (producto.tipo.startsWith('semilla_')) {
            if (precioTelefono !== null) {
                totalTelefono += precioTelefono * producto.cantidad * BROTES_POR_SEMILLA;
            }
            if (precioPersona !== null) {
                totalPersona += precioPersona * producto.cantidad * BROTES_POR_SEMILLA;
            }
        } else if (producto.tipo.startsWith('brote_')) {
            // Los brotes se venden directamente
            if (precioTelefono !== null) {
                totalTelefono += precioTelefono * producto.cantidad;
            }
            if (precioPersona !== null) {
                totalPersona += precioPersona * producto.cantidad;
            }
        } else {
            // Otros productos (crack, meta, etc.)
            if (precioTelefono !== null) {
                totalTelefono += precioTelefono * producto.cantidad;
            }
            if (precioPersona !== null) {
                totalPersona += precioPersona * producto.cantidad;
            }
        }
    });
    
    return {
        telefono: totalTelefono,
        persona: totalPersona
    };
}

/**
 * Obtiene el nombre legible de un producto
 * @param {string} tipoProducto - Tipo de producto
 * @returns {string} - Nombre del producto
 */
function obtenerNombreProducto(tipoProducto) {
    return PRODUCTOS[tipoProducto] ? PRODUCTOS[tipoProducto].nombre : tipoProducto;
}

/**
 * Obtiene el nombre legible de un motivo de pérdida
 * @param {string} motivo - Valor del motivo
 * @returns {string} - Nombre del motivo
 */
function obtenerNombreMotivo(motivo) {
    const motivoObj = MOTIVOS_PERDIDA.find(m => m.valor === motivo);
    return motivoObj ? motivoObj.nombre : motivo;
}

