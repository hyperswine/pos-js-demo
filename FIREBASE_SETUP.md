# Firebase Setup Guide for Quantii POS System

## Prerequisites
1. A Google account
2. Node.js and npm installed

## Setup Steps

### 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name (e.g., "quantii-pos-system")
4. Disable Google Analytics (optional for this project)
5. Click "Create project"

### 2. Set up Firestore Database
1. In your Firebase project, click "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location closest to your users
5. Click "Done"

### 3. Get Firebase Configuration
1. In your Firebase project, click the gear icon → "Project settings"
2. Scroll down to "Your apps" section
3. Click the web icon (`</>`) to add a web app
4. Give your app a name (e.g., "Quantii POS")
5. Click "Register app"
6. Copy the configuration object

### 4. Update Firebase Configuration
1. Open `src/lib/firebase.js`
2. Replace the placeholder configuration with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-actual-app-id"
}
```

### 5. Set Up Firestore Security Rules (Optional)
For production, update your Firestore rules in the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all documents for now
    // In production, implement proper authentication
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 6. Test the Integration
1. Start your development server: `npm run dev`
2. Login with the demo key: `admin123`
3. Try adding/editing inventory items
4. Process a transaction
5. Check your Firestore console to see the data

## Collections Structure

The app creates these Firestore collections:

### `inventory`
```javascript
{
  name: "Coffee",
  price: 3.50,
  stock: 100,
  category: "Beverages",
  sku: "BEV001",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### `transactions`
```javascript
{
  items: [
    {
      id: "item-id",
      name: "Coffee",
      price: 3.50,
      quantity: 2
    }
  ],
  total: 7.00,
  timestamp: "2025-05-30T...",
  timestampFormatted: "5/30/2025, 2:30:00 PM",
  createdAt: timestamp
}
```

### `settings` (future use)
```javascript
{
  storeName: "Quantii System",
  currency: "USD",
  taxRate: 0.08,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Features Enabled

✅ **Persistent Inventory Management**
- Add, edit, delete items with Firestore sync
- Real-time stock updates

✅ **Transaction History**
- All transactions saved to Firestore
- Automatic inventory updates on purchase

✅ **Offline Fallback**
- App works offline with local data
- Error messages for connection issues

✅ **Loading States**
- Visual feedback during database operations
- Disabled buttons prevent duplicate actions

## Next Steps

1. **Authentication**: Implement proper user authentication
2. **Real-time Updates**: Add real-time listeners for multi-user scenarios
3. **Data Validation**: Add form validation and data sanitization
4. **Backup**: Implement data export/import features
5. **Analytics**: Add sales reporting and analytics

## Troubleshooting

**Common Issues:**

1. **"Permission denied" errors**: Check Firestore security rules
2. **"Firebase not initialized"**: Verify your configuration in `firebase.js`
3. **Data not syncing**: Check your internet connection and Firebase project status
4. **Build errors**: Ensure all Firebase packages are installed correctly

**Development Mode:**
- The app will show "Using offline mode" if Firestore connection fails
- Default data will be used for testing
