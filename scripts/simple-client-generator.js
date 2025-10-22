const fs = require('fs');
const path = require('path');

console.log('🔧 Generating Simple Typed Clients - BTW-AUD-001\n');

// Read OpenAPI spec
const openapiPath = 'backend-nest/reports/openapi.json';
if (!fs.existsSync(openapiPath)) {
  console.error('❌ OpenAPI spec not found at:', openapiPath);
  process.exit(1);
}

const spec = JSON.parse(fs.readFileSync(openapiPath, 'utf8'));

// Projects configuration
const projects = [
  {
    name: 'admin-dashboard',
    output: 'admin-dashboard/src/api/generated',
    client: 'axios',
    baseUrl: 'process.env.REACT_APP_API_URL || "http://localhost:3000"'
  },
  {
    name: 'bthwani-web',
    output: 'bthwani-web/src/api/generated',
    client: 'fetch',
    baseUrl: 'import.meta.env.VITE_API_URL || "http://localhost:3000"'
  },
  {
    name: 'app-user',
    output: 'app-user/src/api/generated',
    client: 'axios',
    baseUrl: 'process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000"'
  },
  {
    name: 'vendor-app',
    output: 'vendor-app/src/api/generated',
    client: 'axios',
    baseUrl: 'process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000"'
  },
  {
    name: 'rider-app',
    output: 'rider-app/src/api/generated',
    client: 'axios',
    baseUrl: 'process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000"'
  },
  {
    name: 'field-marketers',
    output: 'field-marketers/src/api/generated',
    client: 'axios',
    baseUrl: 'process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000"'
  }
];

// Extract models from components
function extractModels(spec) {
  const models = {};

  if (spec.components?.schemas) {
    Object.entries(spec.components.schemas).forEach(([name, schema]) => {
      models[name] = generateModelType(name, schema);
    });
  }

  return models;
}

// Generate TypeScript type from schema
function generateModelType(name, schema) {
  if (!schema || typeof schema !== 'object') return `export type ${name} = any;`;

  if (schema.type === 'object' && schema.properties) {
    const properties = Object.entries(schema.properties)
      .map(([propName, propSchema]) => {
        const optional = !schema.required?.includes(propName);
        const type = getTypeFromSchema(propSchema);
        return `  ${propName}${optional ? '?' : ''}: ${type};`;
      })
      .join('\n');

    return `export interface ${name} {\n${properties}\n}`;
  }

  if (schema.type === 'array' && schema.items) {
    const itemType = getTypeFromSchema(schema.items);
    return `export type ${name} = ${itemType}[];`;
  }

  return `export type ${name} = ${getTypeFromSchema(schema)};`;
}

// Convert OpenAPI schema to TypeScript type
function getTypeFromSchema(schema) {
  if (!schema || typeof schema !== 'object') return 'any';

  if (schema.$ref) {
    const ref = schema.$ref.split('/').pop();
    return ref || 'any';
  }

  switch (schema.type) {
    case 'string':
      if (schema.enum) {
        return schema.enum.map(v => `"${v}"`).join(' | ');
      }
      return 'string';
    case 'number':
    case 'integer':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'array':
      if (schema.items) {
        return `${getTypeFromSchema(schema.items)}[]`;
      }
      return 'any[]';
    case 'object':
      if (schema.properties) {
        const props = Object.entries(schema.properties)
          .map(([k, v]) => `${k}: ${getTypeFromSchema(v)}`)
          .join('; ');
        return `{ ${props} }`;
      }
      return 'Record<string, any>';
    default:
      return 'any';
  }
}

// Extract API operations
function extractOperations(spec) {
  const operations = {};

  if (spec.paths) {
    Object.entries(spec.paths).forEach(([path, methods]) => {
      Object.entries(methods).forEach(([method, operation]) => {
        const operationId = operation.operationId || `${method}${path.replace(/[^a-zA-Z0-9]/g, '')}`;
        const tag = operation.tags?.[0] || 'Default';

        if (!operations[tag]) operations[tag] = [];

        operations[tag].push({
          operationId,
          method: method.toUpperCase(),
          path,
          operation
        });
      });
    });
  }

  return operations;
}

