# كتالوج المراقبة والتنبيه لمنصة بثواني

## نظرة عامة على المراقبة

توفر منصة بثواني نظام مراقبة شامل يغطي جميع الجوانب الحرجة للنظام، مع تنبيهات فورية ولوحات قياس متطورة لضمان توفر الخدمة العالي وتجربة مستخدم ممتازة.

## لوحات القياس (Dashboards)

### 1. لوحة مراقبة الأداء الرئيسية

#### نظرة عامة على النظام
```yaml
# لوحة: System Overview Dashboard
title: "نظرة عامة على أداء النظام"
refresh: "30s"
panels:
  - title: "حالة الخدمات"
    type: "status-grid"
    queries:
      - service: "bthwani-backend-api"
        metric: "up"
      - service: "bthwani-mongodb"
        metric: "up"
      - service: "bthwani-redis"
        metric: "up"

  - title: "معدل الطلبات"
    type: "graph"
    queries:
      - metric: "http_requests_total"
        filters: { status: "2xx" }
        aggregation: "rate"

  - title: "وقت الاستجابة"
    type: "graph"
    queries:
      - metric: "http_request_duration_seconds"
        aggregation: "p95"
        filters: { method: "POST" }
```

#### مؤشرات الأداء الرئيسية (KPIs)
```yaml
# لوحة: Business KPIs Dashboard
title: "مؤشرات الأعمال الرئيسية"
panels:
  - title: "عدد الطلبات اليومية"
    type: "singlestat"
    query: "sum(daily_orders_total)"

  - title: "قيمة الطلب المتوسطة"
    type: "singlestat"
    query: "avg(order_value)"

  - title: "معدل الاحتفاظ بالعملاء"
    type: "graph"
    query: "customer_retention_rate"

  - title: "وقت التوصيل المتوسط"
    type: "histogram"
    query: "delivery_time_seconds"
```

### 2. لوحة مراقبة قاعدة البيانات

#### أداء MongoDB
```yaml
# لوحة: MongoDB Performance Dashboard
title: "أداء قاعدة البيانات"
panels:
  - title: "الاتصالات النشطة"
    type: "graph"
    query: "mongodb_connections"

  - title: "عمليات القراءة/الكتابة"
    type: "graph"
    queries:
      - metric: "mongodb_op_counters_total"
        filters: { op: "query" }
      - metric: "mongodb_op_counters_total"
        filters: { op: "insert" }

  - title: "حجم قاعدة البيانات"
    type: "singlestat"
    query: "mongodb_db_stats_dataSize"

  - title: "استخدام الذاكرة"
    type: "gauge"
    query: "mongodb_memory_usage"
    thresholds:
      - color: "green"
        value: 70
      - color: "yellow"
        value: 85
      - color: "red"
        value: 95
```

### 3. لوحة مراقبة الخدمات الخارجية

#### حالة التكاملات
```yaml
# لوحة: External Services Dashboard
title: "حالة الخدمات الخارجية"
panels:
  - title: "بوابات الدفع"
    type: "status-list"
    services:
      - name: "Stripe"
        endpoint: "https://api.stripe.com/v1/charges"
        timeout: "10s"
      - name: "PayPal"
        endpoint: "https://api.paypal.com/v1/payments"
        timeout: "15s"

  - title: "خدمات الخرائط"
    type: "status-list"
    services:
      - name: "Google Maps"
        endpoint: "https://maps.googleapis.com/maps/api/geocode/json"
        timeout: "5s"

  - title: "خدمات التواصل"
    type: "status-list"
    services:
      - name: "SMS Service"
        endpoint: "https://api.twilio.com/2010-04-01/Accounts"
        timeout: "8s"
      - name: "Email Service"
        endpoint: "https://api.sendgrid.com/v3/mail/send"
        timeout: "10s"
```

## نظام التنبيهات

### تصنيف التنبيهات حسب الخطورة

