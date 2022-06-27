import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import config from './config';

// Initialize firebase
export const firebaseApp = initializeApp(config);

// Initialize auth && firestore with the 'firebaseApp' property
export const auth = getAuth(firebaseApp);
// connectAuthEmulator(auth, "http://localhost:9099");

export const firestore = getFirestore(firebaseApp);
