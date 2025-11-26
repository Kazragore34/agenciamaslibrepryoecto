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
    if (typeof firebase !== 'undefined' && typeof firebase.firestore !== 'undefined') {
        try {
            // Verificar si ya está inicializado
            if (!firebase.apps || firebase.apps.length === 0) {
                firebase.initializeApp(firebaseConfig);
            }
            db = firebase.firestore();
            console.log('Firebase inicializado correctamente');
            return true;
        } catch (error) {
            console.error('Error inicializando Firebase:', error);
            return false;
        }
    }
    return false;
}

// Función para esperar a que Firebase esté disponible
function waitForFirebase(callback, maxAttempts = 50) {
    let attempts = 0;
    const checkFirebase = setInterval(function() {
        attempts++;
        if (initializeFirebase()) {
            clearInterval(checkFirebase);
            if (callback) callback();
        } else if (attempts >= maxAttempts) {
            clearInterval(checkFirebase);
            console.error('Firebase no se pudo inicializar después de varios intentos');
        }
    }, 100);
}

// Intentar inicializar inmediatamente
if (!initializeFirebase()) {
    // Si no funcionó, esperar a que Firebase esté disponible
    waitForFirebase(function() {
        console.log('Firebase inicializado después de esperar');
    });
}