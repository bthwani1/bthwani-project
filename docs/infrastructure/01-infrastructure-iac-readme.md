# دليل البنية التحتية وIaC لمنصة بثواني

## نظرة عامة على البنية التحتية

تستخدم منصة بثواني خدمات Render السحابية للنشر والتشغيل، مع التركيز على قابلية التوسع التلقائي والموثوقية العالية.

## خدمات Render المستخدمة

### 1. خدمة الويب الرئيسية (Web Service)
**اسم الخدمة**: `bthwani-backend-api`
**نوع الخدمة**: Web Service
**مواصفات الخادم**:
- **Runtime**: Node.js 18
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Port**: 3000

**إعدادات الأداء**:
```yaml
# render.yaml
services:
  - type: web
    name: bthwani-backend-api
    runtime: node
    buildCommand: npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
    autoDeploy: true
    healthCheckPath: /api/health
    disk:
      name: bthwani-data
      mountPath: /data
      sizeGB: 10
```

### 2. خدمة قاعدة البيانات (Database Service)
**اسم الخدمة**: `bthwani-mongodb`
**نوع الخدمة**: PostgreSQL (أو MongoDB Atlas)
**المواصفات**:
- **المحرك**: MongoDB 5.0+
- **التخزين**: 10GB SSD
- **النسخ الاحتياطي**: تلقائي يومي

**إعدادات النسخ الاحتياطي**:
```yaml
# إعدادات قاعدة البيانات في Render
backup:
  enabled: true
  schedule: "0 2 * * *"  # يومياً الساعة 2 صباحاً
  retention: 30  # احتفاظ لمدة 30 يوم
```

### 3. خدمة Redis (Cache Service)
**اسم الخدمة**: `bthwani-redis`
**نوع الخدمة**: Redis Service
**المواصفات**:
- **المحرك**: Redis 6.2
- **الذاكرة**: 1GB RAM
- **التخزين**: Persistent (AOF + RDB)

### 4. خدمة تخزين الملفات (File Storage)
**اسم الخدمة**: `bthwani-storage`
**نوع الخدمة**: Static Site (للصور والملفات)
**المواصفات**:
- **التخزين**: 50GB
- **CDN**: Cloudflare
- **ضغط**: تلقائي للصور

## إعدادات Autoscaling

### سياسات التوسع التلقائي

```yaml
# إعدادات التوسع في Render
scaling:
  minInstances: 1
  maxInstances: 5
  targetCPUPercent: 70
  targetMemoryPercent: 80

# قواعد التوسع حسب الحمل
autoScaling:
  enabled: true
  metrics:
    - type: CPU
      target: 70
      cooldown: 300
    - type: Memory
      target: 80
      cooldown: 300
  policies:
    - type: TargetTrackingScaling
      targetValue: 70.0
      scaleInCooldown: 300
      scaleOutCooldown: 60
```

### مراقبة الأداء
- **مقاييس مراقبة**: CPU، Memory، Disk، Network
- **تنبيهات**: عند تجاوز 80% من أي مقياس
- **سجلات**: احتفاظ لمدة 30 يوم

## فحوصات الصحة (Health Checks)

### نقاط فحص الصحة الرئيسية

#### 1. فحص صحة API الرئيسية
```
GET /api/health
```
**الاستجابة المتوقعة**:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-10T10:30:00Z",
  "version": "2.1.0",
  "uptime": "5d 12h 30m",
  "database": "connected",
  "redis": "connected"
}
```

#### 2. فحص صحة قاعدة البيانات
```javascript
// فحص في الكود
app.get('/api/health/db', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping()
    res.json({ status: 'healthy', database: 'connected' })
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error: error.message })
  }
})
```

#### 3. فحص صحة Redis
```javascript
app.get('/api/health/redis', async (req, res) => {
  try {
    await redisClient.ping()
    res.json({ status: 'healthy', redis: 'connected' })
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error: error.message })
  }
})
```

### إعدادات فحوصات الصحة في Render
```yaml
healthCheck:
  path: /api/health
  method: GET
  headers:
    - name: User-Agent
      value: Render-Health-Check
  timeout: 30
  interval: 60
  failureThreshold: 3
  successThreshold: 2
