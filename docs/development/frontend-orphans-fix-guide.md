# Frontend Orphans Fix Guide - BTW-FE-005

## Overview

This guide explains how to fix frontend API calls that don't have corresponding backend endpoints ("orphans").

## Quick Start

1. **Analyze orphans:**
   ```bash
   cd backend-nest
   npm run fix:fe-orphans
   ```

2. **Review report:**
   ```bash
   cat reports/fe_orphans_fixes.md
   ```

3. **Implement fixes** based on priority (High → Medium → Low)

## Fix Strategies

### Strategy 1: IMPLEMENT (Create Backend Endpoint)

**When to use:**
- Core functionality needed
- Dashboard/admin endpoints
- Critical business features

**Steps:**
1. Create or update controller
2. Add service method
3. Add OpenAPI decorators
4. Write tests
5. Update OpenAPI spec
6. Regenerate typed clients

**Example:**

```typescript
// src/modules/dashboard/dashboard.controller.ts

@Controller('admin/dashboard')
@ApiTags('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get dashboard summary statistics' })
  @ApiResponse({ 
    status: 200, 
    description: 'Dashboard summary',
    type: DashboardSummaryDto 
  })
  async getSummary() {
    return this.dashboardService.getSummary();
  }

  @Get('alerts')
  @ApiOperation({ summary: 'Get dashboard alerts' })
  @ApiResponse({ status: 200, type: [AlertDto] })
  async getAlerts() {
    return this.dashboardService.getAlerts();
  }

  @Get('timeseries')
  @ApiOperation({ summary: 'Get time series data' })
  @ApiQuery({ name: 'metric', required: true })
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to', required: false })
  async getTimeSeries(@Query() query: TimeSeriesQueryDto) {
    return this.dashboardService.getTimeSeries(query);
  }
}
```

### Strategy 2: REDIRECT (Use Existing Endpoint)

**When to use:**
- Similar endpoint already exists
- Can reuse existing logic
- Just needs path adjustment

**Steps:**
1. Identify equivalent endpoint
2. Update frontend to use existing path
3. Add route alias if needed (deprecation path)

**Example:**

```typescript
// Instead of creating /admin/users/list, redirect to existing /admin/users

// Frontend before:
await axios.get('/admin/users/list');

// Frontend after:
import { UsersService } from '@/api/generated';
await UsersService.getUsers();
```

### Strategy 3: DEPRECATE (Remove from Frontend)

**When to use:**
- Feature no longer needed
- Duplicate functionality
- Never implemented

**Steps:**
1. Verify feature is unused
2. Remove frontend code
3. Update UI to remove feature
4. Document in changelog

### Strategy 4: MOCK (Use Mock Data)

**When to use:**
- Service worker / offline features
- Development/testing only
- Non-critical features

**Steps:**
1. Create mock response
2. Update service worker or API client
3. Document as mock endpoint

**Example:**

```typescript
// public/sw.js or api/mocks.ts

const mockEndpoints = {
  '/api/content/latest': {
    content: [],
    updated_at: new Date().toISOString()
  }
};
```

## Priority Levels

### 🔴 High Priority

**Criteria:**
- Admin dashboard functionality
- Financial/payment endpoints
- Core business logic
- User-facing features

**Examples:**
- `/admin/dashboard/summary`
- `/finance/commissions/settings`
- `/admin/support/tickets`

**Timeline:** Implement within 3 days

### 🟡 Medium Priority

**Criteria:**
- Analytics endpoints
- Lead generation
- Support features
- Secondary functionality

**Examples:**
- `/analytics/overview`
- `/leads/merchant`
- `/support/contact`

**Timeline:** Implement within 7 days

### 🟢 Low Priority

**Criteria:**
- Optional features
- Service worker endpoints
- Development tools
- Can be mocked

**Examples:**
- `/api/content/latest`
- Development-only endpoints

**Timeline:** Implement or mock within 14 days

## Implementation Checklist

For each endpoint to implement:

- [ ] Create DTO classes with validation
- [ ] Create service method
- [ ] Create controller method
- [ ] Add OpenAPI decorators (@ApiOperation, @ApiResponse)
- [ ] Add authentication/authorization guards
- [ ] Write unit tests
- [ ] Write e2e tests
- [ ] Update OpenAPI spec (`npm run audit:openapi`)
- [ ] Regenerate typed clients
- [ ] Update frontend to use typed client
- [ ] Test end-to-end
- [ ] Document in changelog

