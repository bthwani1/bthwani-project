# مصفوفة الصلاحيات والوصول لمنصة بثواني

## نظرة عامة على نظام التحكم في الوصول

تطبق منصة بثواني نظام تحكم في الوصول متعدد الطبقات يعتمد على مبدأ أقل الامتيازات (Least Privilege) مع مراقبة شاملة لجميع العمليات الحساسة.

## هيكل الأدوار والمسؤوليات

### 1. الأدوار الرئيسية في النظام

#### دور العميل (Customer Role)
**المسؤوليات**:
- طلب المنتجات والخدمات
- إدارة الملف الشخصي
- تتبع الطلبات والمدفوعات
- التواصل مع الدعم الفني

**الصلاحيات**:
```yaml
customer_permissions:
  orders:
    - read_own_orders
    - create_order
    - cancel_own_order
    - track_order_status
  profile:
    - read_own_profile
    - update_own_profile
    - upload_avatar
    - manage_addresses
  payments:
    - read_own_payments
    - make_payment
    - view_payment_methods
  support:
    - create_support_ticket
    - read_own_tickets
```

#### دور التاجر (Vendor Role)
**المسؤوليات**:
- إدارة متجرهم ومنتجاتهم
- معالجة الطلبات الواردة
- إدارة المخزون والأسعار
- متابعة التقارير المالية

**الصلاحيات**:
```yaml
vendor_permissions:
  store:
    - manage_own_store
    - update_store_info
    - upload_store_images
    - manage_store_hours
  products:
    - create_product
    - read_own_products
    - update_own_products
    - delete_own_products
    - manage_inventory
  orders:
    - read_vendor_orders
    - update_order_status
    - accept_order
    - reject_order
    - view_order_details
  financial:
    - read_own_earnings
    - view_own_reports
    - request_withdrawal
    - view_payments
```

#### دور السائق (Driver Role)
**المسؤوليات**:
- قبول ورفض طلبات التوصيل
- تحديث حالة الطلبات
- إدارة المدفوعات والأرباح
- متابعة التقييمات

**الصلاحيات**:
```yaml
driver_permissions:
  orders:
    - read_available_orders
    - accept_order
    - reject_order
    - update_order_status
    - view_order_details
    - update_location
  profile:
    - read_own_profile
    - update_own_profile
    - upload_documents
    - manage_vehicle_info
  financial:
    - read_own_earnings
    - request_withdrawal
    - view_own_payments
  ratings:
    - view_own_rating
    - respond_to_reviews
```

#### دور المسوق الميداني (Marketer Role)
**المسؤوليات**:
- جذب العملاء والتجار الجدد
- تنفيذ الحملات التسويقية
- تحليل البيانات وإعداد التقارير

**الصلاحيات**:
```yaml
marketer_permissions:
  campaigns:
    - create_campaign
    - read_own_campaigns
    - update_own_campaigns
    - view_campaign_results
  leads:
    - create_lead
    - update_lead_status
    - assign_lead
    - view_own_leads
  analytics:
    - view_marketing_reports
    - analyze_campaign_performance
  referrals:
    - create_referral_code
    - track_referrals
```

#### دور المشرف (Admin Role)
**المسؤوليات**:
- إدارة شاملة للمنصة والمستخدمين
- مراقبة الأداء والأمان
- إدارة التكوينات والإعدادات

**الصلاحيات**:
```yaml
admin_permissions:
  users:
    - read_all_users
    - update_any_user
    - delete_user
    - manage_user_roles
    - view_user_activity
  vendors:
    - read_all_vendors
    - approve_vendor
    - suspend_vendor
    - manage_vendor_payments
  drivers:
    - read_all_drivers
    - approve_driver
    - suspend_driver
    - manage_driver_documents
  orders:
    - read_all_orders
    - update_any_order
    - cancel_any_order
    - view_order_analytics
  financial:
    - read_all_payments
    - process_refunds
    - view_financial_reports
    - manage_commissions
  system:
    - manage_settings
    - view_system_logs
    - manage_integrations
    - configure_security
```

#### دور المطور (Developer Role)
**المسؤوليات**:
- تطوير وصيانة النظام
- مراقبة الأداء والأخطاء
- نشر التحديثات والإصلاحات

**الصلاحيات**:
```yaml
developer_permissions:
  development:
    - deploy_to_staging
    - view_development_logs
    - access_development_tools
  monitoring:
    - view_application_metrics
    - access_monitoring_tools
    - view_error_reports
  support:
    - read_support_tickets
    - access_customer_data_anonymized
```