```

## الشبكات والاتصالات

### إعدادات الشبكة

#### 1. VPC وSubnets
```yaml
# إعدادات الشبكة في Render
networking:
  vpc:
    name: bthwani-vpc
    cidr: 10.0.0.0/16
  subnets:
    - name: public-subnet
      cidr: 10.0.1.0/24
      availabilityZone: us-east-1a
    - name: private-subnet
      cidr: 10.0.2.0/24
      availabilityZone: us-east-1b
```

#### 2. Security Groups
```yaml
# مجموعات الأمان
securityGroups:
  - name: web-sg
    description: Security group for web services
    inbound:
      - protocol: tcp
        port: 80
        source: 0.0.0.0/0
      - protocol: tcp
        port: 443
        source: 0.0.0.0/0
      - protocol: tcp
        port: 3000
        source: 10.0.0.0/16
```

### Load Balancer وCDN
```yaml
# إعدادات Load Balancer
loadBalancer:
  type: application
  scheme: internet-facing
  listeners:
    - protocol: HTTP
      port: 80
      targetProtocol: HTTP
      targetPort: 3000
    - protocol: HTTPS
      port: 443
      targetProtocol: HTTP
      targetPort: 3000

# إعدادات CDN (Cloudflare)
cdn:
  enabled: true
  cache:
    defaultTTL: 3600
    maxTTL: 86400
  compression: true
  ssl: full
```

## DNS وSSL

### إعدادات DNS

#### 1. سجلات DNS الرئيسية
| نوع السجل | الاسم | القيمة | TTL |
|------------|-------|---------|-----|
| A | api.bthwani.com | [IP Load Balancer] | 300 |
| CNAME | www.api.bthwani.com | api.bthwani.com | 300 |
| CNAME | admin.bthwani.com | [IP Admin Service] | 300 |
| CNAME | app.bthwani.com | [IP Frontend] | 300 |

#### 2. سجلات الصحة والمراقبة
```bash
# فحص DNS
nslookup api.bthwani.com
dig api.bthwani.com

# فحص شهادة SSL
curl -vI https://api.bthwani.com
```

### إعدادات SSL/TLS

#### 1. شهادات SSL من Let's Encrypt
```yaml
# إعدادات SSL في Render
ssl:
  provider: letsencrypt
  domains:
    - api.bthwani.com
    - www.api.bthwani.com
    - admin.bthwani.com
    - app.bthwani.com
  settings:
    minTlsVersion: TLSv1.2
    cipherSuites:
      - ECDHE-RSA-AES128-GCM-SHA256
      - ECDHE-RSA-AES256-GCM-SHA384
```

#### 2. إعدادات الأمان المتقدمة
```yaml
security:
  ssl:
    protocols:
      - TLSv1.2
      - TLSv1.3
    ciphers:
      - ECDHE-RSA-AES128-GCM-SHA256
      - ECDHE-RSA-AES256-GCM-SHA384
    hsts:
      enabled: true
      maxAge: 31536000
      includeSubdomains: true
