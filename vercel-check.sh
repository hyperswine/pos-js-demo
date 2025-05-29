#!/bin/zsh

# Vercel Deployment Verification Script
# Run this to ensure your POS system is ready for Vercel deployment

echo "🚀 Vercel Deployment Verification"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project directory confirmed"

# Check required files for Vercel deployment
echo ""
echo "📋 Checking Vercel deployment files..."

required_files=(
    "next.config.mjs"
    "vercel.json"
    "src/lib/firebase.js"
    "src/lib/firestore.js"
    "VERCEL_DEPLOYMENT.md"
    "FIREBASE_SETUP.md"
    ".env.example"
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

# Check for GitHub Pages remnants (should be cleaned up)
echo ""
echo "🧹 Checking for GitHub Pages cleanup..."

github_pages_files=(
    ".github/workflows/deploy.yml"
    "src/lib/config.js"
    "deploy-check.sh"
    "DEPLOYMENT.md"
    "QUICK_DEPLOY.md"
)

cleanup_needed=false
for file in "${github_pages_files[@]}"; do
    if [ -f "$file" ] || [ -d ".github" ]; then
        echo "⚠️  Found GitHub Pages file: $file (can be removed)"
        cleanup_needed=true
    fi
done

if [ "$cleanup_needed" = false ]; then
    echo "✅ No GitHub Pages files found - clean setup"
fi

# Test Next.js build
echo ""
echo "🔨 Testing Next.js build..."
if npm run build > /tmp/build.log 2>&1; then
    echo "✅ Build successful"
else
    echo "❌ Build failed - check output:"
    cat /tmp/build.log
    exit 1
fi

# Check Next.js config for Vercel compatibility
echo ""
echo "⚙️  Checking Next.js configuration..."
if grep -q "output.*export" next.config.mjs; then
    echo "⚠️  Found 'output: export' in next.config.mjs - this is for static hosting"
    echo "   Vercel doesn't need this setting (it can use server features)"
else
    echo "✅ Next.js config is optimized for Vercel"
fi

# Environment variables check
echo ""
echo "🔧 Environment variables..."
if [ -f ".env.local" ]; then
    echo "✅ .env.local exists (for local development)"

    # Check if Firebase vars are defined
    if grep -q "NEXT_PUBLIC_FIREBASE" .env.local; then
        echo "✅ Firebase environment variables found in .env.local"
    else
        echo "⚠️  No Firebase variables found in .env.local"
    fi
else
    echo "⚠️  .env.local not found (you'll need Firebase config for testing)"
fi

echo ""
echo "📝 Vercel Environment Variables needed:"
echo "   NEXT_PUBLIC_FIREBASE_API_KEY"
echo "   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
echo "   NEXT_PUBLIC_FIREBASE_PROJECT_ID"
echo "   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
echo "   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
echo "   NEXT_PUBLIC_FIREBASE_APP_ID"
echo "   NEXT_PUBLIC_ACCESS_KEY (optional)"

# Check package.json scripts
echo ""
echo "📦 Package.json scripts..."
if grep -q "\"export\"" package.json; then
    echo "⚠️  Found 'export' script - this is for static hosting (can be removed)"
else
    echo "✅ Clean build scripts for Vercel"
fi

echo ""
echo "🎯 Vercel Deployment Steps:"
echo "1. Push your code to GitHub"
echo "2. Connect repository to Vercel (vercel.com)"
echo "3. Add environment variables in Vercel dashboard"
echo "4. Deploy automatically!"

echo ""
if [ "$all_files_exist" = true ]; then
    echo "✅ Your POS system is ready for Vercel deployment!"
else
    echo "❌ Please fix the issues above before deploying"
fi

echo ""
echo "📚 Next steps:"
echo "   - Setup Firebase: FIREBASE_SETUP.md"
echo "   - Deploy to Vercel: VERCEL_DEPLOYMENT.md"
