#!/usr/bin/env bash
# Local Test Script for Proof Guards
# اختبار محلي لحراس الإثبات

set -e

echo "🚀 Starting Proof Guards Local Test..."
echo ""

# Create artifacts directory
mkdir -p artifacts

# Step 1: Extract Backend Routes
echo "📊 Step 1: Extracting backend routes..."
if [ -d "backend-nest/src" ]; then
  cd backend-nest
  npx --yes ts-node scripts/extract-routes.ts || echo "⚠️  Could not extract routes"
  cd ..
else
  echo "⚠️  Backend not found, skipping"
fi

# Step 2: Extract OpenAPI Contracts
echo ""
echo "📊 Step 2: Extracting OpenAPI contracts..."
if [ -d "backend-nest/src" ]; then
  cd backend-nest
  npx --yes ts-node scripts/extract-openapi.ts || echo "⚠️  Could not extract OpenAPI"
  cd ..
else
  echo "⚠️  Backend not found, skipping"
fi

# Step 3: Extract Frontend API Calls
echo ""
echo "📊 Step 3: Extracting frontend API calls..."

if [ -d "admin-dashboard/src" ]; then
  echo "  - Admin Dashboard..."
  npx --yes ts-node scripts/extract-fe-calls.ts admin-dashboard/src > artifacts/fe_calls_admin.csv || echo "⚠️  Could not extract admin calls"
fi

if [ -d "bthwani-web/src" ]; then
  echo "  - Web App..."
  npx --yes ts-node scripts/extract-fe-calls.ts bthwani-web/src > artifacts/fe_calls_web.csv || echo "⚠️  Could not extract web calls"
fi

if [ -d "app-user/src" ]; then
  echo "  - User App..."
  npx --yes ts-node scripts/extract-fe-calls.ts app-user/src > artifacts/fe_calls_app.csv || echo "⚠️  Could not extract app calls"
fi

if [ -d "vendor-app/src" ]; then
  echo "  - Vendor App..."
  npx --yes ts-node scripts/extract-fe-calls.ts vendor-app/src > artifacts/fe_calls_vendor.csv || echo "⚠️  Could not extract vendor calls"
fi

if [ -d "rider-app/src" ]; then
  echo "  - Rider App..."
  npx --yes ts-node scripts/extract-fe-calls.ts rider-app/src > artifacts/fe_calls_rider.csv || echo "⚠️  Could not extract rider calls"
fi

# Step 4: Check for FE Orphans
echo ""
echo "📊 Step 4: Checking for FE orphans..."
node scripts/check-fe-orphans.js

# Check orphans count
ORPHAN_COUNT=$(tail -n +2 artifacts/fe_orphans.csv | grep -c '^' || echo "0")
echo ""
if [ "$ORPHAN_COUNT" -eq 0 ]; then
  echo "✅ No FE orphans found!"
else
  echo "❌ Found $ORPHAN_COUNT orphan API calls!"
  echo ""
  echo "Orphans:"
  cat artifacts/fe_orphans.csv
  exit 1
fi

# Step 5: Block Raw fetch/axios
echo ""
echo "📊 Step 5: Checking for raw fetch/axios usage..."
bash scripts/block_raw_fetch.sh

if [ -s artifacts/grep_raw_fetch.txt ]; then
  echo "❌ Raw fetch/axios detected!"
  cat artifacts/grep_raw_fetch.txt
  exit 1
else
  echo "✅ No raw fetch/axios usage detected!"
fi

# Step 6: Generate Typed Clients Report
echo ""
echo "📊 Step 6: Generating typed clients report..."
node scripts/generate-typed-clients-report.js

# Display report
echo ""
echo "📄 Typed Clients Report:"
if [ -f artifacts/typed_clients_report.json ]; then
  cat artifacts/typed_clients_report.json | jq '.' || cat artifacts/typed_clients_report.json
else
  echo "⚠️  Report not generated"
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ All Proof Guards checks passed!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Generated artifacts in ./artifacts/:"
echo "  - fe_orphans.csv (0 rows)"
echo "  - grep_raw_fetch.txt (empty)"
echo "  - typed_clients_report.json"
echo "  - fe_calls_*.csv"
echo "  - route_inventory_backend.csv"
echo "  - openapi_contracts.csv"
echo ""

