// Funciones para la página principal (menu.html)

/**
 * Carga el resumen de metas del usuario (tanto dealers como vendedores)
 */
async function cargarResumenMetas() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    try {
        const faltante = await obtenerDineroFaltante(currentUser.id);
        
        const metaDiariaEl = document.getElementById('metaDiaria');
        const metaSemanalEl = document.getElementById('metaSemanal');
        
        if (metaDiariaEl) {
            metaDiariaEl.innerHTML = `
                <div class="meta-card">
                    <h4>Meta Diaria</h4>
                    <div class="meta-progress">
                        <div class="meta-bar" style="width: ${Math.min(100, faltante.porcentajeDiario)}%"></div>
                    </div>
                    <p class="meta-text">
                        <span class="meta-recidido">$${faltante.diaria.toLocaleString()}</span> faltantes de $${META_DIARIA.toLocaleString()}
                    </p>
                    <p class="meta-porcentaje">${faltante.porcentajeDiario.toFixed(1)}% completado</p>
                </div>
            `;
        }
        
        if (metaSemanalEl) {
            metaSemanalEl.innerHTML = `
                <div class="meta-card">
                    <h4>Meta Semanal</h4>
                    <div class="meta-progress">
                        <div class="meta-bar" style="width: ${Math.min(100, faltante.porcentajeSemanal)}%"></div>
                    </div>
                    <p class="meta-text">
                        <span class="meta-recidido">$${faltante.semanal.toLocaleString()}</span> faltantes de $${META_SEMANAL.toLocaleString()}
                    </p>
                    <p class="meta-porcentaje">${faltante.porcentajeSemanal.toFixed(1)}% completado</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error cargando resumen de metas:', error);
    }
}

/**
 * Carga las entregas pendientes de confirmar (para vendedores y dealers que reciben)
 * Versión compacta con opción de expandir
 */
async function cargarEntregasPendientes() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    try {
        // Tanto vendedores como dealers pueden recibir entregas
        const entregas = await obtenerEntregasPendientesVendedor(currentUser.id);
        const entregasEl = document.getElementById('entregasPendientes');
        const contadorEl = document.getElementById('contadorEntregas');
        
        if (!entregasEl) return;
        
        if (contadorEl) {
            if (entregas.length > 0) {
                contadorEl.textContent = entregas.length;
                contadorEl.style.display = 'inline-block';
            } else {
                contadorEl.style.display = 'none';
            }
        }
        
        if (entregas.length === 0) {
            entregasEl.innerHTML = '<p style="color: #6b7280; text-align: center; padding: 1rem;">No hay entregas pendientes</p>';
            return;
        }
        
        let html = '<div style="display: flex; flex-direction: column; gap: 0.75rem;">';
        entregas.forEach((entrega, index) => {
            const fecha = entrega.fechaCreacion?.toDate();
            const fechaStr = fecha ? fecha.toLocaleString('es-PE') : 'Fecha no disponible';
            const productosResumen = entrega.productos.slice(0, 2).map(p => 
                `${obtenerNombreProducto(p.tipo)}: ${p.cantidad}`
            ).join(', ');
            const tieneMasProductos = entrega.productos.length > 2;
            const expandId = `expandEntrega_${index}`;
            
            html += `
                <div style="border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 0.75rem; background: #fef3c7; transition: all 0.2s;" 
                     onmouseover="this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'" 
                     onmouseout="this.style.boxShadow='none'">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                        <div style="flex: 1;">
                            <div style="font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                ${entrega.dealerNombre || 'Sargento'}
                            </div>
                            <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.25rem;">
                                ${productosResumen}${tieneMasProductos ? '...' : ''}
                            </div>
                            <div style="font-size: 0.75rem; color: #9ca3af;">
                                ${fechaStr}
                            </div>
                        </div>
                        <div style="display: flex; gap: 0.5rem; align-items: start;">
                            <span style="background: #f59e0b; color: white; padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; white-space: nowrap;">
                                Pendiente
                            </span>
                        </div>
                    </div>
                    
                    <!-- Detalles expandibles -->
                    <div id="${expandId}" style="display: none; margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #e5e7eb;">
                        <div style="margin-bottom: 0.5rem;">
                            <strong style="font-size: 0.875rem; color: #374151;">Productos completos:</strong>
                            <div style="margin-top: 0.25rem; font-size: 0.875rem; color: #6b7280;">
                                ${entrega.productos.map(p => 
                                    `<div>• ${obtenerNombreProducto(p.tipo)}: ${p.cantidad}</div>`
                                ).join('')}
                            </div>
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <button onclick="confirmarEntregaRapida('${entrega.id}')" 
                                    style="flex: 1; background: #10b981; color: white; border: none; padding: 0.5rem; border-radius: 0.375rem; font-size: 0.875rem; cursor: pointer; font-weight: 500;">
                                ✅ Confirmar
                            </button>
                            <button onclick="verDetallesEntrega('${entrega.id}')" 
                                    style="flex: 1; background: #3b82f6; color: white; border: none; padding: 0.5rem; border-radius: 0.375rem; font-size: 0.875rem; cursor: pointer; font-weight: 500;">
                                📋 Ver Detalles
                            </button>
                        </div>
                    </div>
                    
                    <!-- Botón para expandir/colapsar -->
                    <button onclick="toggleExpand('${expandId}')" 
                            style="width: 100%; margin-top: 0.5rem; background: transparent; border: 1px solid #d1d5db; color: #6b7280; padding: 0.375rem; border-radius: 0.375rem; font-size: 0.75rem; cursor: pointer;">
                        <span id="${expandId}_icon">▼</span> Ver más
                    </button>
                </div>
            `;
        });
        html += '</div>';
        
        entregasEl.innerHTML = html;
    } catch (error) {
        console.error('Error cargando entregas pendientes:', error);
    }
}

// Función para expandir/colapsar detalles
function toggleExpand(expandId) {
    const expandEl = document.getElementById(expandId);
    const iconEl = document.getElementById(expandId + '_icon');
    
    if (expandEl.style.display === 'none' || !expandEl.style.display) {
        expandEl.style.display = 'block';
        if (iconEl) iconEl.textContent = '▲';
    } else {
        expandEl.style.display = 'none';
        if (iconEl) iconEl.textContent = '▼';
    }
}

// Función para confirmar entrega rápidamente
async function confirmarEntregaRapida(entregaId) {
    mostrarConfirmacion('¿Confirmas que recibiste estos productos?', async () => {
        try {
            await confirmarEntrega(entregaId);
            mostrarModal('Entrega confirmada correctamente', 'success');
            cargarEntregasPendientes();
        } catch (error) {
            mostrarModal('Error: ' + error.message, 'error');
        }
    });
}

// Función para ver detalles de entrega
function verDetallesEntrega(entregaId) {
    window.location.href = `tickets_dinero.html?entrega=${entregaId}`;
}

/**
 * Carga tickets y depósitos resumidos (debajo de Armas Activas)
 */
async function cargarTicketsDepositosResumen() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    try {
        const resumenEl = document.getElementById('ticketsDepositosResumen');
        const contadorEl = document.getElementById('contadorTicketsDepositos');
        
        if (!resumenEl) return;
        
        let items = [];
        
        // Cargar tickets
        try {
            let tickets = [];
            if (esSargentoOAdmin()) {
                const ticketsCreados = await obtenerTicketsPorDealer(currentUser.id);
                const ticketsRecibidos = await obtenerTicketsPorVendedor(currentUser.id);
                const ticketsIds = new Set();
                ticketsCreados.forEach(t => {
                    ticketsIds.add(t.id);
                    tickets.push({ ...t, tipo: 'ticket' });
                });
                ticketsRecibidos.forEach(t => {
                    if (!ticketsIds.has(t.id)) {
                        tickets.push({ ...t, tipo: 'ticket' });
                    }
                });
            } else {
                tickets = await obtenerTicketsPorVendedor(currentUser.id);
                tickets = tickets.map(t => ({ ...t, tipo: 'ticket' }));
            }
            items.push(...tickets);
        } catch (error) {
            console.error('Error cargando tickets:', error);
        }
        
        // Cargar depósitos
        try {
            const depositos = await obtenerDepositosPorUsuario(currentUser.id);
            items.push(...depositos);
        } catch (error) {
            console.error('Error cargando depósitos:', error);
        }
        
        // Ordenar por fecha (más recientes primero)
        items.sort((a, b) => {
            const fechaA = a.fechaCreacion?.toDate() || new Date(0);
            const fechaB = b.fechaCreacion?.toDate() || new Date(0);
            return fechaB - fechaA;
        });
        
        // Mostrar solo los últimos 5
        const itemsMostrar = items.slice(0, 5);
        
        if (contadorEl) {
            if (items.length > 0) {
                contadorEl.textContent = items.length;
                contadorEl.style.display = 'inline-block';
            } else {
                contadorEl.style.display = 'none';
            }
        }
        
        if (itemsMostrar.length === 0) {
            resumenEl.innerHTML = '<p style="color: #9ca3af; text-align: center; padding: 0.5rem; font-size: 0.75rem;">No hay tickets ni depósitos</p>';
            return;
        }
        
        let html = '<div style="display: flex; flex-direction: column; gap: 0.5rem;">';
        itemsMostrar.forEach((item, index) => {
            const fecha = item.fechaCreacion?.toDate();
            const fechaStr = fecha ? fecha.toLocaleDateString('es-PE') : 'N/A';
            const esTicket = item.tipo === 'ticket';
            const esDeposito = item.tipo === 'deposito';
            
            let estadoColor = '#6b7280';
            let estadoTexto = '';
            if (esTicket) {
                if (item.estado === 'pendiente' || item.estado === 'pendiente_dealer') {
                    estadoColor = '#f59e0b';
                    estadoTexto = 'Pendiente';
                } else if (item.estado === 'confirmado') {
                    estadoColor = '#10b981';
                    estadoTexto = 'Confirmado';
                } else if (item.estado === 'rechazado') {
                    estadoColor = '#ef4444';
                    estadoTexto = 'Rechazado';
                }
            } else if (esDeposito) {
                if (item.estado === 'pendiente') {
                    estadoColor = '#f59e0b';
                    estadoTexto = 'Pendiente';
                } else if (item.estado === 'aprobado') {
                    estadoColor = '#10b981';
                    estadoTexto = 'Aprobado';
                } else if (item.estado === 'rechazado') {
                    estadoColor = '#ef4444';
                    estadoTexto = 'Rechazado';
                }
            }
            
            const monto = esTicket ? (item.montoEntregado || item.montoAprox || 0) : (item.montoTotal || 0);
            const codigo = esTicket ? (item.ticketId || 'N/A') : (item.depositoId || 'N/A');
            
            html += `
                <div style="border: 1px solid #e5e7eb; border-radius: 0.375rem; padding: 0.5rem; background: ${esTicket ? '#dbeafe' : '#fef3c7'}; transition: all 0.2s; cursor: pointer;" 
                     onmouseover="this.style.boxShadow='0 1px 3px rgba(0,0,0,0.1)'" 
                     onmouseout="this.style.boxShadow='none'"
                     onclick="window.location.href='tickets_dinero.html${esTicket ? '?id=' + item.id : ''}'">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="flex: 1; min-width: 0;">
                            <div style="font-weight: 600; color: #374151; font-size: 0.75rem; margin-bottom: 0.125rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                ${codigo}
                            </div>
                            <div style="font-size: 0.625rem; color: #6b7280;">
                                ${fechaStr} • $${monto.toLocaleString()}
                            </div>
                        </div>
                        <span style="background: ${estadoColor}; color: white; padding: 0.125rem 0.375rem; border-radius: 9999px; font-size: 0.625rem; white-space: nowrap; margin-left: 0.5rem;">
                            ${estadoTexto}
                        </span>
                    </div>
                </div>
            `;
        });
        
        if (items.length > 5) {
            html += `
                <button onclick="window.location.href='tickets_dinero.html'" 
                        style="width: 100%; margin-top: 0.25rem; background: transparent; border: 1px solid #d1d5db; color: #6b7280; padding: 0.375rem; border-radius: 0.375rem; font-size: 0.75rem; cursor: pointer;">
                    Ver todos (${items.length})
                </button>
            `;
        }
        
        html += '</div>';
        resumenEl.innerHTML = html;
    } catch (error) {
        console.error('Error cargando tickets y depósitos resumen:', error);
    }
}

// Función para confirmar ticket rápidamente
async function confirmarTicketRapido(ticketId) {
    mostrarPrompt('Ingresa el monto entregado:', '0', 'number', async (monto) => {
        if (!monto || parseFloat(monto) <= 0) {
            mostrarModal('Por favor, ingresa un monto válido', 'error');
            return;
        }
        
        try {
            await confirmarTicketDineroDealer(ticketId, parseFloat(monto));
            mostrarModal('Ticket confirmado correctamente', 'success');
            cargarTicketsPendientes();
        } catch (error) {
            mostrarModal('Error: ' + error.message, 'error');
        }
    });
}

// Función para ver detalles de ticket
function verDetallesTicket(ticketId) {
    window.location.href = `tickets_dinero.html?id=${ticketId}`;
}

/**
 * Carga las estadísticas diarias del usuario (dealers y vendedores)
 */
async function cargarEstadisticasDiarias() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    try {
        const dineroHoy = await obtenerDineroEntregadoHoy(currentUser.id);
        const estadisticasEl = document.getElementById('estadisticasDiarias');
        
        if (estadisticasEl) {
            estadisticasEl.innerHTML = `
                <div class="stat-card">
                    <h4>Dinero Entregado Hoy</h4>
                    <p class="stat-value">$${dineroHoy.toLocaleString()}</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error cargando estadísticas diarias:', error);
    }
}

