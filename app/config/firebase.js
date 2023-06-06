import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';
import firebase from 'firebase/app';
import 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyDuCpDiOkX7zNZtX_6zyraDzNLf0K5Pfnc",
    authDomain: "chat-45200.firebaseapp.com",
    databaseURL: "https://chat-45200-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "chat-45200",
    storageBucket: "chat-45200.appspot.com",
    messagingSenderId: "565316550802",
    appId: "1:565316550802:web:5c2d29e1344c795ac4a64b"
  };

// เชื่อมต่อ Firebase
firebase.initializeApp(firebaseConfig);

// สร้างอินสแตนซ์ของ Realtime Database
const database = firebase.database();

export default database;
