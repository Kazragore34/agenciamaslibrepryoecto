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
 */
async function cargarEntregasPendientes() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    try {
        // Tanto vendedores como dealers pueden recibir entregas
        const entregas = await obtenerEntregasPendientesVendedor(currentUser.id);
        const entregasEl = document.getElementById('entregasPendientes');
        
        if (!entregasEl) return;
        
        if (entregas.length === 0) {
            entregasEl.innerHTML = '<p style="color: #6b7280;">No hay entregas pendientes</p>';
            return;
        }
        
        let html = '<div class="entregas-list">';
        entregas.forEach(entrega => {
            const fecha = entrega.fechaCreacion?.toDate();
            const fechaStr = fecha ? fecha.toLocaleString('es-PE') : 'Fecha no disponible';
            
            html += `
                <div class="entrega-item">
                    <div class="entrega-header">
                        <strong>De: ${entrega.dealerNombre}</strong>
                        <span class="estado-badge pendiente">Pendiente</span>
                    </div>
                    <div class="entrega-productos">
                        ${entrega.productos.map(p => 
                            `<span>${obtenerNombreProducto(p.tipo)}: ${p.cantidad}</span>`
                        ).join(', ')}
                    </div>
                    <div class="entrega-fecha">${fechaStr}</div>
                    <div class="entrega-acciones">
                        <a href="tickets_dinero.html?entrega=${entrega.id}" class="btn-primary btn-sm">Ver Detalles</a>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        
        entregasEl.innerHTML = html;
    } catch (error) {
        console.error('Error cargando entregas pendientes:', error);
    }
}

/**
 * Carga los tickets de dinero pendientes (para vendedores y dealers que reciben)
 */
async function cargarTicketsPendientes() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    try {
        // Tanto vendedores como dealers pueden recibir tickets
        const tickets = await obtenerTicketsPendientesVendedor(currentUser.id);
        const ticketsEl = document.getElementById('ticketsPendientes');
        
        if (!ticketsEl) return;
        
        if (tickets.length === 0) {
            ticketsEl.innerHTML = '<p style="color: #6b7280;">No hay tickets pendientes</p>';
            return;
        }
        
        let html = '<div class="tickets-list">';
        tickets.forEach(ticket => {
            const fecha = ticket.fechaCreacion?.toDate();
            const fechaStr = fecha ? fecha.toLocaleString('es-PE') : 'Fecha no disponible';
            
            html += `
                <div class="ticket-item">
                    <div class="ticket-header">
                        <strong>${ticket.ticketId}</strong>
                        <span class="estado-badge pendiente">Pendiente</span>
                    </div>
                    <div class="ticket-info">
                        <p>De: ${ticket.dealerNombre}</p>
                        <p class="ticket-fecha">${fechaStr}</p>
                    </div>
                    <div class="ticket-acciones">
                        <a href="tickets_dinero.html?id=${ticket.id}" class="btn-primary btn-sm">Confirmar</a>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        
        ticketsEl.innerHTML = html;
    } catch (error) {
        console.error('Error cargando tickets pendientes:', error);
    }
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
 * Carga las armas activas y solicitudes de balas
 */
async function cargarArmasActivas() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    try {
        if (esVendedor()) {
            const armas = await obtenerArmasActivasVendedor(currentUser.id);
            const armasEl = document.getElementById('armasActivas');
            
            if (!armasEl) return;
            
            if (armas.length === 0) {
                armasEl.innerHTML = '<p style="color: #6b7280;">No tienes armas activas</p>';
                return;
            }
            
            let html = '<div class="armas-list">';
            armas.forEach(arma => {
                const solicitudesPendientes = (arma.solicitudesBalas || []).filter(s => s.estado === 'pendiente');
                
                html += `
                    <div class="arma-item">
                        <div class="arma-header">
                            <strong>${arma.tipoArma}</strong>
                            ${arma.chaleco ? '<span class="badge">Con Chaleco</span>' : ''}
                        </div>
                        <div class="arma-info">
                            <p>De: ${arma.dealerNombre}</p>
                            ${solicitudesPendientes.length > 0 ? 
                                `<p class="solicitud-pendiente">${solicitudesPendientes.length} solicitud(es) de balas pendiente(s)</p>` : 
                                ''
                            }
                        </div>
                        <div class="arma-acciones">
                            <a href="armas.html?id=${arma.id}" class="btn-primary btn-sm">Ver Detalles</a>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
            
            armasEl.innerHTML = html;
        } else if (esDealer()) {
            const solicitudes = await obtenerSolicitudesBalasPendientes(currentUser.id);
            const armasEl = document.getElementById('armasActivas');
            
            if (!armasEl) return;
            
            if (solicitudes.length === 0) {
                armasEl.innerHTML = '<p style="color: #6b7280;">No hay solicitudes de balas pendientes</p>';
                return;
            }
            
            let html = '<div class="armas-list">';
            solicitudes.forEach(arma => {
                html += `
                    <div class="arma-item">
                        <div class="arma-header">
                            <strong>${arma.tipoArma}</strong>
                            <span class="estado-badge pendiente">Solicitudes Pendientes</span>
                        </div>
                        <div class="arma-info">
                            <p>Vendedor: ${arma.vendedorNombre}</p>
                            <p class="solicitud-pendiente">${arma.solicitudesPendientes.length} solicitud(es) pendiente(s)</p>
                        </div>
                        <div class="arma-acciones">
                            <a href="armas.html?id=${arma.id}" class="btn-primary btn-sm">Ver Detalles</a>
                        </div>
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
    
    // Los dealers también ven las secciones de vendedor (metas, entregas, tickets)
    // No ocultamos secciones, todos ven todo
    
    // Cargar datos
    await cargarResumenMetas();
    await cargarEntregasPendientes();
    await cargarTicketsPendientes();
    await cargarEstadisticasDiarias();
    await cargarEstadisticasSemanales();
    await cargarArmasActivas();
}

