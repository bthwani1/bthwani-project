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

// Function to search for endpoint usage in a file
function searchInFile(filePath, cleanEndpoint) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Search for various patterns that might indicate usage:
    const patterns = [
      cleanEndpoint,
      `["']${cleanEndpoint}["']`,
      `axios\.(get|post|patch|put|delete)\s*\(\s*["']\s*[/]*${cleanEndpoint}\s*["']`,
      `axios\.(get|post|patch|put|delete)\s*\(\s*\`\s*[/]*${cleanEndpoint}\s*\``,
      `fetch\s*\(\s*["']\s*[/]*${cleanEndpoint}\s*["']`,
      `fetch\s*\(\s*\`\s*[/]*${cleanEndpoint}\s*\``,
      `["']/${cleanEndpoint}["']`,
      `["']\`\$\{.*\}/${cleanEndpoint}["']`,
      `["']api/v1/${cleanEndpoint}["']`,
      `\`\$\{.*\}/${cleanEndpoint}\``,
      `["']\$\{.*\}/${cleanEndpoint}["']`
    ];

    for (const pattern of patterns) {
      if (content.includes(pattern)) {
        return true;
      }
    }

    return false;
  } catch (error) {
    return false;
  }
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

    // Search in each file
    for (const file of files) {
      if (searchInFile(file, cleanEndpoint)) {
        return true;
      }
    }

    return false;
  } catch (error) {
    return false;
  }
}

// Main analysis function
function analyzeUnusedEndpoints() {
  console.log('🔍 Analyzing backend endpoints and frontend usage...\n');

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

  // Analyze each endpoint
  const usedEndpoints = [];
  const unusedEndpoints = [];

  for (let i = 0; i < allRoutes.length; i++) {
    const route = allRoutes[i];
    const fullPath = `/api/v1${route.path}`;

    process.stdout.write(`\r🔍 Checking endpoint ${i + 1}/${allRoutes.length}: ${route.method} ${route.path}`);

    let isUsed = false;

    // Check if endpoint is used in any frontend
    for (const frontendDir of frontendDirs) {
      const fullFrontendPath = path.join(__dirname, frontendDir);
      if (fs.existsSync(fullFrontendPath)) {
        if (searchEndpointUsage(route.path, fullFrontendPath)) {
          isUsed = true;
          break;
        }
      }
    }

    if (isUsed) {
      usedEndpoints.push(route);
    } else {
      unusedEndpoints.push(route);
    }
  }

  console.log('\n');

  // Generate report
  const report = {
    summary: {
      totalEndpoints: totalEndpoints,
      usedEndpoints: usedEndpoints.length,
      unusedEndpoints: unusedEndpoints.length,
      usagePercentage: ((usedEndpoints.length / totalEndpoints) * 100).toFixed(2)
    },
    used: usedEndpoints.map(r => `${r.method} ${r.path}`),
    unused: unusedEndpoints.map(r => `${r.method} ${r.path}`),
    details: {
      usedByModule: {},
      unusedByModule: {}
    }
  };

  // Group by module
  usedEndpoints.forEach(route => {
    const module = route.file.split('.')[0];
    if (!report.details.usedByModule[module]) {
      report.details.usedByModule[module] = [];
    }
    report.details.usedByModule[module].push(`${route.method} ${route.path}`);
  });

  unusedEndpoints.forEach(route => {
    const module = route.file.split('.')[0];
    if (!report.details.unusedByModule[module]) {
      report.details.unusedByModule[module] = [];
    }
    report.details.unusedByModule[module].push(`${route.method} ${route.path}`);
  });

  // Save report
  fs.writeFileSync('unused-endpoints-report.json', JSON.stringify(report, null, 2));

  // Console output
  console.log(`✅ Used endpoints: ${usedEndpoints.length} (${report.summary.usagePercentage}%)`);
  console.log(`❌ Unused endpoints: ${unusedEndpoints.length}\n`);

  console.log('📂 Unused endpoints by module:');
  Object.keys(report.details.unusedByModule)
    .sort((a, b) => report.details.unusedByModule[b].length - report.details.unusedByModule[a].length)
    .slice(0, 10)
    .forEach(module => {
      console.log(`  ${module}: ${report.details.unusedByModule[module].length} unused endpoints`);
    });

  console.log('\n💾 Detailed report saved to unused-endpoints-report.json');

  return report;
}

// Run analysis
analyzeUnusedEndpoints();
