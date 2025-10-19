# PowerShell version of block_raw_fetch.sh
# Block raw fetch/axios usage

$ErrorActionPreference = "Stop"

# Create artifacts directory
$null = New-Item -ItemType Directory -Force -Path "artifacts"

# Allowed wrappers
$ALLOW = 'httpClient|apiClient|typedClient|axiosInstance|useAdminAPI|useAdminQuery|useAdminMutation'

Write-Host "🔍 Searching for raw fetch/axios usage..." -ForegroundColor Cyan

# Define directories to scan
$dirs = @(
    "admin-dashboard",
    "bthwani-web",
    "app-user",
    "vendor-app",
    "rider-app",
    "field-marketers"
)

$allBadLines = @()

foreach ($dir in $dirs) {
    if (Test-Path $dir) {
        Write-Host "  Scanning $dir..." -ForegroundColor Gray
        
        # Find all TypeScript/JavaScript files in this directory
        $files = Get-ChildItem -Path $dir -Recurse -Include *.ts,*.tsx,*.js,*.jsx -File |
            Where-Object {
                $_.FullName -notmatch 'node_modules' -and
                $_.FullName -notmatch '\\dist\\' -and
                $_.FullName -notmatch '\\build\\' -and
                $_.FullName -notmatch '__tests__' -and
                $_.FullName -notmatch '__mocks__' -and
                $_.FullName -notmatch '\\coverage\\'
            }
        
        Write-Host "    Found $($files.Count) files" -ForegroundColor DarkGray
        
        # Search for raw fetch/axios usage
        foreach ($file in $files) {
            $lineNumber = 0
            Get-Content $file.FullName | ForEach-Object {
                $lineNumber++
                $line = $_
                
                # Check if line contains fetch( or axios.
                if ($line -match '\bfetch\(|\baxios\.') {
                    # Check if it's NOT using an allowed wrapper
                    if ($line -notmatch $ALLOW) {
                        $relativePath = $file.FullName -replace [regex]::Escape((Get-Location).Path + '\'), ''
                        $allBadLines += "${relativePath}:${lineNumber}:$line"
                    }
                }
            }
        }
    }
}

Write-Host ""
Write-Host "📊 Total files scanned across all projects" -ForegroundColor Cyan

# Write results
if ($allBadLines.Count -gt 0) {
    $allBadLines | Out-File -FilePath "artifacts/grep_raw_fetch.txt" -Encoding UTF8
    
    Write-Host ""
    Write-Host "❌ Raw fetch/axios detected!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Found $($allBadLines.Count) violations:" -ForegroundColor Yellow
    
    $allBadLines | Select-Object -First 10 | ForEach-Object {
        $parts = $_ -split ':', 3
        Write-Host "  $($parts[0]):$($parts[1])" -ForegroundColor Gray
        Write-Host "    $($parts[2].Trim())" -ForegroundColor DarkGray
    }
    
    if ($allBadLines.Count -gt 10) {
        Write-Host "  ... and $($allBadLines.Count - 10) more" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "Full report: artifacts/grep_raw_fetch.txt" -ForegroundColor Cyan
    exit 1
} else {
    "" | Out-File -FilePath "artifacts/grep_raw_fetch.txt" -Encoding UTF8
    Write-Host "✅ No raw fetch/axios usage detected!" -ForegroundColor Green
    exit 0
}
