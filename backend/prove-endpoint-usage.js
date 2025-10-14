const fs = require('fs');
const path = require('path');

// Function to extract routes from a file
function extractRoutes(filePath) {
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

// Function to search for endpoint usage in a file and return details
function searchInFileDetailed(filePath, cleanEndpoint) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const usageDetails = [];

    // Look for endpoint paths within axios/axiosInstance calls
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];

      // Check if line contains axios or axiosInstance
      if (line.includes('axiosInstance') || line.includes('axios')) {
        // Look for exact endpoint matches or endpoint as a complete path segment
        // This handles: "/me", "/users/me", "/admin/me" but not "/something/me/else"
        const endpointPatterns = [
          // Exact match: "/me"
          `["']\s*/${cleanEndpoint}\s*["']`,
          // As complete path segment: "/me/" or "/me/"
          `["']\s*/${cleanEndpoint}/\s*["']`,
          // At end of path: "/something/me"
          `["']\s*/[^"']*/${cleanEndpoint}\s*["']`,
          // With parameters: "/me/:id" but only if "me" is the main segment
          `["']\s*/${cleanEndpoint}/[^"']*\s*["']`
        ];

        let foundValidMatch = false;
        for (const pattern of endpointPatterns) {
          const regex = new RegExp(pattern, 'g');
          const matches = line.match(regex);

          if (matches && matches.length > 0) {
            // Additional validation: make sure "me" is not part of another word
            const isValidMatch = matches.some(match => {
              // Extract the path from the match
              const pathMatch = match.match(/["']([^"']+)["']/);
              if (pathMatch) {
                const path = pathMatch[1];
                // Check if "me" appears as a complete path segment
                const segments = path.split('/').filter(s => s.length > 0);
                return segments.some(segment => segment === cleanEndpoint);
              }
              return false;
            });

            if (isValidMatch) {
              foundValidMatch = true;
              break;
            }
          }
        }

        if (foundValidMatch) {
          // Additional check: make sure it's actually an API call, not just a string
          if (line.includes('.get(') || line.includes('.post(') || line.includes('.patch(') || line.includes('.put(') || line.includes('.delete(')) {
            usageDetails.push({
              file: path.relative(process.cwd(), filePath),
              line: lineIndex + 1,
              content: line.trim(),
              pattern: 'axios/axiosInstance call with validated endpoint',
              endpoint: cleanEndpoint
            });
          }
        }
      }
    }

    return usageDetails;
  } catch (error) {
    return [];
  }
}

// Function to check if a line looks like an actual API call
function isLikelyApiCall(line, endpoint) {
  // Must contain axios, axiosInstance, or fetch
  if (!line.includes('axios') && !line.includes('axiosInstance') && !line.includes('fetch')) {
    return false;
  }

  // Must look like a function call (has parentheses)
  if (!line.includes('(') || !line.includes(')')) {
    return false;
  }

  // Must not be just a comment or string literal
  if (line.trim().startsWith('//') || line.trim().startsWith('*')) {
    return false;
  }

  // Must not be just a variable declaration without function call
  if (line.includes('=') && !line.includes('axios') && !line.includes('axiosInstance') && !line.includes('fetch')) {
    return false;
  }

  return true;
}

// Function to search for endpoint usage in a directory
function searchEndpointUsage(endpoint, searchDir) {
  try {
    // Remove /api/v1 prefix if present and clean the endpoint path
    const cleanEndpoint = endpoint.replace(/^\/*api\/v1\//, '').replace(/^\//, '');

    // Get all files to search in
    const files = [];

    function walkDir(dir) {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          walkDir(fullPath);
        } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx') || item.endsWith('.js') || item.endsWith('.jsx'))) {
          files.push(fullPath);
        }
      }
    }

    walkDir(searchDir);

    // Search in each file and collect detailed usage
    const allUsageDetails = [];
    for (const file of files) {
      const usageDetails = searchInFileDetailed(file, cleanEndpoint);
      allUsageDetails.push(...usageDetails);
    }

    return allUsageDetails;
  } catch (error) {
    return [];
  }
}

// Main analysis function
function proveEndpointUsage() {
  console.log('🔍 Proving endpoint usage in frontend applications...\n');

  // List of all route files from the index.ts imports
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

  let allRoutes = [];
  let totalEndpoints = 0;

  // Extract all routes
  routeFiles.forEach(file => {
    const filePath = path.join(__dirname, 'src', file);
    if (fs.existsSync(filePath)) {
      const routes = extractRoutes(filePath);
      if (routes.length > 0) {
        allRoutes = allRoutes.concat(routes);
        totalEndpoints += routes.length;
      }
    }
  });

  console.log(`📊 Total endpoints found: ${totalEndpoints}`);
  console.log(`📋 Unique endpoints: ${allRoutes.length}\n`);

  // Frontend directories to search
  const frontendDirs = [
    '../admin-dashboard/src',
    '../bthwani-web/src',
    '../app-user/src',
    '../rider-app/src',
    '../vendor-app/src',
    '../field-marketers/src'
  ];

  // Analyze each endpoint and collect usage proof
  const endpointUsageProof = {};

  for (let i = 0; i < allRoutes.length; i++) {
    const route = allRoutes[i];
    const fullPath = `/api/v1${route.path}`;

    process.stdout.write(`\r🔍 Checking endpoint ${i + 1}/${allRoutes.length}: ${route.method} ${route.path}`);

    let usageDetails = [];

    // Check if endpoint is used in any frontend
    for (const frontendDir of frontendDirs) {
      const fullFrontendPath = path.join(__dirname, frontendDir);
      if (fs.existsSync(fullFrontendPath)) {
        const details = searchEndpointUsage(route.path, fullFrontendPath);
        usageDetails = usageDetails.concat(details);
      }
    }

    if (usageDetails.length > 0) {
      endpointUsageProof[`${route.method} ${route.path}`] = {
        method: route.method,
        path: route.path,
        file: route.file,
        usage: usageDetails
      };
    }
  }

  console.log('\n');

  // Generate detailed report
  const report = {
    summary: {
      totalEndpoints: totalEndpoints,
      provenUsedEndpoints: Object.keys(endpointUsageProof).length,
      endpointsWithoutProof: totalEndpoints - Object.keys(endpointUsageProof).length
    },
    usageProof: endpointUsageProof
  };

  // Save detailed report
  fs.writeFileSync('endpoint-usage-proof.json', JSON.stringify(report, null, 2));

  // Console output
  console.log(`✅ Proven used endpoints: ${Object.keys(endpointUsageProof).length}`);
  console.log(`❌ Endpoints without usage proof: ${report.summary.endpointsWithoutProof}\n`);

  console.log('📂 Top endpoints by usage files:');
  const sortedEndpoints = Object.keys(endpointUsageProof)
    .sort((a, b) => endpointUsageProof[b].usage.length - endpointUsageProof[a].usage.length)
    .slice(0, 10);

  sortedEndpoints.forEach(endpoint => {
    const usage = endpointUsageProof[endpoint];
    console.log(`  ${endpoint}: used in ${usage.usage.length} files`);
  });

  console.log('\n💾 Detailed usage proof saved to endpoint-usage-proof.json');

  return report;
}

// Run analysis
proveEndpointUsage();
