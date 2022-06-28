import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import config from './config';

// Initialize firebase
export const firebaseApp = initializeApp(config);

// Initialize auth && firestore with the 'firebaseApp' property
export const auth = getAuth(firebaseApp);
connectAuthEmulator(auth, "http://localhost:9099");

export const firestore = getFirestore(firebaseApp);
connectFirestoreEmulator(firestore, "localhost", 8080);

// https://stackoverflow.com/questions/57547745/how-to-use-httpscallable-on-a-region-other-then-us-central1-for-web
export const functions = getFunctions(
    firebaseApp,
    "australia-southeast1"
);
connectFunctionsEmulator(functions, "localhost", 5001);