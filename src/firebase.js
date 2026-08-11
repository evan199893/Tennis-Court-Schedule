import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, remove, push } from 'firebase/database';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

// Client web config (safe to ship); override via VITE_* in .env.local if needed.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCtx2fp6qxTJVgieezblSRp75soz2zyFro",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "lane87-tennis.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://lane87-tennis-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "lane87-tennis",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "lane87-tennis.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "913456995845",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:913456995845:web:a1330ab2c319a6c812466c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);

// Sign in anonymously
export const initializeAuth = () => {
  return signInAnonymously(auth);
};

// Watch for auth state changes
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Get items from Firebase
export const getItems = (callback) => {
  const itemsRef = ref(database, 'items');
  return onValue(itemsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const itemsArray = Object.entries(data).map(([key, value]) => ({
        ...value,
        id: key,
      }));
      callback(itemsArray);
    } else {
      callback([]);
    }
  });
};

// Add item to Firebase
export const addItem = (item) => {
  const itemsRef = ref(database, 'items');
  const newItemRef = push(itemsRef);
  return set(newItemRef, item);
};

// Remove item from Firebase
export const removeItemFromFirebase = (itemId) => {
  const itemRef = ref(database, `items/${itemId}`);
  return remove(itemRef);
};

// Update all items (for bulk operations)
export const updateItems = (items) => {
  const itemsRef = ref(database, 'items');
  const itemsData = {};
  items.forEach((item) => {
    if (item.id) {
      itemsData[item.id] = { ...item };
      delete itemsData[item.id].id; // Remove id from stored data
    }
  });
  return set(itemsRef, itemsData);
};
