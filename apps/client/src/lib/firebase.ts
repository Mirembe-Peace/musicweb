import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyBwsUbW4cSlO3uyv78slQX93Z8xJ-6BXJ4',
  authDomain: 'ashabamusicug.firebaseapp.com',
  projectId: 'ashabamusicug',
  storageBucket: 'ashabamusicug.firebasestorage.app',
  messagingSenderId: '683674583629',
  appId: '1:683674583629:web:88c9a3a64e9b792f709204',
  measurementId: 'G-5ZVNK7Y6C0',
};

export const firebaseApp = initializeApp(firebaseConfig);

// Only init analytics in the browser (skips SSR/build and unsupported browsers)
export const initAnalytics = async () => {
  if (await isSupported()) {
    return getAnalytics(firebaseApp);
  }
  return null;
};
