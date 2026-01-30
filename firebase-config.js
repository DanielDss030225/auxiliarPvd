
// Inicializa Firebase apenas se ainda não estiver inicializado
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();
