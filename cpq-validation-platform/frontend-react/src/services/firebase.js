import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if Firebase config is properly set
const isFirebaseConfigured = firebaseConfig.projectId && 
                              firebaseConfig.apiKey && 
                              firebaseConfig.projectId !== 'undefined' &&
                              firebaseConfig.apiKey !== 'undefined';

let app = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    console.warn('Orders will be saved to localStorage only. Please configure Firebase in .env file.');
  }
} else {
  console.warn('⚠️ Firebase not configured. Please create a .env file with:');
  console.warn('   VITE_FIREBASE_API_KEY=your_api_key');
  console.warn('   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain');
  console.warn('   VITE_FIREBASE_PROJECT_ID=your_project_id');
  console.warn('   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket');
  console.warn('   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id');
  console.warn('   VITE_FIREBASE_APP_ID=your_app_id');
  console.warn('Orders will be saved to localStorage only.');
}

export { db };

// Enable offline persistence (if supported)
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Firebase persistence: Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('Firebase persistence: The current browser does not support offline persistence.');
    }
  });
} catch (error) {
  console.warn('Firebase persistence setup failed:', error);
}
