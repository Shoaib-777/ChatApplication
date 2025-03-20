import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCdLJJ-UMStJ6hQ33RbBbJ9Msrxyx7iJeI",
  authDomain: "admin-dashboard-b87b4.firebaseapp.com",
  databaseURL: "https://admin-dashboard-b87b4-default-rtdb.firebaseio.com",
  projectId: "admin-dashboard-b87b4",
  storageBucket: "admin-dashboard-b87b4.appspot.com",
  messagingSenderId: "552184790838",
  appId: "1:552184790838:web:23632a7dad1c76b4cb3d97"
};

export const app = initializeApp(firebaseConfig);
export const DB = getFirestore(app)
export const storage = getStorage(app)