#!/usr/bin/env node

/**
 * SDK Validation Script
 *
 * Validates that all generated SDKs are present and properly structured
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Generated SDKs\n');

const projects = [
  { name: 'admin-dashboard', output: 'admin-dashboard/src/api/generated' },
  { name: 'bthwani-web', output: 'bthwani-web/src/api/generated' },
  { name: 'app-user', output: 'app-user/src/api/generated' },
  { name: 'vendor-app', output: 'vendor-app/src/api/generated' },
  { name: 'rider-app', output: 'rider-app/src/api/generated' },
  { name: 'field-marketers', output: 'field-marketers/src/api/generated' }
];

let errors = [];
let warnings = [];

projects.forEach(project => {
  const outputDir = path.join(process.cwd(), project.output);

  console.log(`Checking ${project.name}...`);

  // Check if directory exists
  if (!fs.existsSync(outputDir)) {
    errors.push(`${project.name}: Generated directory missing: ${project.output}`);
    return;
  }

  // Check required files
  const requiredFiles = ['index.ts', 'apis.ts', 'models.ts'];
  requiredFiles.forEach(file => {
    const filePath = path.join(outputDir, file);
    if (!fs.existsSync(filePath)) {
      errors.push(`${project.name}: Missing required file: ${file}`);
    } else {
      // Check file size (basic validation)
      const stats = fs.statSync(filePath);
      if (stats.size < 100) {
        warnings.push(`${project.name}: ${file} seems too small (${stats.size} bytes)`);
      }
    }
  });

  // Check if there are API files
  const files = fs.readdirSync(outputDir);
  const apiFiles = files.filter(file => file.endsWith('Api.ts') && file !== 'apis.ts');
  if (apiFiles.length === 0) {
    warnings.push(`${project.name}: No individual API files found`);
  } else {
    console.log(`  ✅ Found ${apiFiles.length} API files`);
  }
});

// Check OpenAPI source
const openapiPath = path.join(process.cwd(), 'openapi.yaml');
if (!fs.existsSync(openapiPath)) {
  errors.push('Root openapi.yaml file missing');
} else {
  const stats = fs.statSync(openapiPath);
  console.log(`✅ OpenAPI spec: ${stats.size} bytes`);
}

// Report results
console.log('\n📊 Validation Results:');
console.log(`Errors: ${errors.length}`);
console.log(`Warnings: ${warnings.length}`);

if (errors.length > 0) {
  console.log('\n❌ Errors:');
  errors.forEach(error => console.log(`  - ${error}`));
}

if (warnings.length > 0) {
  console.log('\n⚠️  Warnings:');
  warnings.forEach(warning => console.log(`  - ${warning}`));
}

if (errors.length === 0) {
  console.log('\n✅ All SDKs validated successfully!');
  process.exit(0);
} else {
  console.log('\n❌ Validation failed. Run "npm run generate:sdks" to regenerate.');
  process.exit(1);
}
