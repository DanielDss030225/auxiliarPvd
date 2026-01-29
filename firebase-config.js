// Configuração do Firebase extraída de visualizador.js
const firebaseConfig = {
    apiKey: "AIzaSyDQWO9csuYqrd0JyXa_cs4f3jAsjQAEWSw",
    authDomain: "meu-site-fd954.firebaseapp.com",
    projectId: "meu-site-fd954",
    storageBucket: "meu-site-fd954.appspot.com",
    messagingSenderId: "1062346912662",
    appId: "1:1062346912662:web:0f41873e12965c545363b7",
    measurementId: "G-5HXX5ZZKER"
};

// Inicializa Firebase apenas se ainda não estiver inicializado
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();
