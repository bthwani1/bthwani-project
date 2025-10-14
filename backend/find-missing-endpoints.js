const fs = require('fs');
const path = require('path');

// Function to extract routes from backend files
function extractBackendRoutes(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const routes = [];

    // Match router methods with their paths - handle both single and double quotes
    const routeRegex = /router\.(get|post|put|patch|delete|options|head)\s*\(\s*["']([^"']+)["']/g;
    let match;

    while ((match = routeRegex.exec(content)) !== null) {
      routes.push({
        method: match[1].toUpperCase(),
        path: match[2],
        file: path.basename(filePath)
      });
    }

    return routes;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return [];
  }
}

// Function to extract API calls from frontend files
function extractFrontendApiCalls(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const apiCalls = [];

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];

      // Look for axios/axiosInstance calls
      if (line.includes('axiosInstance') || line.includes('axios')) {
        // Extract URL strings from axios/axiosInstance calls
        // Handle both with and without spaces after method name
        const urlRegex = /(?:axiosInstance|axios)\.(get|post|patch|put|delete)\s*\(\s*["']([^"']+)["']/g;
        let match;

        while ((match = urlRegex.exec(line)) !== null) {
          const method = match[1].toUpperCase();
          const url = match[2];

          // Only consider URLs that start with / (API endpoints)
          if (url.startsWith('/')) {
            // Extract the path part (remove query parameters and fragments)
            const path = url.split('?')[0].split('#')[0];
            apiCalls.push({
              method: method,
              path: path,
              fullUrl: url,
              file: path.relative(process.cwd(), filePath),
              line: lineIndex + 1,
              content: line.trim()
            });
          }
        }

        // Also handle cases where there might be template literals or variables
        // Look for axios/axiosInstance calls that might span multiple lines or use variables
        if (line.includes('axiosInstance.') || line.includes('axios.')) {
          // Check if this line contains a path that starts with /
          const pathMatch = line.match(/["']([^"']*\/[^"']+)["']/);
          if (pathMatch && pathMatch[1].startsWith('/')) {
            const fullPath = pathMatch[1];
            // Try to determine the method from context
            let method = 'GET'; // default
            if (line.includes('.post(')) method = 'POST';
            else if (line.includes('.patch(')) method = 'PATCH';
            else if (line.includes('.put(')) method = 'PUT';
            else if (line.includes('.delete(')) method = 'DELETE';

            apiCalls.push({
              method: method,
              path: fullPath,
              fullUrl: fullPath,
              file: path.relative(process.cwd(), filePath),
              line: lineIndex + 1,
              content: line.trim(),
              note: 'Multi-line or variable-based call'
            });
          }
        }
      }
    }

    return apiCalls;
  } catch (error) {
    return [];
  }
}