### 2. الأدوار الفرعية والتخصصية

#### مدير مالي (Finance Manager)
**الإضافات على صلاحيات المشرف**:
```yaml
finance_manager_permissions:
  extends: "admin"
  financial:
    - manage_all_payments
    - process_all_withdrawals
    - view_detailed_financial_reports
    - manage_tax_settings
    - export_financial_data
```

#### مدير دعم العملاء (Support Manager)
**الإضافات على صلاحيات المشرف**:
```yaml
support_manager_permissions:
  extends: "admin"
  support:
    - manage_all_tickets
    - assign_tickets_to_agents
    - view_customer_communication_history
    - generate_support_reports
    - manage_support_agents
```

#### مهندس أمان (Security Engineer)
**الإضافات على صلاحيات المطور**:
```yaml
security_engineer_permissions:
  extends: "developer"
  security:
    - access_security_logs
    - manage_firewall_rules
    - configure_security_policies
    - run_security_scans
    - manage_encryption_keys
```

## مصفوفة الصلاحيات التفصيلية

### مصفوفة صلاحيات API

| المسار | العميل | التاجر | السائق | المسوق | المشرف | المطور |
|--------|--------|--------|--------|--------|--------|--------|
| `/api/v1/auth/*` | ✅ قراءة/كتابة | ✅ قراءة/كتابة | ✅ قراءة/كتابة | ✅ قراءة/كتابة | ✅ كامل | ❌ |
| `/api/v1/users/profile` | ✅ قراءة/كتابة | ✅ قراءة/كتابة | ✅ قراءة/كتابة | ✅ قراءة/كتابة | ✅ كامل | ❌ |
| `/api/v1/orders` | ✅ قراءة/كتابة | ✅ قراءة/كتابة | ✅ قراءة/كتابة | ❌ | ✅ كامل | ❌ |
| `/api/v1/orders/{id}` | ✅ قراءة/كتابة | ✅ قراءة/كتابة | ✅ قراءة/كتابة | ❌ | ✅ كامل | ❌ |
| `/api/v1/vendors/*` | ❌ | ✅ قراءة/كتابة | ❌ | ❌ | ✅ كامل | ❌ |
| `/api/v1/drivers/*` | ❌ | ❌ | ✅ قراءة/كتابة | ❌ | ✅ كامل | ❌ |
| `/api/v1/admin/*` | ❌ | ❌ | ❌ | ❌ | ✅ كامل | ✅ قراءة |
| `/api/v1/payments/*` | ✅ قراءة/كتابة | ✅ قراءة | ✅ قراءة | ❌ | ✅ كامل | ❌ |
| `/api/v1/support/*` | ✅ قراءة/كتابة | ✅ قراءة/كتابة | ✅ قراءة/كتابة | ✅ قراءة | ✅ كامل | ✅ قراءة |

### مصفوفة صلاحيات قاعدة البيانات

| الجدول | العميل | التاجر | السائق | المسوق | المشرف | المطور |
|--------|--------|--------|--------|--------|--------|--------|
| `users` | قراءة نفسه | قراءة نفسه | قراءة نفسه | قراءة نفسه | كامل | قراءة |
| `orders` | قراءة طلباته | قراءة طلبات متجره | قراءة طلباته | ❌ | كامل | قراءة |
| `products` | قراءة الكل | كتابة منتجاته | ❌ | ❌ | كامل | قراءة |
| `drivers` | ❌ | ❌ | قراءة بياناته | ❌ | كامل | قراءة |
| `vendors` | ❌ | قراءة بياناته | ❌ | ❌ | كامل | قراءة |
| `payments` | قراءة مدفوعاته | قراءة مدفوعات متجره | قراءة أرباحه | ❌ | كامل | قراءة |
| `audit_logs` | ❌ | ❌ | ❌ | ❌ | قراءة | قراءة |
| `system_settings` | ❌ | ❌ | ❌ | ❌ | كامل | قراءة |

## آليات الموافقات والتفويض

### 1. نظام الموافقات متعددة المستويات

#### موافقات الطلبات المالية الكبرى
```yaml
approval_workflow:
  high_value_orders:
    threshold: "1000 SAR"
    levels:
      - level: 1
        role: "vendor_manager"
        action: "review"
        auto_approve: false
      - level: 2
        role: "finance_manager"
        action: "approve"
        auto_approve: false
      - level: 3
        role: "cto"
        action: "final_approve"
        auto_approve: true

  refunds:
    threshold: "500 SAR"
    levels:
      - level: 1
        role: "support_manager"
        action: "review"
      - level: 2
        role: "finance_manager"
        action: "approve"
```

