# GitHub Pages Deployment Guide

## Environment Variables Challenge

GitHub Pages serves static files only and **cannot access environment variables at runtime**. However, Next.js can embed environment variables during the build process.

## Setup Instructions

### 1. Configure GitHub Repository Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → Repository secrets

Add these secrets with your Firebase configuration:

```
FIREBASE_API_KEY=your-actual-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-actual-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=your-actual-app-id
ACCESS_KEY=admin123
```

### 2. Enable GitHub Pages

1. Go to your repository → Settings → Pages
2. Source: "GitHub Actions"
3. Save

### 3. Deploy

Push to the `main` branch and GitHub Actions will automatically:
1. Install dependencies
2. Create `.env.local` from your secrets
3. Build the static site with Firebase config embedded
4. Deploy to GitHub Pages

## Alternative Deployment Options

### Option A: Vercel (Recommended for Firebase)

Vercel has excellent Next.js support and environment variable handling:

1. Connect your GitHub repo to [Vercel](https://vercel.com)
2. Add environment variables in Vercel dashboard
3. Automatic deployments on every push

### Option B: Netlify

Similar to Vercel with environment variable support:

1. Connect repo to [Netlify](https://netlify.com)
2. Add environment variables in site settings
3. Build command: `npm run build`
4. Publish directory: `out`

### Option C: Self-Hosted Static

If you prefer self-hosting:

1. Build locally with your `.env.local` file
2. Upload the `out/` folder to any static hosting
3. Configure your web server to serve the files

## Security Considerations

### Firebase Configuration in Static Files

⚠️ **Important**: When deploying to static hosting (including GitHub Pages), your Firebase config becomes publicly visible in the JavaScript bundle.

**This is generally safe because:**
- Firebase config is not sensitive (it's meant to be public)
- Security is handled by Firestore security rules
- API keys are restricted by domain/app

**To secure your data:**
1. Configure proper Firestore security rules
2. Restrict API key usage to your domains
3. Use Firebase Auth for user authentication (optional upgrade)

### Recommended Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write from your domain only
    match /{document=**} {
      allow read, write: if request.auth != null ||
        request.headers['origin'] in [
          'https://yourusername.github.io',
          'https://yourapp.vercel.app'
        ];
    }
  }
}
```

## Testing Deployment

1. **Local Testing**:
   ```bash
   npm run build
   npx serve out
   ```

2. **Check Deployed Site**:
   - Visit your GitHub Pages URL
   - Test login with your access key
   - Verify Firebase operations work
   - Check browser console for errors

## Troubleshooting

### Common Issues:

1. **404 on GitHub Pages**: Ensure `output: 'export'` in `next.config.mjs`
2. **Environment variables not working**: Check GitHub secrets configuration
3. **Firebase connection fails**: Verify API key restrictions in Firebase Console
4. **Assets not loading**: Check `basePath` configuration for your repository name

### Build Logs

Check GitHub Actions logs if deployment fails:
- Repository → Actions → Latest workflow run
- Look for error messages in build step

## Next Steps

After successful deployment:

1. **Custom Domain** (optional): Configure custom domain in GitHub Pages settings
2. **SSL Certificate**: GitHub Pages provides free SSL for `*.github.io` domains
3. **Analytics**: Add Firebase Analytics or Google Analytics
4. **Monitoring**: Set up uptime monitoring for your deployed app

## Cost Considerations

- **GitHub Pages**: Free for public repositories
- **Firebase**: Generous free tier (Spark plan)
- **Vercel/Netlify**: Free tiers available with good limits

The combination provides a completely free hosting solution for most small to medium POS applications!
