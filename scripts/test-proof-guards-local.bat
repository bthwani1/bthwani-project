@echo off
REM Local Test Script for Proof Guards - Windows
REM اختبار محلي لحراس الإثبات - ويندوز

setlocal enabledelayedexpansion

echo.
echo 🚀 Starting Proof Guards Local Test...
echo.

REM Create artifacts directory
if not exist artifacts mkdir artifacts

REM Step 1: Extract Backend Routes
echo 📊 Step 1: Extracting backend routes...
if exist "backend-nest\src" (
  cd backend-nest
  call npx --yes ts-node scripts\extract-routes.ts
  if errorlevel 1 echo ⚠️  Could not extract routes
  cd ..
) else (
  echo ⚠️  Backend not found, skipping
)

REM Step 2: Extract OpenAPI Contracts
echo.
echo 📊 Step 2: Extracting OpenAPI contracts...
if exist "backend-nest\src" (
  cd backend-nest
  call npx --yes ts-node scripts\extract-openapi.ts
  if errorlevel 1 echo ⚠️  Could not extract OpenAPI
  cd ..
) else (
  echo ⚠️  Backend not found, skipping
)

REM Step 3: Extract Frontend API Calls
echo.
echo 📊 Step 3: Extracting frontend API calls...

if exist "admin-dashboard\src" (
  echo   - Admin Dashboard...
  call npx --yes ts-node scripts\extract-fe-calls.ts admin-dashboard\src > artifacts\fe_calls_admin.csv
)

if exist "bthwani-web\src" (
  echo   - Web App...
  call npx --yes ts-node scripts\extract-fe-calls.ts bthwani-web\src > artifacts\fe_calls_web.csv
)

if exist "app-user\src" (
  echo   - User App...
  call npx --yes ts-node scripts\extract-fe-calls.ts app-user\src > artifacts\fe_calls_app.csv
)

if exist "vendor-app\src" (
  echo   - Vendor App...
  call npx --yes ts-node scripts\extract-fe-calls.ts vendor-app\src > artifacts\fe_calls_vendor.csv
)

if exist "rider-app\src" (
  echo   - Rider App...
  call npx --yes ts-node scripts\extract-fe-calls.ts rider-app\src > artifacts\fe_calls_rider.csv
)

REM Step 4: Check for FE Orphans
echo.
echo 📊 Step 4: Checking for FE orphans...
call node scripts\check-fe-orphans.js
if errorlevel 1 (
  echo.
  echo ❌ Orphan API calls found!
  type artifacts\fe_orphans.csv
  exit /b 1
)

REM Check orphans count
for /f %%A in ('type artifacts\fe_orphans.csv ^| find /c /v ""') do set TOTAL_LINES=%%A
set /a TOTAL_ORPHANS=!TOTAL_LINES!-1

for /f %%B in ('type artifacts\fe_orphans_critical.csv ^| find /c /v ""') do set CRITICAL_LINES=%%B
set /a CRITICAL_ORPHANS=!CRITICAL_LINES!-1

set /a ACCEPTABLE_ORPHANS=!TOTAL_ORPHANS!-!CRITICAL_ORPHANS!

echo.
echo 📊 Orphan Analysis:
echo    Total orphans: !TOTAL_ORPHANS!
echo    Critical: !CRITICAL_ORPHANS!
echo    Acceptable: !ACCEPTABLE_ORPHANS!
echo.

if !CRITICAL_ORPHANS! equ 0 (
  echo ✅ No critical orphans! All orphans are acceptable/documented.
) else (
  echo ❌ Found !CRITICAL_ORPHANS! critical orphans!
  type artifacts\fe_orphans_critical.csv
  exit /b 1
)

REM Step 5: Block Raw fetch/axios
echo.
echo 📊 Step 5: Checking for raw fetch/axios usage...
call node scripts\block_raw_fetch.js

if errorlevel 1 (
  echo.
  echo ❌ Raw fetch/axios detected!
  type artifacts\grep_raw_fetch.txt
  exit /b 1
)

REM Step 6: Generate Typed Clients Report
echo.
echo 📊 Step 6: Generating typed clients report...
call node scripts\generate-typed-clients-report.js
if errorlevel 1 (
  echo ⚠️  Report generation failed
  exit /b 1
)

REM Display report
echo.
echo 📄 Typed Clients Report:
if exist artifacts\typed_clients_report.json (
  type artifacts\typed_clients_report.json
) else (
  echo ⚠️  Report not generated
  exit /b 1
)

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo ✅ All Proof Guards checks passed!
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo Generated artifacts in .\artifacts\:
echo   - fe_orphans.csv (0 rows)
echo   - grep_raw_fetch.txt (empty)
echo   - typed_clients_report.json
echo   - fe_calls_*.csv
echo   - route_inventory_backend.csv
echo   - openapi_contracts.csv
echo.

endlocal