#### نظام الموافقات للتغييرات الحساسة
```javascript
// مثال على نظام موافقات لتغيير كلمة المرور
const passwordChangeApproval = async (userId, newPassword) => {
  const user = await User.findById(userId)

  if (user.role === 'admin' || user.role === 'finance_manager') {
    // إشعار المشرف الأعلى للموافقة
    await sendApprovalRequest({
      requesterId: userId,
      action: 'password_change',
      details: { timestamp: new Date() },
      approvers: ['super_admin']
    })

    // انتظار الموافقة لمدة 24 ساعة
    const approval = await waitForApproval('password_change', userId, 24 * 60 * 60 * 1000)

    if (approval.status === 'approved') {
      await updatePassword(userId, newPassword)
    } else {
      throw new Error('Password change requires approval')
    }
  } else {
    // تغيير مباشر للمستخدمين العاديين
    await updatePassword(userId, newPassword)
  }
}
```

### 2. نظام التفويض المؤقت

#### تفويض الصلاحيات المؤقتة
```yaml
temporary_delegation:
  - delegate: "support_agent_1"
    delegator: "support_manager"
    permissions:
      - read_all_tickets
      - update_ticket_status
      - respond_to_customers
    duration: "8 ساعات"
    reason: "إجازة مدير الدعم"
    approved_by: "cto"

  - delegate: "junior_dev"
    delegator: "senior_dev"
    permissions:
      - deploy_to_staging
      - view_production_logs
    duration: "2 أسابيع"
    reason: "تدريب المطور الجديد"
    approved_by: "tech_lead"
```

## نظام سجلات التدقيق (Audit Logging)

### 1. هيكل سجل التدقيق

#### سجل تدقيق شامل
```json
{
  "id": "audit_abc123def456",
  "timestamp": "2025-01-10T14:30:25.123Z",
  "userId": "user_xyz789",
  "sessionId": "session_123abc",
  "role": "admin",
  "action": "update_user_role",
  "resource": "users",
  "resourceId": "user_456def",
  "details": {
    "oldRole": "vendor",
    "newRole": "admin",
    "reason": "ترقية بناءً على الأداء"
  },
  "ipAddress": "192.168.1.100",
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "location": "Riyadh, Saudi Arabia",
  "riskScore": 0.2,
  "approvedBy": "super_admin",
  "approvalId": "approval_789ghi"
}
```

### 2. فئات سجلات التدقيق

#### سجلات المصادقة والوصول
```json
{
  "category": "authentication",
  "action": "login_success",
  "details": {
    "method": "jwt",
    "mfaUsed": true,
    "deviceId": "device_123",
    "riskScore": 0.1
  }
}
```

#### سجلات العمليات المالية
```json
{
  "category": "financial",
  "action": "payment_processed",
  "details": {
    "amount": 150.00,
    "currency": "SAR",
    "paymentMethod": "credit_card",
    "merchantId": "merchant_456",
    "commission": 7.50
  }
}
```

#### سجلات تغييرات النظام
```json
{
  "category": "system",
  "action": "config_updated",
  "details": {
    "configKey": "payment_gateway_timeout",
    "oldValue": "30",
    "newValue": "60",
    "reason": "تحسين تجربة الدفع"
  }
}
```

#### سجلات الأمان والحماية
```json
{
  "category": "security",
  "action": "suspicious_activity_detected",
  "details": {
    "activityType": "multiple_failed_logins",
    "ipAddress": "203.0.113.1",
    "attempts": 15,
    "timeframe": "5 دقائق",
    "actionTaken": "ip_blocked"
  }
}
```

### 3. تخزين وأرشفة سجلات التدقيق

#### تخزين آمن للسجلات
```javascript
// تخزين سجلات التدقيق مع التشفير
const storeAuditLog = async (auditData) => {
  const encryptedData = encryptSensitiveData(auditData)
  const hashedData = createIntegrityHash(auditData)

  await AuditLog.create({
    ...encryptedData,
    integrityHash: hashedData,
    retentionPeriod: calculateRetentionPeriod(auditData.category),
    compliance: checkComplianceRequirements(auditData)
  })
}
```

#### أرشفة السجلات طويلة الأمد
```yaml
audit_archiving:
  retention_periods:
    authentication_logs: "7 سنوات"
    financial_transactions: "7 سنوات"
    security_incidents: "10 سنوات"
    system_changes: "5 سنوات"
    user_activity: "2 سنوات"

  archival_destinations:
    - type: "aws_glacier"
      category: ["financial_transactions", "security_incidents"]
      retrieval_time: "1-5 ساعات"
    - type: "encrypted_s3"
      category: ["authentication_logs", "system_changes"]
      retrieval_time: "دقائق"
```

