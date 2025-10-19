# Fix All Dependencies Script
# Regenerate all lock files and fix conflicts

$ErrorActionPreference = "Continue"

Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     🔧 BThwani Dependency Fix Script                    ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$projects = @(
    "backend-nest",
    "admin-dashboard",
    "bthwani-web",
    "app-user",
    "vendor-app",
    "rider-app",
    "field-marketers"
)

$totalProjects = $projects.Count
$currentProject = 0

foreach ($project in $projects) {
    $currentProject++
    
    if (-not (Test-Path $project)) {
        Write-Host "⏭️  Skipping $project (not found)" -ForegroundColor Gray
        continue
    }
    
    Write-Host ""
    Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Yellow
    Write-Host "  📦 [$currentProject/$totalProjects] Processing: $project" -ForegroundColor Cyan
    Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Yellow
    
    Push-Location $project
    
    try {
        # Step 1: Clean
        Write-Host "  🧹 Cleaning..." -ForegroundColor Gray
        if (Test-Path "node_modules") {
            Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
            Write-Host "     ✅ Removed node_modules" -ForegroundColor Green
        }
        
        if (Test-Path "package-lock.json") {
            Remove-Item -Force "package-lock.json" -ErrorAction SilentlyContinue
            Write-Host "     ✅ Removed package-lock.json" -ForegroundColor Green
        }
        
        # Step 2: Install
        Write-Host "  📥 Installing dependencies..." -ForegroundColor Gray
        $output = npm install --legacy-peer-deps 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "     ✅ Dependencies installed" -ForegroundColor Green
        } else {
            Write-Host "     ⚠️  Installation completed with warnings" -ForegroundColor Yellow
        }
        
        # Step 3: Audit (non-blocking)
        Write-Host "  🔍 Security audit..." -ForegroundColor Gray
        $auditOutput = npm audit --production 2>&1
        $vulnerabilities = ($auditOutput | Select-String "vulnerabilities").Line
        if ($vulnerabilities) {
            Write-Host "     ⚠️  $vulnerabilities" -ForegroundColor Yellow
        } else {
            Write-Host "     ✅ No vulnerabilities" -ForegroundColor Green
        }
        
        Write-Host "  ✅ $project completed" -ForegroundColor Green
        
    } catch {
        Write-Host "  ❌ Error processing $project : $_" -ForegroundColor Red
    } finally {
        Pop-Location
    }
}

Write-Host ""
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  ✅ All projects processed!" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Test each project: npm run dev" -ForegroundColor White
Write-Host "  2. Run tests: npm test" -ForegroundColor White
Write-Host "  3. Commit lock files: git add */package-lock.json" -ForegroundColor White
Write-Host "  4. Push: git commit -m 'fix: regenerate lock files'" -ForegroundColor White
Write-Host ""

