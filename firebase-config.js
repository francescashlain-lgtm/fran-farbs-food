// Firebase configuration and initialization
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_IojcmA6PK39zA7V0TORkXcwXmrKsYn8",
  authDomain: "fran-farbs-food.firebaseapp.com",
  projectId: "fran-farbs-food",
  storageBucket: "fran-farbs-food.firebasestorage.app",
  messagingSenderId: "235791975194",
  appId: "1:235791975194:web:5ddf3a904406622f05a2a3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Current user state
let currentUser = null;
let unsubscribeSnapshot = null;

// Auth state change callback (will be set by app.js)
let onUserChanged = null;

// Listen for auth state changes
onAuthStateChanged(auth, async (user) => {
  currentUser = user;

  if (user) {
    // User signed in - start listening to their data
    startDataSync(user.uid);
  } else {
    // User signed out - stop listening
    if (unsubscribeSnapshot) {
      unsubscribeSnapshot();
      unsubscribeSnapshot = null;
    }
  }

  // Notify app.js of auth state change
  if (onUserChanged) {
    onUserChanged(user);
  }
});

// Sign in with Google
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

// Sign out
export async function signOutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

// Get current user
export function getCurrentUser() {
  return currentUser;
}

// Set callback for auth state changes
export function setAuthStateCallback(callback) {
  onUserChanged = callback;
  // If user is already signed in, call callback immediately
  if (currentUser) {
    callback(currentUser);
  }
}

// Shared document used by all accounts
const sharedDocRef = () => doc(db, 'shared', 'main');

// Start real-time sync for shared data
function startDataSync(uid) {
  unsubscribeSnapshot = onSnapshot(sharedDocRef(), (docSnap) => {
    if (docSnap.exists()) {
      const cloudData = docSnap.data();
      // Notify app.js that cloud data is available
      if (window.onCloudDataReceived) {
        window.onCloudDataReceived(cloudData);
      }
    }
  }, (error) => {
    console.error('Firestore sync error:', error);
  });
}

// Save data to Firestore shared document
export async function saveToCloud(data) {
  if (!currentUser) return false;

  try {
    await setDoc(sharedDocRef(), {
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving to cloud:', error);
    return false;
  }
}

// Load shared data from Firestore (one-time fetch)
export async function loadFromCloud() {
  if (!currentUser) return null;

  try {
    const docSnap = await getDoc(sharedDocRef());

    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error loading from cloud:', error);
    return null;
  }
}

// Export auth and db for direct access if needed
export { auth, db };
