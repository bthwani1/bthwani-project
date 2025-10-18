# 📋 Contract Testing Guide - BTW-AUD-001

## Overview

This guide explains how BThwani implements API contract testing using OpenAPI as the Single Source of Truth (SSoT).

## Architecture

```
┌─────────────────┐
│  OpenAPI Spec   │ ◄─── Single Source of Truth
│  (SSoT)         │
└────────┬────────┘
         │
         ├──► Generate Typed Clients (TypeScript)
         │    ├─ Admin Dashboard
         │    ├─ Web App  
         │    └─ Mobile App
         │
         ├──► Validate Backend Implementation
         │    └─ Contract Tests
         │
         └──► Documentation
              └─ Swagger UI
```

## Components

### 1. OpenAPI Specification

**Location:** `backend-nest/reports/openapi.json`, `openapi.yaml`

**Generation:**
```bash
cd backend-nest
npm run audit:openapi
```

**Validation:**
```bash
# Lint OpenAPI spec
npx @stoplight/spectral-cli lint reports/openapi.yaml --ruleset ../.spectral.yml

# Validate syntax
npx @apidevtools/swagger-cli validate reports/openapi.yaml
```

### 2. Typed Client Generation

**Generate for all frontends:**
```bash
cd backend-nest
chmod +x scripts/generate-typed-clients.sh
./scripts/generate-typed-clients.sh
```

**What gets generated:**
- Type definitions for all DTOs
- Service methods for all endpoints
- Request/response interfaces
- Error types

**Example usage:**
```typescript
// Instead of raw axios:
const response = await axios.get('/api/users');

// Use typed client:
import { UsersService } from '@/api/generated';
const users = await UsersService.getUsers();
// ✅ Fully typed, autocomplete, compile-time errors
```

### 3. Contract Tests

**Run contract tests:**
```bash
cd backend-nest
npm run test:contract
```

**What they validate:**
- Response schemas match OpenAPI spec
- All required fields are present
- Data types are correct
- Status codes are as documented
- Headers are as specified
- Pagination contracts
- Error response format
- Idempotency support

**Example test:**
```typescript
it('GET /users should match OpenAPI spec', async () => {
  const response = await request(app.getHttpServer())
    .get('/admin/users')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  // Validate against OpenAPI schema
  expect(response.body).toHaveProperty('data');
  expect(response.body).toHaveProperty('meta');
  expect(Array.isArray(response.body.data)).toBe(true);
});
```

## CI/CD Integration

### GitHub Actions Workflow

The contract guard workflow runs on every PR:

```yaml
# .github/workflows/api-contract-and-routes-guard.yml
name: API Contract and Routes Guard

on:
  pull_request:
    branches: [main, develop]

jobs:
  contract-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run test:contract
      - run: npm run audit:parity
```

### Acceptance Criteria (BTW-AUD-001)

- [x] ParityGap <= 5%
- [x] ContractTests = green
- [x] OpenAPI-lint = pass

## Parity Report

**Check API parity:**
```bash
npm run audit:parity
```

**Output:** `reports/parity_report.json`, `reports/parity_report.md`

**What it shows:**
- Frontend calls without backend implementation
- Backend endpoints not in OpenAPI spec
- OpenAPI paths not implemented in code
- Recommendations for alignment

## Best Practices

### 1. Keep OpenAPI in Sync

**Add new endpoint:**
1. Update controller with `@ApiOperation()`, `@ApiResponse()`
2. Run `npm run audit:openapi` to regenerate spec
3. Run `npm run test:contract` to verify
4. Regenerate typed clients
5. Update frontend to use typed client

### 2. Use Swagger Decorators

```typescript
@ApiTags('users')
@Controller('users')
export class UsersController {
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: [UserDto]
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(@Query() query: PaginationDto) {
    // ...
  }
}
```

### 3. Version Your API

