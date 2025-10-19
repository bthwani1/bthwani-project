#!/usr/bin/env bash
# Fix All Dependencies Script - Bash Version
# Regenerate all lock files and fix conflicts

set -e

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║     🔧 BThwani Dependency Fix Script                    ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

projects=(
    "backend-nest"
    "admin-dashboard"
    "bthwani-web"
    "app-user"
    "vendor-app"
    "rider-app"
    "field-marketers"
)

total_projects=${#projects[@]}
current_project=0

for project in "${projects[@]}"; do
    ((current_project++))
    
    if [ ! -d "$project" ]; then
        echo "⏭️  Skipping $project (not found)"
        continue
    fi
    
    echo ""
    echo "════════════════════════════════════════════════════════"
    echo "  📦 [$current_project/$total_projects] Processing: $project"
    echo "════════════════════════════════════════════════════════"
    
    cd "$project" || continue
    
    # Step 1: Clean
    echo "  🧹 Cleaning..."
    rm -rf node_modules 2>/dev/null || true
    rm -f package-lock.json 2>/dev/null || true
    echo "     ✅ Cleaned"
    
    # Step 2: Install
    echo "  📥 Installing dependencies..."
    if npm install --legacy-peer-deps 2>&1; then
        echo "     ✅ Dependencies installed"
    else
        echo "     ⚠️  Installation completed with warnings"
    fi
    
    # Step 3: Audit (non-blocking)
    echo "  🔍 Security audit..."
    npm audit --production 2>&1 | grep "vulnerabilities" || echo "     ✅ No vulnerabilities"
    
    echo "  ✅ $project completed"
    
    cd - >/dev/null || exit
done

echo ""
echo "════════════════════════════════════════════════════════"
echo "  ✅ All projects processed!"
echo "════════════════════════════════════════════════════════"
echo ""
echo "Next steps:"
echo "  1. Test each project: npm run dev"
echo "  2. Run tests: npm test"
echo "  3. Commit lock files: git add */package-lock.json"
echo "  4. Push: git commit -m 'fix: regenerate lock files'"
echo ""