## المصادقة متعددة العوامل (MFA)

### 1. تفعيل MFA إلزامي للحسابات الحساسة

#### قائمة الحسابات التي تتطلب MFA إلزامياً
```yaml
mfa_required_roles:
  - "admin"
  - "finance_manager"
  - "support_manager"
  - "security_engineer"
  - "system_admin"
  - "database_admin"

mfa_enforcement:
  enforcement_date: "2025-01-01"
  grace_period: "30 يوم"
  exceptions:
    - reason: "حساب مؤقت للاختبار"
      approved_by: "cto"
      expiry_date: "2025-02-01"
```

### 2. أنواع MFA المدعومة

#### MFA بالرسائل النصية (SMS)
```javascript
// إعداد MFA عبر SMS
const setupSMSMFA = async (userId) => {
  const secret = speakeasy.generateSecret()
  const phoneNumber = await getUserPhoneNumber(userId)

  // إرسال رمز التحقق
  await sendSMS(phoneNumber, `رمز التحقق: ${secret.base32.slice(0, 6)}`)

  // حفظ السر في قاعدة البيانات
  await User.updateOne(
    { _id: userId },
    {
      mfaType: 'sms',
      mfaSecret: secret.base32,
      mfaEnabled: true
    }
  )
}
```

#### MFA بالتطبيق المصدق (TOTP)
```javascript
// إعداد MFA عبر تطبيق مصدق
const setupTOTPMFA = async (userId) => {
  const secret = speakeasy.generateSecret({
    name: 'Bthwani (' + userId + ')',
    issuer: 'Bthwani Platform'
  })

  // إنشاء رمز QR
  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url)

  // حفظ السر
  await User.updateOne(
    { _id: userId },
    {
      mfaType: 'totp',
      mfaSecret: secret.base32,
      mfaEnabled: true
    }
  )

  return { qrCodeUrl, secret: secret.base32 }
}
```

#### MFA بالأجهزة (Hardware Tokens)
```javascript
// إعداد MFA بالأجهزة المادية
const setupHardwareMFA = async (userId, deviceSerial) => {
  // التحقق من صحة الجهاز
  const isValidDevice = await validateHardwareToken(deviceSerial)

  if (!isValidDevice) {
    throw new Error('Invalid hardware token')
  }

  await User.updateOne(
    { _id: userId },
    {
      mfaType: 'hardware',
      mfaDeviceSerial: deviceSerial,
      mfaEnabled: true
    }
  )
}
```

### 3. مراقبة استخدام MFA

#### لوحة مراقبة MFA
```yaml
# لوحة مراقبة حالة MFA
mfa_dashboard:
  total_users: 1250
  mfa_enabled: 380
  mfa_percentage: 30.4
  mfa_required_but_disabled: 12
  mfa_violations_this_month: 3

  by_role:
    admin: "45/50 (90%)"
    finance_manager: "8/8 (100%)"
    support_manager: "15/18 (83%)"
    security_engineer: "5/5 (100%)"
```

#### تنبيهات MFA
```yaml
mfa_alerts:
  - name: "MFA Disabled for Sensitive Account"
    condition: "mfa_enabled = false AND role IN (admin, finance_manager)"
    severity: "high"
    action: "إشعار المشرف + تعطيل الحساب مؤقتاً"

  - name: "Multiple MFA Failures"
    condition: "mfa_failures > 3 in 10 minutes"
    severity: "medium"
    action: "زيادة متطلبات المصادقة مؤقتاً"

  - name: "MFA Setup Incomplete"
    condition: "mfa_required = true AND mfa_enabled = false for 7 days"
    severity: "medium"
    action: "إرسال تذكير + تعطيل الحساب"
```

## آليات مراقبة الامتثال

### 1. تقارير الامتثال التلقائية

#### تقرير الامتثال الشهري
```javascript
// إنشاء تقرير امتثال شهري
const generateComplianceReport = async (month, year) => {
  const report = {
    period: `${year}-${month}`,
    totalUsers: await User.countDocuments(),
    mfaCompliance: await calculateMFACompliance(),
    accessViolations: await countAccessViolations(month, year),
    auditCoverage: await calculateAuditCoverage(),
    securityIncidents: await countSecurityIncidents(month, year)
  }

  // حفظ التقرير
  await ComplianceReport.create(report)

  // إرسال للجهات المعنية
  await sendComplianceReport(report)

  return report
}
```