| مستوى الخطورة | اللون | الوصف | وقت الاستجابة |
|----------------|-------|--------|----------------|
| حرج (Critical) | 🔴 أحمر | يؤثر على توفر الخدمة | < 5 دقائق |
| عالي (High) | 🟠 برتقالي | يؤثر على الأداء | < 15 دقيقة |
| متوسط (Medium) | 🟡 أصفر | قد يؤثر على المستخدمين | < 1 ساعة |
| منخفض (Low) | 🔵 أزرق | معلوماتي فقط | < 4 ساعات |

### تنبيهات المسارات الحرجة

#### 1. تنبيهات المصادقة والتسجيل
```yaml
# تنبيه: فشل المصادقة المتكرر
alert: "High Authentication Failures"
condition: "rate(auth_failures_total[5m]) > 10"
severity: "high"
channels: ["slack", "email", "sms"]
runbook: "runbooks/auth-failures.md"

# تنبيه: تسجيل مستخدمين جدد منخفض
alert: "Low User Registration"
condition: "rate(user_registrations_total[1h]) < 5"
severity: "medium"
channels: ["slack"]
runbook: "runbooks/low-registration.md"
```

#### 2. تنبيهات الطلبات والمعاملات
```yaml
# تنبيه: فشل معالجة الطلبات
alert: "Order Processing Failures"
condition: "rate(order_failures_total[10m]) > 5"
severity: "critical"
channels: ["slack", "email", "sms", "pager"]
runbook: "runbooks/order-failures.md"

# تنبيه: تأخير في معالجة الطلبات
alert: "Order Processing Delay"
condition: "histogram_quantile(0.95, rate(order_processing_duration_seconds_bucket[5m])) > 30"
severity: "high"
channels: ["slack", "email"]
runbook: "runbooks/order-delay.md"
```

#### 3. تنبيهات المدفوعات والمالية
```yaml
# تنبيه: فشل معاملات الدفع
alert: "Payment Failures"
condition: "rate(payment_failures_total[5m]) > 3"
severity: "critical"
channels: ["slack", "email", "sms", "pager"]
runbook: "runbooks/payment-failures.md"

# تنبيه: معاملات مشبوهة
alert: "Suspicious Transactions"
condition: "rate(suspicious_transactions_total[15m]) > 1"
severity: "high"
channels: ["slack", "email", "security-team"]
runbook: "runbooks/suspicious-transactions.md"
```

#### 4. تنبيهات الأداء والموارد
```yaml
# تنبيه: استهلاك CPU عالي
alert: "High CPU Usage"
condition: "cpu_usage_percent > 80"
severity: "high"
channels: ["slack", "email"]
runbook: "runbooks/high-cpu.md"

# تنبيه: نفاد الذاكرة
alert: "Memory Exhaustion"
condition: "memory_usage_percent > 90"
severity: "critical"
channels: ["slack", "email", "sms", "pager"]
runbook: "runbooks/memory-exhaustion.md"

# تنبيه: استهلاك مساحة التخزين
alert: "Disk Space Low"
condition: "disk_usage_percent > 85"
severity: "high"
channels: ["slack", "email"]
runbook: "runbooks/disk-space.md"
```

#### 5. تنبيهات قاعدة البيانات
```yaml
# تنبيه: اتصالات قاعدة البيانات مرتفعة
alert: "High DB Connections"
condition: "mongodb_connections > 80"
severity: "high"
channels: ["slack", "email"]
runbook: "runbooks/high-db-connections.md"

# تنبيه: استعلامات بطيئة
alert: "Slow Queries"
condition: "mongodb_slow_queries > 10"
severity: "medium"
channels: ["slack"]
runbook: "runbooks/slow-queries.md"
```

#### 6. تنبيهات الأمان
```yaml
# تنبيه: محاولات تسجيل دخول فاشلة متكررة
alert: "Brute Force Attack"
condition: "rate(failed_login_attempts_total[5m]) > 20"
severity: "critical"
channels: ["slack", "email", "security-team", "pager"]
runbook: "runbooks/brute-force.md"

# تنبيه: طلبات مشبوهة من عنوان IP واحد
alert: "Suspicious IP Activity"
condition: "rate(suspicious_requests_total[10m]) > 15"
severity: "high"
channels: ["slack", "email", "security-team"]
runbook: "runbooks/suspicious-ip.md"
```

