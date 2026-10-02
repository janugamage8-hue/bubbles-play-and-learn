// ==============================================================================
// Bubbles Play & Learn Co. - Firebase Configuration & Firestore Initialization
// ==============================================================================

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// ------------------------------------------------------------------------------
// 🔑 FIREBASE CREDENTIALS CONFIGURATION
// Replace the values below with your Firebase Project settings:
// 1. Go to https://console.firebase.google.com/ and select your project.
// 2. Open Project Settings -> General -> Your apps -> Web apps.
// 3. Copy the configuration object into firebaseConfig below.
// ------------------------------------------------------------------------------
export const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForBubblesAppPlaceholder123",
  authDomain: "bubbles-play-and-learn.firebaseapp.com",
  projectId: "bubbles-play-and-learn",
  storageBucket: "bubbles-play-and-learn.appspot.com",
  messagingSenderId: "109876543210",
  appId: "1:109876543210:web:abcdef1234567890"
};

// Check if dynamic configuration is provided in localStorage for browser testing
if (typeof localStorage !== 'undefined') {
  try {
    const customConfig = localStorage.getItem('BUBBLES_FIREBASE_CONFIG');
    if (customConfig) {
      Object.assign(firebaseConfig, JSON.parse(customConfig));
    }
  } catch (e) {
    console.warn('Could not parse BUBBLES_FIREBASE_CONFIG from localStorage', e);
  }
}

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Cloud Firestore instance using getFirestore(app)
export const db = getFirestore(app);

// Attach globally for browser convenience
if (typeof window !== 'undefined') {
  window.bubblesFirebase = { app, db, firebaseConfig };
}

export { app };
export default db;
