const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all controller files
const controllerFiles = glob.sync('backend-nest/src/modules/*/controllers/*.controller.ts', {
  cwd: process.cwd()
});

console.log('🔍 Checking for API duplicates across controllers...\n');

// Parse routes from controllers
function extractRoutes(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const routes = [];

  // Match @Method decorators followed by route paths
  const methodRegex = /@(Get|Post|Put|Patch|Delete)\s*\(\s*['"]([^'"]*)['"]/g;
  let match;

  while ((match = methodRegex.exec(content)) !== null) {
    const method = match[1].toUpperCase();
    const routePath = match[2];
    routes.push({
      method,
      path: routePath,
      file: path.basename(filePath),
      controller: path.basename(path.dirname(filePath))
    });
  }

  return routes;
}

// Collect all routes
const allRoutes = [];
controllerFiles.forEach(file => {
  try {
    const routes = extractRoutes(file);
    allRoutes.push(...routes);
  } catch (error) {
    console.warn(`⚠️ Could not parse ${file}:`, error.message);
  }
});

// Check for duplicates
const routeMap = new Map();
const duplicates = [];

allRoutes.forEach(route => {
  const key = `${route.method} ${route.path}`;
  if (routeMap.has(key)) {
    duplicates.push({
      route: key,
      files: [...routeMap.get(key), route.file]
    });
  } else {
    routeMap.set(key, [route.file]);
  }
});

// Filter to only show actual duplicates
const realDuplicates = duplicates.filter(dup =>
  dup.files.length > 1 && new Set(dup.files).size > 1
);

if (realDuplicates.length === 0) {
  console.log('✅ No API duplicates found!');
  process.exit(0);
}

// Report duplicates
console.log(`❌ Found ${realDuplicates.length} duplicate routes:\n`);

realDuplicates.forEach((dup, index) => {
  console.log(`${index + 1}. ${dup.route}`);
  dup.files.forEach(file => console.log(`   - ${file}`));
  console.log('');
});

// Create CSV report
const csvContent = 'route,files\n' +
  realDuplicates.map(dup =>
    `"${dup.route}","${dup.files.join('; ')}"`
  ).join('\n');

fs.mkdirSync('backend-nest/reports', { recursive: true });
fs.writeFileSync('backend-nest/reports/api_duplicates.csv', csvContent);

console.log('📄 Report saved to backend-nest/reports/api_duplicates.csv');

// Exit with error if duplicates found
process.exit(realDuplicates.length > 0 ? 1 : 0);
