#!/usr/bin/env node

/**
 * Quick Firebase Status Checker
 * Run this to test if Firebase/Firestore is working
 */

require('dotenv').config({ path: '.env.local' });

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, getDoc, deleteDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

async function quickTest() {
  console.log('🔥 Quick Firebase Status Check');
  console.log('===============================');
  console.log(`Project: ${firebaseConfig.projectId}`);
  console.log('');

  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log('✅ Firebase initialized');

    // Try to write a test document
    const testRef = doc(db, 'test', 'connection');
    await setDoc(testRef, {
      timestamp: new Date().toISOString(),
      message: 'Firebase is working!'
    });

    console.log('✅ Firestore write successful');

    // Try to read it back
    const docSnap = await getDoc(testRef);
    if (docSnap.exists()) {
      console.log('✅ Firestore read successful');
      console.log('📄 Test data:', docSnap.data());
    }

    // Clean up
    await deleteDoc(testRef);
    console.log('✅ Test cleanup complete');

    console.log('');
    console.log('🎉 SUCCESS: Firebase/Firestore is working perfectly!');
    console.log('🚀 Your POS app is ready to use at http://localhost:3000');

  } catch (error) {
    console.log('');
    console.log('❌ Firebase Error:', error.message);

    if (error.message.includes('PERMISSION_DENIED')) {
      console.log('');
      console.log('🔧 SOLUTION: Enable Firestore in Firebase Console');
      console.log('   1. Go to: https://console.firebase.google.com/');
      console.log(`   2. Select project: ${firebaseConfig.projectId}`);
      console.log('   3. Click "Firestore Database" in sidebar');
      console.log('   4. Click "Create database"');
      console.log('   5. Choose "Start in test mode"');
      console.log('   6. Select a location and click "Done"');
    }
  }

  process.exit(0);
}

quickTest();
