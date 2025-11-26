// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCiTwuyK3h7Q7iFNgD3qLzWZeWfXOhrrao",
    authDomain: "fichaytuning.firebaseapp.com",
    projectId: "fichaytuning",
    storageBucket: "fichaytuning.firebasestorage.app",
    messagingSenderId: "1021393431204",
    appId: "1:1021393431204:web:268fc509847140b18b1431"
};

// Inicializar Firebase - Variable global
var db;

// Función para inicializar Firebase
function initializeFirebase() {
    if (typeof firebase !== 'undefined') {
        try {
            // Verificar si ya está inicializado
            if (!firebase.apps || firebase.apps.length === 0) {
                firebase.initializeApp(firebaseConfig);
            }
            db = firebase.firestore();
            console.log('Firebase inicializado correctamente');
        } catch (error) {
            console.error('Error inicializando Firebase:', error);
        }
    } else {
        console.error("Firebase SDK no está cargado. Asegúrate de incluir los scripts de Firebase.");
    }
}

// Intentar inicializar inmediatamente
initializeFirebase();

// Si no funcionó, intentar cuando el DOM esté listo
if (typeof db === 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFirebase);
    } else {
        // DOM ya está listo, intentar de nuevo después de un breve delay
        setTimeout(initializeFirebase, 100);
    }
}