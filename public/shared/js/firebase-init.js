// DÁN cấu hình Firebase của anh vào đây
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyD_rJgBFgBulheVenQUE2KXr4PBpSpTCxw",
  authDomain: "etax-7fbf8.firebaseapp.com",
  projectId: "etax-7fbf8",
  storageBucket: "etax-7fbf8.appspot.com",
  messagingSenderId: "1030026724634",
  appId: "1:1030026724634:web:d76f5f9dad43bad6fd58a3"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);