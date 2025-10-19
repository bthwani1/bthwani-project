#!/usr/bin/env node
/**
 * Final categorization: which orphans to keep, remove, or add decorators
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

const orphans = csv('artifacts/fe_orphans.csv');
const backendRoutes = csv('artifacts/route_inventory_backend.csv');

// Build backend routes set for quick lookup
const backendSet = new Set();
backendRoutes.forEach(r => {
  const method = (r.method || r.METHOD || '').toUpperCase();
  const path = (r.path || r.PATH || '').toLowerCase();
  backendSet.add(`${method} ${path}`);
});

const categorized = {
  likelyUnused: [],      // Appears to be old/unused features
  needsDecorators: [],   // Exists in backend but needs OpenAPI
  pathMismatch: [],      // Different path between FE/BE
  critical: [],          // Core features (auth, users, delivery)
  canRemove: []          // Safe to remove from frontend
};

// Define critical paths that should exist
const criticalPaths = [
  '/auth/',
  '/users/',
  '/delivery/cart',
  '/delivery/order',
  '/wallet/'
];

for (const orphan of orphans) {
  const path = orphan.path;
  const method = orphan.method;
  
  // Critical paths
  const isCritical = criticalPaths.some(p => path.includes(p));
  
  // Check likely categories
  if (path.includes('/admin/onboarding-slides') || 
      path.includes('/admin/home-layouts') ||
      path.includes('/admin/strings')) {
    categorized.likelyUnused.push({ ...orphan, reason: 'CMS endpoints - rarely used' });
  }
  else if (path.includes('/merchant') && method === 'DELETE') {
    categorized.likelyUnused.push({ ...orphan, reason: 'Merchant management - may not be implemented' });
  }
  else if (path.includes('/errands')) {
    categorized.likelyUnused.push({ ...orphan, reason: 'Errands feature - may not be active' });
  }
  else if (path.includes('/er/')) {
    categorized.likelyUnused.push({ ...orphan, reason: 'ER/HR endpoints - admin only' });
  }
  else if (path.includes('/groceries')) {
    categorized.likelyUnused.push({ ...orphan, reason: 'Groceries - may be deprecated' });
  }
  else if (isCritical) {
    categorized.critical.push({ ...orphan, reason: 'Core feature - must exist or add' });
  }
  else {
    categorized.canRemove.push({ ...orphan, reason: 'Secondary feature' });
  }
}

console.log('📊 Final Orphan Categorization\n');
console.log('═'.repeat(70));

console.log(`\n🔴 CRITICAL - Must Fix (${categorized.critical.length})`);
console.log('-'.repeat(70));
categorized.critical.forEach(item => {
  console.log(`  ${item.method.padEnd(7)} ${item.path}`);
  console.log(`           → ${item.reason}`);
});

console.log(`\n⚠️  LIKELY UNUSED - Can Remove (${categorized.likelyUnused.length})`);
console.log('-'.repeat(70));
categorized.likelyUnused.slice(0, 15).forEach(item => {
  console.log(`  ${item.method.padEnd(7)} ${item.path}`);
  console.log(`           → ${item.reason}`);
});
if (categorized.likelyUnused.length > 15) {
  console.log(`  ... and ${categorized.likelyUnused.length - 15} more`);
}

console.log(`\n🟡 CAN REMOVE - Secondary Features (${categorized.canRemove.length})`);
console.log('-'.repeat(70));
categorized.canRemove.forEach(item => {
  console.log(`  ${item.method.padEnd(7)} ${item.path}`);
  console.log(`           → ${item.reason}`);
});

console.log('\n' + '═'.repeat(70));
console.log('\n📝 Recommendations:\n');
console.log(`1. Fix CRITICAL (${categorized.critical.length})`);
console.log(`   - Add missing endpoints in backend`);
console.log(`   - Or fix path mismatches`);
console.log();
console.log(`2. Remove LIKELY UNUSED (${categorized.likelyUnused.length})`);
console.log(`   - Remove from frontend code`);
console.log(`   - Or verify if actually needed`);
console.log();
console.log(`3. Remove CAN REMOVE (${categorized.canRemove.length})`);
console.log(`   - Safe to remove from frontend`);
console.log();
console.log('═'.repeat(70));
console.log();

// Save report
fs.writeFileSync('artifacts/orphans_categorized.json', JSON.stringify(categorized, null, 2));
console.log('✅ Saved: artifacts/orphans_categorized.json\n');

