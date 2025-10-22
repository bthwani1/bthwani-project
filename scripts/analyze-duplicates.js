const fs = require('fs');
const path = require('path');

console.log('🔍 Analyzing API duplicates...\n');

// Find all controller files
function findControllers(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (item === 'node_modules' || item === 'dist' || item === 'build') continue;

    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...findControllers(fullPath));
    } else if (fullPath.endsWith('.controller.ts') && !fullPath.includes('.spec.ts')) {
      results.push(fullPath);
    }
  }
  return results;
}

// Extract routes from controller
function extractRoutes(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const routes = [];

  // Extract controller path prefix first
  const controllerMatch = content.match(/@Controller\s*\(\s*['"]([^'"]*)['"]/);
  const controllerPath = controllerMatch ? controllerMatch[1] : '';

  // Match HTTP method decorators followed by route paths
  const methodRegex = /@(Get|Post|Put|Patch|Delete)\s*\(\s*['"]([^'"]*)['"]/g;
  let match;

  while ((match = methodRegex.exec(content)) !== null) {
    const method = match[1].toUpperCase();
    const routePath = match[2];

    routes.push({
      method,
      path: routePath,
      fullPath: controllerPath ? `${controllerPath}/${routePath}`.replace(/\/+/g, '/') : routePath,
      file: path.basename(filePath),
      controller: path.basename(path.dirname(filePath))
    });
  }

  return routes;
}

// Main analysis
const controllers = findControllers('backend-nest/src/modules');
console.log(`Found ${controllers.length} controllers\n`);

const allRoutes = [];
controllers.forEach(file => {
  try {
    const routes = extractRoutes(file);
    allRoutes.push(...routes);
    console.log(`${file}: ${routes.length} routes`);
  } catch (error) {
    console.warn(`⚠️ Could not parse ${file}:`, error.message);
  }
});

console.log(`\nTotal routes found: ${allRoutes.length}\n`);

// Group by method+fullPath
const routeGroups = {};
allRoutes.forEach(route => {
  const key = `${route.method} ${route.fullPath}`;
  if (!routeGroups[key]) {
    routeGroups[key] = [];
  }
  routeGroups[key].push(route);
});

// Find duplicates
const duplicates = [];
Object.entries(routeGroups).forEach(([route, files]) => {
  if (files.length > 1) {
    duplicates.push({
      route,
      files: files.map(f => `${f.controller}/${f.file}`)
    });
  }
});

if (duplicates.length === 0) {
  console.log('✅ No route duplicates found!');
} else {
  console.log(`❌ Found ${duplicates.length} duplicate routes:\n`);
  duplicates.forEach((dup, index) => {
    console.log(`${index + 1}. ${dup.route}`);
    dup.files.forEach(file => console.log(`   - ${file}`));
    console.log('');
  });

  // Save to CSV
  const csv = 'route,files\n' +
    duplicates.map(dup =>
      `"${dup.route}","${dup.files.join('; ')}"`
    ).join('\n');

  fs.writeFileSync('backend-nest/reports/current_duplicates.csv', csv);
  console.log('📄 Report saved to backend-nest/reports/current_duplicates.csv');
}

console.log('\n🎯 Next steps:');
console.log('1. Review each duplicate and decide which controller should own it');
console.log('2. Move/remove duplicate endpoints');
console.log('3. Update frontend calls if needed');
console.log('4. Run tests to ensure nothing breaks');
