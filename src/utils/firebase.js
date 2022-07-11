import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { getAnalytics } from "firebase/analytics";
import config from './config';

// Initialize firebase
export const firebaseApp = initializeApp(config);

// Initialize auth && firestore with the 'firebaseApp' property
export const firebaseAuth = getAuth(firebaseApp);
if (process.env.NODE_ENV !== 'production') {
    connectAuthEmulator(firebaseAuth, "http://localhost:9099");
}

export const firestore = getFirestore(firebaseApp);
if (process.env.NODE_ENV !== 'production') {
    connectFirestoreEmulator(firestore, "localhost", 8080);
}

// https://stackoverflow.com/questions/57547745/how-to-use-httpscallable-on-a-region-other-then-us-central1-for-web
export const functions = getFunctions(
    firebaseApp,
    "australia-southeast1"
);
if (process.env.NODE_ENV !== 'production') {
    connectFunctionsEmulator(functions, "localhost", 5001);
}

export const analytics = getAnalytics(firebaseApp);
