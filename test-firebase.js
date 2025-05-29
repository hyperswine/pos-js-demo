#!/usr/bin/env node

/**
 * Firebase Integration Test Script
 * This script tests the Firebase/Firestore connection without running the full app
 */

const { initializeApp } = require('firebase/app')
const { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } = require('firebase/firestore')

// Test Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "your-api-key-here",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "your-app-id"
}

async function testFirebaseConnection() {
  console.log('🔥 Testing Firebase Integration...\n')

  try {
    // Initialize Firebase
    console.log('1. Initializing Firebase...')
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    console.log('✅ Firebase initialized successfully\n')

    // Test Firestore connection
    console.log('2. Testing Firestore connection...')

    // Test inventory collection
    const testItem = {
      name: 'Test Item',
      price: 1.99,
      stock: 10,
      category: 'Test',
      sku: 'TEST001',
      createdAt: new Date(),
      isTestData: true
    }

    console.log('   Adding test item to inventory...')
    const docRef = await addDoc(collection(db, 'inventory'), testItem)
    console.log('✅ Test item added with ID:', docRef.id)

    console.log('   Reading inventory collection...')
    const querySnapshot = await getDocs(collection(db, 'inventory'))
    const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    console.log('✅ Found', items.length, 'item(s) in inventory')

    // Clean up test data
    console.log('   Cleaning up test data...')
    await deleteDoc(doc(db, 'inventory', docRef.id))
    console.log('✅ Test data cleaned up\n')

    // Test transactions collection
    console.log('3. Testing transactions collection...')
    const testTransaction = {
      items: [{ id: 'test', name: 'Test Item', price: 1.99, quantity: 1 }],
      total: 1.99,
      timestamp: new Date().toISOString(),
      timestampFormatted: new Date().toLocaleString(),
      isTestData: true
    }

    console.log('   Adding test transaction...')
    const transactionRef = await addDoc(collection(db, 'transactions'), testTransaction)
    console.log('✅ Test transaction added with ID:', transactionRef.id)

    console.log('   Reading transactions collection...')
    const transactionSnapshot = await getDocs(collection(db, 'transactions'))
    const transactions = transactionSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    console.log('✅ Found', transactions.length, 'transaction(s)')

    // Clean up test transaction
    await deleteDoc(doc(db, 'transactions', transactionRef.id))
    console.log('✅ Test transaction cleaned up\n')

    console.log('🎉 All Firebase tests passed successfully!')
    console.log('\n📋 Summary:')
    console.log('   - Firebase initialization: ✅')
    console.log('   - Firestore connection: ✅')
    console.log('   - Inventory collection: ✅')
    console.log('   - Transactions collection: ✅')
    console.log('   - Data cleanup: ✅')
    console.log('\n🚀 Your POS system is ready to use Firebase!')

  } catch (error) {
    console.error('❌ Firebase test failed:', error.message)
    console.log('\n🔧 Troubleshooting steps:')
    console.log('1. Check your Firebase configuration in src/lib/firebase.js')
    console.log('2. Ensure your Firestore database is created')
    console.log('3. Verify Firestore security rules allow read/write access')
    console.log('4. Check your internet connection')
    console.log('5. Make sure the Firebase project exists and is active')

    if (error.code) {
      console.log(`\n🐛 Error code: ${error.code}`)
    }

    process.exit(1)
  }
}

// Run the test
if (require.main === module) {
  testFirebaseConnection()
}

module.exports = { testFirebaseConnection }
