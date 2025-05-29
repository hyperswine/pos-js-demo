// Firebase configuration and initialization
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getDemoFirebaseConfig } from './config'

// Get Firebase configuration (environment variables or demo config)
const firebaseConfig = getDemoFirebaseConfig()

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore
export const db = getFirestore(app)

export default app