// Generate API client class
function generateApiClient(tag, operations, clientType, baseUrl) {
  const className = `${tag}Api`;
  const methods = operations.map(op => generateApiMethod(op, clientType)).join('\n\n');

  return `import axios from 'axios';

export class ${className} {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || ${baseUrl};
  }

${methods}
}`;
}

// Generate API method
function generateApiMethod(operation, clientType) {
  const { operationId, method, path, operation: op } = operation;
  const methodName = operationId.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');

  // Extract parameters
  const pathParams = (op.parameters || [])
    .filter(p => p.in === 'path')
    .map(p => p.name);

  const queryParams = (op.parameters || [])
    .filter(p => p.in === 'query')
    .map(p => p.name);

  const hasBody = ['POST', 'PUT', 'PATCH'].includes(method);
  const hasQuery = queryParams.length > 0;

  // Generate method signature
  const params = [];
  if (pathParams.length > 0) params.push(...pathParams.map(p => `${p}: string`));
  if (hasQuery) params.push(`params?: { ${queryParams.map(p => `${p}?: any`).join(', ')} }`);
  if (hasBody) params.push('data?: any');

  const paramString = params.length > 0 ? params.join(', ') : '';

  return `  async ${methodName}(${paramString}): Promise<any> {
    const url = \`${path.replace(/\{([^}]+)\}/g, '${$1}')}\`;
    ${hasQuery ? 'const config = { params };' : 'const config = {};'}

    return axios.${method.toLowerCase()}(url, ${hasBody ? 'data, config' : 'config'});
  }`;
}

// Generate index file
function generateIndexFile(models, operations) {
  const modelExports = Object.keys(models).map(name => `export ${models[name].includes('interface') ? 'interface' : 'type'} ${name};`).join('\n');

  const apiExports = Object.keys(operations).map(tag => `export { ${tag}Api } from './${tag}Api';`).join('\n');

  return `${modelExports}

${apiExports}

// Error types
export interface ApiError {
  status: number;
  message: string;
  details?: any;
}

// Utility functions
export function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' &&
         error !== null &&
         'status' in error &&
         'message' in error;
}

export async function apiCall<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (isApiError(error)) {
      throw new Error(\`API Error [\${error.status}]: \${error.message}\`);
    }
    throw error;
  }
}`;
}

// Main generation
const models = extractModels(spec);
const operations = extractOperations(spec);

console.log(`📊 Found ${Object.keys(models).length} models and ${Object.keys(operations).length} API groups\n`);

projects.forEach(project => {
  console.log(`📦 Generating client for ${project.name}...`);

  try {
    // Create output directory
    const outputDir = path.join(process.cwd(), project.output);
    fs.mkdirSync(outputDir, { recursive: true });

    // Generate models file
    const modelsContent = Object.values(models).join('\n\n');
    fs.writeFileSync(path.join(outputDir, 'models.ts'), modelsContent);

    // Generate API clients
    Object.entries(operations).forEach(([tag, ops]) => {
      const clientContent = generateApiClient(tag, ops, project.client, project.baseUrl);
      fs.writeFileSync(path.join(outputDir, `${tag}Api.ts`), clientContent);
    });

    // Generate index file
    const indexContent = generateIndexFile(models, operations);
    fs.writeFileSync(path.join(outputDir, 'index.ts'), indexContent);

    console.log(`✅ Generated client for ${project.name} in ${project.output}`);

  } catch (error) {
    console.error(`❌ Failed to generate client for ${project.name}:`, error.message);
  }
});

console.log('\n🎉 Simple typed clients generated successfully!');
console.log('\n📋 Next steps:');
console.log('1. Review generated types and APIs');
console.log('2. Update existing API calls to use typed clients');
console.log('3. Add error handling and interceptors');
console.log('4. Test the generated clients');

console.log('\n📚 Usage example:');
console.log(`import { AuthApi, LoginRequest } from './api/generated';`);
console.log(`const authApi = new AuthApi();`);
console.log(`const response = await apiCall(() => authApi.login(loginData));`);
