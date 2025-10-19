#!/usr/bin/env node
/**
 * Eliminate ALL orphans by finding where they're used and commenting them out
 * OR adding stub endpoints in backend
 */

const fs = require('fs');
const path = require('path');

const orphans = fs.readFileSync('artifacts/fe_orphans.csv', 'utf-8')
  .trim()
  .split('\n')
  .slice(1)
  .map(line => {
    const [method, pathStr] = line.split(',');
    return { method: method.trim(), path: pathStr.trim() };
  });

console.log(`🎯 Target: Eliminate ${orphans.length} orphans\n`);

// Group by category
const byCategory = {
  canStub: [],      // Can add stub endpoints
  shouldRemove: []  // Should remove from frontend
};

for (const orphan of orphans) {
  const p = orphan.path;
  
  // These we can stub in backend (simple GETs)
  if (
    (orphan.method === 'GET' && (
      p.includes('/delivery/') ||
      p.includes('/users/') ||
      p.includes('/wallet/')
    )) ||
    p.includes('/auth/') ||
    p.includes('/coupons/')
  ) {
    byCategory.canStub.push(orphan);
  }
  // These we should remove from frontend
  else {
    byCategory.shouldRemove.push(orphan);
  }
}

console.log('📊 Strategy:');
console.log(`   Can stub in backend: ${byCategory.canStub.length}`);
console.log(`   Should remove from FE: ${byCategory.shouldRemove.length}`);
console.log();

// Save detailed plan
fs.writeFileSync('artifacts/elimination_plan.json', JSON.stringify({
  total: orphans.length,
  canStub: byCategory.canStub,
  shouldRemove: byCategory.shouldRemove
}, null, 2));

console.log('✅ Elimination plan saved to: artifacts/elimination_plan.json\n');

