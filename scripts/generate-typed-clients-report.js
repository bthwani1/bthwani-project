#!/usr/bin/env node
/**
 * Generate Typed Clients Usage Report
 * يولد تقرير استخدام العملاء المطبوعين (Typed Clients)
 */

const fs = require('fs');
const path = require('path');

// Directories to scan
const frontendDirs = [
  'admin-dashboard/src',
  'bthwani-web/src',
  'app-user/src',
  'vendor-app/src',
  'rider-app/src',
  'field-marketers/src'
];

// Allowed wrappers (typed clients)
const allowedWrappers = [
  'axiosInstance',
  'apiClient',
  'httpClient',
  'typedClient',
  'useAdminAPI',
  'useAdminQuery',
  'useAdminMutation'
];

// Files to exclude (same as block_raw_fetch.js)
const excludePatterns = [
  /node_modules/,
  /\.test\./,
  /\.spec\./,
  /__tests__/,
  /__mocks__/,
  /coverage/,
  /dist/,
  /build/,
  /[\/\\]public[\/\\]sw\.js/,
  /service-worker/,
  /axios-instance/,
  /axiosInstance\.ts/,
  /httpClient\.ts/,
  /apiClient\.ts/,
  /authService\.ts/,
  /uploadFileToCloudinary/,
  /mapUtils\.ts/,
  /[\/\\]examples[\/\\]/,
  /TestOtpPage/,
  /triggerSOS/,
  /upload\.ts/
];

function shouldExcludeFile(filePath) {
  return excludePatterns.some(pattern => pattern.test(filePath));
}

function findFiles(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  const results = [];
  
  if (!fs.existsSync(dir)) {
    return results;
  }

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    
    if (shouldExcludeFile(fullPath)) {
      continue;
    }

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results.push(...findFiles(fullPath, extensions));
    } else if (extensions.some(ext => fullPath.endsWith(ext))) {
      results.push(fullPath);
    }
  }

  return results;
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  const stats = {
    typedClientUsages: 0,
    rawFetchCount: 0,
    rawAxiosCount: 0,
    wrapperTypes: new Set()
  };

  // Check if file imports axios from a wrapper
  const hasWrapperImport = /import\s+.*axios.*\s+from\s+['"](?!\baxios\b)/.test(content);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip comments
    if (line.trim().startsWith('//') || line.trim().startsWith('*') || line.trim().startsWith('/*')) {
      continue;
    }

    // Skip axios.create
    if (/axios\.create/.test(line)) {
      continue;
    }

    // Skip function declarations named 'fetch'
    if (/\b(async\s+)?function\s+fetch\(/.test(line)) {
      continue;
    }

    // Skip local function calls
    if (/\bfetch\(/.test(line) && !line.includes('await fetch(') && !line.includes('= fetch(')) {
      continue;
    }

    // Skip external APIs
    if (/identitytoolkit\.googleapis\.com|securetoken\.googleapis\.com|maps\.googleapis\.com|googleapis\.com|cloudinary\.com/.test(line)) {
      continue;
    }

    // Skip React Native NetInfo
    if (/NetInfo\.fetch\(\)/.test(line)) {
      continue;
    }
    
    // Check for typed client usages
    for (const wrapper of allowedWrappers) {
      if (line.includes(wrapper)) {
        stats.typedClientUsages++;
        stats.wrapperTypes.add(wrapper);
      }
    }

    // Check for raw fetch (not in wrapper)
    if (/\bfetch\(/.test(line)) {
      const hasWrapper = allowedWrappers.some(w => line.includes(w));
      if (!hasWrapper && !hasWrapperImport) {
        stats.rawFetchCount++;
      }
    }

    // Check for raw axios (not in wrapper)
    if (/\baxios\./.test(line)) {
      const hasWrapper = allowedWrappers.some(w => line.includes(w));
      if (!hasWrapper && !hasWrapperImport) {
        stats.rawAxiosCount++;
      }
    }
  }

  return stats;
}

function generateReport() {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFilesScanned: 0,
      totalTypedClientUsages: 0,
      totalRawFetchUsages: 0,
      totalRawAxiosUsages: 0,
      compliance: 'UNKNOWN'
    },
    wrapperUsage: {},
    projectBreakdown: []
  };

  for (const dir of frontendDirs) {
    const projectName = dir.split('/')[0];
    const files = findFiles(dir);
    
    const projectStats = {
      project: projectName,
      filesScanned: files.length,
      typedClientUsages: 0,
      rawFetchCount: 0,
      rawAxiosCount: 0,
      wrappers: {}
    };

    for (const file of files) {
      const fileStats = analyzeFile(file);
      
      projectStats.typedClientUsages += fileStats.typedClientUsages;
      projectStats.rawFetchCount += fileStats.rawFetchCount;
      projectStats.rawAxiosCount += fileStats.rawAxiosCount;

      for (const wrapper of fileStats.wrapperTypes) {
        projectStats.wrappers[wrapper] = (projectStats.wrappers[wrapper] || 0) + 1;
      }
    }

    report.summary.totalFilesScanned += projectStats.filesScanned;
    report.summary.totalTypedClientUsages += projectStats.typedClientUsages;
    report.summary.totalRawFetchUsages += projectStats.rawFetchCount;
    report.summary.totalRawAxiosUsages += projectStats.rawAxiosCount;

    // Aggregate wrapper usage
    for (const [wrapper, count] of Object.entries(projectStats.wrappers)) {
      report.wrapperUsage[wrapper] = (report.wrapperUsage[wrapper] || 0) + count;
    }

    if (projectStats.filesScanned > 0) {
      report.projectBreakdown.push(projectStats);
    }
  }

  // Determine compliance
  const hasRawUsage = report.summary.totalRawFetchUsages > 0 || 
                      report.summary.totalRawAxiosUsages > 0;
  const hasTypedUsage = report.summary.totalTypedClientUsages > 0;

  if (!hasRawUsage && hasTypedUsage) {
    report.summary.compliance = '✅ COMPLIANT';
  } else if (hasRawUsage) {
    report.summary.compliance = '❌ NON-COMPLIANT';
  } else {
    report.summary.compliance = '⚠️  NO API CALLS DETECTED';
  }

  return report;
}

// Main execution
try {
  // Ensure artifacts directory exists
  const artifactsDir = path.join(process.cwd(), 'artifacts');
  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir, { recursive: true });
  }

  console.log('🔍 Scanning frontend projects for typed client usage...');
  
  const report = generateReport();
  
  // Write report
  const reportPath = path.join(artifactsDir, 'typed_clients_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`\n📊 Report generated: ${reportPath}`);
  console.log(`\nSummary:`);
  console.log(`  Files Scanned: ${report.summary.totalFilesScanned}`);
  console.log(`  Typed Client Usages: ${report.summary.totalTypedClientUsages}`);
  console.log(`  Raw fetch() Usages: ${report.summary.totalRawFetchUsages}`);
  console.log(`  Raw axios Usages: ${report.summary.totalRawAxiosUsages}`);
  console.log(`  Compliance: ${report.summary.compliance}`);
  
  if (report.summary.compliance === '❌ NON-COMPLIANT') {
    console.error('\n❌ Raw API calls detected outside typed wrappers!');
    process.exit(1);
  }
  
  console.log('\n✅ Typed clients report generated successfully!');
  
} catch (error) {
  console.error('Error generating typed clients report:', error);
  process.exit(1);
}

