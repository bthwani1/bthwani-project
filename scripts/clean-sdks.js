#!/usr/bin/env node

/**
 * SDK Cleanup Script
 *
 * Removes all generated SDK files to prepare for fresh generation
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 Cleaning Generated SDKs\n');

const projects = [
  { name: 'admin-dashboard', output: 'admin-dashboard/src/api/generated' },
  { name: 'bthwani-web', output: 'bthwani-web/src/api/generated' },
  { name: 'app-user', output: 'app-user/src/api/generated' },
  { name: 'vendor-app', output: 'vendor-app/src/api/generated' },
  { name: 'rider-app', output: 'rider-app/src/api/generated' },
  { name: 'field-marketers', output: 'field-marketers/src/api/generated' }
];

let cleanedCount = 0;

projects.forEach(project => {
  const outputDir = path.join(process.cwd(), project.output);

  console.log(`Cleaning ${project.name}...`);

  if (fs.existsSync(outputDir)) {
    try {
      // Use rimraf for cross-platform directory removal
      execSync(`npx rimraf "${outputDir}"`);
      console.log(`  ✅ Cleaned: ${project.output}`);
      cleanedCount++;
    } catch (error) {
      console.log(`  ❌ Failed to clean: ${project.output} (${error.message})`);
    }
  } else {
    console.log(`  ℹ️  Already clean: ${project.output}`);
  }
});

// Clean root OpenAPI files
const rootFiles = ['openapi.yaml', 'openapi.json'];
rootFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`  ✅ Cleaned root file: ${file}`);
    } catch (error) {
      console.log(`  ❌ Failed to clean: ${file} (${error.message})`);
    }
  }
});

console.log(`\n✅ Cleaned ${cleanedCount} SDK directories`);
console.log('\n🔄 Run "npm run generate:sdks" to regenerate all SDKs');
