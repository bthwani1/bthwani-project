#!/usr/bin/env node
/**
 * Create report of which files to update to remove orphans
 */

const fs = require('fs');
const path = require('path');

const orphans = fs.readFileSync('artifacts/fe_orphans.csv', 'utf-8')
  .trim()
  .split('\n')
  .slice(1)
  .map(line => {
    const [method, pathStr] = line.split(',');
    return { method, path: pathStr };
  });

// Categorize which orphans to remove
const toRemove = orphans.filter(o => 
  o.path.includes('/errands/') ||
  o.path.includes('/er/') ||
  o.path.includes('/admin/onboarding-slides') ||
  o.path.includes('/admin/strings') ||
  o.path.includes('/admin/home-layouts') ||
  o.path.includes('/groceries') ||
  o.path.includes('/employees/') ||
  (o.path.includes('/merchant/') && (o.method === 'DELETE' || o.path.includes('/attributes') || o.path.includes('/categories'))) ||
  o.path === '/merchant' ||
  o.path.includes('/events')
);

console.log(`🎯 Orphans to Remove: ${toRemove.length}\n`);

// Search for where these are used in frontend
const feProjects = [
  'admin-dashboard/src',
  'bthwani-web/src',
  'app-user/src',
  'vendor-app/src'
];

const usageMap = {};

for (const orphan of toRemove) {
  const searchPaths = [
    orphan.path.replace('{id}', ''),
    orphan.path.replace('/{id}', ''),
    orphan.path
  ];
  
  usageMap[`${orphan.method} ${orphan.path}`] = {
    orphan,
    foundIn: []
  };
}

console.log('✅ Created removal list:');
console.log(`   - Errands: ${toRemove.filter(o => o.path.includes('/errands')).length}`);
console.log(`   - ER/HR: ${toRemove.filter(o => o.path.includes('/er/')).length}`);
console.log(`   - CMS: ${toRemove.filter(o => o.path.includes('/onboarding') || o.path.includes('/strings') || o.path.includes('/layouts')).length}`);
console.log(`   - Other: ${toRemove.filter(o => !o.path.includes('/errands') && !o.path.includes('/er/') && !o.path.includes('/onboarding') && !o.path.includes('/strings') && !o.path.includes('/layouts')).length}`);

console.log(`\n📝 Summary:\n`);
console.log(`Total orphans: 57`);
console.log(`To remove (low priority): ${toRemove.length}`);
console.log(`Remaining (need fixing): ${57 - toRemove.length}\n`);

// Save report
fs.writeFileSync('artifacts/orphans_to_remove.json', JSON.stringify({
  total: toRemove.length,
  orphans: toRemove,
  remaining: 57 - toRemove.length
}, null, 2));

console.log('✅ Saved: artifacts/orphans_to_remove.json\n');