```

## متغيرات البيئة (Environment Variables)

### جدول متغيرات البيئة الكامل

| المتغير | القيمة الوهمية | الوصف | مطلوب/اختياري |
|---------|----------------|-------|----------------|
| `NODE_ENV` | `production` | بيئة التشغيل | مطلوب |
| `PORT` | `3000` | منفذ الخادم | مطلوب |
| `MONGO_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/bthwani` | رابط قاعدة البيانات | مطلوب |
| `REDIS_URL` | `redis://:pass@redis-host:6379` | رابط Redis | مطلوب |
| `JWT_SECRET` | `super-secret-jwt-key-change-in-production` | مفتاح JWT | مطلوب |
| `JWT_REFRESH_SECRET` | `another-super-secret-refresh-key` | مفتاح تحديث JWT | مطلوب |
| `FIREBASE_PROJECT_ID` | `bthwani-app` | معرف مشروع Firebase | مطلوب |
| `FIREBASE_PRIVATE_KEY` | `-----BEGIN PRIVATE KEY-----\n...` | مفتاح Firebase الخاص | مطلوب |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk@bthwani-app.iam.gserviceaccount.com` | بريد Firebase | مطلوب |
| `SMTP_HOST` | `smtp.gmail.com` | خادم البريد | مطلوب |
| `SMTP_PORT` | `587` | منفذ البريد | مطلوب |
| `SMTP_USER` | `noreply@bthwani.com` | مستخدم البريد | مطلوب |
| `SMTP_PASS` | `app-password-from-gmail` | كلمة مرور البريد | مطلوب |
| `STRIPE_SECRET_KEY` | `sk_test_51ABC123...` | مفتاح Stripe السري | مطلوب |
| `STRIPE_PUBLISHABLE_KEY` | `pk_test_51ABC123...` | مفتاح Stripe العلني | مطلوب |
| `PAYPAL_CLIENT_ID` | `paypal-client-id` | معرف عميل PayPal | مطلوب |
| `PAYPAL_CLIENT_SECRET` | `paypal-client-secret` | سر عميل PayPal | مطلوب |
| `CLOUDINARY_URL` | `cloudinary://api_key:api_secret@cloud_name` | رابط Cloudinary | مطلوب |
| `AWS_ACCESS_KEY_ID` | `AKIAIOSFODNN7EXAMPLE` | مفتاح AWS | مطلوب |
| `AWS_SECRET_ACCESS_KEY` | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` | سر AWS | مطلوب |
| `AWS_S3_BUCKET` | `bthwani-production-files` | دلو S3 | مطلوب |
| `GOOGLE_MAPS_API_KEY` | `AIzaSyABC123...` | مفتاح Google Maps | مطلوب |
| `SENTRY_DSN` | `https://abc123@sentry.io/456789` | DSN Sentry | مطلوب |
| `POSTHOG_API_KEY` | `phc_abc123...` | مفتاح PostHog | مطلوب |
| `LOG_LEVEL` | `info` | مستوى السجلات | اختياري |
| `LOG_FILE` | `/var/log/bthwani/app.log` | ملف السجلات | اختياري |
| `MAX_FILE_SIZE` | `10MB` | حجم الملف الأقصى | اختياري |
| `SESSION_TIMEOUT` | `24h` | مهلة الجلسة | اختياري |
| `RATE_LIMIT_WINDOW` | `15m` | نافذة تحديد المعدل | اختياري |
| `RATE_LIMIT_MAX` | `100` | الحد الأقصى للمعدل | اختياري |

## أمر تجهيز البيئة الواحد

### الأمر الشامل لتجهيز البيئة

```bash
# تجهيز البيئة الكاملة بأمر واحد
curl -s https://raw.githubusercontent.com/bthwani/infrastructure/main/setup.sh | bash

# أو محلياً
chmod +x scripts/setup-environment.sh
./scripts/setup-environment.sh --env production --region us-east-1
```

### محتوى سكريبت التجهيز

```bash
#!/bin/bash
# scripts/setup-environment.sh

set -e

ENVIRONMENT=${1:-staging}
REGION=${2:-us-east-1}

echo "🚀 تجهيز بيئة $ENVIRONMENT في منطقة $REGION"

# 1. إنشاء خدمات Render
echo "📦 إنشاء خدمات Render..."
render services create --file render.$ENVIRONMENT.yaml

# 2. إعداد قاعدة البيانات
echo "🗄️ إعداد قاعدة البيانات..."
render databases create --name bthwani-$ENVIRONMENT-db --type mongodb --region $REGION

# 3. إعداد Redis
echo "🔄 إعداد Redis..."
render redis create --name bthwani-$ENVIRONMENT-redis --region $REGION

# 4. إعداد متغيرات البيئة
echo "⚙️ إعداد متغيرات البيئة..."
render secrets create --file .env.$ENVIRONMENT

# 5. إعداد DNS وSSL
echo "🌐 إعداد DNS وSSL..."
render domains add api.bthwani.com --ssl auto
render domains add admin.bthwani.com --ssl auto

# 6. إعداد مراقبة الأداء
echo "📊 إعداد المراقبة..."
render alerts create --service bthwani-backend-api --metric cpu --threshold 80

# 7. فحص الصحة الأولي
echo "🏥 فحص الصحة الأولي..."
sleep 30
curl -f https://api.bthwani.com/api/health || exit 1

echo "✅ تم تجهيز البيئة بنجاح!"
echo "🔗 روابط الوصول:"
echo "   API: https://api.bthwani.com"
echo "   Admin: https://admin.bthwani.com"
echo "   صحة النظام: https://api.bthwani.com/api/health"
```

