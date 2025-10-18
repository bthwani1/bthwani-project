#!/usr/bin/env node
/**
 * BTW-AUD-002: Route Uniqueness Guard
 * Validates that all routes are unique (METHOD + normalized_path)
 * Fails CI if duplicates are found
 * 
 * Usage: node scripts/check-route-uniqueness.js
 */

const fs = require('fs');
const path = require('path');

/**
 * Normalizes route path by converting all param formats to {param}
 */
function normalizePath(routePath) {
  return routePath
    .replace(/:(\w+)/g, '{$1}')           // :id -> {id}
    .replace(/\{(\w+)\?\}/g, '{$1}')      // {id?} -> {id}
    .toLowerCase()                         // normalize case
    .replace(/\/$/, '')                    // remove trailing slash
    .replace(/^\/+/, '/');                 // normalize leading slash
}

/**
 * Generates a unique key for METHOD + normalized_path
 */
function getRouteKey(method, normalizedPath) {
  return `${method.toUpperCase()}:${normalizedPath}`;
}

/**
 * Scans a TypeScript file for route definitions
 */
function scanFile(filePath) {
  const routes = [];
  
  if (!filePath.endsWith('.ts') || filePath.includes('.spec.') || filePath.includes('.test.')) {
    return routes;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    // Regex patterns for route decorators
    const decoratorPattern = /@(Get|Post|Put|Patch|Delete|Head|Options)\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/gi;
    
    lines.forEach((line, index) => {
      let match;
      while ((match = decoratorPattern.exec(line)) !== null) {
        const method = match[1].toUpperCase();
        const routePath = match[2];
        const normalized = normalizePath(routePath);
        
        routes.push({
          method,
          path: routePath,
          normalizedPath: normalized,
          file: filePath,
          line: index + 1
        });
      }
    });
  } catch (error) {
    console.error(`Error scanning file ${filePath}:`, error.message);
  }

  return routes;
}

/**
 * Recursively scans directory for TypeScript files
 */
function scanDirectory(dirPath, routes = []) {
  const excludeDirs = ['node_modules', 'dist', 'coverage', '.git', 'test', '__tests__'];
  
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    entries.forEach(entry => {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        if (!excludeDirs.includes(entry.name)) {
          scanDirectory(fullPath, routes);
        }
      } else if (entry.isFile()) {
        const fileRoutes = scanFile(fullPath);
        routes.push(...fileRoutes);
      }
    });
  } catch (error) {
    // Ignore
  }
  
  return routes;
}

/**
 * Finds duplicate routes
 */
function findDuplicates(routes) {
  const routeMap = new Map();
  
  // Group routes by key
  routes.forEach(route => {
    const key = getRouteKey(route.method, route.normalizedPath);
    if (!routeMap.has(key)) {
      routeMap.set(key, []);
    }
    routeMap.get(key).push(route);
  });
  
  // Find duplicates
  const duplicates = [];
  
  for (const [key, routeList] of routeMap.entries()) {
    if (routeList.length > 1) {
      const first = routeList[0];
      duplicates.push({
        key,
        method: first.method,
        normalizedPath: first.normalizedPath,
        occurrences: routeList.map(r => ({
          file: r.file.replace(process.cwd(), '.'),
          line: r.line,
          originalPath: r.path
        }))
      });
    }
  }
  
  return duplicates.sort((a, b) => a.key.localeCompare(b.key));
}

/**
 * Generates CSV report
 */
function generateCSV(duplicates) {
  const lines = ['Method,NormalizedPath,File,Line,OriginalPath'];
  
  duplicates.forEach(dup => {
    dup.occurrences.forEach(occ => {
      lines.push(`${dup.method},${dup.normalizedPath},"${occ.file}",${occ.line},${occ.originalPath}`);
    });
  });
  
  return lines.join('\n');
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 BThwani Route Uniqueness Guard - BTW-AUD-002');
  console.log('==============================================\n');

  const srcDir = path.resolve(__dirname, '../src');
  console.log(`📂 Scanning directory: ${srcDir}\n`);

  // Scan for routes
  const routes = scanDirectory(srcDir);
  console.log(`✅ Found ${routes.length} routes\n`);

  // Find duplicates
  const duplicates = findDuplicates(routes);
  
  // Create result
  const result = {
    timestamp: new Date().toISOString(),
    totalRoutes: routes.length,
    uniqueRoutes: routes.length - duplicates.reduce((sum, d) => sum + d.occurrences.length - 1, 0),
    duplicates,
    status: duplicates.length === 0 ? 'PASS' : 'FAIL'
  };

  // Print results
  console.log('📊 SCAN RESULTS');
  console.log('===============');
  console.log(`Status: ${result.status === 'PASS' ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Total routes: ${result.totalRoutes}`);
  console.log(`Unique routes: ${result.uniqueRoutes}`);
  console.log(`Duplicate keys: ${duplicates.length}\n`);

  if (duplicates.length > 0) {
    console.log('⚠️  DUPLICATE ROUTES FOUND:\n');
    
    duplicates.forEach((dup, index) => {
      console.log(`${index + 1}. ${dup.method} ${dup.normalizedPath}`);
      console.log(`   Key: ${dup.key}`);
      console.log(`   Occurrences: ${dup.occurrences.length}`);
      dup.occurrences.forEach((occ, i) => {
        console.log(`     ${i + 1}) ${occ.file}:${occ.line} (${occ.originalPath})`);
      });
      console.log('');
    });

    console.log('📋 ACTION REQUIRED:');
    console.log('   1. Review duplicate routes above');
    console.log('   2. Consolidate or rename conflicting routes');
    console.log('   3. Update API documentation');
    console.log('   4. Re-run this check\n');
  } else {
    console.log('✅ No duplicate routes detected!\n');
  }

  // Save reports
  const reportsDir = path.resolve(__dirname, '../reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  // JSON report
  const jsonPath = path.join(reportsDir, 'route_duplicates.json');
  fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2));
  console.log(`💾 JSON report saved to: ${jsonPath}`);

  // CSV report
  if (duplicates.length > 0) {
    const csvPath = path.join(reportsDir, 'route_duplicates.csv');
    fs.writeFileSync(csvPath, generateCSV(duplicates));
    console.log(`💾 CSV report saved to: ${csvPath}`);
  }

  // Exit with appropriate code
  process.exit(result.status === 'FAIL' ? 1 : 0);
}

main();