/**
 * Carga las estadísticas semanales del usuario (dealers y vendedores)
 */
async function cargarEstadisticasSemanales() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    try {
        const dineroSemana = await obtenerDineroEntregadoSemana(currentUser.id);
        const estadisticasEl = document.getElementById('estadisticasSemanales');
        
        if (estadisticasEl) {
            estadisticasEl.innerHTML = `
                <div class="stat-card">
                    <h4>Dinero Entregado Esta Semana</h4>
                    <p class="stat-value">$${dineroSemana.toLocaleString()}</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error cargando estadísticas semanales:', error);
    }
}

/**
 * Carga las armas activas y solicitudes de balas (versión compacta)
 */
async function cargarArmasActivas() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    try {
        const armasEl = document.getElementById('armasActivas');
        const contadorEl = document.getElementById('contadorArmas');
        const seccionAccesos = document.getElementById('seccionAccesosRapidos');
        
        if (!armasEl) return;
        
        if (esProspect()) {
            // Para prospects: mostrar armas activas y acceso rápido para solicitar balas
            const armas = await obtenerArmasPorVendedor(currentUser.id);
            const armasActivas = armas.filter(a => a.estado === 'activa');
            
            if (contadorEl) {
                if (armasActivas.length > 0) {
                    contadorEl.textContent = armasActivas.length;
                    contadorEl.style.display = 'inline-block';
                } else {
                    contadorEl.style.display = 'none';
                }
            }
            
            // Mostrar sección de accesos rápidos
            if (seccionAccesos) {
                seccionAccesos.style.display = 'block';
            }
            
            if (armasActivas.length === 0) {
                armasEl.innerHTML = '<p style="color: #6b7280; text-align: center; padding: 1rem;">No tienes armas activas</p>';
                return;
            }
            
            let html = '<div style="display: flex; flex-direction: column; gap: 0.75rem;">';
            armasActivas.forEach((arma, index) => {
                const solicitudesPendientes = (arma.solicitudesBalas || []).filter(s => s.estado === 'pendiente');
                const balasActual = arma.cantidadBalasActual !== undefined ? arma.cantidadBalasActual : arma.cantidadBalasInicial || 0;
                const balasInicial = arma.cantidadBalasInicial || 0;
                const expandId = `expandArma_${index}`;
                
                html += `
                    <div style="border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 0.75rem; background: #f0fdf4; transition: all 0.2s;" 
                         onmouseover="this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'" 
                         onmouseout="this.style.boxShadow='none'">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                            <div style="flex: 1;">
                                <div style="font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    ${arma.tipoArma}
                                </div>
                                <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.25rem;">
                                    De: ${arma.dealerNombre || 'Sargento'}
                                </div>
                                <div style="font-size: 0.75rem; color: #9ca3af;">
                                    Balas: ${balasActual} / ${balasInicial}
                                    ${arma.chaleco ? ' | 🛡️ Con Chaleco' : ''}
                                </div>
                            </div>
                            ${solicitudesPendientes.length > 0 ? 
                                `<span style="background: #f59e0b; color: white; padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; white-space: nowrap;">
                                    ${solicitudesPendientes.length} solicitud(es)
                                </span>` : 
                                '<span style="background: #10b981; color: white; padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; white-space: nowrap;">Activa</span>'
                            }
                        </div>
                        
                        <!-- Detalles expandibles -->
                        <div id="${expandId}" style="display: none; margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #e5e7eb;">
                            <div style="display: flex; gap: 0.5rem;">
                                <button onclick="solicitarBalasRapido('${arma.id}')" 
                                        style="flex: 1; background: #2563eb; color: white; border: none; padding: 0.5rem; border-radius: 0.375rem; font-size: 0.875rem; cursor: pointer; font-weight: 500;">
                                    🎯 Solicitar Balas
                                </button>
                                <button onclick="verDetallesArma('${arma.id}')" 
                                        style="flex: 1; background: #6b7280; color: white; border: none; padding: 0.5rem; border-radius: 0.375rem; font-size: 0.875rem; cursor: pointer; font-weight: 500;">
                                    📋 Ver Detalles
                                </button>
                            </div>
                        </div>
                        
                        <!-- Botón para expandir/colapsar -->
                        <button onclick="toggleExpand('${expandId}')" 
                                style="width: 100%; margin-top: 0.5rem; background: transparent; border: 1px solid #d1d5db; color: #6b7280; padding: 0.375rem; border-radius: 0.375rem; font-size: 0.75rem; cursor: pointer;">
                            <span id="${expandId}_icon">▼</span> Ver más
                        </button>
                    </div>
                `;
            });
            html += '</div>';
            
            armasEl.innerHTML = html;
        } else if (esSargentoOAdmin()) {
            // Para sargentos: mostrar solicitudes pendientes
            const solicitudes = await obtenerSolicitudesBalasPendientes();
            const solicitudesChalecos = await obtenerSolicitudesChalecosPendientes();
            const totalSolicitudes = solicitudes.length + solicitudesChalecos.length;
            
            if (contadorEl) {
                if (totalSolicitudes > 0) {
                    contadorEl.textContent = totalSolicitudes;
                    contadorEl.style.display = 'inline-block';
                } else {
                    contadorEl.style.display = 'none';
                }
            }
            
            if (seccionAccesos) {
                seccionAccesos.style.display = 'none';
            }
            
            if (totalSolicitudes === 0) {
                armasEl.innerHTML = '<p style="color: #6b7280; text-align: center; padding: 1rem;">No hay solicitudes pendientes</p>';
                return;
            }
            
            let html = '<div style="display: flex; flex-direction: column; gap: 0.75rem;">';
            
            // Solicitudes de balas
            solicitudes.forEach((arma, index) => {
                const expandId = `expandSolicitudBalas_${index}`;
                html += `
                    <div style="border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 0.75rem; background: #fef3c7; transition: all 0.2s;" 
                         onmouseover="this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'" 
                         onmouseout="this.style.boxShadow='none'">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                            <div style="flex: 1;">
                                <div style="font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    ${arma.tipoArma} - Solicitud de Balas
                                </div>
                                <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.25rem;">
                                    De: ${arma.vendedorNombre || 'Prospect'}
                                </div>
                                <div style="font-size: 0.75rem; color: #9ca3af;">
                                    ${arma.solicitudesPendientes.length} solicitud(es) pendiente(s)
                                </div>
                            </div>
                            <span style="background: #f59e0b; color: white; padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; white-space: nowrap;">
                                Pendiente
                            </span>
                        </div>
                        <button onclick="window.location.href='entregas.html'" 
                                style="width: 100%; background: #2563eb; color: white; border: none; padding: 0.5rem; border-radius: 0.375rem; font-size: 0.875rem; cursor: pointer; font-weight: 500;">
                            Ver en Entregas
                        </button>
                    </div>
                `;
            });
            
            // Solicitudes de chalecos
            solicitudesChalecos.forEach((arma, index) => {
                html += `
                    <div style="border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 0.75rem; background: #dbeafe; transition: all 0.2s;" 
                         onmouseover="this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'" 
                         onmouseout="this.style.boxShadow='none'">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                            <div style="flex: 1;">
                                <div style="font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    ${arma.tipoArma} - Solicitud de Chaleco
                                </div>
                                <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.25rem;">
                                    De: ${arma.vendedorNombre || 'Prospect'}
                                </div>
                                <div style="font-size: 0.75rem; color: #9ca3af;">
                                    ${arma.solicitudesChalecosPendientes.length} solicitud(es) pendiente(s)
                                </div>
                            </div>
                            <span style="background: #3b82f6; color: white; padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; white-space: nowrap;">
                                Pendiente
                            </span>
                        </div>
                        <button onclick="window.location.href='entregas.html'" 
                                style="width: 100%; background: #2563eb; color: white; border: none; padding: 0.5rem; border-radius: 0.375rem; font-size: 0.875rem; cursor: pointer; font-weight: 500;">
                            Ver en Entregas
                        </button>
                    </div>
                `;
            });
            
            html += '</div>';
            armasEl.innerHTML = html;
        }
    } catch (error) {
        console.error('Error cargando armas activas:', error);
    }
}

// Funciones de acceso rápido
async function solicitarBalasRapido(armaId) {
    mostrarPrompt('Ingresa la cantidad de balas que necesitas:', '0', 'number', async (cantidad) => {
        if (!cantidad || parseInt(cantidad) <= 0) {
            mostrarModal('Por favor, ingresa una cantidad válida', 'error');
            return;
        }
        
        try {
            await solicitarRecargaBalas(armaId, parseInt(cantidad));
            mostrarModal('Solicitud de balas enviada correctamente', 'success');
            cargarArmasActivas();
        } catch (error) {
            mostrarModal('Error: ' + error.message, 'error');
        }
    });
}

// Función eliminada - los chalecos ahora son independientes y se solicitan desde el botón de acceso rápido

function verDetallesArma(armaId) {
    window.location.href = `armas.html?id=${armaId}`;
}

/**
 * Inicializa la página del menú
 */
async function inicializarMenu() {
    requireAuth();
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'registro.html';
        return;
    }
    
    // Configurar botones de acceso rápido
    const btnSolicitarBalas = document.getElementById('btnSolicitarBalasRapido');
    const btnSolicitarChaleco = document.getElementById('btnSolicitarChalecoRapido');
    
    if (btnSolicitarBalas && esProspect()) {
        btnSolicitarBalas.addEventListener('click', async () => {
            try {
                const armas = await obtenerArmasPorVendedor(currentUser.id);
                const armasActivas = armas.filter(a => a.estado === 'activa');
                
                if (armasActivas.length === 0) {
                    mostrarModal('No tienes armas activas', 'warning');
                    return;
                }
                
                if (armasActivas.length === 1) {
                    solicitarBalasRapido(armasActivas[0].id);
                } else {
                    const opciones = armasActivas.map((a, i) => `${i + 1}. ${a.tipoArma}`).join('\n');
                    mostrarPrompt(`Tienes ${armasActivas.length} armas activas:\n${opciones}\n\nIngresa el número del arma (1-${armasActivas.length}):`, '1', 'number', (seleccion) => {
                        const indice = parseInt(seleccion) - 1;
                        if (isNaN(indice) || indice < 0 || indice >= armasActivas.length) {
                            mostrarModal('Selección inválida', 'error');
                            return;
                        }
                        solicitarBalasRapido(armasActivas[indice].id);
                    });
                }
            } catch (error) {
                mostrarModal('Error: ' + error.message, 'error');
            }
        });
    }
    
    if (btnSolicitarChaleco && esProspect()) {
        btnSolicitarChaleco.addEventListener('click', async () => {
            try {
                await ensureDb();
                
                // Verificar si ya hay una solicitud pendiente de chaleco independiente
                const snapshot = await db.collection('solicitudes_chalecos')
                    .where('usuarioId', '==', currentUser.id)
                    .where('estado', '==', 'pendiente')
                    .get();
                
                if (!snapshot.empty) {
                    mostrarModal('Ya tienes una solicitud de chaleco pendiente', 'warning');
                    return;
                }
                
                // Solicitar chaleco independiente (no enlazado a arma)
                mostrarConfirmacion('¿Deseas solicitar un chaleco? (Este chaleco es independiente y no está enlazado a ningún arma)', async () => {
                    try {
                        await solicitarChalecoIndependiente();
                        mostrarModal('Solicitud de chaleco enviada correctamente', 'success');
                        cargarArmasActivas();
                        cargarTicketsDepositosResumen();
                    } catch (error) {
                        mostrarModal('Error: ' + error.message, 'error');
                    }
                });
            } catch (error) {
                mostrarModal('Error: ' + error.message, 'error');
            }
        });
    }
    
    // Cargar datos
    await cargarResumenMetas();
    await cargarEntregasPendientes();
    await cargarEstadisticasDiarias();
    await cargarEstadisticasSemanales();
    await cargarArmasActivas();
    await cargarTicketsDepositosResumen();
}

