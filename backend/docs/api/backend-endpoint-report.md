# Backend Endpoint Coverage Report

Generated at: 2025-10-13T15:20:27.093Z

## Coverage Summary

- Total endpoints: **578**
- Linked to frontend: **261**
- Unlinked: **317**
- Link ratio: **45.16%**

## Endpoint Inventory

| Method | Path | Source File | Linked | Frontend Usage |
|--------|------|-------------|--------|----------------|
| GET | /api/v1/accounts | backend/src/routes/er/chartAccount.routes.ts | ✅ | admin-dashboard (/accounts) |
| POST | /api/v1/accounts | backend/src/routes/er/chartAccount.routes.ts | ❌ | — |
| DELETE | /api/v1/accounts/:id | backend/src/routes/er/chartAccount.routes.ts | ❌ | — |
| GET | /api/v1/accounts/:id | backend/src/routes/er/chartAccount.routes.ts | ❌ | — |
| PATCH | /api/v1/accounts/:id | backend/src/routes/er/chartAccount.routes.ts | ❌ | — |
| GET | /api/v1/accounts/analysis | backend/src/routes/er/chartAccount.routes.ts | ❌ | — |
| GET | /api/v1/accounts/chart | backend/src/routes/er/chartAccount.routes.ts | ✅ | admin-dashboard (/accounts/chart) |
| POST | /api/v1/accounts/chart | backend/src/routes/er/chartAccount.routes.ts | ✅ | admin-dashboard (/accounts/chart) |
| DELETE | /api/v1/accounts/chart/:id | backend/src/routes/er/chartAccount.routes.ts | ✅ | admin-dashboard (/accounts/chart/:id) |
| GET | /api/v1/accounts/chart/:id | backend/src/routes/er/chartAccount.routes.ts | ❌ | — |
| PATCH | /api/v1/accounts/chart/:id | backend/src/routes/er/chartAccount.routes.ts | ✅ | admin-dashboard (/accounts/chart/:id) |
| GET | /api/v1/accounts/chart/analysis | backend/src/routes/er/chartAccount.routes.ts | ❌ | — |
| GET | /api/v1/accounts/chart/list | backend/src/routes/er/chartAccount.routes.ts | ❌ | — |
| GET | /api/v1/accounts/chart/tree | backend/src/routes/er/chartAccount.routes.ts | ✅ | admin-dashboard (/accounts/chart/tree) |
| GET | /api/v1/accounts/list | backend/src/routes/er/chartAccount.routes.ts | ❌ | — |
| GET | /api/v1/accounts/tree | backend/src/routes/er/chartAccount.routes.ts | ❌ | — |
| PATCH | /api/v1/admin/activation/store/:storeId | backend/src/routes/admin/activation.routes.ts | ✅ | admin-dashboard (/admin/activation/store/:storeId) |
| PATCH | /api/v1/admin/activation/vendor/:vendorId | backend/src/routes/admin/activation.routes.ts | ✅ | admin-dashboard (/admin/activation/vendor/:vendorId) |
| DELETE | /api/v1/admin/backups/:id | backend/src/routes/admin/backupRoutes.ts | ❌ | — |
| GET | /api/v1/admin/backups/:id | backend/src/routes/admin/backupRoutes.ts | ❌ | — |
| POST | /api/v1/admin/backups/:id/restore | backend/src/routes/admin/backupRoutes.ts | ❌ | — |
| POST | /api/v1/admin/backups/:id/test-restore | backend/src/routes/admin/backupRoutes.ts | ❌ | — |
| POST | /api/v1/admin/backups/create/full | backend/src/routes/admin/backupRoutes.ts | ❌ | — |
| POST | /api/v1/admin/backups/create/incremental | backend/src/routes/admin/backupRoutes.ts | ❌ | — |
| GET | /api/v1/admin/backups/list | backend/src/routes/admin/backupRoutes.ts | ❌ | — |
| GET | /api/v1/admin/backups/stats/summary | backend/src/routes/admin/backupRoutes.ts | ❌ | — |
| GET | /api/v1/admin/check-role | backend/src/routes/admin/adminRoutes.ts | ❌ | — |
| GET | /api/v1/admin/commission-plans | backend/src/routes/admin/commissionPlansRoutes.ts | ✅ | admin-dashboard (/admin/commission-plans) |
| POST | /api/v1/admin/commission-plans | backend/src/routes/admin/commissionPlansRoutes.ts | ✅ | admin-dashboard (/admin/commission-plans) |
| DELETE | /api/v1/admin/commission-plans/:id | backend/src/routes/admin/commissionPlansRoutes.ts | ✅ | admin-dashboard (/admin/commission-plans/:id) |
| PATCH | /api/v1/admin/commission-plans/:id | backend/src/routes/admin/commissionPlansRoutes.ts | ✅ | admin-dashboard (/admin/commission-plans/:id) |
| POST | /api/v1/admin/commission-plans/:id/status | backend/src/routes/admin/commissionPlansRoutes.ts | ✅ | admin-dashboard (/admin/commission-plans/:id/status) |
| GET | /api/v1/admin/dashboard/alerts | backend/src/routes/admin/dashboardOverview.routes.ts | ✅ | admin-dashboard (/admin/dashboard/alerts) |
| GET | /api/v1/admin/dashboard/ratings | backend/src/routes/admin/dashboardOverview.routes.ts | ❌ | — |
| GET | /api/v1/admin/dashboard/summary | backend/src/routes/admin/dashboardOverview.routes.ts | ✅ | admin-dashboard (/admin/dashboard/summary) |
| GET | /api/v1/admin/dashboard/support-tickets | backend/src/routes/admin/dashboardOverview.routes.ts | ✅ | admin-dashboard (/admin/dashboard/support-tickets) |
| POST | /api/v1/admin/dashboard/support-tickets/:id/notes | backend/src/routes/admin/dashboardOverview.routes.ts | ❌ | — |
| PUT | /api/v1/admin/dashboard/support-tickets/:id/status | backend/src/routes/admin/dashboardOverview.routes.ts | ✅ | admin-dashboard (/admin/dashboard/support-tickets/:id/status) |
| GET | /api/v1/admin/dashboard/timeseries | backend/src/routes/admin/dashboardOverview.routes.ts | ✅ | admin-dashboard (/admin/dashboard/timeseries) |
| GET | /api/v1/admin/dashboard/top | backend/src/routes/admin/dashboardOverview.routes.ts | ✅ | admin-dashboard (/admin/dashboard/top) |
| POST | /api/v1/admin/data-deletion/request | backend/src/routes/admin/dataDeletionRoutes.ts | ❌ | — |
| GET | /api/v1/admin/data-deletion/requests | backend/src/routes/admin/dataDeletionRoutes.ts | ❌ | — |
| GET | /api/v1/admin/data-deletion/requests/:id | backend/src/routes/admin/dataDeletionRoutes.ts | ❌ | — |
| DELETE | /api/v1/admin/data-deletion/requests/:id/cancel | backend/src/routes/admin/dataDeletionRoutes.ts | ❌ | — |
| POST | /api/v1/admin/data-deletion/requests/:id/process | backend/src/routes/admin/dataDeletionRoutes.ts | ❌ | — |
| GET | /api/v1/admin/data-deletion/requests/stats/summary | backend/src/routes/admin/dataDeletionRoutes.ts | ❌ | — |
| GET | /api/v1/admin/debug/redis | backend/src/routes/redias.ts | ❌ | — |
| GET | /api/v1/admin/delivery/kpis | backend/src/routes/admin/adminRoutes.ts | ❌ | — |
| GET | /api/v1/admin/delivery/stores/:storeId/stats | backend/src/routes/admin/adminRoutes.ts | ❌ | — |
| GET | /api/v1/admin/drivers | backend/src/routes/admin/admin.driver.routes.ts | ✅ | admin-dashboard (/admin/drivers) |
| PATCH | /api/v1/admin/drivers/:id/block | backend/src/routes/admin/admin.driver.routes.ts | ✅ | admin-dashboard (/admin/drivers/:id/block) |
| PATCH | /api/v1/admin/drivers/:id/reset-password | backend/src/routes/admin/admin.driver.routes.ts | ❌ | — |
| PATCH | /api/v1/admin/drivers/:id/verify | backend/src/routes/admin/admin.driver.routes.ts | ❌ | — |
| PATCH | /api/v1/admin/drivers/:id/wallet | backend/src/routes/admin/admin.driver.routes.ts | ❌ | — |
| GET | /api/v1/admin/drivers/active/count | backend/src/routes/admin/admin.driver.routes.ts | ❌ | — |
| GET | /api/v1/admin/drivers/assets | backend/src/routes/admin/drivers.assets.ts | ✅ | admin-dashboard (/admin/drivers/assets) |
| POST | /api/v1/admin/drivers/assets | backend/src/routes/admin/drivers.assets.ts | ✅ | admin-dashboard (/admin/drivers/assets) |
| POST | /api/v1/admin/drivers/assets/:assetId/assign | backend/src/routes/admin/drivers.assets.ts | ❌ | — |
| POST | /api/v1/admin/drivers/assets/:assetId/return | backend/src/routes/admin/drivers.assets.ts | ❌ | — |
| GET | /api/v1/admin/drivers/attendance | backend/src/routes/admin/drivers.attendance.ts | ✅ | admin-dashboard (/admin/drivers/attendance) |
| PATCH | /api/v1/admin/drivers/attendance/sessions/:sessionId/force-close | backend/src/routes/admin/drivers.attendance.ts | ❌ | — |
| POST | /api/v1/admin/drivers/create | backend/src/routes/admin/admin.driver.routes.ts | ❌ | — |
| GET | /api/v1/admin/drivers/docs | backend/src/routes/admin/drivers.docs.ts | ✅ | admin-dashboard (/admin/drivers/docs) |
| PATCH | /api/v1/admin/drivers/docs/:docId | backend/src/routes/admin/drivers.docs.ts | ✅ | admin-dashboard (/admin/drivers/docs/:docId) |
| GET | /api/v1/admin/drivers/docs/expiring | backend/src/routes/admin/drivers.docs.ts | ✅ | admin-dashboard (/admin/drivers/docs/expiring) |
| GET | /api/v1/admin/drivers/docs/expiring | backend/src/routes/admin/drivers.docs.ts | ✅ | admin-dashboard (/admin/drivers/docs/expiring) |
| PATCH | /api/v1/admin/drivers/drivers/:id/joker-window | backend/src/routes/admin/admin.driver.routes.ts | ❌ | — |
| GET | /api/v1/admin/drivers/finance | backend/src/routes/admin/drivers.finance.ts | ✅ | admin-dashboard (/admin/drivers/finance) |
| GET | /api/v1/admin/drivers/finance/:id/adjustments | backend/src/routes/admin/drivers.finance.ts | ❌ | — |
| POST | /api/v1/admin/drivers/finance/:id/adjustments | backend/src/routes/admin/drivers.finance.ts | ❌ | — |
| PATCH | /api/v1/admin/drivers/finance/:payoutId/approve | backend/src/routes/admin/drivers.finance.ts | ✅ | admin-dashboard (/admin/drivers/finance/:payoutId/approve) |
| PATCH | /api/v1/admin/drivers/finance/:payoutId/pay | backend/src/routes/admin/drivers.finance.ts | ✅ | admin-dashboard (/admin/drivers/finance/:payoutId/pay) |
| POST | /api/v1/admin/drivers/finance/run | backend/src/routes/admin/drivers.finance.ts | ✅ | admin-dashboard (/admin/drivers/finance/run) |
| PUT | /api/v1/admin/drivers/joker | backend/src/routes/admin/admin.driver.routes.ts | ❌ | — |
| GET | /api/v1/admin/drivers/leave-requests | backend/src/routes/admin/drivers.leave.routes.ts | ✅ | admin-dashboard (/admin/drivers/leave-requests) |
| POST | /api/v1/admin/drivers/leave-requests | backend/src/routes/admin/drivers.leave.routes.ts | ✅ | admin-dashboard (/admin/drivers/leave-requests) |
| DELETE | /api/v1/admin/drivers/leave-requests/:id | backend/src/routes/admin/drivers.leave.routes.ts | ✅ | admin-dashboard (/admin/drivers/leave-requests/:id) |
| GET | /api/v1/admin/drivers/leave-requests/:id | backend/src/routes/admin/drivers.leave.routes.ts | ✅ | admin-dashboard (/admin/drivers/leave-requests/:id) |
| PATCH | /api/v1/admin/drivers/leave-requests/:id | backend/src/routes/admin/drivers.leave.routes.ts | ✅ | admin-dashboard (/admin/drivers/leave-requests/:id) |
| PATCH | /api/v1/admin/drivers/leave-requests/:id/approve | backend/src/routes/admin/drivers.leave.routes.ts | ✅ | admin-dashboard (/admin/drivers/leave-requests/:id/approve) |
| PATCH | /api/v1/admin/drivers/leave-requests/:id/reject | backend/src/routes/admin/drivers.leave.routes.ts | ✅ | admin-dashboard (/admin/drivers/leave-requests/:id/reject) |
| GET | /api/v1/admin/drivers/leave-requests/stats | backend/src/routes/admin/drivers.leave.routes.ts | ✅ | admin-dashboard (/admin/drivers/leave-requests/stats) |
| GET | /api/v1/admin/drivers/search | backend/src/routes/admin/admin.driver.routes.ts | ✅ | admin-dashboard (admin/drivers/search) |
| GET | /api/v1/admin/drivers/shifts | backend/src/routes/admin/drivers.shifts.ts | ✅ | admin-dashboard (/admin/drivers/shifts) |
| POST | /api/v1/admin/drivers/shifts | backend/src/routes/admin/drivers.shifts.ts | ✅ | admin-dashboard (/admin/drivers/shifts) |
| PATCH | /api/v1/admin/drivers/shifts/:id | backend/src/routes/admin/drivers.shifts.ts | ✅ | admin-dashboard (/admin/drivers/shifts/:id) |
| POST | /api/v1/admin/drivers/shifts/:id/assign | backend/src/routes/admin/drivers.shifts.ts | ❌ | — |
| PATCH | /api/v1/admin/drivers/shifts/:id/mark | backend/src/routes/admin/drivers.shifts.ts | ❌ | — |
| GET | /api/v1/admin/drivers/vacations | backend/src/routes/admin/admin.driver.vacations.routes.ts | ❌ | — |
| PATCH | /api/v1/admin/drivers/vacations/:id/approve | backend/src/routes/admin/admin.driver.routes.ts | ❌ | — |
| GET | /api/v1/admin/drivers/vacations/stats | backend/src/routes/admin/admin.driver.vacations.routes.ts | ✅ | admin-dashboard (/admin/drivers/vacations/stats) |
| POST | /api/v1/admin/drivers/wallet/confirm-transfer | backend/src/routes/admin/admin.driver.routes.ts | ❌ | — |
| POST | /api/v1/admin/drivers/wallet/initiate-transfer | backend/src/routes/admin/admin.driver.routes.ts | ❌ | — |
| GET | /api/v1/admin/field/onboarding/:id | backend/src/routes/admin/onboardingRoutes.ts | ❌ | — |
| POST | /api/v1/admin/field/onboarding/:id/approve | backend/src/routes/admin/onboardingRoutes.ts | ❌ | — |
| POST | /api/v1/admin/field/onboarding/:id/needs-fix | backend/src/routes/admin/onboardingRoutes.ts | ❌ | — |
| POST | /api/v1/admin/field/onboarding/:id/reject | backend/src/routes/admin/onboardingRoutes.ts | ❌ | — |
| GET | /api/v1/admin/field/onboarding/queue | backend/src/routes/admin/onboardingRoutes.ts | ❌ | — |
| GET | /api/v1/admin/marketer-stores | backend/src/routes/admin/storeModerationRoutes.ts | ❌ | — |
| DELETE | /api/v1/admin/marketer-stores/:id | backend/src/routes/admin/storeModerationRoutes.ts | ❌ | — |
| GET | /api/v1/admin/marketer-stores/:id | backend/src/routes/admin/storeModerationRoutes.ts | ❌ | — |
| PATCH | /api/v1/admin/marketer-stores/:id | backend/src/routes/admin/storeModerationRoutes.ts | ❌ | — |
| POST | /api/v1/admin/marketer-stores/:id/activate | backend/src/routes/admin/storeModerationRoutes.ts | ❌ | — |
| POST | /api/v1/admin/marketer-stores/:id/deactivate | backend/src/routes/admin/storeModerationRoutes.ts | ❌ | — |
| POST | /api/v1/admin/marketer-stores/:id/force-close | backend/src/routes/admin/storeModerationRoutes.ts | ❌ | — |
| POST | /api/v1/admin/marketer-stores/:id/force-open | backend/src/routes/admin/storeModerationRoutes.ts | ❌ | — |
| GET | /api/v1/admin/marketers | backend/src/routes/admin/marketersRoutes.ts | ✅ | admin-dashboard (/admin/marketers) |
| DELETE | /api/v1/admin/marketers/:id | backend/src/routes/admin/marketersRoutes.ts | ✅ | admin-dashboard (/admin/marketers/:id) |
| PATCH | /api/v1/admin/marketers/:id | backend/src/routes/admin/marketersRoutes.ts | ✅ | admin-dashboard (/admin/marketers/:id) |
| POST | /api/v1/admin/marketers/:id/reset-password | backend/src/routes/admin/marketersRoutes.ts | ✅ | admin-dashboard (/admin/marketers/:id/reset-password) |
| POST | /api/v1/admin/marketers/:id/status | backend/src/routes/admin/marketersRoutes.ts | ✅ | admin-dashboard (/admin/marketers/:id/status) |
| POST | /api/v1/admin/marketers/invite | backend/src/routes/admin/marketersRoutes.ts | ✅ | admin-dashboard (/admin/marketers/invite) |
| GET | /api/v1/admin/notifications/campaigns | backend/src/routes/admin/admin.notifications.routes.ts | ✅ | admin-dashboard (/admin/notifications/campaigns) |
| POST | /api/v1/admin/notifications/campaigns | backend/src/routes/admin/admin.notifications.routes.ts | ✅ | admin-dashboard (/admin/notifications/campaigns) |
| PATCH | /api/v1/admin/notifications/campaigns/:id | backend/src/routes/admin/admin.notifications.routes.ts | ✅ | admin-dashboard (/admin/notifications/campaigns/:id) |
| POST | /api/v1/admin/notifications/campaigns/:id/audience-preview | backend/src/routes/admin/admin.notifications.routes.ts | ✅ | admin-dashboard (/admin/notifications/campaigns/:id/audience-preview) |
| POST | /api/v1/admin/notifications/campaigns/:id/cancel | backend/src/routes/admin/admin.notifications.routes.ts | ✅ | admin-dashboard (/admin/notifications/campaigns/:id/cancel) |
| POST | /api/v1/admin/notifications/campaigns/:id/send | backend/src/routes/admin/admin.notifications.routes.ts | ✅ | admin-dashboard (/admin/notifications/campaigns/:id/send) |
| GET | /api/v1/admin/notifications/templates | backend/src/routes/admin/admin.notifications.routes.ts | ✅ | admin-dashboard (/admin/notifications/templates) |
| POST | /api/v1/admin/notifications/templates | backend/src/routes/admin/admin.notifications.routes.ts | ✅ | admin-dashboard (/admin/notifications/templates) |
| POST | /api/v1/admin/notifications/v2 | backend/src/routes/admin/notification.routes.ts | ❌ | — |
| GET | /api/v1/admin/onboarding-slides | backend/src/routes/admin/admin.cms.routes.ts | ✅ | admin-dashboard (/admin/onboarding-slides) |
| POST | /api/v1/admin/onboarding-slides | backend/src/routes/admin/admin.cms.routes.ts | ✅ | admin-dashboard (/admin/onboarding-slides) |
| DELETE | /api/v1/admin/onboarding-slides/:id | backend/src/routes/admin/admin.cms.routes.ts | ✅ | admin-dashboard (/admin/onboarding-slides/:id) |
| PUT | /api/v1/admin/onboarding-slides/:id | backend/src/routes/admin/admin.cms.routes.ts | ❌ | — |
| GET | /api/v1/admin/quality/reviews | backend/src/routes/admin/quality.routes.ts | ❌ | — |
| GET | /api/v1/admin/quality/reviews/:id | backend/src/routes/admin/quality.routes.ts | ❌ | — |
| PATCH | /api/v1/admin/quality/reviews/:id/hide | backend/src/routes/admin/quality.routes.ts | ❌ | — |
| PATCH | /api/v1/admin/quality/reviews/:id/publish | backend/src/routes/admin/quality.routes.ts | ❌ | — |
| GET | /api/v1/admin/quality/stats | backend/src/routes/admin/quality.routes.ts | ❌ | — |
| GET | /api/v1/admin/settings | backend/src/routes/admin/settings.routes.ts | ❌ | — |
| PUT | /api/v1/admin/settings | backend/src/routes/admin/settings.routes.ts | ❌ | — |
| GET | /api/v1/admin/settings/appearance | backend/src/routes/admin/settings.routes.ts | ✅ | admin-dashboard (/admin/settings/appearance) |
| PUT | /api/v1/admin/settings/appearance | backend/src/routes/admin/settings.routes.ts | ✅ | admin-dashboard (/admin/settings/appearance) |
| GET | /api/v1/admin/stats | backend/src/routes/admin/adminRoutes.ts | ✅ | admin-dashboard (/admin/stats) |
| GET | /api/v1/admin/storestats/:storeId/stats/:period | backend/src/routes/admin/storeStatsRoutes.ts | ❌ | — |
| GET | /api/v1/admin/support/stats | backend/src/routes/admin/support.routes.ts | ✅ | admin-dashboard (/admin/support/stats) |
| GET | /api/v1/admin/support/tickets | backend/src/routes/admin/support.routes.ts | ❌ | — |
| POST | /api/v1/admin/support/tickets | backend/src/routes/admin/support.routes.ts | ✅ | admin-dashboard (/admin/support/tickets) |
| GET | /api/v1/admin/support/tickets/:id | backend/src/routes/admin/support.routes.ts | ❌ | — |
| PATCH | /api/v1/admin/support/tickets/:id | backend/src/routes/admin/support.routes.ts | ✅ | admin-dashboard (/admin/support/tickets/:id) |
| PATCH | /api/v1/admin/support/tickets/:id/assign | backend/src/routes/admin/support.routes.ts | ❌ | — |
| POST | /api/v1/admin/support/tickets/:id/messages | backend/src/routes/admin/support.routes.ts | ❌ | — |
| GET | /api/v1/admin/users | backend/src/routes/admin/adminRoutes.ts | ✅ | admin-dashboard (/admin/users) |
| GET | /api/v1/admin/users | backend/src/routes/admin/adminUsersRoutes.ts | ✅ | admin-dashboard (/admin/users) |
| DELETE | /api/v1/admin/users/:id | backend/src/routes/admin/adminManagementRoutes.ts | ✅ | admin-dashboard (/admin/users/:id) |
| DELETE | /api/v1/admin/users/:id | backend/src/routes/admin/adminUsersRoutes.ts | ✅ | admin-dashboard (/admin/users/:id) |
| GET | /api/v1/admin/users/:id | backend/src/routes/admin/adminManagementRoutes.ts | ✅ | admin-dashboard (/admin/users/:id) |
| GET | /api/v1/admin/users/:id | backend/src/routes/admin/adminUsersRoutes.ts | ✅ | admin-dashboard (/admin/users/:id) |
| PATCH | /api/v1/admin/users/:id | backend/src/routes/admin/adminRoutes.ts | ✅ | admin-dashboard (/admin/users/:id) |
| PUT | /api/v1/admin/users/:id | backend/src/routes/admin/adminManagementRoutes.ts | ❌ | — |
| PUT | /api/v1/admin/users/:id | backend/src/routes/admin/adminUsersRoutes.ts | ❌ | — |
| PUT | /api/v1/admin/users/:id/permissions | backend/src/routes/admin/adminManagementRoutes.ts | ❌ | — |
| PUT | /api/v1/admin/users/:id/permissions | backend/src/routes/admin/adminUsersRoutes.ts | ❌ | — |
| PATCH | /api/v1/admin/users/:id/role | backend/src/routes/admin/adminRoutes.ts | ✅ | admin-dashboard (/admin/users/:id/role) |
| PATCH | /api/v1/admin/users/:id/status | backend/src/routes/admin/adminManagementRoutes.ts | ✅ | admin-dashboard (/admin/users/:id/status) |
| PATCH | /api/v1/admin/users/:id/status | backend/src/routes/admin/adminUsersRoutes.ts | ✅ | admin-dashboard (/admin/users/:id/status) |
| POST | /api/v1/admin/users/cleanup/accounts | backend/src/routes/admin/adminManagementRoutes.ts | ❌ | — |
| POST | /api/v1/admin/users/create | backend/src/routes/admin/adminManagementRoutes.ts | ❌ | — |
| GET | /api/v1/admin/users/list | backend/src/routes/admin/adminManagementRoutes.ts | ✅ | admin-dashboard (/admin/users/list) |
| GET | /api/v1/admin/users/list | backend/src/routes/admin/adminRoutes.ts | ✅ | admin-dashboard (/admin/users/list) |
| POST | /api/v1/admin/users/login | backend/src/routes/admin/adminManagementRoutes.ts | ❌ | — |
| POST | /api/v1/admin/users/login | backend/src/routes/admin/adminUsersRoutes.ts | ❌ | — |
| GET | /api/v1/admin/users/me | backend/src/routes/admin/adminManagementRoutes.ts | ❌ | — |
| GET | /api/v1/admin/users/modules | backend/src/routes/admin/adminManagementRoutes.ts | ❌ | — |
| PUT | /api/v1/admin/users/password-security/:id/password | backend/src/routes/admin/passwordSecurityRoutes.ts | ❌ | — |
| GET | /api/v1/admin/users/password-security/2fa-status | backend/src/routes/admin/passwordSecurityRoutes.ts | ❌ | — |
| POST | /api/v1/admin/users/password-security/cleanup-default-accounts | backend/src/routes/admin/passwordSecurityRoutes.ts | ❌ | — |
| POST | /api/v1/admin/users/password-security/disable-2fa | backend/src/routes/admin/passwordSecurityRoutes.ts | ❌ | — |
| POST | /api/v1/admin/users/password-security/enable-2fa | backend/src/routes/admin/passwordSecurityRoutes.ts | ❌ | — |
| GET | /api/v1/admin/users/password-security/generate-secure-password | backend/src/routes/admin/passwordSecurityRoutes.ts | ❌ | — |
| POST | /api/v1/admin/users/password-security/regenerate-backup-codes | backend/src/routes/admin/passwordSecurityRoutes.ts | ❌ | — |
| POST | /api/v1/admin/users/password-security/setup-2fa | backend/src/routes/admin/passwordSecurityRoutes.ts | ❌ | — |
| POST | /api/v1/admin/users/password-security/validate-password | backend/src/routes/admin/passwordSecurityRoutes.ts | ❌ | — |
| POST | /api/v1/admin/users/password-security/verify-2fa | backend/src/routes/admin/passwordSecurityRoutes.ts | ❌ | — |
| POST | /api/v1/admin/users/register | backend/src/routes/admin/adminUsersRoutes.ts | ❌ | — |
| GET | /api/v1/admin/users/security/brute-force-status | backend/src/routes/admin/adminManagementRoutes.ts | ❌ | — |
| GET | /api/v1/admin/users/stats/summary | backend/src/routes/admin/adminManagementRoutes.ts | ❌ | — |
| GET | /api/v1/admin/vendors | backend/src/routes/admin/vendorModerationRoutes.ts | ✅ | admin-dashboard (/admin/vendors) |
| DELETE | /api/v1/admin/vendors/:id | backend/src/routes/admin/vendorModerationRoutes.ts | ✅ | admin-dashboard (/admin/vendors/:id) |
| GET | /api/v1/admin/vendors/:id | backend/src/routes/admin/vendorModerationRoutes.ts | ✅ | admin-dashboard (/admin/vendors/:id) |
| PATCH | /api/v1/admin/vendors/:id | backend/src/routes/admin/vendorModerationRoutes.ts | ✅ | admin-dashboard (/admin/vendors/:id) |
| POST | /api/v1/admin/vendors/:id/activate | backend/src/routes/admin/vendorModerationRoutes.ts | ✅ | admin-dashboard (/admin/vendors/:id/activate) |
| POST | /api/v1/admin/vendors/:id/deactivate | backend/src/routes/admin/vendorModerationRoutes.ts | ✅ | admin-dashboard (/admin/vendors/:id/deactivate) |
| POST | /api/v1/admin/vendors/:id/reset-password | backend/src/routes/admin/vendorModerationRoutes.ts | ✅ | admin-dashboard (/admin/vendors/:id/reset-password) |
| GET | /api/v1/admin/vendors/stores/:storeId/vendors | backend/src/routes/admin/vendorModerationRoutes.ts | ❌ | — |
| GET | /api/v1/admin/wallet/coupons | backend/src/routes/admin/admin.wallet.coupons.ts | ✅ | admin-dashboard (/admin/wallet/coupons)<br />admin-dashboard (admin/wallet/coupons) |
| POST | /api/v1/admin/wallet/coupons | backend/src/routes/admin/admin.wallet.coupons.ts | ✅ | admin-dashboard (/admin/wallet/coupons) |
| POST | /api/v1/admin/wallet/credit | backend/src/routes/admin/admin.wallet.coupons.ts | ❌ | — |
| POST | /api/v1/admin/wallet/debit | backend/src/routes/admin/admin.wallet.coupons.ts | ❌ | — |
| GET | /api/v1/admin/wallet/users/search | backend/src/routes/admin/admin.wallet.coupons.ts | ✅ | admin-dashboard (/admin/wallet/users/search) |
| GET | /api/v1/admin/withdrawals | backend/src/routes/admin/admin.withdrawal.routes.ts | ❌ | — |
| PATCH | /api/v1/admin/withdrawals/:id/approve | backend/src/routes/admin/admin.withdrawal.routes.ts | ❌ | — |
| PATCH | /api/v1/admin/withdrawals/:id/reject | backend/src/routes/admin/admin.withdrawal.routes.ts | ❌ | — |
| GET | /api/v1/app/subscriptions | backend/src/routes/app.routes.ts | ❌ | — |
| GET | /api/v1/app/tutorials | backend/src/routes/app.routes.ts | ❌ | — |
| GET | /api/v1/attendance | backend/src/routes/er/attendance.routes.ts | ✅ | admin-dashboard (/attendance) |
| POST | /api/v1/attendance | backend/src/routes/er/attendance.routes.ts | ✅ | admin-dashboard (/attendance) |
| GET | /api/v1/attendance/deductions | backend/src/routes/er/attendance.routes.ts | ❌ | — |
| GET | /api/v1/attendance/today | backend/src/routes/er/attendance.routes.ts | ✅ | admin-dashboard (/attendance/today) |
| DELETE | /api/v1/auth/delete-account | backend/src/routes/marketerV1/auth.routes.ts | ❌ | — |
| POST | /api/v1/auth/delete-account/request | backend/src/routes/marketerV1/auth.routes.ts | ✅ | field-marketers (/auth/delete-account/request) |
| POST | /api/v1/auth/jwt/logout | backend/src/routes/auth.routes.ts | ❌ | — |
| POST | /api/v1/auth/jwt/refresh | backend/src/routes/auth.routes.ts | ❌ | — |
| POST | /api/v1/auth/marketer-login | backend/src/routes/marketerV1/auth.routes.ts | ✅ | field-marketers (/auth/marketer-login) |
| GET | /api/v1/auth/me | backend/src/routes/marketerV1/auth.routes.ts | ✅ | field-marketers (/auth/me) |
| POST | /api/v1/auth/password/forgot | backend/src/routes/passwordReset.ts | ❌ | — |
| POST | /api/v1/auth/password/reset | backend/src/routes/passwordReset.ts | ✅ | app-user (auth/password/reset) |
| POST | /api/v1/auth/password/verify | backend/src/routes/passwordReset.ts | ✅ | app-user (auth/password/verify) |
| POST | /api/v1/auth/push-token | backend/src/routes/marketerV1/auth.routes.ts | ✅ | field-marketers (/auth/push-token) |
| GET | /api/v1/cms/bootstrap | backend/src/routes/cms.routes.ts | ✅ | app-user (/cms/bootstrap)<br />bthwani-web (/cms/bootstrap) |
| GET | /api/v1/cms/onboarding | backend/src/routes/cms.routes.ts | ✅ | app-user (/cms/onboarding)<br />bthwani-web (/cms/onboarding) |
| GET | /api/v1/cms/pages/:slug | backend/src/routes/cms.routes.ts | ✅ | bthwani-web (/cms/pages/:slug) |
| GET | /api/v1/delivery/banners | backend/src/routes/delivery_marketplace_v1/DeliveryBannerRoutes.ts | ✅ | bthwani-web (/delivery/banners) |
| POST | /api/v1/delivery/banners | backend/src/routes/delivery_marketplace_v1/DeliveryBannerRoutes.ts | ✅ | admin-dashboard (/delivery/banners) |
| DELETE | /api/v1/delivery/banners/:id | backend/src/routes/delivery_marketplace_v1/DeliveryBannerRoutes.ts | ✅ | admin-dashboard (/delivery/banners/:id) |
| GET | /api/v1/delivery/banners/:id | backend/src/routes/delivery_marketplace_v1/DeliveryBannerRoutes.ts | ❌ | — |
| PUT | /api/v1/delivery/banners/:id | backend/src/routes/delivery_marketplace_v1/DeliveryBannerRoutes.ts | ❌ | — |
| GET | /api/v1/delivery/banners/admin | backend/src/routes/delivery_marketplace_v1/DeliveryBannerRoutes.ts | ✅ | admin-dashboard (/delivery/banners/admin) |
| GET | /api/v1/delivery/cart | backend/src/routes/delivery_marketplace_v1/DeliveryCartRoutes.ts | ❌ | — |
| DELETE | /api/v1/delivery/cart/:cartId | backend/src/routes/delivery_marketplace_v1/DeliveryCartRoutes.ts | ✅ | admin-dashboard (/delivery/cart/:cartId) |
| GET | /api/v1/delivery/cart/:cartId | backend/src/routes/delivery_marketplace_v1/DeliveryCartRoutes.ts | ✅ | app-user (/delivery/cart/:cartId)<br />bthwani-web (/delivery/cart/:cartId) |
| DELETE | /api/v1/delivery/cart/:cartId/items/:productId | backend/src/routes/delivery_marketplace_v1/DeliveryCartRoutes.ts | ✅ | admin-dashboard (/delivery/cart/:cartId/items/:productId) |
| GET | /api/v1/delivery/cart/abandoned | backend/src/routes/delivery_marketplace_v1/DeliveryCartRoutes.ts | ❌ | — |
| POST | /api/v1/delivery/cart/add | backend/src/routes/delivery_marketplace_v1/DeliveryCartRoutes.ts | ✅ | app-user (/delivery/cart/add)<br />bthwani-web (/delivery/cart/add) |
| GET | /api/v1/delivery/cart/fee | backend/src/routes/delivery_marketplace_v1/DeliveryCartRoutes.ts | ✅ | app-user (/delivery/cart/fee)<br />bthwani-web (/delivery/cart/fee) |
| PUT | /api/v1/delivery/cart/items/:productId | backend/src/routes/delivery_marketplace_v1/DeliveryCartRoutes.ts | ❌ | — |
| POST | /api/v1/delivery/cart/merge | backend/src/routes/delivery_marketplace_v1/DeliveryCartRoutes.ts | ✅ | app-user (/delivery/cart/merge)<br />bthwani-web (/delivery/cart/merge) |
| DELETE | /api/v1/delivery/cart/user/:userId | backend/src/routes/delivery_marketplace_v1/DeliveryCartRoutes.ts | ❌ | — |
| GET | /api/v1/delivery/cart/user/:userId | backend/src/routes/delivery_marketplace_v1/DeliveryCartRoutes.ts | ✅ | app-user (/delivery/cart/user/:userId)<br />bthwani-web (/delivery/cart/user/:userId) |
| DELETE | /api/v1/delivery/cart/user/:userId/items/:productId | backend/src/routes/delivery_marketplace_v1/DeliveryCartRoutes.ts | ❌ | — |
| GET | /api/v1/delivery/categories | backend/src/routes/delivery_marketplace_v1/DeliveryCategoryRoutes.ts | ✅ | admin-dashboard (/delivery/categories)<br />app-user (/delivery/categories)<br />field-marketers (/delivery/categories)<br />bthwani-web (/delivery/categories) |
| POST | /api/v1/delivery/categories | backend/src/routes/delivery_marketplace_v1/DeliveryCategoryRoutes.ts | ✅ | admin-dashboard (/delivery/categories) |
| DELETE | /api/v1/delivery/categories/:id | backend/src/routes/delivery_marketplace_v1/DeliveryCategoryRoutes.ts | ✅ | admin-dashboard (/delivery/categories/:id) |
| GET | /api/v1/delivery/categories/:id | backend/src/routes/delivery_marketplace_v1/DeliveryCategoryRoutes.ts | ❌ | — |
| PUT | /api/v1/delivery/categories/:id | backend/src/routes/delivery_marketplace_v1/DeliveryCategoryRoutes.ts | ✅ | admin-dashboard (/delivery/categories/:id) |
| POST | /api/v1/delivery/categories/:id/move-down | backend/src/routes/delivery_marketplace_v1/DeliveryCategoryRoutes.ts | ❌ | — |
| POST | /api/v1/delivery/categories/:id/move-up | backend/src/routes/delivery_marketplace_v1/DeliveryCategoryRoutes.ts | ❌ | — |
| POST | /api/v1/delivery/categories/bulk-reorder | backend/src/routes/delivery_marketplace_v1/DeliveryCategoryRoutes.ts | ✅ | admin-dashboard (/delivery/categories/bulk-reorder) |
| GET | /api/v1/delivery/categories/children/:parentId | backend/src/routes/delivery_marketplace_v1/DeliveryCategoryRoutes.ts | ✅ | admin-dashboard (/delivery/categories/children/:parentId)<br />bthwani-web (/delivery/categories/children/:parentId) |
| GET | /api/v1/delivery/categories/main | backend/src/routes/delivery_marketplace_v1/DeliveryCategoryRoutes.ts | ✅ | admin-dashboard (/delivery/categories/main) |
| GET | /api/v1/delivery/offer | backend/src/routes/delivery_marketplace_v1/DeliveryOfferRoutes.ts | ✅ | admin-dashboard (/delivery/offer) |
| POST | /api/v1/delivery/offer | backend/src/routes/delivery_marketplace_v1/DeliveryOfferRoutes.ts | ✅ | admin-dashboard (/delivery/offer) |
| DELETE | /api/v1/delivery/offer/:id | backend/src/routes/delivery_marketplace_v1/DeliveryOfferRoutes.ts | ✅ | admin-dashboard (/delivery/offer/:id) |
| GET | /api/v1/delivery/offer/:id | backend/src/routes/delivery_marketplace_v1/DeliveryOfferRoutes.ts | ❌ | — |
| PUT | /api/v1/delivery/offer/:id | backend/src/routes/delivery_marketplace_v1/DeliveryOfferRoutes.ts | ❌ | — |
| GET | /api/v1/delivery/order | backend/src/routes/delivery_marketplace_v1/DeliveryOrderRoutes.ts | ✅ | admin-dashboard (/delivery/order) |
| POST | /api/v1/delivery/order | backend/src/routes/delivery_marketplace_v1/DeliveryOrderRoutes.ts | ✅ | app-user (/delivery/order)<br />bthwani-web (/delivery/order) |
| GET | /api/v1/delivery/order/:id | backend/src/routes/delivery_marketplace_v1/DeliveryOrderRoutes.ts | ✅ | admin-dashboard (/delivery/order/:id) |
| PATCH | /api/v1/delivery/order/:id/admin-status | backend/src/routes/delivery_marketplace_v1/DeliveryOrderRoutes.ts | ✅ | admin-dashboard (/delivery/order/:id/admin-status) |
| PATCH | /api/v1/delivery/order/:id/assign-driver | backend/src/routes/delivery_marketplace_v1/DeliveryOrderRoutes.ts | ✅ | admin-dashboard (/delivery/order/:id/assign-driver) |
| PATCH | /api/v1/delivery/order/:id/driver-deliver | backend/src/routes/delivery_marketplace_v1/DeliveryOrderRoutes.ts | ❌ | — |
| PATCH | /api/v1/delivery/order/:id/driver-pickup | backend/src/routes/delivery_marketplace_v1/DeliveryOrderRoutes.ts | ❌ | — |
| GET | /api/v1/delivery/order/:id/notes | backend/src/routes/delivery_marketplace_v1/DeliveryOrderRoutes.ts | ❌ | — |
| POST | /api/v1/delivery/order/:id/notes | backend/src/routes/delivery_marketplace_v1/DeliveryOrderRoutes.ts | ❌ | — |
| PATCH | /api/v1/delivery/order/:id/pod | backend/src/routes/delivery_marketplace_v1/DeliveryOrderRoutes.ts | ✅ | admin-dashboard (/delivery/order/:id/pod) |
| POST | /api/v1/delivery/order/:id/rate | backend/src/routes/delivery_marketplace_v1/DeliveryOrderRoutes.ts | ❌ | — |
| POST | /api/v1/delivery/order/:id/repeat | backend/src/routes/delivery_marketplace_v1/DeliveryOrderRoutes.ts | ❌ | — |
| PUT | /api/v1/delivery/order/:id/status | backend/src/routes/delivery_marketplace_v1/DeliveryOrderRoutes.ts | ❌ | — |
| PUT | /api/v1/delivery/order/:id/vendor-accept | backend/src/routes/delivery_marketplace_v1/DeliveryOrderRoutes.ts | ✅ | vendor-app (/delivery/order/:id/vendor-accept) |
| PUT | /api/v1/delivery/order/:id/vendor-cancel | backend/src/routes/delivery_marketplace_v1/DeliveryOrderRoutes.ts | ✅ | vendor-app (/delivery/order/:id/vendor-cancel) |
| PATCH | /api/v1/delivery/order/:orderId/sub-orders/:subId/assign-driver | backend/src/routes/delivery_marketplace_v1/DeliveryOrderRoutes.ts | ❌ | — |
| PATCH | /api/v1/delivery/order/:orderId/sub-orders/:subId/pod | backend/src/routes/delivery_marketplace_v1/DeliveryOrderRoutes.ts | ❌ | — |
| PATCH | /api/v1/delivery/order/:orderId/sub-orders/:subId/status | backend/src/routes/delivery_marketplace_v1/DeliveryOrderRoutes.ts | ❌ | — |
| POST | /api/v1/delivery/order/errand | backend/src/routes/delivery_marketplace_v1/DeliveryOrderRoutes.ts | ✅ | app-user (/delivery/order/errand)<br />bthwani-web (/delivery/order/errand) |
| GET | /api/v1/delivery/order/export/orders/excel | backend/src/routes/delivery_marketplace_v1/DeliveryOrderRoutes.ts | ✅ | admin-dashboard (/delivery/order/export/orders/excel) |
| GET | /api/v1/delivery/order/fee | backend/src/routes/delivery_marketplace_v1/DeliveryOrderRoutes.ts | ❌ | — |
| GET | /api/v1/delivery/order/me | backend/src/routes/delivery_marketplace_v1/DeliveryOrderRoutes.ts | ❌ | — |
| DELETE | /api/v1/delivery/order/orders/:id | backend/src/routes/delivery_marketplace_v1/DeliveryOrderRoutes.ts | ❌ | — |
| GET | /api/v1/delivery/order/user/:userId | backend/src/routes/delivery_marketplace_v1/DeliveryOrderRoutes.ts | ✅ | app-user (/delivery/order/user/:userId)<br />bthwani-web (/delivery/order/user/:userId) |
| GET | /api/v1/delivery/order/vendor/orders | backend/src/routes/delivery_marketplace_v1/DeliveryOrderRoutes.ts | ✅ | vendor-app (/delivery/order/vendor/orders) |
| GET | /api/v1/delivery/products | backend/src/routes/delivery_marketplace_v1/DeliveryProductRoutes.ts | ✅ | admin-dashboard (/delivery/products)<br />bthwani-web (/delivery/products) |
| POST | /api/v1/delivery/products | backend/src/routes/delivery_marketplace_v1/DeliveryProductRoutes.ts | ✅ | admin-dashboard (/delivery/products) |
| DELETE | /api/v1/delivery/products/:id | backend/src/routes/delivery_marketplace_v1/DeliveryProductRoutes.ts | ❌ | — |
| GET | /api/v1/delivery/products/:id | backend/src/routes/delivery_marketplace_v1/DeliveryProductRoutes.ts | ❌ | — |
| PUT | /api/v1/delivery/products/:id | backend/src/routes/delivery_marketplace_v1/DeliveryProductRoutes.ts | ❌ | — |
| GET | /api/v1/delivery/products/daily-offers | backend/src/routes/delivery_marketplace_v1/DeliveryProductRoutes.ts | ✅ | bthwani-web (/delivery/products/daily-offers) |
| GET | /api/v1/delivery/products/nearby/new | backend/src/routes/delivery_marketplace_v1/DeliveryProductRoutes.ts | ✅ | bthwani-web (/delivery/products/nearby/new) |
| GET | /api/v1/delivery/products/search | backend/src/routes/delivery_marketplace_v1/DeliveryProductRoutes.ts | ✅ | bthwani-web (/delivery/products/search) |
| GET | /api/v1/delivery/promotions | backend/src/routes/delivery_marketplace_v1/promotion.routes.ts | ✅ | bthwani-web (/delivery/promotions) |
| POST | /api/v1/delivery/promotions | backend/src/routes/delivery_marketplace_v1/promotion.routes.ts | ✅ | admin-dashboard (/delivery/promotions) |
| DELETE | /api/v1/delivery/promotions/:id | backend/src/routes/delivery_marketplace_v1/promotion.routes.ts | ✅ | admin-dashboard (/delivery/promotions/:id) |
| GET | /api/v1/delivery/promotions/:id | backend/src/routes/delivery_marketplace_v1/promotion.routes.ts | ❌ | — |
| PUT | /api/v1/delivery/promotions/:id | backend/src/routes/delivery_marketplace_v1/promotion.routes.ts | ❌ | — |
| GET | /api/v1/delivery/promotions/admin | backend/src/routes/delivery_marketplace_v1/promotion.routes.ts | ❌ | — |
| GET | /api/v1/delivery/promotions/by-products | backend/src/routes/delivery_marketplace_v1/promotion.routes.ts | ✅ | bthwani-web (/delivery/promotions/by-products) |
| GET | /api/v1/delivery/promotions/by-stores | backend/src/routes/delivery_marketplace_v1/promotion.routes.ts | ✅ | app-user (/delivery/promotions/by-stores)<br />bthwani-web (/delivery/promotions/by-stores) |
| GET | /api/v1/delivery/sections | backend/src/routes/delivery_marketplace_v1/storeSection.routes.ts | ✅ | bthwani-web (/delivery/sections) |
| DELETE | /api/v1/delivery/shein-cart/cart | backend/src/routes/delivery_marketplace_v1/sheinCart.ts | ❌ | — |
| GET | /api/v1/delivery/shein-cart/cart | backend/src/routes/delivery_marketplace_v1/sheinCart.ts | ❌ | — |
| POST | /api/v1/delivery/shein-cart/cart/add | backend/src/routes/delivery_marketplace_v1/sheinCart.ts | ❌ | — |
| DELETE | /api/v1/delivery/shein-cart/cart/item/:id | backend/src/routes/delivery_marketplace_v1/sheinCart.ts | ❌ | — |
| PATCH | /api/v1/delivery/shein-cart/cart/item/:id | backend/src/routes/delivery_marketplace_v1/sheinCart.ts | ❌ | — |
| GET | /api/v1/delivery/stores | backend/src/routes/delivery_marketplace_v1/DeliveryStoreRoutes.ts | ✅ | admin-dashboard (/delivery/stores)<br />bthwani-web (/delivery/stores) |
| GET | /api/v1/delivery/stores | backend/src/routes/delivery_marketplace_v1/DeliveryStoreRoutes.ts | ✅ | admin-dashboard (/delivery/stores)<br />bthwani-web (/delivery/stores) |
| POST | /api/v1/delivery/stores | backend/src/routes/delivery_marketplace_v1/DeliveryStoreRoutes.ts | ✅ | admin-dashboard (/delivery/stores) |
| POST | /api/v1/delivery/stores | backend/src/routes/delivery_marketplace_v1/DeliveryStoreRoutes.ts | ✅ | admin-dashboard (/delivery/stores) |
| DELETE | /api/v1/delivery/stores/:id | backend/src/routes/delivery_marketplace_v1/DeliveryStoreRoutes.ts | ✅ | admin-dashboard (/delivery/stores/:id) |
| DELETE | /api/v1/delivery/stores/:id | backend/src/routes/delivery_marketplace_v1/DeliveryStoreRoutes.ts | ✅ | admin-dashboard (/delivery/stores/:id) |
| GET | /api/v1/delivery/stores/:id | backend/src/routes/delivery_marketplace_v1/DeliveryStoreRoutes.ts | ✅ | admin-dashboard (/delivery/stores/:id) |
| GET | /api/v1/delivery/stores/:id | backend/src/routes/delivery_marketplace_v1/DeliveryStoreRoutes.ts | ✅ | admin-dashboard (/delivery/stores/:id) |
| PUT | /api/v1/delivery/stores/:id | backend/src/routes/delivery_marketplace_v1/DeliveryStoreRoutes.ts | ❌ | — |
| PUT | /api/v1/delivery/stores/:id | backend/src/routes/delivery_marketplace_v1/DeliveryStoreRoutes.ts | ❌ | — |
| GET | /api/v1/delivery/stores/search | backend/src/routes/delivery_marketplace_v1/DeliveryStoreRoutes.ts | ✅ | admin-dashboard (/delivery/stores/search)<br />app-user (/delivery/stores/search)<br />bthwani-web (/delivery/stores/search) |
| GET | /api/v1/delivery/stores/search | backend/src/routes/delivery_marketplace_v1/DeliveryStoreRoutes.ts | ✅ | admin-dashboard (/delivery/stores/search)<br />app-user (/delivery/stores/search)<br />bthwani-web (/delivery/stores/search) |
| GET | /api/v1/delivery/subcategories | backend/src/routes/delivery_marketplace_v1/DeliveryProductSubCategoryRoutes.ts | ✅ | admin-dashboard (/delivery/subcategories) |
| POST | /api/v1/delivery/subcategories | backend/src/routes/delivery_marketplace_v1/DeliveryProductSubCategoryRoutes.ts | ✅ | admin-dashboard (/delivery/subcategories) |
| DELETE | /api/v1/delivery/subcategories/:id | backend/src/routes/delivery_marketplace_v1/DeliveryProductSubCategoryRoutes.ts | ❌ | — |
| GET | /api/v1/delivery/subcategories/:id | backend/src/routes/delivery_marketplace_v1/DeliveryProductSubCategoryRoutes.ts | ❌ | — |
| PUT | /api/v1/delivery/subcategories/:id | backend/src/routes/delivery_marketplace_v1/DeliveryProductSubCategoryRoutes.ts | ❌ | — |
| GET | /api/v1/delivery/subcategories/store/:storeId | backend/src/routes/delivery_marketplace_v1/DeliveryProductSubCategoryRoutes.ts | ❌ | — |
| POST | /api/v1/driver/attendance/:id/check-in | backend/src/routes/driver_app/attendance.ts | ❌ | — |
| POST | /api/v1/driver/attendance/:id/check-out | backend/src/routes/driver_app/attendance.ts | ❌ | — |
| GET | /api/v1/driver/attendance/:id/daily | backend/src/routes/driver_app/attendance.ts | ❌ | — |
| POST | /api/v1/driver/attendance/:id/docs | backend/src/routes/driver_app/attendance.ts | ❌ | — |
| PATCH | /api/v1/driver/availability | backend/src/routes/driver_app/driver.routes.ts | ❌ | — |
| PATCH | /api/v1/driver/change-password | backend/src/routes/driver_app/driver.routes.ts | ❌ | — |
| POST | /api/v1/driver/complete/:orderId | backend/src/routes/driver_app/driver.routes.ts | ✅ | rider-app (/driver/complete/:orderId) |
| PATCH | /api/v1/driver/location | backend/src/routes/driver_app/driver.routes.ts | ❌ | — |
| POST | /api/v1/driver/locations | backend/src/routes/driver_app/driver.routes.ts | ❌ | — |
| DELETE | /api/v1/driver/locations/:index | backend/src/routes/driver_app/driver.routes.ts | ❌ | — |
| POST | /api/v1/driver/login | backend/src/routes/driver_app/driver.routes.ts | ✅ | rider-app (/driver/login) |
| GET | /api/v1/driver/me | backend/src/routes/driver_app/driver.routes.ts | ✅ | rider-app (/driver/me) |
| PATCH | /api/v1/driver/me | backend/src/routes/driver_app/driver.routes.ts | ✅ | rider-app (/driver/me) |
| GET | /api/v1/driver/my-orders | backend/src/routes/driver_app/driver.routes.ts | ❌ | — |
| GET | /api/v1/driver/orders | backend/src/routes/driver_app/driver.routes.ts | ✅ | rider-app (/driver/orders) |
| GET | /api/v1/driver/reports | backend/src/routes/driver_app/driver.routes.ts | ❌ | — |
| POST | /api/v1/driver/review | backend/src/routes/driver_app/driver.routes.ts | ❌ | — |
| GET | /api/v1/driver/vacations | backend/src/routes/driver_app/driver.routes.ts | ❌ | — |
| GET | /api/v1/driver/vacations | backend/src/routes/driver_app/driver.vacation.routes.ts | ❌ | — |
| POST | /api/v1/driver/vacations | backend/src/routes/driver_app/driver.routes.ts | ❌ | — |
| POST | /api/v1/driver/vacations | backend/src/routes/driver_app/driver.vacation.routes.ts | ❌ | — |
| POST | /api/v1/driver/vacations/:id/approve | backend/src/routes/driver_app/driver.vacation.routes.ts | ✅ | admin-dashboard (/driver/vacations/:id/approve) |
| POST | /api/v1/driver/vacations/:id/reject | backend/src/routes/driver_app/driver.vacation.routes.ts | ✅ | admin-dashboard (/driver/vacations/:id/reject) |
| GET | /api/v1/driver/wallet/summary | backend/src/routes/driver_app/driver.routes.ts | ✅ | rider-app (/driver/wallet/summary) |
| GET | /api/v1/driver/withdrawals | backend/src/routes/driver_app/driver.withdrawal.routes.ts | ✅ | rider-app (/driver/withdrawals) |
| POST | /api/v1/driver/withdrawals | backend/src/routes/driver_app/driver.withdrawal.routes.ts | ✅ | rider-app (/driver/withdrawals) |
| GET | /api/v1/employees | backend/src/routes/er/employee.routes.ts | ✅ | admin-dashboard (/employees) |
| POST | /api/v1/employees | backend/src/routes/er/employee.routes.ts | ✅ | admin-dashboard (/employees) |
| DELETE | /api/v1/employees/:id | backend/src/routes/er/employee.routes.ts | ✅ | admin-dashboard (/employees/:id) |
| PATCH | /api/v1/employees/:id | backend/src/routes/er/employee.routes.ts | ✅ | admin-dashboard (/employees/:id) |
| GET | /api/v1/entries | backend/src/routes/er/journalEntry.routes.ts | ✅ | admin-dashboard (/entries) |
| POST | /api/v1/entries | backend/src/routes/er/journalEntry.routes.ts | ✅ | admin-dashboard (/entries) |
| GET | /api/v1/entries/:voucherNo | backend/src/routes/er/journalEntry.routes.ts | ✅ | admin-dashboard (/entries/:voucherNo) |
| PUT | /api/v1/entries/:voucherNo | backend/src/routes/er/journalEntry.routes.ts | ✅ | admin-dashboard (/entries/:voucherNo) |
| POST | /api/v1/entries/:voucherNo/post | backend/src/routes/er/journalEntry.routes.ts | ✅ | admin-dashboard (/entries/:voucherNo/post) |
| GET | /api/v1/entries/next-no | backend/src/routes/er/journalEntry.routes.ts | ✅ | admin-dashboard (/entries/next-no) |
| GET | /api/v1/er/accounts-payable | backend/src/routes/er/accountPayable.routes.ts | ❌ | — |
| POST | /api/v1/er/accounts-payable | backend/src/routes/er/accountPayable.routes.ts | ❌ | — |
| DELETE | /api/v1/er/accounts-payable/:id | backend/src/routes/er/accountPayable.routes.ts | ❌ | — |
| GET | /api/v1/er/accounts-payable/:id | backend/src/routes/er/accountPayable.routes.ts | ❌ | — |
| PATCH | /api/v1/er/accounts-payable/:id | backend/src/routes/er/accountPayable.routes.ts | ❌ | — |
| GET | /api/v1/er/accounts-receivable | backend/src/routes/er/accountReceivable.routes.ts | ❌ | — |
| POST | /api/v1/er/accounts-receivable | backend/src/routes/er/accountReceivable.routes.ts | ❌ | — |
| DELETE | /api/v1/er/accounts-receivable/:id | backend/src/routes/er/accountReceivable.routes.ts | ❌ | — |
| GET | /api/v1/er/accounts-receivable/:id | backend/src/routes/er/accountReceivable.routes.ts | ❌ | — |
| PATCH | /api/v1/er/accounts-receivable/:id | backend/src/routes/er/accountReceivable.routes.ts | ❌ | — |
| GET | /api/v1/er/assets | backend/src/routes/er/asset.routes.ts | ✅ | admin-dashboard (/er/assets) |
| DELETE | /api/v1/er/assets/:id([0-9a-fA-F]{24}) | backend/src/routes/er/asset.routes.ts | ❌ | — |
| GET | /api/v1/er/assets/:id([0-9a-fA-F]{24}) | backend/src/routes/er/asset.routes.ts | ❌ | — |
| PATCH | /api/v1/er/assets/:id([0-9a-fA-F]{24}) | backend/src/routes/er/asset.routes.ts | ❌ | — |
| GET | /api/v1/er/assets/stats | backend/src/routes/er/asset.routes.ts | ✅ | admin-dashboard (/er/assets/stats) |
| GET | /api/v1/er/budgets | backend/src/routes/er/budget.routes.ts | ❌ | — |
| POST | /api/v1/er/budgets | backend/src/routes/er/budget.routes.ts | ❌ | — |
| DELETE | /api/v1/er/budgets/:id | backend/src/routes/er/budget.routes.ts | ❌ | — |
| PATCH | /api/v1/er/budgets/:id | backend/src/routes/er/budget.routes.ts | ❌ | — |
| GET | /api/v1/er/budgets/:year | backend/src/routes/er/budget.routes.ts | ❌ | — |
| GET | /api/v1/er/dashboard/financial | backend/src/routes/er/dashboard.routes.ts | ❌ | — |
| GET | /api/v1/er/dashboard/performance | backend/src/routes/er/dashboard.routes.ts | ❌ | — |
| GET | /api/v1/er/dashboard/report | backend/src/routes/er/dashboard.routes.ts | ❌ | — |
| GET | /api/v1/er/dashboard/tasks | backend/src/routes/er/dashboard.routes.ts | ❌ | — |
| GET | /api/v1/er/documents | backend/src/routes/er/document.routes.ts | ✅ | admin-dashboard (/er/documents) |
| POST | /api/v1/er/documents | backend/src/routes/er/document.routes.ts | ✅ | admin-dashboard (/er/documents) |
| DELETE | /api/v1/er/documents/:id | backend/src/routes/er/document.routes.ts | ✅ | admin-dashboard (/er/documents/:id) |
| GET | /api/v1/er/documents/:id | backend/src/routes/er/document.routes.ts | ✅ | admin-dashboard (/er/documents/:id) |
| PATCH | /api/v1/er/documents/:id | backend/src/routes/er/document.routes.ts | ✅ | admin-dashboard (/er/documents/:id) |
| GET | /api/v1/er/kpi-assignments | backend/src/routes/er/kpiAssignment.routes.ts | ❌ | — |
| POST | /api/v1/er/kpi-assignments | backend/src/routes/er/kpiAssignment.routes.ts | ❌ | — |
| DELETE | /api/v1/er/kpi-assignments/:id | backend/src/routes/er/kpiAssignment.routes.ts | ❌ | — |
| PATCH | /api/v1/er/kpi-assignments/:id | backend/src/routes/er/kpiAssignment.routes.ts | ❌ | — |
| GET | /api/v1/er/ledger-entries | backend/src/routes/er/ledgerEntry.routes.ts | ❌ | — |
| POST | /api/v1/er/ledger-entries | backend/src/routes/er/ledgerEntry.routes.ts | ❌ | — |
| DELETE | /api/v1/er/ledger-entries/:id | backend/src/routes/er/ledgerEntry.routes.ts | ❌ | — |
| GET | /api/v1/er/ledger-entries/:id | backend/src/routes/er/ledgerEntry.routes.ts | ❌ | — |
| PATCH | /api/v1/er/ledger-entries/:id | backend/src/routes/er/ledgerEntry.routes.ts | ❌ | — |
| GET | /api/v1/er/payroll | backend/src/routes/er/payroll.routes.ts | ✅ | admin-dashboard (/er/payroll) |
| DELETE | /api/v1/er/payroll/:id([0-9a-fA-F]{24}) | backend/src/routes/er/payroll.routes.ts | ❌ | — |
| GET | /api/v1/er/payroll/:id([0-9a-fA-F]{24}) | backend/src/routes/er/payroll.routes.ts | ❌ | — |
| PATCH | /api/v1/er/payroll/:id([0-9a-fA-F]{24}) | backend/src/routes/er/payroll.routes.ts | ❌ | — |
| POST | /api/v1/er/payroll/process | backend/src/routes/er/payroll.routes.ts | ✅ | admin-dashboard (/er/payroll/process) |
| GET | /api/v1/er/payroll/stats | backend/src/routes/er/payroll.routes.ts | ✅ | admin-dashboard (/er/payroll/stats) |
| GET | /api/v1/er/performance-reviews | backend/src/routes/er/performanceReview.routes.ts | ❌ | — |
| POST | /api/v1/er/performance-reviews | backend/src/routes/er/performanceReview.routes.ts | ❌ | — |
| GET | /api/v1/er/tasks | backend/src/routes/er/task.routes.ts | ❌ | — |
| POST | /api/v1/er/tasks | backend/src/routes/er/task.routes.ts | ❌ | — |
| DELETE | /api/v1/er/tasks/:id | backend/src/routes/er/task.routes.ts | ❌ | — |
| GET | /api/v1/er/tasks/:id | backend/src/routes/er/task.routes.ts | ❌ | — |
| PATCH | /api/v1/er/tasks/:id | backend/src/routes/er/task.routes.ts | ❌ | — |
| GET | /api/v1/favorites | backend/src/routes/favorites.ts | ✅ | app-user (/favorites)<br />bthwani-web (/favorites) |
| POST | /api/v1/favorites | backend/src/routes/favorites.ts | ✅ | app-user (/favorites)<br />bthwani-web (/favorites) |
| DELETE | /api/v1/favorites/:itemType/:itemId | backend/src/routes/favorites.ts | ❌ | — |
| GET | /api/v1/favorites/counts | backend/src/routes/favorites.ts | ❌ | — |
| GET | /api/v1/favorites/exists/:itemType/:itemId | backend/src/routes/favorites.ts | ❌ | — |
| POST | /api/v1/field/onboarding | backend/src/routes/field/onboarding.routes.ts | ✅ | field-marketers (/field/onboarding) |
| GET | /api/v1/field/onboarding/:id | backend/src/routes/field/onboarding.routes.ts | ✅ | field-marketers (/field/onboarding/:id) |
| PATCH | /api/v1/field/onboarding/:id | backend/src/routes/field/onboarding.routes.ts | ✅ | field-marketers (/field/onboarding/:id) |
| POST | /api/v1/field/onboarding/:id/submit | backend/src/routes/field/onboarding.routes.ts | ✅ | field-marketers (/field/onboarding/:id/submit) |
| GET | /api/v1/field/onboarding/my | backend/src/routes/field/onboarding.routes.ts | ✅ | field-marketers (/field/onboarding/my) |
| POST | /api/v1/field/quick-onboard | backend/src/routes/field/quickOnboard.routes.ts | ✅ | field-marketers (/field/quick-onboard) |
| POST | /api/v1/files/sign | backend/src/routes/marketerV1/mediaMarketerRoutes.ts | ❌ | — |
| GET | /api/v1/goals | backend/src/routes/er/performanceGoal.routes.ts | ❌ | — |
| POST | /api/v1/goals | backend/src/routes/er/performanceGoal.routes.ts | ❌ | — |
| PATCH | /api/v1/goals/:id | backend/src/routes/er/performanceGoal.routes.ts | ❌ | — |
| GET | /api/v1/groceries/attributes | backend/src/routes/marchent/api.ts | ✅ | admin-dashboard (groceries/attributes) |
| POST | /api/v1/groceries/attributes | backend/src/routes/marchent/api.ts | ✅ | admin-dashboard (groceries/attributes) |
| DELETE | /api/v1/groceries/attributes/:id | backend/src/routes/marchent/api.ts | ✅ | admin-dashboard (groceries/attributes/:id) |
| PUT | /api/v1/groceries/attributes/:id | backend/src/routes/marchent/api.ts | ❌ | — |
| GET | /api/v1/groceries/attributes/category/:categoryId | backend/src/routes/marchent/api.ts | ❌ | — |
| GET | /api/v1/groceries/catalog | backend/src/routes/marchent/api.ts | ✅ | vendor-app (/groceries/catalog) |
| POST | /api/v1/groceries/catalog | backend/src/routes/marchent/api.ts | ✅ | admin-dashboard (groceries/catalog) |
| DELETE | /api/v1/groceries/catalog/:id | backend/src/routes/marchent/api.ts | ✅ | admin-dashboard (groceries/catalog/:id) |
| GET | /api/v1/groceries/catalog/:id | backend/src/routes/marchent/api.ts | ❌ | — |
| PUT | /api/v1/groceries/catalog/:id | backend/src/routes/marchent/api.ts | ❌ | — |
| GET | /api/v1/groceries/catalog/category/:categoryId | backend/src/routes/marchent/api.ts | ❌ | — |
| GET | /api/v1/groceries/categories | backend/src/routes/marchent/api.ts | ✅ | admin-dashboard (groceries/categories)<br />admin-dashboard (/groceries/categories) |
| POST | /api/v1/groceries/categories | backend/src/routes/marchent/api.ts | ✅ | admin-dashboard (groceries/categories) |
| DELETE | /api/v1/groceries/categories/:id | backend/src/routes/marchent/api.ts | ✅ | admin-dashboard (groceries/categories/:id) |
| GET | /api/v1/groceries/categories/:id | backend/src/routes/marchent/api.ts | ❌ | — |
| PUT | /api/v1/groceries/categories/:id | backend/src/routes/marchent/api.ts | ❌ | — |
| GET | /api/v1/groceries/merchant-products | backend/src/routes/marchent/api.ts | ✅ | admin-dashboard (/groceries/merchant-products)<br />vendor-app (/groceries/merchant-products)<br />bthwani-web (/groceries/merchant-products) |
| POST | /api/v1/groceries/merchant-products | backend/src/routes/marchent/api.ts | ✅ | admin-dashboard (groceries/merchant-products)<br />vendor-app (/groceries/merchant-products) |
| DELETE | /api/v1/groceries/merchant-products/:id | backend/src/routes/marchent/api.ts | ✅ | admin-dashboard (groceries/merchant-products/:id)<br />vendor-app (/groceries/merchant-products/:id) |
| GET | /api/v1/groceries/merchant-products/:id | backend/src/routes/marchent/api.ts | ❌ | — |
| PUT | /api/v1/groceries/merchant-products/:id | backend/src/routes/marchent/api.ts | ✅ | vendor-app (/groceries/merchant-products/:id) |
| GET | /api/v1/groceries/merchant-products/merchant/:merchantId | backend/src/routes/marchent/api.ts | ❌ | — |
| GET | /api/v1/groceries/merchant-products/merchant/:merchantId/category/:categoryId | backend/src/routes/marchent/api.ts | ❌ | — |
| GET | /api/v1/journals | backend/src/routes/er/journals.routes.ts | ✅ | admin-dashboard (/journals) |
| GET | /api/v1/leaves | backend/src/routes/er/leaveRequest.routes.ts | ❌ | — |
| POST | /api/v1/leaves | backend/src/routes/er/leaveRequest.routes.ts | ❌ | — |
| PATCH | /api/v1/leaves/:id | backend/src/routes/er/leaveRequest.routes.ts | ❌ | — |
| GET | /api/v1/marketer/overview/marketer/overview | backend/src/routes/marketerV1/marketerOverviewRoutes.ts | ❌ | — |
| GET | /api/v1/marketer/stores | backend/src/routes/marketerV1/marketerStoreVendorRoutes.ts | ❌ | — |
| POST | /api/v1/marketer/stores | backend/src/routes/marketerV1/marketerStoreVendorRoutes.ts | ❌ | — |
| POST | /api/v1/marketer/vendors | backend/src/routes/marketerV1/marketerStoreVendorRoutes.ts | ❌ | — |
| POST | /api/v1/media/sign-upload | backend/src/routes/mediaRoutes.ts | ✅ | admin-dashboard (/media/sign-upload) |
| POST | /api/v1/messages/schedule | backend/src/routes/messages.ts | ❌ | — |
| POST | /api/v1/messages/send | backend/src/routes/messages.ts | ❌ | — |
| GET | /api/v1/meta/cities | backend/src/routes/meta.ts | ✅ | admin-dashboard (/meta/cities) |
| GET | /api/v1/meta/enums | backend/src/routes/meta.ts | ❌ | — |
| GET | /api/v1/partners | backend/src/routes/partners.ts | ✅ | admin-dashboard (/partners) |
| GET | /api/v1/partners/:store/performance | backend/src/routes/partners.ts | ✅ | admin-dashboard (/partners/:store/performance) |
| GET | /api/v1/partners/contracts/expiring | backend/src/routes/partners.ts | ✅ | admin-dashboard (/partners/contracts/expiring) |
| GET | /api/v1/partners/contracts/export/csv | backend/src/routes/partners.ts | ❌ | — |
| POST | /api/v1/partners/upsert | backend/src/routes/partners.ts | ✅ | admin-dashboard (/partners/upsert) |
| GET | /api/v1/pricing-strategies | backend/src/routes/delivery_marketplace_v1/pricingStrategy.ts | ✅ | admin-dashboard (/pricing-strategies) |
| POST | /api/v1/pricing-strategies | backend/src/routes/delivery_marketplace_v1/pricingStrategy.ts | ✅ | admin-dashboard (/pricing-strategies) |
| PUT | /api/v1/pricing-strategies | backend/src/routes/delivery_marketplace_v1/pricingStrategy.ts | ✅ | admin-dashboard (/pricing-strategies) |
| DELETE | /api/v1/pricing-strategies/:id | backend/src/routes/delivery_marketplace_v1/pricingStrategy.ts | ✅ | admin-dashboard (/pricing-strategies/:id) |
| GET | /api/v1/referrals/link | backend/src/routes/field/referral.routes.ts | ✅ | field-marketers (/referrals/link) |
| GET | /api/v1/referrals/stats | backend/src/routes/field/referral.routes.ts | ✅ | field-marketers (/referrals/stats) |
| POST | /api/v1/referrals/track | backend/src/routes/field/referral.routes.ts | ❌ | — |
| GET | /api/v1/reports/marketers/:id | backend/src/routes/admin/reportsRoutes.ts | ❌ | — |
| GET | /api/v1/reports/marketers/overview | backend/src/routes/admin/reportsRoutes.ts | ✅ | admin-dashboard (/reports/marketers/overview) |
| POST | /api/v1/segments/preview | backend/src/routes/segments.ts | ✅ | admin-dashboard (/segments/preview) |
| POST | /api/v1/segments/sync | backend/src/routes/segments.ts | ✅ | admin-dashboard (/segments/sync) |
| GET | /api/v1/support/customers/:id/overview | backend/src/routes/support/customers.ts | ❌ | — |
| GET | /api/v1/support/messaging-prefs/me | backend/src/routes/support/messaging-prefs.ts | ❌ | — |
| PATCH | /api/v1/support/messaging-prefs/me | backend/src/routes/support/messaging-prefs.ts | ❌ | — |
| GET | /api/v1/support/stats | backend/src/routes/admin/support.routes.ts | ❌ | — |
| GET | /api/v1/support/tickets | backend/src/routes/admin/support.routes.ts | ❌ | — |
| POST | /api/v1/support/tickets | backend/src/routes/admin/support.routes.ts | ❌ | — |
| GET | /api/v1/support/tickets/:id | backend/src/routes/admin/support.routes.ts | ❌ | — |
| PATCH | /api/v1/support/tickets/:id | backend/src/routes/admin/support.routes.ts | ❌ | — |
| PATCH | /api/v1/support/tickets/:id/assign | backend/src/routes/admin/support.routes.ts | ❌ | — |
| POST | /api/v1/support/tickets/:id/messages | backend/src/routes/admin/support.routes.ts | ❌ | — |
| GET | /api/v1/support/v2/canned | backend/src/routes/support.ts | ❌ | — |
| POST | /api/v1/support/v2/canned | backend/src/routes/support.ts | ❌ | — |
| DELETE | /api/v1/support/v2/canned/:id | backend/src/routes/support.ts | ❌ | — |
| PATCH | /api/v1/support/v2/canned/:id | backend/src/routes/support.ts | ❌ | — |
| GET | /api/v1/support/v2/macros | backend/src/routes/support.ts | ❌ | — |
| POST | /api/v1/support/v2/macros | backend/src/routes/support.ts | ❌ | — |
| GET | /api/v1/support/v2/reports/summary | backend/src/routes/support.ts | ❌ | — |
| GET | /api/v1/support/v2/sla-policies | backend/src/routes/support.ts | ❌ | — |
| POST | /api/v1/support/v2/sla-policies | backend/src/routes/support.ts | ❌ | — |
| DELETE | /api/v1/support/v2/sla-policies/:id | backend/src/routes/support.ts | ❌ | — |
| PATCH | /api/v1/support/v2/sla-policies/:id | backend/src/routes/support.ts | ❌ | — |
| GET | /api/v1/support/v2/tickets | backend/src/routes/support.ts | ❌ | — |
| POST | /api/v1/support/v2/tickets | backend/src/routes/support.ts | ❌ | — |
| PATCH | /api/v1/support/v2/tickets/:id | backend/src/routes/support.ts | ❌ | — |
| POST | /api/v1/support/v2/tickets/:id/apply-macro/:macroId | backend/src/routes/support.ts | ❌ | — |
| POST | /api/v1/support/v2/tickets/:id/csat | backend/src/routes/support.ts | ❌ | — |
| GET | /api/v1/support/v2/tickets/:id/messages | backend/src/routes/support.ts | ❌ | — |
| POST | /api/v1/support/v2/tickets/:id/messages | backend/src/routes/support.ts | ❌ | — |
| POST | /api/v1/test/otp/email | backend/src/routes/testOtp.ts | ❌ | — |
| POST | /api/v1/test/otp/sms | backend/src/routes/testOtp.ts | ❌ | — |
| POST | /api/v1/test/otp/whatsapp | backend/src/routes/testOtp.ts | ❌ | — |
| POST | /api/v1/topup | backend/src/routes/Wallet_V8/topupRoutes.ts | ❌ | — |
| GET | /api/v1/topup/logs | backend/src/routes/Wallet_V8/topupRoutes.ts | ❌ | — |
| GET | /api/v1/topup/my-logs | backend/src/routes/Wallet_V8/topupRoutes.ts | ❌ | — |
| POST | /api/v1/topup/pay-bill | backend/src/routes/Wallet_V8/topupRoutes.ts | ❌ | — |
| GET | /api/v1/users/address | backend/src/routes/userRoutes.ts | ✅ | app-user (/users/address) |
| POST | /api/v1/users/address | backend/src/routes/userRoutes.ts | ✅ | app-user (/users/address)<br />bthwani-web (/users/address) |
| DELETE | /api/v1/users/address/:id | backend/src/routes/userRoutes.ts | ❌ | — |
| PATCH | /api/v1/users/address/:id | backend/src/routes/userRoutes.ts | ❌ | — |
| PATCH | /api/v1/users/avatar | backend/src/routes/userRoutes.ts | ✅ | app-user (/users/avatar)<br />bthwani-web (/users/avatar) |
| PATCH | /api/v1/users/avatar | backend/src/routes/userAvatarRoutes.ts | ✅ | app-user (/users/avatar)<br />bthwani-web (/users/avatar) |
| PATCH | /api/v1/users/default-address | backend/src/routes/userRoutes.ts | ✅ | app-user (/users/default-address)<br />bthwani-web (/users/default-address) |
| POST | /api/v1/users/init | backend/src/routes/userRoutes.ts | ❌ | — |
| DELETE | /api/v1/users/me | backend/src/routes/userRoutes.ts | ✅ | app-user (/users/me) |
| GET | /api/v1/users/me | backend/src/routes/userRoutes.ts | ✅ | app-user (/users/me)<br />bthwani-web (/users/me) |
| DELETE | /api/v1/users/me/deactivate | backend/src/routes/userRoutes.ts | ❌ | — |
| GET | /api/v1/users/me/delete-eligibility | backend/src/routes/userRoutes.ts | ✅ | app-user (/users/me/delete-eligibility) |
| GET | /api/v1/users/me/stats | backend/src/routes/userRoutes.ts | ❌ | — |
| GET | /api/v1/users/notifications | backend/src/routes/userRoutes.ts | ✅ | app-user (/users/notifications) |
| PATCH | /api/v1/users/notifications/mark-read | backend/src/routes/userRoutes.ts | ❌ | — |
| POST | /api/v1/users/otp/send | backend/src/routes/userRoutes.ts | ❌ | — |
| POST | /api/v1/users/otp/verify | backend/src/routes/userRoutes.ts | ❌ | — |
| PATCH | /api/v1/users/profile | backend/src/routes/userRoutes.ts | ✅ | app-user (/users/profile)<br />bthwani-web (/users/profile) |
| GET | /api/v1/users/search | backend/src/routes/userRoutes.ts | ✅ | admin-dashboard (/users/search) |
| PATCH | /api/v1/users/security | backend/src/routes/userRoutes.ts | ❌ | — |
| PATCH | /api/v1/users/security/set-pin | backend/src/routes/userRoutes.ts | ❌ | — |
| PATCH | /api/v1/users/security/verify-pin | backend/src/routes/userRoutes.ts | ❌ | — |
| GET | /api/v1/users/transactions | backend/src/routes/userRoutes.ts | ❌ | — |
| GET | /api/v1/users/wallet | backend/src/routes/userRoutes.ts | ❌ | — |
| POST | /api/v1/users/wallet/transfer | backend/src/routes/userRoutes.ts | ❌ | — |
| GET | /api/v1/users/wallet/transfer-history | backend/src/routes/userRoutes.ts | ❌ | — |
| DELETE | /api/v1/utility/daily | backend/src/routes/delivery_marketplace_v1/utility.ts | ✅ | admin-dashboard (/utility/daily) |
| GET | /api/v1/utility/daily | backend/src/routes/delivery_marketplace_v1/utility.ts | ✅ | admin-dashboard (/utility/daily) |
| POST | /api/v1/utility/daily | backend/src/routes/delivery_marketplace_v1/utility.ts | ✅ | admin-dashboard (/utility/daily) |
| DELETE | /api/v1/utility/daily/:id | backend/src/routes/delivery_marketplace_v1/utility.ts | ✅ | admin-dashboard (/utility/daily/:id) |
| GET | /api/v1/utility/options | backend/src/routes/delivery_marketplace_v1/utility.ts | ✅ | admin-dashboard (/utility/options)<br />app-user (/utility/options)<br />bthwani-web (/utility/options) |
| PATCH | /api/v1/utility/options/gas | backend/src/routes/delivery_marketplace_v1/utility.ts | ✅ | admin-dashboard (/utility/options/gas) |
| PATCH | /api/v1/utility/options/water | backend/src/routes/delivery_marketplace_v1/utility.ts | ✅ | admin-dashboard (/utility/options/water) |
| POST | /api/v1/utility/order | backend/src/routes/delivery_marketplace_v1/utility.ts | ✅ | app-user (/utility/order)<br />bthwani-web (/utility/order) |
| PATCH | /api/v1/utility/order/:orderId/sub/:subId/origin | backend/src/routes/delivery_marketplace_v1/utility.ts | ✅ | admin-dashboard (/utility/order/:orderId/sub/:subId/origin) |
| GET | /api/v1/vendor | backend/src/routes/vendor_app/vendor.routes.ts | ✅ | admin-dashboard (/vendor) |
| POST | /api/v1/vendor | backend/src/routes/vendor_app/vendor.routes.ts | ✅ | admin-dashboard (/vendor) |
| POST | /api/v1/vendor/account/delete-request | backend/src/routes/vendor_app/vendor.routes.ts | ✅ | vendor-app (/vendor/account/delete-request) |
| GET | /api/v1/vendor/account/statement | backend/src/routes/vendor_app/vendor.routes.ts | ✅ | vendor-app (/vendor/account/statement) |
| POST | /api/v1/vendor/auth/vendor-login | backend/src/routes/vendor_app/vendor.routes.ts | ✅ | vendor-app (/vendor/auth/vendor-login) |
| GET | /api/v1/vendor/dashboard/overview | backend/src/routes/vendor_app/vendor.routes.ts | ✅ | vendor-app (/vendor/dashboard/overview) |
| GET | /api/v1/vendor/me/profile | backend/src/routes/vendor_app/vendor.routes.ts | ✅ | vendor-app (/vendor/me/profile) |
| PUT | /api/v1/vendor/me/profile | backend/src/routes/vendor_app/vendor.routes.ts | ❌ | — |
| GET | /api/v1/vendor/merchant/reports | backend/src/routes/vendor_app/vendor.routes.ts | ❌ | — |
| POST | /api/v1/vendor/push-token | backend/src/routes/vendor_app/vendor.routes.ts | ✅ | vendor-app (/vendor/push-token) |
| GET | /api/v1/vendor/sales | backend/src/routes/vendor_app/vendor.routes.ts | ❌ | — |
| GET | /api/v1/vendor/settings/notifications | backend/src/routes/vendor_app/vendor.routes.ts | ✅ | vendor-app (/vendor/settings/notifications) |
| PUT | /api/v1/vendor/settings/notifications | backend/src/routes/vendor_app/vendor.routes.ts | ✅ | vendor-app (/vendor/settings/notifications) |
| GET | /api/v1/vendor/settlements | backend/src/routes/vendor_app/vendor.routes.ts | ✅ | vendor-app (/vendor/settlements) |
| GET | /api/v1/vendor/settlements | backend/src/routes/vendor_app/settlement.routes.ts | ✅ | vendor-app (/vendor/settlements) |
| POST | /api/v1/vendor/settlements | backend/src/routes/vendor_app/vendor.routes.ts | ✅ | vendor-app (/vendor/settlements) |
| POST | /api/v1/vendor/settlements | backend/src/routes/vendor_app/settlement.routes.ts | ✅ | vendor-app (/vendor/settlements) |
| GET | /api/v1/vendor/settlements/:id | backend/src/routes/vendor_app/settlement.routes.ts | ❌ | — |
| PATCH | /api/v1/vendor/settlements/:id/cancel | backend/src/routes/vendor_app/settlement.routes.ts | ❌ | — |
| PATCH | /api/v1/vendor/settlements/admin/:id/status | backend/src/routes/vendor_app/settlement.routes.ts | ❌ | — |
| GET | /api/v1/vendor/settlements/admin/all | backend/src/routes/vendor_app/settlement.routes.ts | ❌ | — |
| GET | /api/v1/vendor/settlements/balance/me | backend/src/routes/vendor_app/settlement.routes.ts | ❌ | — |
| POST | /api/v1/vendor/stores | backend/src/routes/vendor_app/vendor.routes.ts | ❌ | — |
| DELETE | /api/v1/vendor/stores/:storeId | backend/src/routes/vendor_app/vendor.routes.ts | ❌ | — |
| GET | /api/v1/wallet | backend/src/routes/Wallet_V8/wallet.routes.ts | ✅ | app-user (/wallet) |
| GET | /api/v1/wallet/admin/withdrawals | backend/src/routes/Wallet_V8/wallet.routes.ts | ❌ | — |
| POST | /api/v1/wallet/admin/withdrawals/:id/process | backend/src/routes/Wallet_V8/wallet.routes.ts | ❌ | — |
| GET | /api/v1/wallet/analytics | backend/src/routes/Wallet_V8/wallet.routes.ts | ❌ | — |
| GET | /api/v1/wallet/analytics/monthly | backend/src/routes/Wallet_V8/wallet.routes.ts | ❌ | — |
| POST | /api/v1/wallet/charge/kuraimi | backend/src/routes/Wallet_V8/wallet.routes.ts | ❌ | — |
| POST | /api/v1/wallet/coupons | backend/src/routes/Wallet_V8/coupon.routes.ts | ✅ | admin-dashboard (/wallet/coupons) |
| POST | /api/v1/wallet/coupons/redeem | backend/src/routes/Wallet_V8/coupon.routes.ts | ❌ | — |
| POST | /api/v1/wallet/coupons/use | backend/src/routes/Wallet_V8/coupon.routes.ts | ❌ | — |
| GET | /api/v1/wallet/coupons/user | backend/src/routes/Wallet_V8/coupon.routes.ts | ❌ | — |
| POST | /api/v1/wallet/coupons/validate | backend/src/routes/Wallet_V8/coupon.routes.ts | ❌ | — |
| POST | /api/v1/wallet/order/capture | backend/src/routes/Wallet_V8/walletOrderRoutes.ts | ❌ | — |
| POST | /api/v1/wallet/order/hold | backend/src/routes/Wallet_V8/walletOrderRoutes.ts | ❌ | — |
| POST | /api/v1/wallet/order/release | backend/src/routes/Wallet_V8/walletOrderRoutes.ts | ❌ | — |
| POST | /api/v1/wallet/reverse/:refNo | backend/src/routes/Wallet_V8/wallet.routes.ts | ❌ | — |
| POST | /api/v1/wallet/subscriptions | backend/src/routes/Wallet_V8/subscription.routes.ts | ❌ | — |
| GET | /api/v1/wallet/subscriptions/my | backend/src/routes/Wallet_V8/subscription.routes.ts | ❌ | — |
| POST | /api/v1/wallet/verify-customer | backend/src/routes/Wallet_V8/wallet.routes.ts | ❌ | — |
| POST | /api/v1/wallet/withdraw-request | backend/src/routes/Wallet_V8/wallet.routes.ts | ❌ | — |

