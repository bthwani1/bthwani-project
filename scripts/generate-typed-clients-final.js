const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Generating Typed API Clients for BTW-AUD-001\n');

// Ensure OpenAPI spec exists
const openapiPath = 'backend-nest/reports/openapi.json';
if (!fs.existsSync(openapiPath)) {
  console.error('❌ OpenAPI spec not found at:', openapiPath);
  console.log('Please run: npm run audit:openapi first');
  process.exit(1);
}

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
      --input-spec ${openapiPath} \
      --generator-name typescript-${project.client} \
      --output ${outputDir} \
      --additional-properties=typescriptThreePlus=true,useSingleRequestParameter=true,withInterfaces=true`;

    execSync(command, { stdio: 'inherit' });

    // Create index file for easy imports
    const indexContent = `// ${project.description}
// Generated from OpenAPI spec
// Do not edit manually - regenerate using: npm run generate:clients

export * from './apis';
export * from './models';
`;

    fs.writeFileSync(path.join(outputDir, 'index.ts'), indexContent);

    console.log(`✅ Generated client for ${project.name} in ${project.output}`);

  } catch (error) {
    console.error(`❌ Failed to generate client for ${project.name}:`, error.message);
  }
}

// Generate clients for all projects
projects.forEach(generateClient);

console.log('\n🎉 All clients generated successfully!');
console.log('\n📋 Next steps:');
console.log('1. Review generated types and APIs');
console.log('2. Update existing API calls to use typed clients');
console.log('3. Add error handling and interceptors');
console.log('4. Update CI to validate client generation');

console.log('\n📚 Usage example:');
console.log(`import { AuthApi, UserApi } from './api/generated';`);
console.log(`const authApi = new AuthApi();`);
console.log(`const user = await authApi.authLoginPost(loginData);`);
