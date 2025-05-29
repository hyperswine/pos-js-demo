import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore'
import { db } from './firebase'

// Inventory operations
export const inventoryService = {
  // Get all inventory items
  async getAll() {
    try {
      const querySnapshot = await getDocs(collection(db, 'inventory'))
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error('Error fetching inventory:', error)
      throw error
    }
  },

  // Add new inventory item
  async add(item) {
    try {
      const docRef = await addDoc(collection(db, 'inventory'), {
        ...item,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return docRef.id
    } catch (error) {
      console.error('Error adding inventory item:', error)
      throw error
    }
  },

  // Update inventory item
  async update(id, updates) {
    try {
      const itemRef = doc(db, 'inventory', id)
      await updateDoc(itemRef, {
        ...updates,
        updatedAt: new Date()
      })
    } catch (error) {
      console.error('Error updating inventory item:', error)
      throw error
    }
  },

  // Delete inventory item
  async delete(id) {
    try {
      await deleteDoc(doc(db, 'inventory', id))
    } catch (error) {
      console.error('Error deleting inventory item:', error)
      throw error
    }
  },

  // Real-time listener for inventory changes
  subscribe(callback) {
    return onSnapshot(collection(db, 'inventory'), (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      callback(items)
    })
  }
}

// Transaction operations
export const transactionService = {
  // Get all transactions
  async getAll() {
    try {
      const q = query(collection(db, 'transactions'), orderBy('timestamp', 'desc'))
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error('Error fetching transactions:', error)
      throw error
    }
  },

  // Add new transaction
  async add(transaction) {
    try {
      const docRef = await addDoc(collection(db, 'transactions'), {
        ...transaction,
        createdAt: new Date()
      })
      return docRef.id
    } catch (error) {
      console.error('Error adding transaction:', error)
      throw error
    }
  },

  // Real-time listener for transaction changes
  subscribe(callback) {
    const q = query(collection(db, 'transactions'), orderBy('timestamp', 'desc'))
    return onSnapshot(q, (snapshot) => {
      const transactions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      callback(transactions)
    })
  }
}

// Settings operations (for storing app configuration)
export const settingsService = {
  // Get app settings
  async get() {
    try {
      const querySnapshot = await getDocs(collection(db, 'settings'))
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]
        return { id: doc.id, ...doc.data() }
      }
      return null
    } catch (error) {
      console.error('Error fetching settings:', error)
      throw error
    }
  },

  // Update app settings
  async update(settings) {
    try {
      const querySnapshot = await getDocs(collection(db, 'settings'))
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref
        await updateDoc(docRef, {
          ...settings,
          updatedAt: new Date()
        })
      } else {
        await addDoc(collection(db, 'settings'), {
          ...settings,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    } catch (error) {
      console.error('Error updating settings:', error)
      throw error
    }
  }
}
