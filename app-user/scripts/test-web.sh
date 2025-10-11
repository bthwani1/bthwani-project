#!/bin/bash

# Web Testing Script for بثواني App
echo "🚀 Starting web tests for بثواني App..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run type checking
echo "🔍 Running TypeScript checks..."
npm run typecheck

if [ $? -ne 0 ]; then
    echo "❌ TypeScript errors found. Please fix them before continuing."
    exit 1
fi

# Run linting
echo "🎯 Running ESLint..."
npm run lint

if [ $? -ne 0 ]; then
    echo "⚠️  Linting issues found. Consider fixing them for better code quality."
fi

# Build for web
echo "🔨 Building for web..."
npm run web --if-present || npx expo export --platform web

if [ $? -ne 0 ]; then
    echo "❌ Web build failed."
    exit 1
fi

# Run tests
echo "🧪 Running tests..."
npm test -- --testPathPattern="__tests__" --passWithNoTests

if [ $? -ne 0 ]; then
    echo "⚠️  Some tests failed. Check the output above."
fi

echo "✅ Web testing completed!"
echo ""
echo "📋 Next steps:"
echo "1. Test the app manually: npm run web"
echo "2. Check PWA features in browser dev tools"
echo "3. Test on different devices and screen sizes"
echo "4. Verify offline functionality"
echo "5. Test push notifications (if applicable)"
