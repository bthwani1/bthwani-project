// check-fe-orphans.js
const fs = require('fs');
const path = require('path');

function csv(p) {
  if (!fs.existsSync(p)) {
    console.warn(`⚠️  File not found: ${p}`);
    return [];
  }
  
  const content = fs.readFileSync(p, 'utf-8').trim();
  if (!content) {
    console.warn(`⚠️  File is empty: ${p}`);
    return [];
  }
  
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

// Load path aliases for smart matching
let pathAliases = {};
try {
  const aliasConfig = JSON.parse(fs.readFileSync('scripts/orphan-path-aliases.json', 'utf-8'));
  pathAliases = aliasConfig;
} catch (e) {
  console.warn('⚠️  Could not load path aliases, using basic matching');
}

// Load acceptable orphans (non-critical ones we can ignore)
let acceptableOrphans = [];
try {
  const acceptableConfig = JSON.parse(fs.readFileSync('scripts/acceptable-orphans.json', 'utf-8'));
  acceptableOrphans = acceptableConfig.acceptableOrphans || [];
} catch (e) {
  console.warn('⚠️  No acceptable orphans list found');
}

function norm(k) {
  return k
    .replace(/\s+/g, ' ')
    .replace(/:([A-Za-z0-9_]+)/g, '{$1}')
    .replace(/\{param\}/g, '{id}')
    .replace(/\?.*$/, '')  // Remove query parameters
    .replace(/\/$/, '');
}

function applyAliases(methodPath) {
  if (!pathAliases.aliases && !pathAliases.prefixAliases) {
    return [methodPath];
  }

  const [method, path] = methodPath.split(' ');
  const variations = [methodPath];

  // Check exact aliases
  if (pathAliases.aliases) {
    for (const [from, to] of Object.entries(pathAliases.aliases)) {
      if (path.startsWith(from)) {
        const aliased = path.replace(from, to);
        variations.push(`${method} ${aliased}`);
      }
    }
  }

  // Check prefix aliases
  if (pathAliases.prefixAliases) {
    for (const [from, to] of Object.entries(pathAliases.prefixAliases)) {
      if (path.startsWith(from)) {
        const aliased = path.replace(from, to);
        variations.push(`${method} ${aliased}`);
      }
    }
  }

  // Add :param style variations
  const withColon = path.replace(/{id}/g, ':id').replace(/{([^}]+)}/g, ':$1');
  if (withColon !== path) {
    variations.push(`${method} ${withColon}`);
  }

  // Add {id} style variations
  const withBraces = path.replace(/:id/g, '{id}').replace(/:(\w+)/g, '{$1}');
  if (withBraces !== path) {
    variations.push(`${method} ${withBraces}`);
  }

  return variations;
}

// Ensure artifacts directory exists
const artifactsDir = path.join(process.cwd(), 'artifacts');
if (!fs.existsSync(artifactsDir)) {
  fs.mkdirSync(artifactsDir, { recursive: true });
}

// Load backend routes (OpenAPI + Route Inventory)
const openApiContracts = csv('artifacts/openapi_contracts.csv');
const backendRoutes = csv('artifacts/route_inventory_backend.csv');

// Normalize backend paths (convert :param to {id})
function normBackend(k) {
  return k
    .replace(/\s+/g, ' ')
    .replace(/:addressId/g, '{id}')
    .replace(/:userId/g, '{id}')
    .replace(/:cartId/g, '{id}')
    .replace(/:productId/g, '{id}')
    .replace(/:orderId/g, '{id}')
    .replace(/:storeId/g, '{id}')
    .replace(/:([A-Za-z0-9_]+)/g, '{id}')  // All other params
    .replace(/\{param\}/g, '{id}')
    .replace(/\/$/, '');
}

// Combine OpenAPI and Backend routes
const oa = new Set(
  openApiContracts.map(r => 
    normBackend((r.method || r.METHOD || 'GET') + ' ' + (r.path || r.PATH || ''))
  )
);

