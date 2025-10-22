const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projects = [
  { name: 'backend-nest', dir: 'backend-nest' },
  { name: 'admin-dashboard', dir: 'admin-dashboard' },
  { name: 'bthwani-web', dir: 'bthwani-web' },
  { name: 'app-user', dir: 'app-user' },
  { name: 'vendor-app', dir: 'vendor-app' },
  { name: 'rider-app', dir: 'rider-app' },
  { name: 'field-marketers', dir: 'field-marketers' }
];

console.log('🚀 Generating SBOM for all projects...\n');

projects.forEach(project => {
  const projectPath = path.join(__dirname, project.dir);
  const outputFile = path.join(__dirname, `sbom-${project.name}.json`);

  try {
    // Check if package.json exists
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      console.log(`⚠️  Skipping ${project.name} - no package.json found`);
      return;
    }

    console.log(`📦 Generating SBOM for ${project.name}...`);

    // Run CycloneDX
    execSync(`cd "${projectPath}" && npx @cyclonedx/cyclonedx-npm --output-file "${outputFile}"`, {
      stdio: 'inherit'
    });

    console.log(`✅ SBOM generated: sbom-${project.name}.json\n`);
  } catch (error) {
    console.error(`❌ Failed to generate SBOM for ${project.name}:`, error.message);
  }
});

console.log('🎉 SBOM generation completed!');
console.log('📋 Generated files:');
projects.forEach(project => {
  const file = `sbom-${project.name}.json`;
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  }
});
