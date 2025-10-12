# استراتيجية السجلات وسياسة الاحتفاظ لمنصة بثواني

## نظرة عامة على استراتيجية السجلات

تتبع منصة بثواني استراتيجية سجلات شاملة ومنظمة تضمن تتبع جميع العمليات الحرجة، مع إمكانية التتبع الكامل للمعاملات عبر جميع طبقات النظام.

## التنسيق الموحد للسجلات

### هيكل السجل القياسي

#### 1. الحقول الأساسية المطلوبة في كل سجل
```json
{
  "timestamp": "2025-01-10T14:30:25.123Z",
  "level": "info",
  "service": "bthwani-backend-api",
  "version": "2.1.0",
  "environment": "production",
  "traceId": "trace_abc123def456",
  "spanId": "span_xyz789",
  "parentSpanId": "span_parent123",
  "userId": "user_123456",
  "sessionId": "session_789abc",
  "requestId": "req_def456ghi789",
  "correlationId": "corr_jkl012mno345",
  "message": "User successfully logged in",
  "category": "authentication",
  "operation": "login",
  "duration": 245,
  "status": "success",
  "metadata": {
    "userAgent": "Mozilla/5.0...",
    "ipAddress": "192.168.1.100",
    "deviceId": "device_123",
    "location": "Riyadh, Saudi Arabia"
  },
  "context": {
    "module": "auth",
    "function": "login",
    "file": "auth.controller.ts",
    "line": 156
  },
  "performance": {
    "cpuUsage": 45.2,
    "memoryUsage": 67.8,
    "responseTime": 245
  },
  "security": {
    "authMethod": "jwt",
    "mfaUsed": false,
    "riskScore": 0.1
  }
}
```

#### 2. مستويات السجلات

| المستوى | القيمة الرقمية | الوصف | متى يُستخدم |
|---------|----------------|--------|-------------|
| `trace` | 10 | معلومات تتبع مفصلة | تتبع مسار التنفيذ |
| `debug` | 20 | معلومات تشخيصية | تطوير وتشخيص الأخطاء |
| `info` | 30 | معلومات عامة | عمليات طبيعية مهمة |
| `warn` | 40 | تحذيرات | مشاكل محتملة |
| `error` | 50 | أخطاء | أخطاء في التنفيذ |
| `fatal` | 60 | أخطاء حرجة | فشل كامل في النظام |

### 3. فئات السجلات حسب الوظيفة

#### فئة المصادقة والأمان (`auth`)
```json
{
  "timestamp": "2025-01-10T14:30:25.123Z",
  "level": "info",
  "category": "auth",
  "operation": "login_success",
  "message": "User logged in successfully",
  "security": {
    "userId": "user_123456",
    "authMethod": "jwt",
    "mfaUsed": false,
    "ipAddress": "192.168.1.100",
    "userAgent": "Mozilla/5.0...",
    "riskScore": 0.1
  }
}
```

#### فئة الطلبات والمعاملات (`orders`)
```json
{
  "timestamp": "2025-01-10T14:31:15.456Z",
  "level": "info",
  "category": "orders",
  "operation": "order_created",
  "message": "New order created successfully",
  "business": {
    "orderId": "order_abc123",
    "customerId": "user_123456",
    "vendorId": "vendor_789xyz",
    "totalAmount": 150.00,
    "currency": "SAR",
    "itemCount": 3
  }
}
```

#### فئة المدفوعات (`payments`)
```json
{
  "timestamp": "2025-01-10T14:32:05.789Z",
  "level": "info",
  "category": "payments",
  "operation": "payment_processed",
  "message": "Payment processed successfully",
  "financial": {
    "paymentId": "pay_def456",
    "orderId": "order_abc123",
    "amount": 150.00,
    "currency": "SAR",
    "method": "credit_card",
    "status": "completed",
    "gateway": "stripe"
  }
}
```

