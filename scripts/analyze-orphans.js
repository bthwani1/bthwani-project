#!/usr/bin/env node
/**
 * Analyze FE Orphans and categorize them
 */

const fs = require('fs');

const orphans = fs.readFileSync('artifacts/fe_orphans.csv', 'utf-8')
  .trim()
  .split('\n')
  .slice(1) // skip header
  .map(line => {
    const [method, path] = line.split(',');
    return { method, path };
  });

const categories = {
  duplicates: [],
  admin: [],
  er: [],
  merchant: [],
  auth: [],
  users: [],
  wallet: [],
  delivery: [],
  errands: [],
  vendors: [],
  other: []
};

for (const orphan of orphans) {
  const { path } = orphan;
  
  // Duplicates/malformed
  if (path.includes('?{id}') || path.includes('{id}?') || path.includes('stores{id}')) {
    categories.duplicates.push(orphan);
  }
  // Admin
  else if (path.startsWith('/admin/')) {
    categories.admin.push(orphan);
  }
  // ER/HR
  else if (path.startsWith('/er/')) {
    categories.er.push(orphan);
  }
  // Merchant
  else if (path.startsWith('/merchant')) {
    categories.merchant.push(orphan);
  }
  // Auth
  else if (path.startsWith('/auth/')) {
    categories.auth.push(orphan);
  }
  // Users
  else if (path.startsWith('/users/') || path.startsWith('/user/')) {
    categories.users.push(orphan);
  }
  // Wallet V2
  else if (path.startsWith('/v2/wallet/')) {
    categories.wallet.push(orphan);
  }
  // Delivery
  else if (path.startsWith('/delivery/')) {
    categories.delivery.push(orphan);
  }
  // Errands
  else if (path.startsWith('/errands/')) {
    categories.errands.push(orphan);
  }
  // Vendors
  else if (path.startsWith('/vendors')) {
    categories.vendors.push(orphan);
  }
  // Other
  else {
    categories.other.push(orphan);
  }
}

console.log('📊 FE Orphans Analysis\n');
console.log('═'.repeat(60));

for (const [category, items] of Object.entries(categories)) {
  if (items.length === 0) continue;
  
  console.log(`\n${category.toUpperCase()}: ${items.length} orphans`);
  console.log('-'.repeat(60));
  
  items.slice(0, 5).forEach(item => {
    console.log(`  ${item.method.padEnd(7)} ${item.path}`);
  });
  
  if (items.length > 5) {
    console.log(`  ... and ${items.length - 5} more`);
  }
}

console.log('\n' + '═'.repeat(60));
console.log('\n📈 Summary by Priority:\n');

const priority = [
  { name: 'Duplicates/Malformed', count: categories.duplicates.length, action: 'Fix extraction logic' },
  { name: 'Auth endpoints', count: categories.auth.length, action: 'Add OpenAPI decorators' },
  { name: 'User endpoints', count: categories.users.length, action: 'Add OpenAPI decorators' },
  { name: 'Delivery endpoints', count: categories.delivery.length, action: 'Add OpenAPI decorators' },
  { name: 'Admin endpoints', count: categories.admin.length, action: 'Add OpenAPI decorators' },
  { name: 'Wallet V2', count: categories.wallet.length, action: 'Add OpenAPI decorators or remove if unused' },
  { name: 'Merchant', count: categories.merchant.length, action: 'Add OpenAPI decorators or remove if unused' },
  { name: 'ER/HR', count: categories.er.length, action: 'Add OpenAPI decorators' },
  { name: 'Errands', count: categories.errands.length, action: 'Add OpenAPI decorators or remove if unused' },
  { name: 'Other', count: categories.other.length, action: 'Review individually' }
];

priority.forEach((p, i) => {
  if (p.count === 0) return;
  console.log(`${i + 1}. ${p.name.padEnd(25)} ${String(p.count).padStart(3)} - ${p.action}`);
});

console.log('\n' + '═'.repeat(60));
console.log(`\nTotal: ${orphans.length} orphans\n`);

// Write detailed report
const report = {
  timestamp: new Date().toISOString(),
  total: orphans.length,
  categories,
  priority
};

fs.writeFileSync('artifacts/orphans_analysis.json', JSON.stringify(report, null, 2));
console.log('✅ Detailed report saved to: artifacts/orphans_analysis.json\n');

