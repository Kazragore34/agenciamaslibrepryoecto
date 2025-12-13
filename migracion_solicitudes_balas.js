/**
 * Script de migración para corregir el campo solicitudesBalas en la base de datos
 * 
 * INSTRUCCIONES:
 * 1. Abre la consola del navegador (F12) en cualquier página de la aplicación
 * 2. Copia y pega todo este código en la consola
 * 3. Presiona Enter para ejecutar
 * 4. Espera a que termine (verás mensajes en la consola)
 */

async function migrarSolicitudesBalas() {
    console.log('=== INICIANDO MIGRACIÓN DE SOLICITUDES DE BALAS ===');
    
    try {
        // Asegurar que db esté disponible
        if (typeof db === 'undefined') {
            throw new Error('Firebase no está inicializado. Por favor, recarga la página.');
        }
        
        // Obtener todas las armas
        const snapshot = await db.collection('entregas_armas').get();
        console.log(`Total de armas encontradas: ${snapshot.size}`);
        
        let armasActualizadas = 0;
        let armasConProblemas = 0;
        let solicitudesCorregidas = 0;
        
        const batch = db.batch();
        let batchCount = 0;
        const BATCH_SIZE = 500; // Firestore permite máximo 500 operaciones por batch
        
        snapshot.forEach((doc) => {
            const armaData = doc.data();
            let necesitaActualizacion = false;
            const actualizaciones = {};
            
            // Verificar si falta el campo solicitudesBalas
            if (!armaData.hasOwnProperty('solicitudesBalas')) {
                console.log(`Arma ${doc.id}: Falta campo solicitudesBalas, agregando...`);
                actualizaciones.solicitudesBalas = [];
                necesitaActualizacion = true;
            }
            // Verificar si el campo no es un array
            else if (!Array.isArray(armaData.solicitudesBalas)) {
                console.log(`Arma ${doc.id}: Campo solicitudesBalas no es un array (tipo: ${typeof armaData.solicitudesBalas}), corrigiendo...`);
                actualizaciones.solicitudesBalas = [];
                necesitaActualizacion = true;
            }
            // Verificar y corregir solicitudes que no tengan el formato correcto
            else if (Array.isArray(armaData.solicitudesBalas) && armaData.solicitudesBalas.length > 0) {
                let tieneProblemas = false;
                const solicitudesCorregidas = armaData.solicitudesBalas.map(solicitud => {
                    // Si la solicitud no tiene estado, agregarlo como 'pendiente'
                    if (!solicitud.hasOwnProperty('estado')) {
                        console.log(`Arma ${doc.id}: Solicitud sin estado, agregando estado 'pendiente'`);
                        tieneProblemas = true;
                        return {
                            ...solicitud,
                            estado: 'pendiente'
                        };
                    }
                    // Si el estado no es string, convertirlo
                    if (typeof solicitud.estado !== 'string') {
                        console.log(`Arma ${doc.id}: Estado no es string (tipo: ${typeof solicitud.estado}), corrigiendo...`);
                        tieneProblemas = true;
                        return {
                            ...solicitud,
                            estado: String(solicitud.estado) === 'pendiente' ? 'pendiente' : 'entregada'
                        };
                    }
                    return solicitud;
                });
                
                if (tieneProblemas) {
                    actualizaciones.solicitudesBalas = solicitudesCorregidas;
                    necesitaActualizacion = true;
                    solicitudesCorregidas++;
                }
            }
            
            if (necesitaActualizacion) {
                batch.update(doc.ref, actualizaciones);
                batchCount++;
                armasActualizadas++;
                
                // Si el batch está lleno, hacer commit y crear uno nuevo
                if (batchCount >= BATCH_SIZE) {
                    await batch.commit();
                    console.log(`Batch de ${batchCount} actualizaciones guardado`);
                    batchCount = 0;
                }
            }
        });
        
        // Hacer commit del batch final si hay actualizaciones pendientes
        if (batchCount > 0) {
            await batch.commit();
            console.log(`Batch final de ${batchCount} actualizaciones guardado`);
        }
        
        console.log('=== MIGRACIÓN COMPLETADA ===');
        console.log(`Armas actualizadas: ${armasActualizadas}`);
        console.log(`Solicitudes corregidas: ${solicitudesCorregidas}`);
        console.log('✅ La migración se completó exitosamente');
        
        return {
            totalArmas: snapshot.size,
            armasActualizadas,
            solicitudesCorregidas
        };
        
    } catch (error) {
        console.error('❌ Error en la migración:', error);
        throw error;
    }
}

// Ejecutar la migración
migrarSolicitudesBalas()
    .then(resultado => {
        console.log('Resultado final:', resultado);
        alert(`Migración completada:\n- Total armas: ${resultado.totalArmas}\n- Armas actualizadas: ${resultado.armasActualizadas}\n- Solicitudes corregidas: ${resultado.solicitudesCorregidas}`);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error en la migración: ' + error.message);
    });

