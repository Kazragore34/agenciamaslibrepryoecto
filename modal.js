/**
 * Sistema de Modales Personalizados
 * Reemplaza alert(), prompt(), confirm() con modales modernos
 */

// Variables globales para modales
let modalCallbacks = {};

/**
 * Muestra un modal de alerta personalizado
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - Tipo de mensaje: 'info', 'success', 'warning', 'error'
 * @param {Function} callback - Función a ejecutar al cerrar (opcional)
 */
function mostrarModal(mensaje, tipo = 'info', callback = null) {
    // Remover modal anterior si existe
    const modalAnterior = document.getElementById('customModal');
    if (modalAnterior) {
        modalAnterior.remove();
    }

    const tipos = {
        info: { color: '#3b82f6', icon: 'ℹ️', titulo: 'Información' },
        success: { color: '#10b981', icon: '✅', titulo: 'Éxito' },
        warning: { color: '#f59e0b', icon: '⚠️', titulo: 'Advertencia' },
        error: { color: '#ef4444', icon: '❌', titulo: 'Error' }
    };

    const config = tipos[tipo] || tipos.info;

    const modal = document.createElement('div');
    modal.id = 'customModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        animation: fadeIn 0.2s ease;
    `;

    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 0.75rem;
            padding: 2rem;
            max-width: 500px;
            width: 100%;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            animation: slideUp 0.3s ease;
        ">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                <span style="font-size: 2rem;">${config.icon}</span>
                <h3 style="margin: 0; color: ${config.color}; font-size: 1.25rem; font-weight: 600;">
                    ${config.titulo}
                </h3>
            </div>
            <p style="color: #374151; margin: 0 0 1.5rem 0; line-height: 1.6; white-space: pre-wrap;">
                ${mensaje}
            </p>
            <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
                <button id="modalBtnAceptar" style="
                    background: ${config.color};
                    color: white;
                    border: none;
                    padding: 0.625rem 1.5rem;
                    border-radius: 0.5rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: opacity 0.2s;
                " onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                    Aceptar
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const cerrarModal = () => {
        modal.style.animation = 'fadeOut 0.2s ease';
        setTimeout(() => {
            modal.remove();
            if (callback) callback();
        }, 200);
    };

    document.getElementById('modalBtnAceptar').addEventListener('click', cerrarModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) cerrarModal();
    });

    // Agregar animaciones CSS si no existen
    if (!document.getElementById('modalStyles')) {
        const style = document.createElement('style');
        style.id = 'modalStyles';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Muestra un modal de confirmación personalizado
 * @param {string} mensaje - Mensaje a mostrar
 * @param {Function} onConfirm - Función a ejecutar al confirmar
 * @param {Function} onCancel - Función a ejecutar al cancelar (opcional)
 */
function mostrarConfirmacion(mensaje, onConfirm, onCancel = null) {
    const modalAnterior = document.getElementById('customModal');
    if (modalAnterior) {
        modalAnterior.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'customModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        animation: fadeIn 0.2s ease;
    `;

    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 0.75rem;
            padding: 2rem;
            max-width: 500px;
            width: 100%;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            animation: slideUp 0.3s ease;
        ">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                <span style="font-size: 2rem;">❓</span>
                <h3 style="margin: 0; color: #374151; font-size: 1.25rem; font-weight: 600;">
                    Confirmar
                </h3>
            </div>
            <p style="color: #374151; margin: 0 0 1.5rem 0; line-height: 1.6; white-space: pre-wrap;">
                ${mensaje}
            </p>
            <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
                <button id="modalBtnCancelar" style="
                    background: #6b7280;
                    color: white;
                    border: none;
                    padding: 0.625rem 1.5rem;
                    border-radius: 0.5rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: opacity 0.2s;
                " onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                    Cancelar
                </button>
                <button id="modalBtnConfirmar" style="
                    background: #2563eb;
                    color: white;
                    border: none;
                    padding: 0.625rem 1.5rem;
                    border-radius: 0.5rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: opacity 0.2s;
                " onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                    Confirmar
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const cerrarModal = () => {
        modal.style.animation = 'fadeOut 0.2s ease';
        setTimeout(() => {
            modal.remove();
        }, 200);
    };

    document.getElementById('modalBtnConfirmar').addEventListener('click', () => {
        cerrarModal();
        if (onConfirm) onConfirm();
    });

    document.getElementById('modalBtnCancelar').addEventListener('click', () => {
        cerrarModal();
        if (onCancel) onCancel();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            cerrarModal();
            if (onCancel) onCancel();
        }
    });
}

/**
 * Muestra un modal de entrada de texto personalizado
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} placeholder - Placeholder del input (opcional)
 * @param {string} tipoInput - Tipo de input: 'text', 'number', 'password' (opcional, default: 'text')
 * @param {Function} onConfirm - Función a ejecutar con el valor ingresado
 * @param {Function} onCancel - Función a ejecutar al cancelar (opcional)
 */
function mostrarPrompt(mensaje, placeholder = '', tipoInput = 'text', onConfirm, onCancel = null) {
    const modalAnterior = document.getElementById('customModal');
    if (modalAnterior) {
        modalAnterior.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'customModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        animation: fadeIn 0.2s ease;
    `;

    const inputId = 'modalInput_' + Date.now();

    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 0.75rem;
            padding: 2rem;
            max-width: 500px;
            width: 100%;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            animation: slideUp 0.3s ease;
        ">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                <span style="font-size: 2rem;">📝</span>
                <h3 style="margin: 0; color: #374151; font-size: 1.25rem; font-weight: 600;">
                    Ingresar Datos
                </h3>
            </div>
            <p style="color: #374151; margin: 0 0 1rem 0; line-height: 1.6;">
                ${mensaje}
            </p>
            <input 
                id="${inputId}"
                type="${tipoInput}"
                placeholder="${placeholder}"
                style="
                    width: 100%;
                    padding: 0.75rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 0.5rem;
                    font-size: 1rem;
                    margin-bottom: 1.5rem;
                    transition: border-color 0.2s;
                    box-sizing: border-box;
                "
                onfocus="this.style.borderColor='#2563eb'"
                onblur="this.style.borderColor='#e5e7eb'"
                autofocus
            />
            <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
                <button id="modalBtnCancelar" style="
                    background: #6b7280;
                    color: white;
                    border: none;
                    padding: 0.625rem 1.5rem;
                    border-radius: 0.5rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: opacity 0.2s;
                " onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                    Cancelar
                </button>
                <button id="modalBtnConfirmar" style="
                    background: #2563eb;
                    color: white;
                    border: none;
                    padding: 0.625rem 1.5rem;
                    border-radius: 0.5rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: opacity 0.2s;
                " onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                    Aceptar
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const input = document.getElementById(inputId);
    
    const cerrarModal = () => {
        modal.style.animation = 'fadeOut 0.2s ease';
        setTimeout(() => {
            modal.remove();
        }, 200);
    };

    const confirmar = () => {
        const valor = input.value.trim();
        cerrarModal();
        if (onConfirm) onConfirm(valor);
    };

    const cancelar = () => {
        cerrarModal();
        if (onCancel) onCancel();
    };

    document.getElementById('modalBtnConfirmar').addEventListener('click', confirmar);
    document.getElementById('modalBtnCancelar').addEventListener('click', cancelar);
    
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            confirmar();
        } else if (e.key === 'Escape') {
            cancelar();
        }
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            cancelar();
        }
    });

    // Agregar animaciones CSS si no existen
    if (!document.getElementById('modalStyles')) {
        const style = document.createElement('style');
        style.id = 'modalStyles';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}