## Frontend Calls Without Matching Backend Endpoint

| Method | Path | Usage |
|--------|------|-------|
| POST | /api/v1/admin/users | admin-dashboard (/admin/users) |
| PATCH | /api/v1/admin/users/:id/permissions | admin-dashboard (/admin/users/:id/permissions) |
| GET | /api/v1/admin/modules | admin-dashboard (/admin/modules) |
| GET | /api/v1/er/assets/:id | admin-dashboard (/er/assets/:id) |
| POST | /api/v1/er/assets | admin-dashboard (/er/assets) |
| PATCH | /api/v1/er/assets/:id | admin-dashboard (/er/assets/:id) |
| DELETE | /api/v1/er/assets/:id | admin-dashboard (/er/assets/:id) |
| PATCH | /api/v1/er/assets/:assetId/assign | admin-dashboard (/er/assets/:assetId/assign) |
| PATCH | /api/v1/er/assets/:assetId/unassign | admin-dashboard (/er/assets/:assetId/unassign) |
| GET | /api/v1/attendance/stats | admin-dashboard (/attendance/stats) |
| GET | /api/v1/er/accounts/chart | admin-dashboard (/er/accounts/chart) |
| GET | /api/v1/er/accounts/chart/tree | admin-dashboard (/er/accounts/chart/tree) |
| GET | /api/v1/er/accounts/chart/analysis | admin-dashboard (/er/accounts/chart/analysis) |
| GET | /api/v1/er/accounts/chart/:id | admin-dashboard (/er/accounts/chart/:id) |
| POST | /api/v1/er/accounts/chart | admin-dashboard (/er/accounts/chart) |
| PATCH | /api/v1/er/accounts/chart/:id | admin-dashboard (/er/accounts/chart/:id) |
| DELETE | /api/v1/er/accounts/chart/:id | admin-dashboard (/er/accounts/chart/:id) |
| PUT | /api/v1/admin/onboarding-slides/:_id | admin-dashboard (/admin/onboarding-slides/:_id) |
| GET | /api/v1/admin/pages | admin-dashboard (/admin/pages) |
| PUT | /api/v1/admin/pages/:_id | admin-dashboard (/admin/pages/:_id) |
| POST | /api/v1/admin/pages | admin-dashboard (/admin/pages) |
| DELETE | /api/v1/admin/pages/:id | admin-dashboard (/admin/pages/:id) |
| GET | /api/v1/admin/strings:param | admin-dashboard (/admin/strings:param) |
| PUT | /api/v1/admin/strings/:_id | admin-dashboard (/admin/strings/:_id) |
| POST | /api/v1/admin/strings | admin-dashboard (/admin/strings) |
| DELETE | /api/v1/admin/strings/:id | admin-dashboard (/admin/strings/:id) |
| GET | /api/v1/admin/home-layouts | admin-dashboard (/admin/home-layouts) |
| PUT | /api/v1/admin/home-layouts/:_id | admin-dashboard (/admin/home-layouts/:_id) |
| POST | /api/v1/admin/home-layouts | admin-dashboard (/admin/home-layouts) |
| DELETE | /api/v1/admin/home-layouts/:id | admin-dashboard (/admin/home-layouts/:id) |
| GET | /api/v1/admin/wallet/coupons/:id | admin-dashboard (/admin/wallet/coupons/:id) |
| PATCH | /api/v1/admin/wallet/coupons/:id | admin-dashboard (/admin/wallet/coupons/:id) |
| DELETE | /api/v1/admin/wallet/coupons/:id | admin-dashboard (/admin/wallet/coupons/:id) |
| POST | /api/v1/admin/wallet/coupons/validate | admin-dashboard (/admin/wallet/coupons/validate) |
| GET | /api/v1/admin/wallet/coupons/stats | admin-dashboard (/admin/wallet/coupons/stats) |
| POST | /api/v1/admin/wallet/coupons/generate | admin-dashboard (/admin/wallet/coupons/generate) |
| GET | /api/v1/er/documents/stats | admin-dashboard (/er/documents/stats) |
| POST | /api/v1/er/documents/upload | admin-dashboard (/er/documents/upload) |
| GET | /api/v1/er/documents/:id/download | admin-dashboard (/er/documents/:id/download) |
| GET | /api/v1/er/documents/expiring-soon | admin-dashboard (/er/documents/expiring-soon) |
| GET | /api/v1/er/documents/expired | admin-dashboard (/er/documents/expired) |
| PATCH | /api/v1/er/documents/bulk | admin-dashboard (/er/documents/bulk) |
| DELETE | /api/v1/er/documents/bulk | admin-dashboard (/er/documents/bulk) |
| GET | /api/v1/er/documents/export | admin-dashboard (/er/documents/export) |
| GET | /api/v1/admin/drivers/finance/:driverId/adjustments | admin-dashboard (/admin/drivers/finance/:driverId/adjustments) |
| POST | /api/v1/admin/drivers/finance/:driverId/adjustments | admin-dashboard (/admin/drivers/finance/:driverId/adjustments) |
| GET | /api/v1/admin/drivers/finance/:driverId/summary | admin-dashboard (/admin/drivers/finance/:driverId/summary) |
| GET | /api/v1/admin/drivers/ratings | admin-dashboard (/admin/drivers/ratings) |
| GET | /api/v1/admin/drivers/:driverId/ratings/stats | admin-dashboard (/admin/drivers/:driverId/ratings/stats) |
| GET | /api/v1/admin/drivers/ratings/recent | admin-dashboard (/admin/drivers/ratings/recent) |
| GET | /api/v1/admin/drivers/:id | admin-dashboard (/admin/drivers/:id)<br />admin-dashboard (admin/drivers/:id) |
| POST | /api/v1/admin/drivers | admin-dashboard (/admin/drivers) |
| PATCH | /api/v1/admin/drivers/:id | admin-dashboard (/admin/drivers/:id) |
| DELETE | /api/v1/admin/drivers/:id | admin-dashboard (/admin/drivers/:id) |
| GET | /api/v1/admin/drivers/attendance/sessions | admin-dashboard (/admin/drivers/attendance/sessions) |
| DELETE | /api/v1/admin/drivers/shifts/:id | admin-dashboard (/admin/drivers/shifts/:id) |
| PATCH | /api/v1/admin/drivers/assets/:id | admin-dashboard (/admin/drivers/assets/:id) |
| DELETE | /api/v1/admin/drivers/assets/:id | admin-dashboard (/admin/drivers/assets/:id) |
| GET | /api/v1/employees/:id | admin-dashboard (/employees/:id) |
| GET | /api/v1/finance/settlements | admin-dashboard (/finance/settlements) |
| GET | /api/v1/finance/settlements/:settlementId | admin-dashboard (/finance/settlements/:settlementId) |
| POST | /api/v1/finance/settlements/generate | admin-dashboard (/finance/settlements/generate) |
| PATCH | /api/v1/finance/settlements/:settlementId/mark-paid | admin-dashboard (/finance/settlements/:settlementId/mark-paid) |
| GET | /api/v1/finance/settlements/:settlementId/export.csv | admin-dashboard (/finance/settlements/:settlementId/export.csv) |
| GET | /api/v1/finance/wallet/balance | admin-dashboard (/finance/wallet/balance) |
| GET | /api/v1/finance/wallet/balances/:type | admin-dashboard (/finance/wallet/balances/:type) |
| GET | /api/v1/finance/wallet/settlement-balance/:type | admin-dashboard (/finance/wallet/settlement-balance/:type) |
| GET | /api/v1/finance/wallet/ledger/entries | admin-dashboard (/finance/wallet/ledger/entries) |
| GET | /api/v1/finance/reconciliation/report | admin-dashboard (/finance/reconciliation/report) |
| GET | /api/v1/finance/reconciliation/validate-balance | admin-dashboard (/finance/reconciliation/validate-balance) |
| GET | /api/v1/finance/reconciliation/daily-report/:date | admin-dashboard (/finance/reconciliation/daily-report/:date) |
| POST | /api/v1/finance/commissions/rules | admin-dashboard (/finance/commissions/rules) |
| GET | /api/v1/finance/commissions/rules | admin-dashboard (/finance/commissions/rules) |
| POST | /api/v1/finance/commissions/calculate | admin-dashboard (/finance/commissions/calculate) |
| GET | /api/v1/finance/commissions/report | admin-dashboard (/finance/commissions/report) |
| POST | /api/v1/finance/payouts/generate | admin-dashboard (/finance/payouts/generate) |
| GET | /api/v1/finance/payouts | admin-dashboard (/finance/payouts) |
| GET | /api/v1/finance/payouts/:batchId | admin-dashboard (/finance/payouts/:batchId) |
| PATCH | /api/v1/finance/payouts/:batchId/process | admin-dashboard (/finance/payouts/:batchId/process) |
| GET | /api/v1/finance/payouts/:batchId/export.csv | admin-dashboard (/finance/payouts/:batchId/export.csv) |
| GET | /api/v1/finance/payouts/wallet-statement/:accountId | admin-dashboard (/finance/payouts/wallet-statement/:accountId) |
| GET | /api/v1/finance/payouts/wallet-statement/:accountId/export.csv | admin-dashboard (/finance/payouts/wallet-statement/:accountId/export.csv) |
| GET | /api/v1/finance/reports/sales/export | admin-dashboard (/finance/reports/sales/export) |
| GET | /api/v1/finance/reports/payouts/export | admin-dashboard (/finance/reports/payouts/export) |
| GET | /api/v1/finance/reports/orders/export | admin-dashboard (/finance/reports/orders/export) |
| GET | /api/v1/finance/reports/fees-taxes/export | admin-dashboard (/finance/reports/fees-taxes/export) |
| GET | /api/v1/finance/reports/refunds/export | admin-dashboard (/finance/reports/refunds/export) |
| GET | /api/v1/finance/reports/data-summary | admin-dashboard (/finance/reports/data-summary) |
| POST | /api/v1/finance/reports/validate-consistency | admin-dashboard (/finance/reports/validate-consistency) |
| GET | /api/v1/er/journals | admin-dashboard (/er/journals) |
| GET | /api/v1/er/entries/next-no | admin-dashboard (/er/entries/next-no) |
| GET | /api/v1/er/entries | admin-dashboard (/er/entries) |
| GET | /api/v1/er/entries/:voucherNo | admin-dashboard (/er/entries/:voucherNo) |
| POST | /api/v1/er/entries | admin-dashboard (/er/entries) |
| PUT | /api/v1/er/entries/:voucherNo | admin-dashboard (/er/entries/:voucherNo) |
| POST | /api/v1/er/entries/:voucherNo/post | admin-dashboard (/er/entries/:voucherNo/post) |
| GET | /api/v1/er/payroll/:id | admin-dashboard (/er/payroll/:id) |
| POST | /api/v1/er/payroll | admin-dashboard (/er/payroll) |
| PATCH | /api/v1/er/payroll/:id | admin-dashboard (/er/payroll/:id) |
| DELETE | /api/v1/er/payroll/:id | admin-dashboard (/er/payroll/:id) |
| GET | /api/v1/admin/reports/overview | admin-dashboard (/admin/reports/overview) |
| GET | /api/v1/admin/reports/financial | admin-dashboard (/admin/reports/financial) |
| GET | /api/v1/admin/reports/orders | admin-dashboard (/admin/reports/orders) |
| GET | /api/v1/admin/reports/users | admin-dashboard (/admin/reports/users) |
| GET | /api/v1/admin/reports/vendors | admin-dashboard (/admin/reports/vendors) |
| GET | /api/v1/admin/reports/drivers | admin-dashboard (/admin/reports/drivers) |
| POST | /api/v1/admin/reports/generate | admin-dashboard (/admin/reports/generate) |
| POST | /api/v1/admin/reports/export/:type/:format | admin-dashboard (/admin/reports/export/:type/:format) |
| GET | /api/v1/admin/reports/realtime | admin-dashboard (/admin/reports/realtime) |
| GET | /api/v1/admin/wallet/settlements | admin-dashboard (/admin/wallet/settlements) |
| GET | /api/v1/admin/wallet/settlements/:id | admin-dashboard (/admin/wallet/settlements/:id) |
| PATCH | /api/v1/admin/wallet/settlements/:id/status | admin-dashboard (/admin/wallet/settlements/:id/status) |
| GET | /api/v1/admin/wallet/settlements/stats | admin-dashboard (/admin/wallet/settlements/stats) |
| GET | /api/v1/admin/wallet/settlements/export | admin-dashboard (/admin/wallet/settlements/export) |
| GET | /api/v1/admin/wallet/subscriptions | admin-dashboard (/admin/wallet/subscriptions) |
| GET | /api/v1/admin/wallet/subscriptions/:id | admin-dashboard (/admin/wallet/subscriptions/:id) |
| POST | /api/v1/admin/wallet/subscriptions | admin-dashboard (/admin/wallet/subscriptions) |
| PATCH | /api/v1/admin/wallet/subscriptions/:id | admin-dashboard (/admin/wallet/subscriptions/:id) |
| PATCH | /api/v1/admin/wallet/subscriptions/:id/cancel | admin-dashboard (/admin/wallet/subscriptions/:id/cancel) |
| PATCH | /api/v1/admin/wallet/subscriptions/:id/renew | admin-dashboard (/admin/wallet/subscriptions/:id/renew) |
| DELETE | /api/v1/admin/wallet/subscriptions/:id | admin-dashboard (/admin/wallet/subscriptions/:id) |
| GET | /api/v1/admin/wallet/subscriptions/stats | admin-dashboard (/admin/wallet/subscriptions/stats) |
| GET | /api/v1/admin/wallet/subscriptions/plans | admin-dashboard (/admin/wallet/subscriptions/plans) |
| POST | /api/v1/admin/vendors | admin-dashboard (/admin/vendors) |
| GET | /api/v1/admin/vendors/stats | admin-dashboard (/admin/vendors/stats) |
| GET | /api/v1/admin/vendors/:vendorId/stats | admin-dashboard (/admin/vendors/:vendorId/stats) |
| GET | /api/v1/admin/vendors/:vendorId/performance | admin-dashboard (/admin/vendors/:vendorId/performance) |
| GET | /api/v1/admin/vendors/:vendorId/sales-data | admin-dashboard (/admin/vendors/:vendorId/sales-data) |
| PATCH | /api/v1/admin/vendors/:vendorId/status | admin-dashboard (/admin/vendors/:vendorId/status) |
| PATCH | /api/v1/admin/vendors/:vendorId | admin-dashboard (/admin/vendors/:vendorId) |
| POST | /api/v1/admin/vendors/:vendorId/reset-password | admin-dashboard (/admin/vendors/:vendorId/reset-password) |
| DELETE | /api/v1/admin/vendors/:vendorId | admin-dashboard (/admin/vendors/:vendorId) |
| GET | /api/v1/admin/vendors/export | admin-dashboard (/admin/vendors/export) |
| GET | /api/v1/admin/wallet/transactions | admin-dashboard (/admin/wallet/transactions) |
| GET | /api/v1/admin/wallet/:userId | admin-dashboard (/admin/wallet/:userId) |
| PATCH | /api/v1/admin/wallet/:userId/balance | admin-dashboard (/admin/wallet/:userId/balance) |
| GET | /api/v1/admin/wallet/stats | admin-dashboard (/admin/wallet/stats) |
| GET | /api/v1/admin/me | admin-dashboard (/admin/me) |
| GET | /api/v1/features | admin-dashboard (/features) |
| POST | /api/v1/admin/notifications/campaigns/:_id/audience-preview | admin-dashboard (/admin/notifications/campaigns/:_id/audience-preview) |
| POST | /api/v1/admin/notifications/campaigns/:_id/send | admin-dashboard (/admin/notifications/campaigns/:_id/send) |
| GET | /api/v1/admin/drivers/:id/orders | admin-dashboard (/admin/drivers/:id/orders) |
| GET | /api/v1/admin/drivers/:id/reviews | admin-dashboard (/admin/drivers/:id/reviews) |
| PATCH | /api/v1/admin/drivers/:editingId | admin-dashboard (/admin/drivers/:editingId) |
| PATCH | /api/v1/admin/drivers/:driverId/joker-window | admin-dashboard (/admin/drivers/:driverId/joker-window) |
| GET | /api/v1/api/v1/test/otp/:channel | admin-dashboard (/api/v1/test/otp/:channel) |
| GET | /api/v1/admin/list | admin-dashboard (/admin/list) |
| POST | /api/v1/admin/create | admin-dashboard (/admin/create) |
| GET | /api/v1/admin/:id | admin-dashboard (/admin/:id) |
| PUT | /api/v1/admin/:id | admin-dashboard (/admin/:id) |
| PATCH | /api/v1/admin/:id/status | admin-dashboard (/admin/:id/status) |
| GET | /api/v1/finance/commissions/settings | admin-dashboard (/finance/commissions/settings) |
| GET | /api/v1/finance/commissions/audit-log | admin-dashboard (/finance/commissions/audit-log) |
| POST | /api/v1/finance/commissions/settings | admin-dashboard (/finance/commissions/settings) |
| PUT | /api/v1/groceries/attributes/:editId | admin-dashboard (groceries/attributes/:editId) |
| GET | /api/v1/groceries/attributes/category/:catId | admin-dashboard (groceries/attributes/category/:catId) |
| GET | /api/v1/groceries/catalog?usageType=grocery | admin-dashboard (groceries/catalog?usageType=grocery)<br />admin-dashboard (/groceries/catalog?usageType=grocery) |
| PUT | /api/v1/groceries/catalog/:editId | admin-dashboard (groceries/catalog/:editId) |
| PUT | /api/v1/groceries/categories/:editId | admin-dashboard (groceries/categories/:editId) |
| GET | /api/v1/attributes/category/:categoryId | admin-dashboard (/attributes/category/:categoryId) |
| PUT | /api/v1/groceries/merchant-products/:editId | admin-dashboard (groceries/merchant-products/:editId) |
| GET | /api/v1/admin/users/search | admin-dashboard (/admin/users/search) |
| GET | /api/v1/field/onboarding/queue | admin-dashboard (/field/onboarding/queue) |
| POST | /api/v1/field/onboarding/:id/approve | admin-dashboard (/field/onboarding/:id/approve) |
| POST | /api/v1/field/onboarding/:id/reject | admin-dashboard (/field/onboarding/:id/reject) |
| POST | /api/v1/field/onboarding/:id/needs-fix | admin-dashboard (/field/onboarding/:id/needs-fix) |
| GET | /api/v1/admin/ops/drivers/realtime | admin-dashboard (/admin/ops/drivers/realtime) |
| GET | /api/v1/admin/ops/heatmap | admin-dashboard (/admin/ops/heatmap) |
| POST | /api/v1/admin/ops/drivers/:id/actions | admin-dashboard (/admin/ops/drivers/:id/actions) |
| GET | /api/v1/admin/quality/reviews?:queryParams | admin-dashboard (/admin/quality/reviews?:queryParams) |
| PATCH | /api/v1/admin/quality/reviews/:_id/hide | admin-dashboard (/admin/quality/reviews/:_id/hide) |
| PATCH | /api/v1/admin/quality/reviews/:_id/publish | admin-dashboard (/admin/quality/reviews/:_id/publish) |
| GET | /api/v1/merchant/reports | admin-dashboard (/merchant/reports) |
| GET | /api/v1/reports/marketers/:uid | admin-dashboard (/reports/marketers/:uid)<br />field-marketers (/reports/marketers/:uid) |
| GET | /api/v1/admin/stores | admin-dashboard (/admin/stores) |
| POST | /api/v1/admin/stores/:id/activate | admin-dashboard (/admin/stores/:id/activate) |
| POST | /api/v1/admin/stores/:id/deactivate | admin-dashboard (/admin/stores/:id/deactivate) |
| POST | /api/v1/admin/stores/:id/force-close | admin-dashboard (/admin/stores/:id/force-close) |
| POST | /api/v1/admin/stores/:id/force-open | admin-dashboard (/admin/stores/:id/force-open) |
| PATCH | /api/v1/admin/stores/:id | admin-dashboard (/admin/stores/:id) |
| DELETE | /api/v1/admin/stores/:id | admin-dashboard (/admin/stores/:id) |
| GET | /api/v1/admin/support/tickets?:params | admin-dashboard (/admin/support/tickets?:params) |
| GET | /api/v1/admin/audit-logs?:params | admin-dashboard (/admin/audit-logs?:params) |
| GET | /api/v1/admin/audit-logs/stats | admin-dashboard (/admin/audit-logs/stats) |
| GET | /api/v1/admin/audit-logs/my-actions?limit=3 | admin-dashboard (/admin/audit-logs/my-actions?limit=3) |
| PATCH | /api/v1/admin/vendors/:id/status | admin-dashboard (/admin/vendors/:id/status) |
| POST | /api/v1/admin/vendors/:id/branches | admin-dashboard (/admin/vendors/:id/branches) |
| PATCH | /api/v1/admin/vendors/:id/branches/:branchId | admin-dashboard (/admin/vendors/:id/branches/:branchId) |
| PUT | /api/v1/delivery/banners/:_id | admin-dashboard (/delivery/banners/:_id) |
| GET | /api/v1/delivery/cart/export?abandoned=:showAbandonedOnly | admin-dashboard (/delivery/cart/export?abandoned=:showAbandonedOnly) |
| POST | /api/v1/delivery/cart/:_id/retarget/push | admin-dashboard (/delivery/cart/:_id/retarget/push) |
| PUT | /api/v1/delivery/categories/:_id | admin-dashboard (/delivery/categories/:_id) |
| GET | /api/v1/delivery/categories/export | admin-dashboard (/delivery/categories/export) |
| PUT | /api/v1/delivery/offer/:_id | admin-dashboard (/delivery/offer/:_id) |
| GET | /api/v1/delivery/promotions/admin?status=all | admin-dashboard (/delivery/promotions/admin?status=all) |
| PUT | /api/v1/delivery/promotions/:_id | admin-dashboard (/delivery/promotions/:_id) |
| GET | /api/v1/:MCK_PREFIX/merchant-products | admin-dashboard (:MCK_PREFIX/merchant-products) |
| PUT | /api/v1/delivery/subcategories/:_id | admin-dashboard (/delivery/subcategories/:_id) |
| DELETE | /api/v1/delivery/subcategories/:subId | admin-dashboard (/delivery/subcategories/:subId) |
| PUT | /api/v1/:MCK_PREFIX/merchant-products/:_id | admin-dashboard (:MCK_PREFIX/merchant-products/:_id) |
| PUT | /api/v1/delivery/products/:_id | admin-dashboard (/delivery/products/:_id) |
| DELETE | /api/v1/:MCK_PREFIX/merchant-products/:prodId | admin-dashboard (:MCK_PREFIX/merchant-products/:prodId) |
| DELETE | /api/v1/delivery/products/:prodId | admin-dashboard (/delivery/products/:prodId) |
| PUT | /api/v1/delivery/stores/:_id | admin-dashboard (/delivery/stores/:_id) |
| PUT | /api/v1/pricing-strategies/:_id | admin-dashboard (/pricing-strategies/:_id) |
| GET | /api/v1/delivery/stores/:storeId/stats/:period | admin-dashboard (/delivery/stores/:storeId/stats/:period) |
| PATCH | /api/v1/delivery/order/:orderId/suborders/:subId/assign-driver | admin-dashboard (/delivery/order/:orderId/suborders/:subId/assign-driver) |
| PATCH | /api/v1/delivery/order/:orderId/suborders/:subId/status | admin-dashboard (/delivery/order/:orderId/suborders/:subId/status) |
| PATCH | /api/v1/delivery/order/:orderId/suborders/:subId/pod | admin-dashboard (/delivery/order/:orderId/suborders/:subId/pod) |
| PATCH | /api/v1/delivery/order/:id/procurement | admin-dashboard (/delivery/order/:id/procurement) |
| POST | /api/v1/delivery/order/:orderId/notes | admin-dashboard (/delivery/order/:orderId/notes) |
| GET | /api/v1/delivery/order/:orderId/notes | admin-dashboard (/delivery/order/:orderId/notes) |
| GET | /api/v1/users/:id | admin-dashboard (/users/:id) |
| GET | /api/v1/drivers/health | admin-dashboard (/drivers/health) |
| GET | /api/v1/admin/driver-assets | admin-dashboard (/admin/driver-assets) |
| POST | /api/v1/admin/driver-assets/:assetId/assign | admin-dashboard (/admin/driver-assets/:assetId/assign) |
| POST | /api/v1/admin/driver-assets/:aid/return | admin-dashboard (/admin/driver-assets/:aid/return) |
| GET | /api/v1/drivers/:id/attendance/daily | admin-dashboard (/drivers/:id/attendance/daily) |
| GET | /api/v1/admin/drivers/:id/adjustments | admin-dashboard (/admin/drivers/:id/adjustments) |
| GET | /api/v1/admin/driver-payouts | admin-dashboard (/admin/driver-payouts) |
| POST | /api/v1/admin/drivers/:id/adjustments | admin-dashboard (/admin/drivers/:id/adjustments) |
| PATCH | /api/v1/admin/driver-payouts/:payoutId/approve | admin-dashboard (/admin/driver-payouts/:payoutId/approve) |
| PATCH | /api/v1/admin/driver-payouts/:payId/pay | admin-dashboard (/admin/driver-payouts/:payId/pay) |
| GET | /api/v1/admin/driver-shifts | admin-dashboard (/admin/driver-shifts) |
| PATCH | /api/v1/admin/driver-shifts/:shiftId/mark | admin-dashboard (/admin/driver-shifts/:shiftId/mark) |
| GET | /api/v1/admin/drivers/vacations?:param | admin-dashboard (/admin/drivers/vacations?:param) |
| POST | /api/v1/marketing/adspend/upload | admin-dashboard (/marketing/adspend/upload) |
| GET | /api/v1/marketing/roas | admin-dashboard (/marketing/roas) |
| GET | /api/v1/opening-balance | admin-dashboard (/opening-balance) |
| GET | /api/v1/journal-entries | admin-dashboard (/journal-entries) |
| GET | /api/v1/accounts/chart?onlyLeaf=1 | admin-dashboard (/accounts/chart?onlyLeaf=1) |
| POST | /api/v1/journal-entries | admin-dashboard (/journal-entries) |
| POST | /api/v1/opening-balance | admin-dashboard (/opening-balance) |
| GET | /api/v1/reports/trial-balance | admin-dashboard (/reports/trial-balance) |
| GET | /api/v1/reports/summary | admin-dashboard (/reports/summary) |
| GET | /api/v1/customers/:userId/overview | admin-dashboard (/customers/:userId/overview) |
| GET | /api/v1/support/tickets/:ticketId/messages | admin-dashboard (/support/tickets/:ticketId/messages) |
| POST | /api/v1/support/tickets/:ticketId/messages | admin-dashboard (/support/tickets/:ticketId/messages) |
| POST | /api/v1/admin/dashboard/support-tickets/:ticketId/notes | admin-dashboard (/admin/dashboard/support-tickets/:ticketId/notes) |
| GET | /api/v1/support/reports/summary | admin-dashboard (/support/reports/summary) |
| DELETE | /api/v1/media/delete/:fileName | admin-dashboard (/media/delete/:fileName) |
| GET | /api/v1/groceries/merchant-products/:productId | vendor-app (/groceries/merchant-products/:productId) |
| PUT | /api/v1/groceries/merchant-products/:productId | vendor-app (/groceries/merchant-products/:productId) |
| GET | /api/v1/delivery/stores/:storeId | vendor-app (/delivery/stores/:storeId)<br />bthwani-web (/delivery/stores/:storeId) |
| PUT | /api/v1/delivery/stores/:storeId | vendor-app (/delivery/stores/:storeId) |
| GET | /api/v1/vendor/sales?limit=100 | vendor-app (/vendor/sales?limit=100) |
| POST | /api/v1/driver/availability | rider-app (/driver/availability) |
| GET | /api/v1/driver/offers | rider-app (/driver/offers) |
| POST | /api/v1/driver/offers/:offerId/accept | rider-app (/driver/offers/:offerId/accept) |
| POST | /api/v1/driver/change-password | rider-app (/driver/change-password) |
| POST | /api/v1/rides/sos | rider-app (/rides/sos) |
| POST | /api/v1/:BASE_URL/accounts:signInWithPassword?key=:API_KEY | app-user (:BASE_URL/accounts:signInWithPassword?key=:API_KEY)<br />bthwani-web (:BASE_URL/accounts:signInWithPassword?key=:API_KEY) |
| DELETE | /api/v1/:API_URL/:itemType/:itemId | app-user (:API_URL/:itemType/:itemId)<br />bthwani-web (:API_URL/:itemType/:itemId) |
| GET | /api/v1/:API_URL/exists/:itemType/:itemId | app-user (:API_URL/exists/:itemType/:itemId)<br />bthwani-web (:API_URL/exists/:itemType/:itemId) |
| GET | /api/v1/:API_URL/counts | app-user (:API_URL/counts)<br />bthwani-web (:API_URL/counts) |
| PATCH | /api/v1/users/address/:_id | app-user (/users/address/:_id)<br />bthwani-web (/users/address/:_id) |
| DELETE | /api/v1/users/address/:addressId | app-user (/users/address/:addressId)<br />bthwani-web (/users/address/:addressId) |
| GET | /api/v1/:API_URL/delivery/promotions | app-user (:API_URL/delivery/promotions) |
| GET | /api/v1/:API_URL/delivery/categories?:qs | app-user (:API_URL/delivery/categories?:qs) |
| GET | /api/v1/:API_URL/delivery/categories/children/:parentId?withNumbers=1 | app-user (:API_URL/delivery/categories/children/:parentId?withNumbers=1) |
| GET | /api/v1/:API_URL/delivery/stores:params | app-user (:API_URL/delivery/stores:params) |
| GET | /api/v1/:API_URL/delivery/promotions/by-stores?ids=:param&channel=app | app-user (:API_URL/delivery/promotions/by-stores?ids=:param&channel=app) |
| GET | /api/v1/:API_URL/delivery/stores | app-user (:API_URL/delivery/stores) |
| PUT | /api/v1/delivery/cart/items/:id | app-user (/delivery/cart/items/:id) |
| POST | /api/v1/users/notifications/mark-all-read | app-user (/users/notifications/mark-all-read) |
| POST | /api/v1/users/notifications/:notificationId/read | app-user (/users/notifications/:notificationId/read) |
| POST | /api/v1/:API_URL/users/init | app-user (:API_URL/users/init) |
| GET | /api/v1/:API_URL/users/me | app-user (:API_URL/users/me) |
| POST | /api/v1/:API_URL/users/otp/send | app-user (:API_URL/users/otp/send) |
| POST | /api/v1/:API_URL/users/otp/verify | app-user (:API_URL/users/otp/verify) |
| POST | /api/v1/delivery/order/errand/fee | app-user (/delivery/order/errand/fee)<br />bthwani-web (/delivery/order/errand/fee) |
| GET | /api/v1/:API_URL/delivery/promotions/by-products?ids=:idsParam&channel=app | app-user (:API_URL/delivery/promotions/by-products?ids=:idsParam&channel=app) |
| GET | /api/v1/:API_URL/delivery/stores?categoryId=:categoryId | app-user (:API_URL/delivery/stores?categoryId=:categoryId)<br />bthwani-web (:API_URL/delivery/stores?categoryId=:categoryId) |
| GET | /api/v1/:API_URL/delivery/promotions/by-stores?ids=:idsParam&channel=app | app-user (:API_URL/delivery/promotions/by-stores?ids=:idsParam&channel=app) |
| GET | /api/v1/delivery/categories/children/:parentCategoryId | app-user (/delivery/categories/children/:parentCategoryId) |
| POST | /api/v1/coupons/validate | app-user (/coupons/validate)<br />bthwani-web (/coupons/validate) |
| GET | /api/v1/:API_URL/delivery/promotions/by-products?ids=:param&channel=app | app-user (:API_URL/delivery/promotions/by-products?ids=:param&channel=app) |
| GET | /api/v1/:API_URL/utility/options?city=:param | app-user (:API_URL/utility/options?city=:param) |
| GET | /api/v1/coupons/user | app-user (/coupons/user) |
| GET | /v1/places:autocomplete | app-user (https://places.googleapis.com/v1/places:autocomplete) |
| GET | /v1/places/:pid | app-user (https://places.googleapis.com/v1/places/:pid?languageCode=ar) |
| GET | /v1/geocode:reverse | app-user (https://places.googleapis.com/v1/geocode:reverse) |
| POST | /api/v1/events | app-user (/events) |
| POST | /api/v1/auth/forgot | bthwani-web (/auth/forgot) |
| POST | /api/v1/auth/reset/verify | bthwani-web (/auth/reset/verify) |
| POST | /api/v1/auth/reset | bthwani-web (/auth/reset) |
| POST | /api/v1/auth/verify-otp | bthwani-web (/auth/verify-otp) |
| DELETE | /api/v1/delivery/cart/:productId | bthwani-web (/delivery/cart/:productId) |
| PATCH | /api/v1/delivery/cart/:productId | bthwani-web (/delivery/cart/:productId) |
| DELETE | /api/v1/delivery/cart | bthwani-web (/delivery/cart) |
| PATCH | /api/v1/cms/onboarding/step | bthwani-web (/cms/onboarding/step) |
| PATCH | /api/v1/cms/preferences | bthwani-web (/cms/preferences) |
| GET | /api/v1/cms/pages | bthwani-web (/cms/pages) |
| GET | /api/v1/delivery/products/:productId | bthwani-web (/delivery/products/:productId) |
| GET | /api/v1/merchant/merchant-products/:productId | bthwani-web (/merchant/merchant-products/:productId) |
| GET | /api/v1/delivery/order/:orderId | bthwani-web (/delivery/order/:orderId) |
| PATCH | /api/v1/delivery/order/:orderId/status | bthwani-web (/delivery/order/:orderId/status) |
| POST | /api/v1/delivery/order/:orderId/rate | bthwani-web (/delivery/order/:orderId/rate) |
| POST | /api/v1/errands/order | bthwani-web (/errands/order) |
| GET | /api/v1/errands/user/:userId | bthwani-web (/errands/user/:userId) |
| GET | /api/v1/errands/:errandId | bthwani-web (/errands/:errandId) |
| PATCH | /api/v1/errands/:errandId/status | bthwani-web (/errands/:errandId/status) |
| POST | /api/v1/errands/:errandId/rate | bthwani-web (/errands/:errandId/rate) |
| GET | /api/v1/errands/categories | bthwani-web (/errands/categories) |
| GET | /api/v1/errands/drivers/available | bthwani-web (/errands/drivers/available) |
| GET | /api/v1/grocery/stores | bthwani-web (/grocery/stores) |
| GET | /api/v1/grocery/stores/:storeId | bthwani-web (/grocery/stores/:storeId) |
| GET | /api/v1/grocery/products/search | bthwani-web (/grocery/products/search) |
| GET | /api/v1/grocery/stores/:storeId/products | bthwani-web (/grocery/stores/:storeId/products) |
| GET | /api/v1/grocery/categories | bthwani-web (/grocery/categories) |
| POST | /api/v1/grocery/order | bthwani-web (/grocery/order) |
| GET | /api/v1/grocery/order/user/:userId | bthwani-web (/grocery/order/user/:userId) |
| GET | /api/v1/grocery/order/:orderId | bthwani-web (/grocery/order/:orderId) |
| POST | /api/v1/grocery/order/:orderId/rate | bthwani-web (/grocery/order/:orderId/rate) |
| GET | /api/v1/gas/providers | bthwani-web (/gas/providers) |
| GET | /api/v1/gas/cylinders | bthwani-web (/gas/cylinders) |
| POST | /api/v1/gas/order | bthwani-web (/gas/order) |
| GET | /api/v1/gas/order/user/:userId | bthwani-web (/gas/order/user/:userId) |
| GET | /api/v1/gas/order/:orderId | bthwani-web (/gas/order/:orderId) |
| PATCH | /api/v1/gas/order/:orderId/status | bthwani-web (/gas/order/:orderId/status) |
| POST | /api/v1/gas/order/:orderId/rate | bthwani-web (/gas/order/:orderId/rate) |
| GET | /api/v1/water/providers | bthwani-web (/water/providers) |
| GET | /api/v1/water/bottles | bthwani-web (/water/bottles) |
| POST | /api/v1/water/order | bthwani-web (/water/order) |
| GET | /api/v1/water/order/user/:userId | bthwani-web (/water/order/user/:userId) |
| GET | /api/v1/water/order/:orderId | bthwani-web (/water/order/:orderId) |
| PATCH | /api/v1/water/order/:orderId/status | bthwani-web (/water/order/:orderId/status) |
| POST | /api/v1/water/order/:orderId/rate | bthwani-web (/water/order/:orderId/rate) |
| GET | /api/v1/notifications | bthwani-web (/notifications) |
| POST | /api/v1/notifications/register | bthwani-web (/notifications/register) |
| GET | /api/v1/notifications/unread/count | bthwani-web (/notifications/unread/count) |
| PATCH | /api/v1/notifications/:notificationId/read | bthwani-web (/notifications/:notificationId/read) |
| PATCH | /api/v1/notifications/read-all | bthwani-web (/notifications/read-all) |
| DELETE | /api/v1/notifications/:notificationId | bthwani-web (/notifications/:notificationId) |
| GET | /api/v1/notifications/settings | bthwani-web (/notifications/settings) |
| PATCH | /api/v1/notifications/settings | bthwani-web (/notifications/settings) |
| POST | /api/v1/notifications/test | bthwani-web (/notifications/test) |
| POST | /api/v1/payments/create-session | bthwani-web (/payments/create-session) |
| POST | /api/v1/payments/confirm | bthwani-web (/payments/confirm) |
| GET | /api/v1/utility/orders/user/:userId | bthwani-web (/utility/orders/user/:userId) |
| GET | /api/v1/utility/order/:orderId | bthwani-web (/utility/order/:orderId) |
| PATCH | /api/v1/utility/order/:orderId/status | bthwani-web (/utility/order/:orderId/status) |
| PATCH | /api/v1/utility/order/:orderId/cancel | bthwani-web (/utility/order/:orderId/cancel) |
| POST | /api/v1/utility/order/:orderId/rate | bthwani-web (/utility/order/:orderId/rate) |
| GET | /api/v1/user/profile | bthwani-web (/user/profile) |
| GET | /api/v1/delivery/categories/children/:currentParentId | bthwani-web (/delivery/categories/children/:currentParentId) |
| GET | /api/v1/delivery/deals | bthwani-web (/delivery/deals) |
| GET | /api/v1/delivery/subcategories/store/:_id | bthwani-web (/delivery/subcategories/store/:_id) |