#### فئة الأداء (`performance`)
```json
{
  "timestamp": "2025-01-10T14:33:00.000Z",
  "level": "warn",
  "category": "performance",
  "operation": "slow_query",
  "message": "Database query took longer than expected",
  "performance": {
    "queryTime": 500,
    "threshold": 200,
    "query": "SELECT * FROM orders WHERE status = ?",
    "database": "mongodb",
    "collection": "orders"
  }
}
```

## نظام التتبع والارتباط (Tracing & Correlation)

### 1. معرفات التتبع الرئيسية

#### Trace ID
- **الغرض**: تتبع معاملة واحدة عبر جميع الخدمات
- **التنسيق**: `trace_[a-f0-9]{16}`
- **مثال**: `trace_a1b2c3d4e5f6g7h8`

#### Span ID
- **الغرض**: تتبع عملية فرعية داخل Trace واحد
- **التنسيق**: `span_[a-f0-9]{16}`
- **مثال**: `span_i9j0k1l2m3n4o5p6`

#### Request ID
- **الغرض**: تتبع طلب HTTP واحد
- **التنسيق**: `req_[a-f0-9]{16}`
- **مثال**: `req_q7r8s9t0u1v2w3x4`

#### Correlation ID
- **الغرض**: ربط معاملات متعددة متعلقة
- **التنسيق**: `corr_[a-f0-9]{16}`
- **مثال**: `corr_y5z6a7b8c9d0e1f2`

### 2. مثال على تتبع معاملة كاملة

#### بداية المعاملة في تطبيق الويب
```json
{
  "timestamp": "2025-01-10T14:30:00.000Z",
  "level": "info",
  "service": "bthwani-web-app",
  "traceId": "trace_a1b2c3d4e5f6g7h8",
  "spanId": "span_i9j0k1l2m3n4o5p6",
  "requestId": "req_q7r8s9t0u1v2w3x4",
  "correlationId": "corr_y5z6a7b8c9d0e1f2",
  "category": "user_action",
  "operation": "add_to_cart",
  "message": "User added item to cart"
}
```

#### استمرار المعاملة في خدمة API
```json
{
  "timestamp": "2025-01-10T14:30:01.123Z",
  "level": "info",
  "service": "bthwani-backend-api",
  "traceId": "trace_a1b2c3d4e5f6g7h8",
  "spanId": "span_parent123",
  "requestId": "req_q7r8s9t0u1v2w3x4",
  "correlationId": "corr_y5z6a7b8c9d0e1f2",
  "category": "api_request",
  "operation": "cart_update",
  "message": "Cart updated in database"
}
```

#### إتمام المعاملة في قاعدة البيانات
```json
{
  "timestamp": "2025-01-10T14:30:01.456Z",
  "level": "info",
  "service": "bthwani-backend-api",
  "traceId": "trace_a1b2c3d4e5f6g7h8",
  "spanId": "span_db123",
  "parentSpanId": "span_parent123",
  "requestId": "req_q7r8s9t0u1v2w3x4",
  "correlationId": "corr_y5z6a7b8c9d0e1f2",
  "category": "database",
  "operation": "insert_cart_item",
  "message": "Cart item inserted successfully",
  "performance": {
    "queryTime": 12,
    "rowsAffected": 1
  }
}
```

## مواقع تجميع السجلات

### 1. تخزين السجلات المحلي

#### في الحاويات (Container Logs)
```yaml
# إعدادات السجلات في Docker/Render
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
    labels: "bthwani-app"
```

#### في الخادم المحلي (Server Logs)
```bash
# مسارات السجلات المحلية
/var/log/bthwani/
├── app.log           # سجلات التطبيق الرئيسية
├── access.log        # سجلات الوصول
├── error.log         # سجلات الأخطاء
├── security.log      # سجلات الأمان
└── audit.log         # سجلات المراجعة
```

### 2. منصات تجميع السجلات السحابية

