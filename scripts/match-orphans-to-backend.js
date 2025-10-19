#!/usr/bin/env node
/**
 * Match orphans to backend routes to find mismatches
 */

const fs = require('fs');

function csv(p) {
  if (!fs.existsSync(p)) return [];
  const content = fs.readFileSync(p, 'utf-8').trim();
  if (!content) return [];
  const lines = content.split('\n');
  const headers = lines.shift().split(',');
  return lines.map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((key, i) => {
      obj[key.trim()] = (values[i] || '').trim();
    });
    return obj;
  });
}

// Load data
const orphans = csv('artifacts/fe_orphans.csv');
const backendRoutes = csv('artifacts/route_inventory_backend.csv');
const openApiRoutes = csv('artifacts/openapi_contracts.csv');

// Create maps
const backendMap = {};
backendRoutes.forEach(r => {
  const method = (r.method || r.METHOD || '').toUpperCase();
  const path = (r.path || r.PATH || '').toLowerCase();
  const key = `${method} ${path}`;
  backendMap[key] = r;
});

const openApiMap = {};
openApiRoutes.forEach(r => {
  const method = (r.METHOD || r.method || '').toUpperCase();
  const path = (r.PATH || r.path || '').toLowerCase();
  const key = `${method} ${path}`;
  openApiMap[key] = r;
});

console.log('🔍 Analyzing orphans to find matches...\n');

const results = {
  existsButMissingDecorators: [],
  pathMismatch: [],
  doesNotExist: [],
  inBackendNotInOpenApi: []
};

for (const orphan of orphans) {
  const method = orphan.method;
  const path = orphan.path;
  const orphanKey = `${method} ${path.toLowerCase()}`;
  
  // Check exact match in backend
  if (backendMap[orphanKey]) {
    // Exists in backend
    if (openApiMap[orphanKey]) {
      // Exists in both - shouldn't be orphan
      console.warn(`⚠️  ${method} ${path} exists in both but marked as orphan`);
    } else {
      // Exists in backend but missing OpenAPI decorators
      results.existsButMissingDecorators.push({
        ...orphan,
        controller: backendMap[orphanKey].controller,
        handler: backendMap[orphanKey].handler
      });
    }
  } else {
    // Not exact match - check for similar paths
    const pathLower = path.toLowerCase();
    const similarPaths = Object.keys(backendMap).filter(key => {
      const [bMethod, bPath] = key.split(' ');
      return bMethod === method && (
        bPath.includes(pathLower.split('/').pop()) ||
        pathLower.includes(bPath.split('/').pop()) ||
        bPath.replace('/users/', '/user/') === pathLower ||
        bPath.replace('/address', '/addresses') === pathLower ||
        bPath.replace('/addresses', '/address') === pathLower
      );
    });
    
    if (similarPaths.length > 0) {
      results.pathMismatch.push({
        ...orphan,
        possibleMatches: similarPaths
      });
    } else {
      results.doesNotExist.push(orphan);
    }
  }
}

// Check which backend routes have OpenAPI but not in backend (shouldn't happen)
for (const [key, route] of Object.entries(backendMap)) {
  if (!openApiMap[key]) {
    const [method, path] = key.split(' ');
    results.inBackendNotInOpenApi.push({
      method: method.toUpperCase(),
      path,
      controller: route.controller,
      handler: route.handler
    });
  }
}

console.log('═'.repeat(70));
console.log('\n📊 Orphan Analysis Results\n');
console.log('═'.repeat(70));

console.log(`\n✅ Exists in Backend but Missing OpenAPI Decorators: ${results.existsButMissingDecorators.length}`);
if (results.existsButMissingDecorators.length > 0) {
  console.log('-'.repeat(70));
  results.existsButMissingDecorators.slice(0, 10).forEach(item => {
    console.log(`  ${item.method.padEnd(7)} ${item.path}`);
    console.log(`           → ${item.controller}.${item.handler}()`);
  });
  if (results.existsButMissingDecorators.length > 10) {
    console.log(`  ... and ${results.existsButMissingDecorators.length - 10} more`);
  }
}

console.log(`\n⚠️  Path Mismatch (Frontend != Backend): ${results.pathMismatch.length}`);
if (results.pathMismatch.length > 0) {
  console.log('-'.repeat(70));
  results.pathMismatch.slice(0, 10).forEach(item => {
    console.log(`  ${item.method.padEnd(7)} ${item.path}`);
    console.log(`           → Possible: ${item.possibleMatches.join(', ')}`);
  });
  if (results.pathMismatch.length > 10) {
    console.log(`  ... and ${results.pathMismatch.length - 10} more`);
  }
}

console.log(`\n❌ Does Not Exist in Backend: ${results.doesNotExist.length}`);
if (results.doesNotExist.length > 0) {
  console.log('-'.repeat(70));
  results.doesNotExist.slice(0, 15).forEach(item => {
    console.log(`  ${item.method.padEnd(7)} ${item.path}`);
  });
  if (results.doesNotExist.length > 15) {
    console.log(`  ... and ${results.doesNotExist.length - 15} more`);
  }
}

console.log(`\n🔧 In Backend but Missing OpenAPI: ${results.inBackendNotInOpenApi.length}`);
if (results.inBackendNotInOpenApi.length > 0) {
  console.log('-'.repeat(70));
  results.inBackendNotInOpenApi.slice(0, 10).forEach(item => {
    console.log(`  ${item.method.padEnd(7)} ${item.path}`);
    console.log(`           → ${item.controller}.${item.handler}()`);
  });
  if (results.inBackendNotInOpenApi.length > 10) {
    console.log(`  ... and ${results.inBackendNotInOpenApi.length - 10} more`);
  }
}

console.log('\n' + '═'.repeat(70));
console.log('\n📝 Action Items:\n');
console.log(`1. Add OpenAPI decorators: ${results.existsButMissingDecorators.length + results.inBackendNotInOpenApi.length} endpoints`);
console.log(`2. Fix path mismatches: ${results.pathMismatch.length} endpoints`);
console.log(`3. Remove from Frontend: ${results.doesNotExist.length} endpoints`);
console.log('\n' + '═'.repeat(70));

// Save detailed report
fs.writeFileSync('artifacts/orphans_match_analysis.json', JSON.stringify(results, null, 2));
console.log('\n✅ Detailed report: artifacts/orphans_match_analysis.json\n');