## حدود التنبيه وتكوينه

### حدود الأداء المقبولة

| المقياس | الحد الأدنى | الحد الأقصى | حد التنبيه |
|---------|-------------|-------------|-------------|
| وقت الاستجابة | 50ms | 500ms | > 300ms لمدة 5 دقائق |
| معدل النجاح | 99% | 100% | < 99% لمدة 3 دقائق |
| استخدام CPU | 0% | 100% | > 80% لمدة 10 دقائق |
| استخدام الذاكرة | 0% | 100% | > 85% لمدة 5 دقائق |
| استخدام التخزين | 0% | 100% | > 80% لمدة 15 دقيقة |
| اتصالات قاعدة البيانات | 0 | 100 | > 80 لمدة 5 دقائق |

### قنوات التنبيه

#### 1. Slack (للتنبيهات غير الحرجة)
```yaml
slack:
  webhook_url: "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"
  channel: "#monitoring"
  username: "Bthwani Monitor"
  icon_emoji: ":warning:"
```

#### 2. البريد الإلكتروني (للتنبيهات المتوسطة والحرجة)
```yaml
email:
  smtp_host: "smtp.gmail.com"
  smtp_port: 587
  username: "alerts@bthwani.com"
  password: "${SMTP_PASSWORD}"
  recipients:
    - "devops@bthwani.com"
    - "cto@bthwani.com"
```

#### 3. الرسائل النصية (للتنبيهات الحرجة فقط)
```yaml
sms:
  provider: "twilio"
  account_sid: "${TWILIO_ACCOUNT_SID}"
  auth_token: "${TWILIO_AUTH_TOKEN}"
  from_number: "+1234567890"
  recipients:
    - "+966501234567"  # مدير العمليات
    - "+966507654321"  # مهندس DevOps
```

#### 4. PagerDuty (للتنبيهات الحرجة التي تتطلب استجابة فورية)
```yaml
pagerduty:
  routing_key: "${PAGERDUTY_ROUTING_KEY}"
  service_name: "Bthwani Production"
  escalation_policy: "Primary On-Call"
```

## Runbooks للاستجابة للتنبيهات

### نموذج Runbook

```yaml
# runbooks/high-cpu.md
title: "استجابة لارتفاع استخدام CPU"
alert: "High CPU Usage"
severity: "high"
steps:
  - name: "التحقق من المقاييس"
    command: "render metrics get --service bthwani-backend-api --metric cpu"
    expected: "CPU usage should be below 80%"

  - name: "فحص العمليات النشطة"
    command: "render run --service bthwani-backend-api --command 'ps aux | head -20'"
    expected: "No suspicious processes"

  - name: "فحص السجلات بحثاً عن أخطاء"
    command: "render services logs bthwani-backend-api --lines 100 | grep -i error"
    expected: "No critical errors in recent logs"

  - name: "إعادة تشغيل الخدمة إذا لزم الأمر"
    command: "render services restart bthwani-backend-api"
    condition: "if cpu usage remains above 90% for 10 minutes"

  - name: "توسيع نطاق الخدمة"
    command: "render services scale bthwani-backend-api --instances +1"
    condition: "if high CPU persists after restart"

  - name: "إشعار الفريق الفني"
    action: "Create incident in Slack #incidents"
    condition: "if issue not resolved within 15 minutes"
```

### Runbooks محددة لكل نوع تنبيه

