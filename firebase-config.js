// Configuración de Firebase
// IMPORTANTE: Reemplaza estos valores con los de tu proyecto Firebase
// Obtén estos valores desde Firebase Console > Project Settings > General > Your apps

const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_PROJECT_ID.firebaseapp.com",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_PROJECT_ID.appspot.com",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
};

// Inicializar Firebase
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
} else {
    console.error("Firebase SDK no está cargado. Asegúrate de incluir los scripts de Firebase.");
}

