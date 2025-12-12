// Configuración de productos, precios y constantes del sistema

const PRODUCTOS = {
    coca: { nombre: 'Coca', precioMin: null },
    meta: { nombre: 'Meta', precioMin: null },
    crack: { nombre: 'Crack', precioMin: null },
    weed: { nombre: 'Weed', precioMin: null },
    semilla_maleza: { nombre: 'Semilla Maleza', precioMin: 170 },
    semilla_amarillo: { nombre: 'Semilla Amarillo', precioMin: 180 },
    semilla_azul: { nombre: 'Semilla Azul', precioMin: 220 },
    semilla_morado: { nombre: 'Semilla Morado', precioMin: 210 }
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

/**
 * Obtiene el precio mínimo de un producto
 * @param {string} tipoProducto - Tipo de producto
 * @returns {number|null} - Precio mínimo o null si no tiene
 */
function obtenerPrecioMinimo(tipoProducto) {
    if (PRODUCTOS[tipoProducto] && PRODUCTOS[tipoProducto].precioMin) {
        return PRODUCTOS[tipoProducto].precioMin;
    }
    return null;
}

/**
 * Calcula el precio aproximado total de una lista de productos
 * @param {Array} productos - Array de objetos {tipo, cantidad}
 * @returns {number} - Precio aproximado total
 */
function calcularPrecioAprox(productos) {
    let total = 0;
    productos.forEach(producto => {
        const precioMin = obtenerPrecioMinimo(producto.tipo);
        if (precioMin !== null) {
            total += precioMin * producto.cantidad;
        }
    });
    return total;
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