// Main analysis function
function findMissingEndpoints() {
  console.log('🔍 Finding endpoints used in frontend but missing in backend...\n');

  // List of all route files from the backend index.ts imports
  const routeFiles = [
    // Main routes
    'routes/auth.routes.ts',
    'routes/userRoutes.ts',
    'routes/userAvatarRoutes.ts',
    'routes/mediaRoutes.ts',
    'routes/favorites.ts',
    'routes/passwordReset.ts',
    'routes/testOtp.ts',
    'routes/app.routes.ts',
    'routes/meta.ts',
    'routes/partners.ts',
    'routes/redias.ts',
    'routes/messages.ts',
    'routes/roas.ts',
    'routes/segments.ts',
    'routes/kpis.ts',
    'routes/marketing.ts',
    'routes/marketing-roas.ts',
    'routes/support.ts',
    'routes/support.routes.ts',
    // Admin routes
    'routes/admin/adminRoutes.ts',
    'routes/admin/adminManagementRoutes.ts',
    'routes/admin/adminUsersRoutes.ts',
    'routes/admin/adminCmsRoutes.ts',
    'routes/admin/activation.routes.ts',
    'routes/admin/adminNotificationsRoutes.ts',
    'routes/admin/adminWalletCoupons.ts',
    'routes/admin/adminWithdrawalRoutes.ts',
    'routes/admin/backupRoutes.ts',
    'routes/admin/commissionPlansRoutes.ts',
    'routes/admin/dashboardOverviewRoutes.ts',
    'routes/admin/dataDeletionRoutes.ts',
    'routes/admin/driversAssets.ts',
    'routes/admin/driversAttendance.ts',
    'routes/admin/driversDocs.ts',
    'routes/admin/driversFinance.ts',
    'routes/admin/driversShifts.ts',
    'routes/admin/driversVacations.ts',
    'routes/admin/driversLeaveRoutes.ts',
    'routes/admin/marketersRoutes.ts',
    'routes/admin/notificationRoutes.ts',
    'routes/admin/onboardingRoutes.ts',
    'routes/admin/qualityRoutes.ts',
    'routes/admin/reportsRoutes.ts',
    'routes/admin/settingsRoutes.ts',
    'routes/admin/storeModerationRoutes.ts',
    'routes/admin/storeStatsRoutes.ts',
    'routes/admin/supportRoutes.ts',
    'routes/admin/vendorModerationRoutes.ts',
    // Delivery marketplace routes
    'routes/delivery_marketplace_v1/DeliveryBannerRoutes.ts',
    'routes/delivery_marketplace_v1/DeliveryCartRoutes.ts',
    'routes/delivery_marketplace_v1/DeliveryCategoryRoutes.ts',
    'routes/delivery_marketplace_v1/DeliveryOfferRoutes.ts',
    'routes/delivery_marketplace_v1/DeliveryOrderRoutes.ts',
    'routes/delivery_marketplace_v1/DeliveryProductRoutes.ts',
    'routes/delivery_marketplace_v1/DeliveryProductSubCategoryRoutes.ts',
    'routes/delivery_marketplace_v1/DeliveryStoreRoutes.ts',
    'routes/delivery_marketplace_v1/pricingStrategy.ts',
    'routes/delivery_marketplace_v1/promotion.routes.ts',
    'routes/delivery_marketplace_v1/sheinCart.ts',
    'routes/delivery_marketplace_v1/storeSection.routes.ts',
    'routes/delivery_marketplace_v1/utility.ts',
    // Driver app routes
    'routes/driver_app/attendance.ts',
    'routes/driver_app/driver.routes.ts',
    'routes/driver_app/driver.vacation.routes.ts',
    'routes/driver_app/driver.withdrawal.routes.ts',
    // Vendor app routes
    'routes/vendor_app/settlement.routes.ts',
    'routes/vendor_app/vendor.routes.ts',
    // Wallet routes
    'routes/Wallet_V8/coupon.routes.ts',
    'routes/Wallet_V8/subscription.routes.ts',
    'routes/Wallet_V8/topupRoutes.ts',
    'routes/Wallet_V8/walletOrderRoutes.ts',
    'routes/Wallet_V8/wallet.routes.ts',
    // Marketer routes
    'routes/marketerV1/auth.routes.ts',
    'routes/marketerV1/marketerOverviewRoutes.ts',
    'routes/marketerV1/marketerStoreVendorRoutes.ts',
    'routes/marketerV1/mediaMarketerRoutes.ts',
    // Field routes
    'routes/field/onboarding.routes.ts',
    'routes/field/quickOnboard.routes.ts',
    'routes/field/referral.routes.ts',
    // Finance routes
    'routes/finance/commission.routes.ts',
    'routes/finance/commissionSettings.routes.ts',
    'routes/finance/coupon.routes.ts',
    'routes/finance/monitoring.routes.ts',
    'routes/finance/payout.routes.ts',
    'routes/finance/reconciliation.routes.ts',
    'routes/finance/reports.routes.ts',
    'routes/finance/settlement.routes.ts',
    'routes/finance/wallet.routes.ts',
    // ER routes
    'routes/er/accountPayable.routes.ts',
    'routes/er/accountReceivable.routes.ts',
    'routes/er/asset.routes.ts',
    'routes/er/attendance.routes.ts',
    'routes/er/budget.routes.ts',
    'routes/er/chartAccount.routes.ts',
    'routes/er/dashboard.routes.ts',
    'routes/er/document.routes.ts',
    'routes/er/employee.routes.ts',
    'routes/er/journalEntry.routes.ts',
    'routes/er/journals.routes.ts',
    'routes/er/kpiAssignment.routes.ts',
    'routes/er/leaveRequest.routes.ts',
    'routes/er/ledgerEntry.routes.ts',
    'routes/er/payroll.routes.ts',
    'routes/er/performanceGoal.routes.ts',
    'routes/er/performanceReview.routes.ts',
    'routes/er/task.routes.ts',
    // Merchant routes
    'routes/marchent/api.ts',
    // CMS routes
    'routes/cms.routes.ts',
    // Support routes
    'routes/support/customers.ts',
    'routes/support/messaging-prefs.ts'
  ];

  let allBackendRoutes = [];
  let totalBackendEndpoints = 0;

  // Extract all backend routes
  routeFiles.forEach(file => {
    const filePath = path.join(__dirname, 'src', file);
    if (fs.existsSync(filePath)) {
      const routes = extractBackendRoutes(filePath);
      if (routes.length > 0) {
        allBackendRoutes = allBackendRoutes.concat(routes);
        totalBackendEndpoints += routes.length;
      }
    }
  });

  console.log(`📊 Total backend endpoints found: ${totalBackendEndpoints}`);
  console.log(`📋 Unique backend endpoints: ${allBackendRoutes.length}\n`);

  // Create a map of backend routes for quick lookup
  const backendRoutesMap = new Map();
  allBackendRoutes.forEach(route => {
    const key = `${route.method} ${route.path}`;
    backendRoutesMap.set(key, route);
  });

  // Frontend directories to search
  const frontendDirs = [
    '../admin-dashboard/src',
    '../bthwani-web/src',
    '../app-user/src',
    '../rider-app/src',
    '../vendor-app/src',
    '../field-marketers/src'
  ];

  let allFrontendCalls = [];
  let totalFrontendCalls = 0;

  // Extract all frontend API calls
  for (const frontendDir of frontendDirs) {
    const fullFrontendPath = path.join(__dirname, frontendDir);
    if (fs.existsSync(fullFrontendPath)) {
      console.log(`🔍 Analyzing frontend: ${frontendDir}`);

      function walkDir(dir) {
        const items = fs.readdirSync(dir);
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
            walkDir(fullPath);
          } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx') || item.endsWith('.js') || item.endsWith('.jsx'))) {
            const calls = extractFrontendApiCalls(fullPath);
            allFrontendCalls = allFrontendCalls.concat(calls);
            totalFrontendCalls += calls.length;
          }
        }
      }

      walkDir(fullFrontendPath);
    }
  }

  console.log(`\n📊 Total frontend API calls found: ${totalFrontendCalls}`);
  console.log(`📋 Unique frontend API calls: ${allFrontendCalls.length}\n`);

  // Find missing endpoints (frontend calls that don't exist in backend)
  const missingEndpoints = [];
  const existingEndpoints = [];

  allFrontendCalls.forEach(call => {
    const key = `${call.method} ${call.path}`;
    if (backendRoutesMap.has(key)) {
      existingEndpoints.push(call);
    } else {
      missingEndpoints.push(call);
    }
  });

  // Generate report
  const report = {
    summary: {
      totalBackendEndpoints: totalBackendEndpoints,
      totalFrontendCalls: totalFrontendCalls,
      existingEndpoints: existingEndpoints.length,
      missingEndpoints: missingEndpoints.length,
      coveragePercentage: ((existingEndpoints.length / totalFrontendCalls) * 100).toFixed(2)
    },
    missing: missingEndpoints,
    existing: existingEndpoints
  };

  // Group missing endpoints by file
  const missingByFile = {};
  missingEndpoints.forEach(endpoint => {
    if (!missingByFile[endpoint.file]) {
      missingByFile[endpoint.file] = [];
    }
    missingByFile[endpoint.file].push(endpoint);
  });

  // Save report
  fs.writeFileSync('missing-endpoints-report.json', JSON.stringify(report, null, 2));

  // Console output
  console.log(`✅ Existing endpoints: ${existingEndpoints.length} (${report.summary.coveragePercentage}%)`);
  console.log(`❌ Missing endpoints: ${missingEndpoints.length}\n`);

  console.log('📂 Missing endpoints by file:');
  Object.keys(missingByFile)
    .sort((a, b) => missingByFile[b].length - missingByFile[a].length)
    .slice(0, 10)
    .forEach(file => {
      console.log(`  ${file}: ${missingByFile[file].length} missing endpoints`);
    });

  if (missingEndpoints.length > 0) {
    console.log('\n📋 Top missing endpoints:');
    missingEndpoints.slice(0, 20).forEach(endpoint => {
      console.log(`  ${endpoint.method} ${endpoint.path} (in ${endpoint.file}:${endpoint.line})`);
    });
  }

  console.log('\n💾 Detailed report saved to missing-endpoints-report.json');

  return report;
}

// Run analysis
findMissingEndpoints();