#### Elasticsearch + Kibana
```yaml
# إعدادات Elasticsearch
elasticsearch:
  hosts: ["https://es.bthwani.com:9200"]
  index: "bthwani-logs-%Y.%m.%d"
  authentication:
    username: "${ES_USERNAME}"
    password: "${ES_PASSWORD}"
```

#### AWS CloudWatch Logs
```yaml
# إعدادات CloudWatch
cloudwatch:
  logGroup: "/aws/bthwani/production"
  region: "us-east-1"
  retention: 30  # أيام
```

#### Google Cloud Logging
```yaml
# إعدادات Google Cloud Logging
gcp_logging:
  project_id: "bthwani-production"
  log_name: "bthwani-app"
```

## سياسة الاحتفاظ بالسجلات

### جدول مدة الاحتفاظ حسب نوع السجل

| نوع السجل | مدة الاحتفاظ | السبب | موقع التخزين |
|-----------|---------------|--------|---------------|
| سجلات التطبيق (info) | 30 يوم | مراقبة الأداء والتشخيص | Elasticsearch محلي |
| سجلات الأخطاء | 90 يوم | تحليل الأخطاء والمشاكل | Elasticsearch محلي + Cloud |
| سجلات الأمان | 1 سنة | متطلبات الامتثال | Cloud محصن + نسخ احتياطية |
| سجلات المراجعة | 7 سنوات | متطلبات قانونية ومالية | Cloud محصن + نسخ احتياطية |
| سجلات قاعدة البيانات | 30 يوم | مراقبة أداء قاعدة البيانات | MongoDB profiler |
| سجلات الشبكة | 60 يوم | مراقبة الأمان والأداء | Cloud محصن |

### آلية التنظيف التلقائي

#### 1. تنظيف السجلات المحلية
```bash
# سكريبت يومي لتنظيف السجلات القديمة
#!/bin/bash
# /scripts/cleanup-logs.sh

LOG_DIR="/var/log/bthwani"
RETENTION_DAYS=${1:-30}

# حذف السجلات القديمة من 30 يوم
find $LOG_DIR -name "*.log" -type f -mtime +$RETENTION_DAYS -delete

# ضغط السجلات القديمة
find $LOG_DIR -name "*.log" -type f -mtime +7 -exec gzip {} \;

echo "Log cleanup completed at $(date)"
```

#### 2. تنظيف السجلات في Elasticsearch
```javascript
// سكريبت لتنظيف السجلات القديمة في Elasticsearch
const { Client } = require('@elastic/elasticsearch')

const client = new Client({
  node: process.env.ELASTICSEARCH_URL
})

async function cleanupOldLogs() {
  const indexPattern = 'bthwani-logs-*'
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - 30) // 30 يوم

  await client.indices.delete({
    index: `${indexPattern}-*`,
    body: {
      query: {
        range: {
          timestamp: {
            lt: cutoffDate.toISOString()
          }
        }
      }
    }
  })
}
```

## بحث وتحليل السجلات

### 1. مثال بحث يربط بين الواجهة والخلفية

#### سيناريو: تتبع طلب من الويب للدفع

**البحث في Elasticsearch**:
```json
{
  "query": {
    "bool": {
      "must": [
        {
          "term": {
            "traceId": "trace_a1b2c3d4e5f6g7h8"
          }
        }
      ],
      "should": [
        {
          "term": {
            "service": "bthwani-web-app"
          }
        },
        {
          "term": {
            "service": "bthwani-backend-api"
          }
        },
        {
          "term": {
            "service": "payment-gateway"
          }
        }
      ],
      "minimum_should_match": 1
    }
  },
  "sort": [
    {
      "timestamp": {
        "order": "asc"
      }
    }
  ]
}
```

