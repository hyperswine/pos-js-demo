# Quick Deployment Guide

## 🚀 Deploy to GitHub Pages in 5 Steps

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project: "your-pos-system"
3. Set up Firestore database in test mode
4. Get your web app configuration

### Step 2: Configure GitHub Secrets
In your GitHub repo → Settings → Secrets and variables → Actions:

Add these secrets from your Firebase config:
```
FIREBASE_API_KEY=AIza...
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123...
ACCESS_KEY=admin123
```

### Step 3: Enable GitHub Pages
1. Repository → Settings → Pages
2. Source: **"GitHub Actions"**
3. Save

### Step 4: Deploy
```bash
git add .
git commit -m "Deploy POS system to GitHub Pages"
git push origin main
```

### Step 5: Access Your App
- Your site will be available at: `https://yourusername.github.io/pos-js-demo`
- Login with: `admin123` (or your custom ACCESS_KEY)

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Test production build
npm run build
npx serve out
```

## ✅ Verification

Run the deployment checker:
```bash
./deploy-check.sh
```

## 📚 Detailed Guides

- **Firebase Setup**: `FIREBASE_SETUP.md`
- **Full Deployment Guide**: `DEPLOYMENT.md`
- **Project Documentation**: `README.md`

## 🆘 Need Help?

**Common Issues:**
1. **Build fails**: Check Firebase config in GitHub secrets
2. **404 errors**: Verify GitHub Pages source is "GitHub Actions"
3. **App won't load**: Check browser console for errors
4. **Firebase errors**: Verify Firestore security rules allow access

**Alternative Hosting:**
- **Vercel**: Connect repo + add env vars (recommended)
- **Netlify**: Connect repo + configure build settings
- **Self-hosted**: Build locally and upload `out/` folder