```typescript
@Controller({ path: 'users', version: '1' })
export class UsersV1Controller {
  // v1 implementation
}

@Controller({ path: 'users', version: '2' })
export class UsersV2Controller {
  // v2 implementation with breaking changes
}
```

### 4. Document Error Responses

```typescript
@ApiResponse({
  status: 400,
  description: 'Validation error',
  type: ValidationErrorDto
})
@ApiResponse({
  status: 401,
  description: 'Unauthorized',
  type: ErrorDto
})
@ApiResponse({
  status: 404,
  description: 'User not found',
  type: ErrorDto
})
```

### 5. Use DTOs for Validation

```typescript
export class CreateUserDto {
  @ApiProperty({ example: '+967777777777' })
  @IsPhoneNumber('YE')
  phone: string;

  @ApiProperty({ minLength: 8, example: 'SecurePass123!' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ enum: ['user', 'vendor', 'driver'] })
  @IsEnum(['user', 'vendor', 'driver'])
  role: string;
}
```

## Troubleshooting

### Contract Tests Failing

**Problem:** Tests fail with schema mismatch

**Solutions:**
1. Regenerate OpenAPI spec: `npm run audit:openapi`
2. Check Swagger decorators in controller
3. Verify DTO classes are exported
4. Run `npm run audit:parity` to find gaps

### Typed Client Not Working

**Problem:** Generated client has wrong types

**Solutions:**
1. Ensure OpenAPI spec is up to date
2. Regenerate clients: `./scripts/generate-typed-clients.sh`
3. Check that DTOs use class-validator decorators
4. Verify @ApiProperty decorators are present

### Parity Gap Too High

**Problem:** Parity report shows >5% gap

**Solutions:**
1. Review `reports/parity_report.md`
2. Add missing OpenAPI decorators
3. Remove orphaned frontend calls
4. Document deprecated endpoints with @Deprecated()

## Metrics & Monitoring

### Current Status

Check latest parity report:
```bash
cat backend-nest/reports/parity_report.md
```

### Expected Metrics

- **Parity Gap:** < 5%
- **Contract Test Pass Rate:** 100%
- **OpenAPI Lint Errors:** 0
- **Route Duplicates:** 0

### Dashboards

- OpenAPI Spec: http://localhost:3000/api/docs
- Parity Report: `backend-nest/reports/parity_report.md`
- Contract Test Results: CI artifacts

## Migration Guide

### Migrate from Raw Axios to Typed Client

**Before:**
```typescript
// ❌ No type safety
const response = await axios.get('/api/users');
const users = response.data; // any type
```

**After:**
```typescript
// ✅ Full type safety
import { UsersService, User } from '@/api/generated';

const users: User[] = await UsersService.getUsers();
// Autocomplete, compile-time errors, refactoring support
```

### Update Existing Endpoint

1. Update controller:
```typescript
@Get(':id')
@ApiOperation({ summary: 'Get user by ID' })
@ApiParam({ name: 'id', type: 'string' })
@ApiResponse({ status: 200, type: UserDto })
@ApiResponse({ status: 404, description: 'User not found' })
async findOne(@Param('id') id: string) {
  return this.usersService.findOne(id);
}
```

2. Regenerate spec:
```bash
npm run audit:openapi
```

3. Run contract tests:
```bash
npm run test:contract
```

4. Regenerate clients:
```bash
./scripts/generate-typed-clients.sh
```

5. Update frontend imports (if needed)

## Resources

- [OpenAPI Specification](https://swagger.io/specification/)
- [NestJS Swagger Module](https://docs.nestjs.com/openapi/introduction)
- [Spectral Linting](https://stoplight.io/open-source/spectral)
- [Contract Testing](https://martinfowler.com/bliki/ContractTest.html)

## Support

For questions or issues:
1. Check this guide
2. Review parity report
3. Run contract tests locally
4. Contact backend team

---

**Status:** ✅ Implemented  
**Owner:** @BE, @FE  
**Due:** +7d from 2025-10-16