## أدوات المراقبة والصيانة

### مراقبة الأداء (APM)

#### 1. Sentry لمراقبة الأخطاء
```javascript
// إعداد Sentry في التطبيق
import * as Sentry from '@sentry/node'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})
```

#### 2. مراقبة قاعدة البيانات
```bash
# مراقبة أداء MongoDB
mongostat --host $MONGO_URI
mongotop --host $MONGO_URI

# مراقبة Redis
redis-cli --scan --pattern "*" | head -20
redis-cli info memory
```

### أدوات النسخ الاحتياطي

#### 1. نسخ احتياطي تلقائي
```yaml
# إعدادات النسخ الاحتياطي في Render
backup:
  schedule: "0 2 * * *"  # يومياً الساعة 2 صباحاً
  retention:
    count: 30  # احتفاظ بـ 30 نسخة
  destinations:
    - type: s3
      bucket: bthwani-backups
      region: us-east-1
```

#### 2. أدوات الاسترداد
```bash
# استرداد من نسخة احتياطية
render databases restore --name bthwani-production-db --backup-id backup_20250110_020000

# فحص سلامة البيانات بعد الاسترداد
mongosh $MONGO_URI --eval "db.stats()"
```

## اعتبارات الأمان

### 1. إدارة الأسرار (Secrets Management)
```yaml
# إعدادات إدارة الأسرار في Render
secrets:
  encryption: AES256
  rotation:
    enabled: true
    schedule: "0 0 1 * *"  # شهرياً
  access:
    - service: bthwani-backend-api
    - service: bthwani-admin-dashboard
```

### 2. حماية الشبكة
```yaml
# قواعد جدار الحماية
firewall:
  inbound:
    - protocol: tcp
      port: 80
      source: cloudflare
    - protocol: tcp
      port: 443
      source: cloudflare
    - protocol: tcp
      port: 22
      source: admin-ips
  outbound:
    - protocol: tcp
      port: 27017
      destination: mongodb-atlas
    - protocol: tcp
      port: 6379
      destination: redis-service
```

### 3. مراقبة الأمان
```yaml
# تنبيهات الأمان
alerts:
  - name: high-cpu-usage
    condition: cpu > 80%
    channels: [slack, email]
  - name: failed-logins
    condition: failed_login_attempts > 10
    channels: [slack, email]
  - name: suspicious-activity
    condition: unusual_ip_access
    channels: [slack, email]
```

## خطة الصيانة والتحديثات

### جدولة الصيانة

#### 1. الصيانة اليومية
```bash
# فحص حالة الخدمات
render services list --env production
render services logs bthwani-backend-api --lines 100

# فحص استخدام الموارد
render metrics get --service bthwani-backend-api --metric cpu,memory
```

#### 2. الصيانة الأسبوعية
```bash
# تحديث التبعيات الأمنية
npm audit fix --production

# تحسين قاعدة البيانات
render databases optimize --name bthwani-production-db

# مراجعة السجلات الأمنية
render logs analyze --service bthwani-backend-api --level error
```

#### 3. الصيانة الشهرية
```bash
# تحديث نظام التشغيل والحزم
render services update --name bthwani-backend-api --runtime node18

# مراجعة استراتيجية النسخ الاحتياطي
render backups list --database bthwani-production-db

# اختبار خطة التعافي من الكوارث
render services stop bthwani-backend-api
# ... اختبار الاسترداد ...
render services start bthwani-backend-api
```

---

هذا الدليل يوفر نظرة شاملة على بنية البنية التحتية لمنصة بثواني مع التركيز على خدمات Render والأمان والموثوقية.
