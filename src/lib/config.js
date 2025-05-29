// Demo Firebase configuration for GitHub Pages
// This file provides fallback configuration when environment variables aren't available

const getDemoFirebaseConfig = () => {
  // Check if we have environment variables (preferred)
  if (
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  ) {
    return {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
    }
  }

  // Fallback demo configuration (replace with your actual config for deployment)
  console.warn('Using demo Firebase configuration. Replace with actual config for production.')

  return {
    apiKey: "demo-api-key",
    authDomain: "demo-project.firebaseapp.com",
    projectId: "demo-project-id",
    storageBucket: "demo-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "demo-app-id"
  }
}

const getAccessKey = () => {
  return process.env.NEXT_PUBLIC_ACCESS_KEY || 'admin123'
}

export { getDemoFirebaseConfig, getAccessKey }