**نتيجة البحث**:
```json
{
  "hits": [
    {
      "_source": {
        "timestamp": "2025-01-10T14:30:00.000Z",
        "service": "bthwani-web-app",
        "traceId": "trace_a1b2c3d4e5f6g7h8",
        "operation": "initiate_payment",
        "message": "User initiated payment process"
      }
    },
    {
      "_source": {
        "timestamp": "2025-01-10T14:30:01.123Z",
        "service": "bthwani-backend-api",
        "traceId": "trace_a1b2c3d4e5f6g7h8",
        "operation": "create_payment_intent",
        "message": "Payment intent created in Stripe"
      }
    },
    {
      "_source": {
        "timestamp": "2025-01-10T14:30:02.456Z",
        "service": "payment-gateway",
        "traceId": "trace_a1b2c3d4e5f6g7h8",
        "operation": "process_payment",
        "message": "Payment processed successfully",
        "financial": {
          "amount": 150.00,
          "status": "completed"
        }
      }
    }
  ]
}
```

### 2. لوحات مراقبة السجلات

#### لوحة مراقبة الأخطاء
```yaml
# لوحة: Error Monitoring Dashboard
title: "مراقبة الأخطاء والمشاكل"
panels:
  - title: "معدل الأخطاء بالساعة"
    type: "graph"
    query: "rate(error_logs_total[1h])"
    thresholds:
      - color: "green"
        value: 1
      - color: "yellow"
        value: 5
      - color: "red"
        value: 10

  - title: "أكثر الأخطاء شيوعاً"
    type: "table"
    query: "topk(10, error_messages)"
    columns: ["message", "count", "last_seen"]

  - title: "توزيع الأخطاء حسب الخدمة"
    type: "pie"
    query: "error_logs_total by service"
```

#### لوحة مراقبة الأداء
```yaml
# لوحة: Performance Monitoring Dashboard
title: "مراقبة الأداء"
panels:
  - title: "وقت الاستجابة المتوسط"
    type: "graph"
    query: "avg(response_time_seconds)"

  - title: "طلبات بطيئة"
    type: "table"
    query: "slow_requests where duration > 1000ms"
    columns: ["endpoint", "duration", "timestamp", "user_id"]

  - title: "استخدام الموارد"
    type: "graph"
    queries:
      - metric: "cpu_usage_percent"
      - metric: "memory_usage_percent"
```

## أدوات وأنظمة السجلات المستخدمة

### 1. Winston للتطبيقات Node.js
```javascript
// إعداد Winston في Backend
const winston = require('winston')

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] })
  ),
  defaultMeta: {
    service: 'bthwani-backend-api',
    version: process.env.APP_VERSION
  },
  transports: [
    // سجلات محلية
    new winston.transports.File({
      filename: 'logs/app.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // سجلات أخطاء منفصلة
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880,
      maxFiles: 10
    }),
    // سجلات أمان منفصلة
    new winston.transports.File({
      filename: 'logs/security.log',
      level: 'warn',
      maxsize: 5242880,
      maxFiles: 30
    }),
    // إرسال لـ Elasticsearch
    new winston.transports.Http({
      host: process.env.ELASTICSEARCH_URL,
      path: '/_bulk',
      ssl: true
    })
  ]
})
```

### 2. Sentry لمراقبة الأخطاء المتقدمة
```javascript
// إعداد Sentry
import * as Sentry from '@sentry/node'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  beforeSend(event) {
    // تصفية السجلات الحساسة
    if (event.exception) {
      event.exception.values[0].stacktrace.frames.forEach(frame => {
        if (frame.filename.includes('password') || frame.filename.includes('token')) {
          frame.filename = '[FILTERED]'
        }
      })
    }
    return event
  }
})
```

### 3. MongoDB Profiler لسجلات قاعدة البيانات
```javascript
// تفعيل MongoDB Profiler
db.setProfilingLevel(1, { slowms: 100 })

// استعلام السجلات البطيئة
db.system.profile.find({
  millis: { $gt: 100 },
  ts: { $gt: new Date(Date.now() - 24*60*60*1000) }
}).sort({ millis: -1 }).limit(10)
```

## الامتثال والأمان في السجلات