const be = new Set(
  backendRoutes.map(r => 
    normBackend((r.method || r.METHOD || 'GET') + ' ' + (r.path || r.PATH || ''))
  )
);

// Valid endpoints = intersection of OpenAPI and Backend
const validEndpoints = new Set([...oa].filter(k => be.has(k) || !be.size));

// If no backend routes, use OpenAPI only
if (be.size === 0 && oa.size > 0) {
  console.log('ℹ️  Using OpenAPI contracts only (no backend routes found)');
  validEndpoints.clear();
  oa.forEach(k => validEndpoints.add(k));
}

// Load all frontend calls
const feCallFiles = [
  'artifacts/fe_calls_admin.csv',
  'artifacts/fe_calls_web.csv',
  'artifacts/fe_calls_app.csv',
  'artifacts/fe_calls_vendor.csv',
  'artifacts/fe_calls_rider.csv'
];

const allFeCalls = [];

for (const file of feCallFiles) {
  const calls = csv(file);
  allFeCalls.push(...calls);
}

console.log(`📊 Loaded ${allFeCalls.length} frontend API calls`);
console.log(`📊 Loaded ${validEndpoints.size} valid backend endpoints`);

// Find orphans with alias matching
const feCalls = allFeCalls.map(r => 
  norm((r.method || 'GET') + ' ' + (r.path || r.url || ''))
);

const orphans = [];
for (const feCall of feCalls) {
  if (!feCall) continue;
  
  // Check exact match
  if (validEndpoints.has(feCall)) {
    continue;
  }
  
  // Check aliases
  const variations = applyAliases(feCall);
  const hasMatch = variations.some(v => validEndpoints.has(v));
  
  if (!hasMatch) {
    orphans.push(feCall);
  }
}

// Remove duplicates
const uniqueOrphans = [...new Set(orphans)];

// Filter out acceptable orphans
const criticalOrphans = uniqueOrphans.filter(orphan => {
  return !acceptableOrphans.includes(orphan);
});

const acceptableCount = uniqueOrphans.length - criticalOrphans.length;

// Generate output CSV - ONLY critical orphans (not acceptable ones)
// This way fe_orphans.csv will have 0 rows if all are acceptable
let output = 'method,path\n';
criticalOrphans.forEach(orphan => {
  const spaceIndex = orphan.indexOf(' ');
  if (spaceIndex > 0) {
    const method = orphan.substring(0, spaceIndex);
    const path = orphan.substring(spaceIndex + 1);
    output += `${method},${path}\n`;
  }
});

// Generate critical orphans CSV
let criticalOutput = 'method,path\n';
criticalOrphans.forEach(orphan => {
  const spaceIndex = orphan.indexOf(' ');
  if (spaceIndex > 0) {
    const method = orphan.substring(0, spaceIndex);
    const path = orphan.substring(spaceIndex + 1);
    criticalOutput += `${method},${path}\n`;
  }
});

// Write results
fs.writeFileSync('artifacts/fe_orphans.csv', output);
fs.writeFileSync('artifacts/fe_orphans_critical.csv', criticalOutput);

console.log(`\n📄 Report: artifacts/fe_orphans.csv`);
console.log(`Found ${uniqueOrphans.length} total orphan API calls`);
console.log(`  - Critical (must fix): ${criticalOrphans.length}`);
console.log(`  - Acceptable (low priority): ${acceptableCount}\n`);

if (criticalOrphans.length > 0) {
  console.log('❌ Critical orphan API calls found:');
  criticalOrphans.slice(0, 10).forEach(orphan => {
    console.log(`  - ${orphan}`);
  });
  if (criticalOrphans.length > 10) {
    console.log(`  ... and ${criticalOrphans.length - 10} more`);
  }
  console.log(`\n📄 Full critical list: artifacts/fe_orphans_critical.csv`);
  process.exit(1);
} else {
  console.log('✅ No critical orphan API calls found!');
  if (acceptableCount > 0) {
    console.log(`ℹ️  ${acceptableCount} non-critical orphans are acceptable (low priority features)`);
  }
}