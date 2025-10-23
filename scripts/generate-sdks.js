#!/usr/bin/env node

/**
 * Unified SDK Generation Script
 *
 * Generates OpenAPI specification from backend and creates typed SDKs for all frontend applications
 *
 * Usage: node scripts/generate-sdks.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Unified SDK Generation System - BTW-AUD-001\n');

// Step 1: Ensure OpenAPI specification exists
console.log('📝 Step 1: Checking OpenAPI specification...');

const openapiPath = path.join(process.cwd(), 'openapi.yaml');
const backendOpenapiPath = path.join(process.cwd(), 'backend-nest/reports/openapi.yaml');

if (!fs.existsSync(openapiPath)) {
  console.log('🔄 Root openapi.yaml not found, generating from backend...');
  try {
    execSync('cd backend-nest && npm run audit:openapi', { stdio: 'inherit' });

    // Copy to root as single source of truth
    if (fs.existsSync(backendOpenapiPath)) {
      execSync('cp backend-nest/reports/openapi.yaml openapi.yaml', { stdio: 'inherit' });
      execSync('cp backend-nest/reports/openapi.json openapi.json', { stdio: 'inherit' });
      console.log('✅ OpenAPI specification generated and copied to root');
    } else {
      console.error('❌ Backend did not generate OpenAPI files');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Failed to generate OpenAPI spec:', error.message);
    console.log('💡 Try running the backend build first or use existing openapi.yaml');
    process.exit(1);
  }
} else {
  console.log('✅ Using existing openapi.yaml as source of truth');
}

// Step 3: Generate SDKs for all applications
console.log('🔧 Step 3: Generating SDKs for all applications...\n');

const projects = [
  {
    name: 'admin-dashboard',
    output: 'admin-dashboard/src/api/generated',
    client: 'axios',
    description: 'Admin Dashboard API Client'
  },
  {
    name: 'bthwani-web',
    output: 'bthwani-web/src/api/generated',
    client: 'fetch',
    description: 'Main Web App API Client'
  },
  {
    name: 'app-user',
    output: 'app-user/src/api/generated',
    client: 'axios',
    description: 'User Mobile App API Client'
  },
  {
    name: 'vendor-app',
    output: 'vendor-app/src/api/generated',
    client: 'axios',
    description: 'Vendor Mobile App API Client'
  },
  {
    name: 'rider-app',
    output: 'rider-app/src/api/generated',
    client: 'axios',
    description: 'Rider Mobile App API Client'
  },
  {
    name: 'field-marketers',
    output: 'field-marketers/src/api/generated',
    client: 'axios',
    description: 'Field Marketers App API Client'
  }
];

function generateClient(project) {
  console.log(`📦 Generating client for ${project.name}...`);

  try {
    // Create output directory
    const outputDir = path.join(process.cwd(), project.output);
    fs.mkdirSync(outputDir, { recursive: true });

    // Generate client
    const command = `npx openapi-generator-cli generate \
      --input-spec openapi.yaml \
      --generator-name typescript-${project.client} \
      --output ${outputDir} \
      --additional-properties=typescriptThreePlus=true,useSingleRequestParameter=true,withInterfaces=true`;

    execSync(command, { stdio: 'inherit' });

    // Create enhanced index file
    const indexContent = `// ${project.description}
// Generated from OpenAPI spec: openapi.yaml
// Generation Date: ${new Date().toISOString()}
// Do not edit manually - regenerate using: npm run generate:sdks

export * from './apis';
export * from './models';

// Enhanced API client with interceptors
export class ${project.name.replace('-', '')}ApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.REACT_APP_API_URL || "http://localhost:3000";
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }
}
`;

    fs.writeFileSync(path.join(outputDir, 'index.ts'), indexContent);

    console.log(`✅ Generated client for ${project.name} in ${project.output}`);

  } catch (error) {
    console.error(`❌ Failed to generate client for ${project.name}:`, error.message);
  }
}

// Generate clients for all projects
projects.forEach(generateClient);

// Step 4: Validate generated SDKs
console.log('\n🔍 Step 4: Validating generated SDKs...');
let validationErrors = [];

projects.forEach(project => {
  const indexPath = path.join(process.cwd(), project.output, 'index.ts');
  if (!fs.existsSync(indexPath)) {
    validationErrors.push(`Missing index.ts for ${project.name}`);
  }

  const apisPath = path.join(process.cwd(), project.output, 'apis.ts');
  if (!fs.existsSync(apisPath)) {
    validationErrors.push(`Missing apis.ts for ${project.name}`);
  }

  const modelsPath = path.join(process.cwd(), project.output, 'models.ts');
  if (!fs.existsSync(modelsPath)) {
    validationErrors.push(`Missing models.ts for ${project.name}`);
  }
});

if (validationErrors.length > 0) {
  console.error('❌ SDK Validation Errors:');
  validationErrors.forEach(error => console.error(`  - ${error}`));
  process.exit(1);
} else {
  console.log('✅ All SDKs validated successfully');
}

// Step 5: Generate summary report
console.log('\n📊 Step 5: Generating summary report...');

const summary = {
  generationDate: new Date().toISOString(),
  openapiVersion: '3.0.0',
  totalApplications: projects.length,
  generatedClients: projects.map(p => ({
    name: p.name,
    clientType: p.client,
    outputPath: p.output,
    description: p.description
  })),
  sourceOfTruth: 'openapi.yaml (root level)',
  nextSteps: [
    'Review generated types and APIs',
    'Update existing API calls to use typed clients',
    'Add error handling and interceptors',
    'Test API integration in each application'
  ]
};

fs.writeFileSync(
  path.join(process.cwd(), 'sdk-generation-report.json'),
  JSON.stringify(summary, null, 2)
);

console.log('✅ Summary report saved to sdk-generation-report.json');

console.log('\n🎉 SDK Generation Complete!');
console.log('\n📋 Generated SDKs:');
projects.forEach(project => {
  console.log(`  - ${project.name}: ${project.output} (${project.client})`);
});

console.log('\n📚 Usage Example:');
console.log(`import { AuthApi, UserApi } from './api/generated';`);
console.log(`const authApi = new AuthApi();`);
console.log(`const user = await authApi.authLoginPost(loginData);`);

console.log('\n🔄 To regenerate SDKs after API changes:');
console.log('npm run generate:sdks');

console.log('\n📖 For more information, see: sdk-generation-report.json');
