#!/bin/bash

# Production Test Runner Script
# Runs tests with production-like environment and disabled proxy

set -e

echo "🚀 Running Production Tests with Proxy Disabled"
echo "================================================="

# Set production environment variables (disable proxy)
export NODE_ENV=production
export HTTP_PROXY=""
export HTTPS_PROXY=""
export NO_PROXY="localhost,127.0.0.1,*.local"
export DISABLE_EXTERNAL_APIS=true
export DISABLE_EMAIL_NOTIFICATIONS=true
export DISABLE_SMS_NOTIFICATIONS=true

# Load test production config if it exists
if [ -f "scripts/test-env-production.json" ]; then
    echo "📄 Loading production test configuration..."
    # Export all variables from JSON (using jq if available, otherwise skip)
    if command -v jq &> /dev/null; then
        eval "$(jq -r 'to_entries | .[] | "export \(.key)=\(.value)"' scripts/test-env-production.json)"
    else
        echo "⚠️  jq not available, using basic environment setup"
    fi
fi

# Change to backend directory
cd backend-nest

echo "🔧 Environment Configuration:"
echo "  NODE_ENV: $NODE_ENV"
echo "  HTTP_PROXY: $HTTP_PROXY"
echo "  HTTPS_PROXY: $HTTPS_PROXY"
echo "  DISABLE_EXTERNAL_APIS: $DISABLE_EXTERNAL_APIS"

# Run spectral validation first
echo ""
echo "🔍 Running Spectral OpenAPI Validation..."
if command -v spectral &> /dev/null; then
    spectral lint ../openapi.yaml --ruleset ../.spectral.yaml --fail-severity error
    echo "✅ Spectral validation passed"
else
    echo "⚠️  Spectral not installed, skipping OpenAPI validation"
fi

# Run API parity checks
echo ""
echo "⚖️  Running API Parity Checks..."
npm run audit:parity

# Run security audit
echo ""
echo "🔒 Running Security Audit..."
npm run audit:security

# Run tests if they exist
echo ""
echo "🧪 Running Unit Tests..."
if [ -f "package.json" ] && grep -q '"test"' package.json; then
    npm test
else
    echo "⚠️  No test script found"
fi

# Run contract tests
echo ""
echo "📋 Running Contract Tests..."
if [ -f "package.json" ] && grep -q '"test:contract"' package.json; then
    npm run test:contract
else
    echo "⚠️  No contract test script found"
fi

# Run e2e tests if available
echo ""
echo "🔄 Running E2E Tests..."
if [ -f "package.json" ] && grep -q '"test:e2e"' package.json; then
    npm run test:e2e
else
    echo "⚠️  No E2E test script found"
fi

echo ""
echo "🎉 All Production Tests Completed Successfully!"
echo "================================================="