### 2. مراقبة الامتثال في الوقت الفعلي

#### مراقبة الوصول غير المصرح به
```javascript
// مراقبة محاولات الوصول غير المصرح به
const monitorUnauthorizedAccess = async (req, res, next) => {
  const user = req.user
  const resource = req.path
  const action = req.method

  // التحقق من الصلاحية
  const hasPermission = await checkPermission(user.role, resource, action)

  if (!hasPermission) {
    // تسجيل محاولة الوصول غير المصرح بها
    await UnauthorizedAccess.create({
      userId: user.id,
      resource,
      action,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date(),
      riskScore: calculateRiskScore(user, resource, action)
    })

    // إشعار فريق الأمان إذا كانت محاولة مشبوهة
    if (await isSuspiciousActivity(user, resource, action)) {
      await alertSecurityTeam({
        type: 'unauthorized_access',
        userId: user.id,
        resource,
        riskLevel: 'high'
      })
    }

    return res.status(403).json({ error: 'Access denied' })
  }

  next()
}
```

## خطة الصيانة والمراجعة

### 1. مراجعة الصلاحيات ربع سنوياً

#### أهداف المراجعة:
- [ ] تقييم دقة الصلاحيات الممنوحة
- [ ] مراجعة سجلات التدقيق بحثاً عن أنماط مشبوهة
- [ ] تحديث الأدوار حسب احتياجات الأعمال
- [ ] ضمان امتثال جميع الحسابات لمتطلبات MFA

#### تقرير مراجعة الصلاحيات (يناير 2025)
```yaml
permissions_review_q1_2025:
  total_users_reviewed: 1250
  permission_changes: 45
  violations_found: 3
  mfa_compliance: 94.2
  recommendations:
    - "إضافة دور جديد لمديري المنتجات"
    - "تشديد صلاحيات الوصول للبيانات المالية"
    - "تحسين آلية مراجعة الصلاحيات التلقائية"
```

### 2. اختبارات أمان الوصول الدورية

#### اختبار اختراق الصلاحيات
```javascript
// اختبار تلقائي للصلاحيات
const testPermissionsSecurity = async () => {
  const testCases = [
    {
      userRole: 'customer',
      testPath: '/api/v1/admin/users',
      expectedStatus: 403
    },
    {
      userRole: 'vendor',
      testPath: '/api/v1/drivers/earnings',
      expectedStatus: 403
    },
    {
      userRole: 'admin',
      testPath: '/api/v1/admin/users',
      expectedStatus: 200
    }
  ]

  for (const testCase of testCases) {
    const response = await makeAuthenticatedRequest(testCase.testPath, testCase.userRole)
    if (response.status !== testCase.expectedStatus) {
      throw new Error(`Permission test failed for ${testCase.userRole} on ${testCase.testPath}`)
    }
  }
}
```

#### اختبار MFA
```javascript
// اختبار فعالية MFA
const testMFAEffectiveness = async () => {
  const mfaRequiredUsers = await User.find({ mfaRequired: true })

  for (const user of mfaRequiredUsers) {
    // محاولة تسجيل دخول بدون MFA
    const loginWithoutMFA = await attemptLogin(user.phone, user.password)

    if (loginWithoutMFA.success) {
      throw new Error(`MFA not enforced for user ${user.id}`)
    }

    // محاولة تسجيل دخول مع MFA صحيح
    const loginWithMFA = await attemptLoginWithMFA(user.phone, user.password, 'correct_otp')

    if (!loginWithMFA.success) {
      throw new Error(`MFA verification failed for user ${user.id}`)
    }
  }
}
```

## مؤشرات نجاح نظام التحكم في الوصول

### مقاييس الأمان الرئيسية
| المقياس | الهدف | الحالة الحالية | اتجاه التغيير |
|---------|-------|----------------|----------------|
| تغطية MFA للحسابات الحساسة | 100% | 94.2% | متزايد |
| انتهاكات الصلاحيات شهرياً | 0 | 3 | متناقص |
| وقت اكتشاف الانتهاكات | < 5 دقائق | 2 دقائق | متناقص |
| دقة سجلات التدقيق | 100% | 99.8% | مستقر |
| تغطية المراجعة ربع سنوياً | 100% | 100% | مستقر |

---

هذه المصفوفة توفر نظام تحكم في الوصول شامل وآمن لمنصة بثواني مع ضمان الامتثال لأعلى معايير الأمان والحوكمة.