## Common Patterns

### Admin Dashboard Endpoints

```typescript
@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminDashboardController {
  @Get('stats')
  async getStats() {
    return {
      users: await this.usersService.count(),
      orders: await this.ordersService.count(),
      revenue: await this.paymentsService.getTotalRevenue(),
    };
  }
}
```

### Lead Generation Endpoints

```typescript
@Controller('api/leads')
export class LeadsController {
  @Post('merchant')
  @ApiOperation({ summary: 'Submit merchant lead' })
  async submitMerchantLead(@Body() dto: MerchantLeadDto) {
    return this.leadsService.createMerchantLead(dto);
  }

  @Post('captain')
  @ApiOperation({ summary: 'Submit driver/captain lead' })
  async submitCaptainLead(@Body() dto: CaptainLeadDto) {
    return this.leadsService.createCaptainLead(dto);
  }
}
```

### Support/Contact Endpoints

```typescript
@Controller('api/support')
export class SupportController {
  @Post('contact')
  @ApiOperation({ summary: 'Submit contact form' })
  @ApiResponse({ status: 201, description: 'Message sent' })
  async submitContact(@Body() dto: ContactFormDto) {
    await this.supportService.createTicket(dto);
    await this.notificationService.notifySupport(dto);
    return { success: true, message: 'We will contact you soon' };
  }
}
```

### Finance Endpoints

```typescript
@Controller('finance')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'finance')
export class FinanceController {
  @Get('commissions/settings')
  async getCommissionSettings() {
    return this.financeService.getCommissionSettings();
  }

  @Post('commissions/settings')
  async updateCommissionSettings(@Body() dto: CommissionSettingsDto) {
    return this.financeService.updateCommissionSettings(dto);
  }

  @Get('commissions/audit-log')
  async getCommissionAuditLog(@Query() query: PaginationDto) {
    return this.financeService.getCommissionAuditLog(query);
  }
}
```

## Testing

### Unit Tests

```typescript
describe('DashboardController', () => {
  let controller: DashboardController;
  let service: DashboardService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: DashboardService,
          useValue: {
            getSummary: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
    service = module.get<DashboardService>(DashboardService);
  });

  it('should return dashboard summary', async () => {
    const mockSummary = { users: 100, orders: 50 };
    jest.spyOn(service, 'getSummary').mockResolvedValue(mockSummary);

    const result = await controller.getSummary();
    expect(result).toEqual(mockSummary);
  });
});
```

### E2E Tests

```typescript
describe('Dashboard Endpoints (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    // Setup app and get admin auth token
  });

  it('GET /admin/dashboard/summary', async () => {
    return request(app.getHttpServer())
      .get('/admin/dashboard/summary')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('users');
        expect(res.body).toHaveProperty('orders');
      });
  });
});
```

## Tracking Progress

### Check Remaining Orphans

```bash
cd backend-nest
npm run audit:parity
cat reports/parity_report.md
```

### Acceptance Criteria

- [x] Analysis tool created
- [ ] High priority orphans implemented (0/X)
- [ ] Medium priority orphans implemented (0/X)
- [ ] Low priority orphans mocked or implemented (0/X)
- [ ] FE_orphans count = 0
- [ ] All endpoints documented in OpenAPI
- [ ] All frontends use typed clients

## Troubleshooting

**Problem:** Can't find which module to add endpoint to

**Solution:** Check similar endpoints or create new module:
```bash
nest g module dashboard
nest g controller dashboard
nest g service dashboard
```

**Problem:** Frontend still using old path after implementation

**Solution:** 
1. Regenerate typed clients: `./scripts/generate-typed-clients.sh`
2. Update frontend imports
3. Clear cache and rebuild

**Problem:** Parity gap not decreasing

**Solution:**
1. Ensure OpenAPI decorators are added
2. Run `npm run audit:openapi`
3. Run `npm run audit:parity`
4. Check that paths match exactly

## Resources

- [NestJS Controllers](https://docs.nestjs.com/controllers)
- [NestJS OpenAPI](https://docs.nestjs.com/openapi/introduction)
- [Contract Testing Guide](../backend-nest/docs/CONTRACT_TESTING_GUIDE.md)

## Support

For questions:
1. Review generated report: `reports/fe_orphans_fixes.md`
2. Check code templates in report
3. Contact backend team

---

**Status:** 🔄 In Progress  
**Owner:** @FE, @BE  
**Due:** +5d from 2025-10-16