### 1. تصفية البيانات الحساسة

#### قائمة الحقول التي يجب تصفيتها:
- كلمات المرور (`password`, `pwd`, `pass`)
- مفاتيح API (`api_key`, `secret`, `token`)
- معلومات البطاقات الائتمانية (`card_number`, `cvv`)
- بيانات شخصية حساسة (`ssn`, `national_id`)
- عناوين بريد إلكتروني حساسة

#### آلية التصفية:
```javascript
// دالة تصفية البيانات الحساسة
function sanitizeLogData(data) {
  const sensitiveFields = ['password', 'token', 'secret', 'cvv', 'ssn']
  const sanitized = { ...data }

  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[FILTERED]'
    }
  }

  // تصفية أي حقول فرعية
  if (sanitized.metadata) {
    for (const key in sanitized.metadata) {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        sanitized.metadata[key] = '[FILTERED]'
      }
    }
  }

  return sanitized
}
```

### 2. تشفير السجلات الحساسة

#### تشفير السجلات قبل التخزين:
```javascript
// تشفير السجلات الحساسة
const crypto = require('crypto')

function encryptSensitiveLogs(logData) {
  if (logData.category === 'audit' || logData.level === 'error') {
    const cipher = crypto.createCipher('aes-256-gcm', process.env.LOG_ENCRYPTION_KEY)
    const encrypted = cipher.update(JSON.stringify(logData), 'utf8', 'hex')
    encrypted += cipher.final('hex')

    return {
      ...logData,
      message: '[ENCRYPTED]',
      encrypted_content: encrypted,
      auth_tag: cipher.getAuthTag().toString('hex')
    }
  }

  return logData
}
```

### 3. التحقق من سلامة السجلات

#### كشف التلاعب بالسجلات:
```javascript
// التحقق من سلامة السجلات المشفرة
function verifyLogIntegrity(logData) {
  if (logData.encrypted_content) {
    const decipher = crypto.createDecipher('aes-256-gcm', process.env.LOG_ENCRYPTION_KEY)
    decipher.setAuthTag(Buffer.from(logData.auth_tag, 'hex'))

    try {
      const decrypted = decipher.update(logData.encrypted_content, 'hex', 'utf8')
      const originalLog = JSON.parse(decrypted + decipher.final('utf8'))

      // التحقق من عدم التلاعب
      const hash = crypto.createHash('sha256')
      hash.update(JSON.stringify(originalLog))
      const expectedHash = hash.digest('hex')

      return logData.integrity_hash === expectedHash
    } catch (error) {
      return false // السجل تالف أو تم التلاعب به
    }
  }

  return true
}
```

## خطة الصيانة والمراجعة

### 1. مراجعة السجلات اليومية
```bash
# فحص السجلات بحثاً عن أنماط مشبوهة
grep -r "suspicious" /var/log/bthwani/ | head -10

# فحص معدل الأخطاء
grep -r "ERROR" /var/log/bthwani/app.log | wc -l

# فحص الأداء
grep -r "slow query" /var/log/bthwani/app.log | head -5
```

### 2. مراجعة السجلات الأسبوعية
```bash
# تحليل اتجاهات الأداء
cat /var/log/bthwani/app.log | grep "response_time" | awk '{print $NF}' | sort -n

# فحص نمط الهجمات
cat /var/log/bthwani/security.log | grep "attack" | wc -l

# مراجعة استخدام الموارد
cat /var/log/bthwani/app.log | grep "memory" | tail -20
```

### 3. مراجعة السجلات الشهرية
```bash
# تحليل شامل للأداء والأمان
# إنشاء تقرير شهري للإدارة
# مراجعة فعالية استراتيجية السجلات
# اقتراح تحسينات للنظام
```

---

هذه الاستراتيجية تضمن سجلات شاملة وآمنة وفعالة لمنصة بثواني مع إمكانية التتبع الكامل والامتثال للمعايير.
