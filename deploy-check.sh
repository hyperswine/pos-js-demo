#!/bin/bash

# GitHub Pages Deployment Checklist & Test Script
# Run this script to verify your setup before deploying

echo "🚀 GitHub Pages Deployment Checklist"
echo "====================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project directory confirmed"

# Check if required files exist
echo ""
echo "📋 Checking required files..."

required_files=(
    "next.config.mjs"
    ".github/workflows/deploy.yml"
    "src/lib/firebase.js"
    "src/lib/firestore.js"
    "src/lib/config.js"
    "DEPLOYMENT.md"
    "FIREBASE_SETUP.md"
)

all_files_exist=true
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        all_files_exist=false
    fi
done

if [ "$all_files_exist" = false ]; then
    echo ""
    echo "❌ Some required files are missing. Please check your setup."
    exit 1
fi

# Test build
echo ""
echo "🔨 Testing build process..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Build successful"
else
    echo "❌ Build failed - check 'npm run build' output"
    exit 1
fi

# Check if out directory was created
if [ -d "out" ]; then
    echo "✅ Static files generated in 'out' directory"
    echo "   📦 Files: $(find out -type f | wc -l | tr -d ' ') files"
    echo "   📏 Size: $(du -sh out | cut -f1)"
else
    echo "❌ 'out' directory not found"
    exit 1
fi

# Environment check
echo ""
echo "🔧 Environment configuration..."
if [ -f ".env.local" ]; then
    echo "✅ .env.local exists (for local development)"
else
    echo "⚠️  .env.local not found (okay for GitHub Pages deployment)"
fi

echo ""
echo "📝 GitHub Secrets needed for deployment:"
echo "   - FIREBASE_API_KEY"
echo "   - FIREBASE_AUTH_DOMAIN"
echo "   - FIREBASE_PROJECT_ID"
echo "   - FIREBASE_STORAGE_BUCKET"
echo "   - FIREBASE_MESSAGING_SENDER_ID"
echo "   - FIREBASE_APP_ID"
echo "   - ACCESS_KEY (optional, defaults to 'admin123')"

echo ""
echo "🎯 Next Steps:"
echo "1. Create Firebase project (see FIREBASE_SETUP.md)"
echo "2. Add GitHub repository secrets (see DEPLOYMENT.md)"
echo "3. Enable GitHub Pages with 'GitHub Actions' source"
echo "4. Push to main branch to trigger deployment"

echo ""
echo "✅ Your project is ready for GitHub Pages deployment!"
echo ""
echo "📚 Documentation:"
echo "   - Firebase setup: FIREBASE_SETUP.md"
echo "   - Deployment guide: DEPLOYMENT.md"
echo "   - Project info: README.md"
