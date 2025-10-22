const fs = require('fs');
const path = require('path');

console.log('🔄 Normalizing OpenAPI spec...\n');

// Load OpenAPI spec (try JSON first, then YAML)
let openapiPath = 'backend-nest/reports/openapi.json';
let openapiSpec;

if (fs.existsSync(openapiPath)) {
  openapiSpec = JSON.parse(fs.readFileSync(openapiPath, 'utf8'));
} else {
  openapiPath = 'backend-nest/reports/openapi.yaml';
  if (fs.existsSync(openapiPath)) {
    console.log('⚠️ YAML support not available, skipping YAML processing');
    console.log('Please convert openapi.yaml to openapi.json first');
    process.exit(1);
  } else {
    console.error('❌ OpenAPI spec not found at:', openapiPath);
    process.exit(1);
  }
}

// Normalization rules
const NORMALIZATION_RULES = {
  // Standardize response codes
  responseCodes: {
    '200': '200',
    '201': '201',
    '204': '204',
    '400': '400',
    '401': '401',
    '403': '403',
    '404': '404',
    '409': '409',
    '422': '422',
    '500': '500'
  },

  // Standardize error messages
  errorMessages: {
    '200': 'Success',
    '201': 'Created',
    '204': 'No Content',
    '400': 'Bad Request',
    '401': 'Unauthorized',
    '403': 'Forbidden',
    '404': 'Not Found',
    '409': 'Conflict',
    '422': 'Unprocessable Entity',
    '500': 'Internal Server Error'
  },

  // Standardize parameter names
  parameterNames: {
    'id': 'id',
    'userId': 'userId',
    'user_id': 'userId',
    'user-id': 'userId',
    'page': 'page',
    'limit': 'limit',
    'cursor': 'cursor',
    'sort': 'sort',
    'order': 'order'
  }
};

function normalizePath(path) {
  // Convert path parameters to consistent format
  return path
    .replace(/\{(\w+)\}/g, (match, param) => {
      const normalized = NORMALIZATION_RULES.parameterNames[param] || param;
      return `{${normalized}}`;
    })
    .replace(/\{(\w+)_(\w+)\}/g, (match, p1, p2) => {
      const normalized = NORMALIZATION_RULES.parameterNames[`${p1}_${p2}`] || `${p1}_${p2}`;
      return `{${normalized}}`;
    });
}

function normalizeOperation(operation) {
  if (!operation) return operation;

  // Normalize responses
  if (operation.responses) {
    const normalizedResponses = {};
    for (const [code, response] of Object.entries(operation.responses)) {
      const normalizedCode = NORMALIZATION_RULES.responseCodes[code] || code;
      normalizedResponses[normalizedCode] = {
        ...response,
        description: NORMALIZATION_RULES.errorMessages[code] || response.description || 'Response'
      };
    }
    operation.responses = normalizedResponses;
  }

  // Normalize parameters
  if (operation.parameters) {
    operation.parameters = operation.parameters.map(param => ({
      ...param,
      name: NORMALIZATION_RULES.parameterNames[param.name] || param.name
    }));
  }

  // Ensure consistent structure
  if (!operation.summary && operation.description) {
    operation.summary = operation.description.substring(0, 100);
  }

  if (!operation.tags || operation.tags.length === 0) {
    operation.tags = ['API'];
  }

  return operation;
}

function normalizeOpenAPISpec(spec) {
  const normalizedSpec = { ...spec };

  // Normalize paths
  const normalizedPaths = {};
  for (const [path, methods] of Object.entries(spec.paths || {})) {
    const normalizedPath = normalizePath(path);
    normalizedPaths[normalizedPath] = {};

    for (const [method, operation] of Object.entries(methods)) {
      normalizedPaths[normalizedPath][method] = normalizeOperation(operation);
    }
  }

  normalizedSpec.paths = normalizedPaths;

  // Ensure components section exists
  if (!normalizedSpec.components) {
    normalizedSpec.components = {
      schemas: {},
      securitySchemes: {}
    };
  }

  // Add standard security schemes if missing
  if (!normalizedSpec.components.securitySchemes) {
    normalizedSpec.components.securitySchemes = {
      bearer: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    };
  }

  return normalizedSpec;
}

// Normalize the spec
const normalizedSpec = normalizeOpenAPISpec(openapiSpec);

// Save normalized spec as JSON
const outputPath = 'backend-nest/reports/openapi.normalized.json';
fs.writeFileSync(outputPath, JSON.stringify(normalizedSpec, null, 2));

console.log('✅ OpenAPI spec normalized!');
console.log(`📄 Saved to: ${outputPath}`);

// Generate summary
const pathCount = Object.keys(normalizedSpec.paths || {}).length;
const operationCount = Object.values(normalizedSpec.paths || {})
  .reduce((count, methods) => count + Object.keys(methods).length, 0);

console.log(`📊 Summary:`);
console.log(`   - Paths: ${pathCount}`);
console.log(`   - Operations: ${operationCount}`);
console.log(`   - Components: ${Object.keys(normalizedSpec.components?.schemas || {}).length} schemas`);
