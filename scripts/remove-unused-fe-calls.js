#!/usr/bin/env node
/**
 * Remove unused/orphan frontend API calls
 * Based on categorized orphans analysis
 */

const fs = require('fs');
const path = require('path');

// Load categorized orphans
const categorized = JSON.parse(
  fs.readFileSync('artifacts/orphans_categorized.json', 'utf-8')
);

const toRemove = [
  ...categorized.likelyUnused,
  ...categorized.canRemove
];

console.log(`🗑️  Preparing to mark ${toRemove.length} unused API calls for review\n`);

// Group by path prefix for easier review
const byPrefix = {};

toRemove.forEach(orphan => {
  const prefix = orphan.path.split('/').slice(0, 3).join('/');
  if (!byPrefix[prefix]) {
    byPrefix[prefix] = [];
  }
  byPrefix[prefix].push(orphan);
});

console.log('═'.repeat(70));
console.log('\n📋 Unused API Calls by Module:\n');

for (const [prefix, items] of Object.entries(byPrefix)) {
  console.log(`\n${prefix}/ (${items.length} calls)`);
  console.log('-'.repeat(70));
  items.slice(0, 5).forEach(item => {
    console.log(`  ${item.method.padEnd(7)} ${item.path}`);
    console.log(`           → ${item.reason}`);
  });
  if (items.length > 5) {
    console.log(`  ... and ${items.length - 5} more`);
  }
}

console.log('\n' + '═'.repeat(70));
console.log('\n✅ These API calls can be safely removed from frontend:');
console.log(`   Total: ${toRemove.length} calls\n`);

// Create a removal guide
const removalGuide = {
  summary: `${toRemove.length} unused API calls identified`,
  categories: {
    cms: toRemove.filter(o => o.path.includes('/admin/onboarding') || o.path.includes('/admin/strings') || o.path.includes('/home-layouts')),
    er: toRemove.filter(o => o.path.includes('/er/')),
    errands: toRemove.filter(o => o.path.includes('/errands')),
    merchant: toRemove.filter(o => o.path.includes('/merchant')),
    other: toRemove.filter(o => 
      !o.path.includes('/admin/onboarding') && 
      !o.path.includes('/admin/strings') &&
      !o.path.includes('/home-layouts') &&
      !o.path.includes('/er/') && 
      !o.path.includes('/errands') && 
      !o.path.includes('/merchant')
    )
  },
  action: 'Review and remove these calls from frontend code',
  allCalls: toRemove
};

fs.writeFileSync('artifacts/unused_api_calls.json', JSON.stringify(removalGuide, null, 2));

console.log('📄 Removal guide saved to: artifacts/unused_api_calls.json');
console.log();
console.log('🎯 Next steps:');
console.log('   1. Review the categorized list');
console.log('   2. Verify these endpoints are truly unused');
console.log('   3. Remove API calls from frontend code');
console.log('   4. Re-run orphans check');
console.log();