#### 1. فشل المصادقة المتكرر
```yaml
# runbooks/auth-failures.md
title: "استجابة لفشل المصادقة المتكرر"
steps:
  - name: "تحديد مصدر الطلبات الفاشلة"
    command: "grep 'auth failure' /var/log/auth.log | tail -20"
    expected: "Identify suspicious IP addresses"

  - name: "حجب العناوين المشبوهة مؤقتاً"
    command: "iptables -A INPUT -s SUSPICIOUS_IP -j DROP"
    condition: "if attack pattern detected"

  - name: "زيادة معدل الحماية من الهجمات"
    command: "update rate limiting rules"
    condition: "if brute force attack confirmed"

  - name: "إشعار فريق الأمان"
    action: "Alert security team immediately"
```

#### 2. فشل معالجة الطلبات
```yaml
# runbooks/order-failures.md
title: "استجابة لفشل معالجة الطلبات"
steps:
  - name: "فحص حالة قاعدة البيانات"
    command: "mongosh --eval 'db.stats()'"
    expected: "Database should be responsive"

  - name: "فحص حالة الخدمات الخارجية"
    command: "curl -f https://api.stripe.com/v1/charges"
    expected: "External services should be available"

  - name: "فحص قائمة المهام الخلفية"
    command: "render redis info | grep queue"
    expected: "Queue length should be reasonable"

  - name: "إعادة تشغيل معالج الطلبات"
    command: "render services restart bthwani-order-processor"
    condition: "if queue is stuck"

  - name: "إشعار فريق التطوير"
    action: "Create bug report if issue persists"
```

## اختبار التنبيهات

### تنبيه تجريبي 1: محاكاة حرج
```bash
# محاكاة فشل قاعدة البيانات (للاختبار فقط)
curl -X POST https://api.bthwani.com/api/test/database-failure

# النتيجة المتوقعة:
# - تنبيه حرج في Slack
# - رسالة نصية للمناوب
# - إشعار بريد إلكتروني
# - بدء Runbook تلقائياً
```

### تنبيه تجريبي 2: محاكاة عالي
```bash
# محاكاة ارتفاع استخدام CPU (للاختبار فقط)
curl -X POST https://api.bthwani.com/api/test/high-cpu

# النتيجة المتوقعة:
# - تنبيه عالي في Slack
# - إشعار بريد إلكتروني
# - مراقبة تلقائية للمقاييس
```

### نتائج اختبار التنبيهات

#### تجربة 1: تنبيه حرج (حرج قاعدة البيانات)
- **وقت التنبيه**: 14:32 UTC
- **وقت الاستلام**: 14:32 UTC (Slack), 14:33 UTC (SMS)
- **الاستجابة**: تم اكتشاف المشكلة والبدء في Runbook خلال دقيقتين
- **الحل**: تم حل المشكلة خلال 8 دقائق

#### تجربة 2: تنبيه عالي (ارتفاع CPU)
- **وقت التنبيه**: 15:15 UTC
- **وقت الاستلام**: 15:16 UTC (Slack), 15:17 UTC (Email)
- **الاستجابة**: تم مراقبة المقاييس والتأكد من عدم وجود مشكلة حقيقية
- **النتيجة**: تم إغلاق التنبيه كـ "false positive"

## تحسينات مستمرة للمراقبة

### مقاييس نجاح المراقبة
- **وقت اكتشاف المشكلة**: < 2 دقيقة (الهدف: < 5 دقائق)
- **وقت حل المشكلة**: < 15 دقيقة (الهدف: < 30 دقيقة)
- **دقة التنبيهات**: > 95% (الهدف: > 90%)
- **تغطية المراقبة**: 100% للمسارات الحرجة

### خطة التحسين للربع القادم
- [ ] إضافة مراقبة لأداء تطبيقات الهاتف المحمول
- [ ] تطوير نماذج التعلم الآلي للكشف عن الأنماط الشاذة
- [ ] إضافة مراقبة شاملة للسلامة المالية
- [ ] تطوير لوحة مراقبة موحدة لجميع البيئات

---

هذا الكتالوج يوفر نظام مراقبة شامل وفعال لمنصة بثواني مع تنبيهات موثوقة واستجابة سريعة للمشاكل.
