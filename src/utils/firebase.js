import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import config from './config';

// Initialize firebase
export const firebaseApp = initializeApp(config);

// Initialize auth && firestore with the 'firebaseApp' property
export const auth = getAuth(firebaseApp);
// connectAuthEmulator(auth, "http://localhost:9099");

export const firestore = getFirestore(firebaseApp);

// https://stackoverflow.com/questions/57547745/how-to-use-httpscallable-on-a-region-other-then-us-central1-for-web
export const functions = getFunctions(firebaseApp, "australia-southeast1");
