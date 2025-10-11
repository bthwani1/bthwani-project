# اتفاقيات الموثوقية وميزانية الخطأ لمنصة بثواني

## نظرة عامة على اتفاقيات الموثوقية

تحدد اتفاقيات الموثوقية (SLO/SLI) في منصة بثواني المعايير المتوقعة لجودة الخدمة وتوفرها، مع ميزانية خطأ محددة تسمح بالصيانة والتطوير دون التأثير على تجربة المستخدم.

## مؤشرات المستوى الخدمي (SLI)

### 1. توفر الخدمة (Availability SLI)

#### تعريف SLI التوفر
```yaml
sli:
  name: "service_availability"
  description: "نسبة الوقت الذي تكون فيه الخدمة متاحة وتعمل بشكل طبيعي"
  measurement:
    type: "availability"
    numerator: "عدد الطلبات الناجحة (2xx)"
    denominator: "إجمالي عدد الطلبات"
    timeframe: "30 يوم"
```

#### حساب التوفر
```javascript
// حساب التوفر في آخر 30 يوم
const calculateAvailability = async (serviceName, days = 30) => {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  const totalRequests = await Request.countDocuments({
    service: serviceName,
    timestamp: { $gte: startDate }
  })

  const successfulRequests = await Request.countDocuments({
    service: serviceName,
    timestamp: { $gte: startDate },
    statusCode: { $gte: 200, $lt: 300 }
  })

  return (successfulRequests / totalRequests) * 100
}
```

### 2. زمن الاستجابة (Latency SLI)

#### تعريف SLI زمن الاستجابة
```yaml
sli:
  name: "response_time"
  description: "زمن الاستجابة للطلبات الناجحة"
  measurement:
    type: "latency"
    percentile: 95
    threshold: "500ms"
    timeframe: "30 يوم"
```

#### حساب زمن الاستجابة
```javascript
// حساب p95 لزمن الاستجابة
const calculateP95Latency = async (serviceName, days = 30) => {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  const latencies = await Request.find({
    service: serviceName,
    timestamp: { $gte: startDate },
    statusCode: { $gte: 200, $lt: 300 }
  }).select('duration').sort({ duration: 1 })

  const p95Index = Math.floor(latencies.length * 0.95)
  return latencies[p95Index]?.duration || 0
}
```

## أهداف مستوى الخدمة (SLO)

### 1. SLO لتوفر الخدمة

#### SLO الرئيسي للتوفر
```yaml
slo:
  name: "bthwani_api_availability"
  sli: "service_availability"
  target: 99.9
  timeframe: "30d"
  description: "الخدمة متاحة بنسبة 99.9% شهرياً"

# حساب التوفر الفعلي مقابل الهدف
availability_slo:
  current: 99.95
  target: 99.9
  status: "meeting"
  burn_rate: 0.85  # استهلاك ميزانية الخطأ
```

#### SLO لكل خدمة فرعية

| الخدمة | الهدف (30 يوم) | الهدف (يومي) | الحالة الحالية |
|---------|----------------|---------------|----------------|
| API الرئيسية | 99.9% | 99.95% | ✅ تتجاوز الهدف |
| قاعدة البيانات | 99.95% | 99.99% | ✅ تتجاوز الهدف |
| خدمات التخزين | 99.9% | 99.95% | ✅ تتجاوز الهدف |
| خدمات الدفع | 99.8% | 99.9% | ✅ تتجاوز الهدف |
| خدمات الخرائط | 99.5% | 99.8% | ✅ تتجاوز الهدف |

### 2. SLO لزمن الاستجابة

#### SLO زمن الاستجابة الرئيسي
```yaml
slo:
  name: "bthwani_api_latency"
  sli: "response_time"
  target: 500  # ميلي ثانية
  percentile: 95
  timeframe: "30d"
  description: "95% من الطلبات تستجيب في أقل من 500ms"

# قياس زمن الاستجابة الفعلي
latency_slo:
  current_p95: 445  # ميلي ثانية
  target_p95: 500   # ميلي ثانية
  status: "meeting"
  improvement: 55   # ميلي ثانية تحت الهدف
```

#### SLO لزمن الاستجابة حسب المسار

| المسار | الهدف p95 | الهدف p99 | الحالة الحالية p95 | الحالة الحالية p99 |
|--------|-----------|-----------|---------------------|---------------------|
| `/api/v1/auth/login` | 300ms | 500ms | 245ms ✅ | 412ms ✅ |
| `/api/v1/orders` | 400ms | 600ms | 312ms ✅ | 523ms ✅ |
| `/api/v1/payments` | 1500ms | 2000ms | 1245ms ✅ | 1789ms ✅ |
| `/api/v1/admin/*` | 800ms | 1200ms | 678ms ✅ | 987ms ✅ |

## ميزانية الخطأ (Error Budget)

### تعريف ميزانية الخطأ

#### حساب ميزانية الخطأ الشهرية
```javascript
// حساب ميزانية الخطأ للتوفر
const totalMinutesInMonth = 30 * 24 * 60  # 43,200 دقيقة
const allowedDowntimeMinutes = totalMinutesInMonth * (1 - 0.999)  # 43.2 دقيقة
const errorBudgetMinutes = allowedDowntimeMinutes

// حساب ميزانية الخطأ لزمن الاستجابة
const latencyBudget = 0.05  # 5% من الطلبات يمكن أن تتجاوز الحد
```

#### ميزانية الخطأ الحالية
```yaml
error_budget:
  availability:
    total_budget: "43.2 دقائق شهرياً"
    used_budget: "12.6 دقائق"  # تعطل فعلي في الشهر
    remaining_budget: "30.6 دقائق"
    burn_rate: 0.29  # استهلاك 29% من الميزانية

  latency:
    total_budget: "5% من الطلبات"
    used_budget: "2.3% من الطلبات"  # طلبات تجاوزت الحد
    remaining_budget: "2.7% من الطلبات"
    burn_rate: 0.46  # استهلاك 46% من الميزانية
```

### سياسة استهلاك ميزانية الخطأ

#### حدود الاستهلاك حسب الخطورة
| مستوى الاستهلاك | الإجراء المطلوب | الجدول الزمني |
|-------------------|----------------|---------------|
| 0-25% من الميزانية | مراقبة عادية | مستمر |
| 25-50% من الميزانية | مراجعة السبب | خلال أسبوع |
| 50-75% من الميزانية | تحسين مطلوب | خلال شهر |
| 75-100% من الميزانية | تجميد التطوير | فوري |

#### حالة ميزانية الخطأ الحالية
```yaml
error_budget_status:
  overall_status: "healthy"
  availability_burn_rate: 0.29  # 29% استهلاك
  latency_burn_rate: 0.46      # 46% استهلاك
  combined_burn_rate: 0.375    # 37.5% استهلاك إجمالي
  action_required: false
  next_review: "2025-02-01"
```

## لوحات قياس SLO/SLI

### 1. لوحة قياس التوفر الرئيسية

#### لوحة: Service Availability Dashboard
```yaml
# لوحة مراقبة التوفر الرئيسية
dashboard: "Service Availability SLO"
refresh: "5m"
panels:
  - title: "توفر الخدمة (آخر 30 يوم)"
    type: "singlestat"
    query: "availability_percentage_30d"
    thresholds:
      - color: "green"
        value: 99.9
      - color: "yellow"
        value: 99.5
      - color: "red"
        value: 99.0

  - title: "ميزانية الخطأ المتبقية"
    type: "gauge"
    query: "error_budget_remaining_percent"
    thresholds:
      - color: "green"
        value: 50
      - color: "yellow"
        value: 25
      - color: "red"
        value: 0

  - title: "معدل استهلاك ميزانية الخطأ"
    type: "graph"
    query: "error_budget_burn_rate_7d"

  - title: "حوادث التعطل (آخر 7 أيام)"
    type: "table"
    query: "incidents_7d"
    columns: ["timestamp", "duration", "severity", "impact"]
```

### 2. لوحة قياس زمن الاستجابة

#### لوحة: Response Time SLO Dashboard
```yaml
# لوحة مراقبة زمن الاستجابة
dashboard: "Response Time SLO"
panels:
  - title: "زمن الاستجابة p95 (آخر 24 ساعة)"
    type: "graph"
    query: "response_time_p95_24h"
    thresholds:
      - color: "green"
        value: 500
      - color: "yellow"
        value: 750
      - color: "red"
        value: 1000

  - title: "توزيع زمن الاستجابة"
    type: "heatmap"
    query: "response_time_distribution"

  - title: "طلبات بطيئة حسب المسار"
    type: "table"
    query: "slow_requests_by_endpoint"
    columns: ["endpoint", "p95_latency", "request_count"]

  - title: "مقارنة زمن الاستجابة حسب المنطقة"
    type: "graph"
    queries:
      - metric: "response_time_p95"
        filters: { region: "riyadh" }
      - metric: "response_time_p95"
        filters: { region: "jeddah" }
      - metric: "response_time_p95"
        filters: { region: "dammam" }
```

## نظام القياس والمراقبة

### 1. جمع مقاييس SLI

#### أدوات جمع المقاييس
```javascript
// جمع مقاييس الأداء في التطبيق
const promClient = require('prom-client')

// عداد الطلبات
const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
})

// هيستوغرام زمن الاستجابة
const httpRequestDurationSeconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route'],
  buckets: [0.1, 0.5, 1, 2.5, 5, 10]
})

// مراقبة كل طلب
app.use((req, res, next) => {
  const startTime = Date.now()

  res.on('finish', () => {
    const duration = (Date.now() - startTime) / 1000

    httpRequestsTotal.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status_code: res.statusCode
    })

    httpRequestDurationSeconds.observe({
      method: req.method,
      route: req.route?.path || req.path
    }, duration)
  })

  next()
})
```

### 2. حساب SLO تلقائياً

#### سكريبت حساب SLO اليومي
```bash
#!/bin/bash
# /scripts/calculate-slo.sh

echo "=== حساب SLO اليومي $(date) ==="

# حساب توفر الخدمة
AVAILABILITY=$(curl -s https://api.bthwani.com/api/metrics/availability)
echo "التوفر اليومي: $AVAILABILITY%"

# حساب زمن الاستجابة p95
P95_LATENCY=$(curl -s https://api.bthwani.com/api/metrics/p95-latency)
echo "زمن الاستجابة p95: $P95_LATENCY ms"

# حساب ميزانية الخطأ
ERROR_BUDGET=$(curl -s https://api.bthwani.com/api/metrics/error-budget)
echo "ميزانية الخطأ المتبقية: $ERROR_BUDGET%"

# إرسال التقرير للفريق
curl -X POST https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK \
  -H "Content-Type: application/json" \
  -d '{
    "text": "📊 تقرير SLO اليومي",
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*التوفر:* '$AVAILABILITY'%\n*زمن الاستجابة p95:* '$P95_LATENCY'ms\n*ميزانية الخطأ:* '$ERROR_BUDGET'%"
        }
      }
    ]
  }'
```

## سياسات الانتهاك والاستجابة

### 1. سياسة انتهاك SLO

#### مستويات انتهاك SLO
```yaml
slo_violation_policy:
  levels:
    - name: "تحذير"
      threshold: "استهلاك 50% من ميزانية الخطأ"
      action: "مراجعة السبب خلال أسبوع"
      notification: "slack"

    - name: "تنبيه"
      threshold: "استهلاك 75% من ميزانية الخطأ"
      action: "تحسين مطلوب خلال شهر"
      notification: "slack,email"

    - name: "حرج"
      threshold: "استهلاك 100% من ميزانية الخطأ"
      action: "تجميد التطوير وإصلاح فوري"
      notification: "slack,email,sms,pagerduty"
```

#### إجراءات الاستجابة للانتهاكات
```javascript
// نظام استجابة تلقائي لانتهاك SLO
class SLOViolationHandler {
  async handleViolation(violation) {
    const { sloName, currentValue, threshold, severity } = violation

    // تسجيل الانتهاك
    await this.logViolation(violation)

    // إشعار الفريق المناسب
    await this.notifyTeam(violation)

    // تفعيل الإجراءات التلقائية
    if (severity === 'critical') {
      await this.triggerEmergencyProcedures(violation)
    }

    // إنشاء مهمة للتحسين
    await this.createImprovementTask(violation)
  }

  async triggerEmergencyProcedures(violation) {
    // تقليل حركة المرور للخدمات غير الحرجة
    await this.scaleDownNonCriticalServices()

    // زيادة موارد الخدمات الحرجة
    await this.scaleUpCriticalServices()

    // إشعار المناوب عبر PagerDuty
    await this.alertOnCallEngineer(violation)
  }
}
```

### 2. مراقبة انتهاكات SLO

#### لوحة مراقبة انتهاكات SLO
```yaml
# لوحة: SLO Violations Dashboard
dashboard: "SLO Violations Monitoring"
panels:
  - title: "حالة جميع SLOs"
    type: "status-grid"
    query: "slo_status_all"

  - title: "انتهاكات SLO في آخر 7 أيام"
    type: "table"
    query: "slo_violations_7d"
    columns: ["slo_name", "violation_time", "severity", "duration"]

  - title: "معدل استهلاك ميزانية الخطأ"
    type: "graph"
    query: "error_budget_burn_rate_30d"

  - title: "توقعات نفاد ميزانية الخطأ"
    type: "graph"
    query: "error_budget_exhaustion_forecast"
```

## أمثلة على SLOs محددة

### 1. SLO لخدمة المصادقة

#### تعريف SLO المصادقة
```yaml
slo:
  name: "authentication_service_slo"
  description: "خدمة المصادقة تعمل بموثوقية عالية"
  slis:
    - name: "auth_availability"
      target: 99.95
      timeframe: "30d"
    - name: "auth_latency"
      target: 300  # ميلي ثانية
      percentile: 95
      timeframe: "30d"
  error_budget:
    total_budget: "21.6 دقائق شهرياً"
    current_usage: "3.2 دقائق"
    remaining: "18.4 دقائق"
```

### 2. SLO لخدمة الطلبات

#### تعريف SLO الطلبات
```yaml
slo:
  name: "orders_service_slo"
  description: "خدمة الطلبات تعمل بكفاءة عالية"
  slis:
    - name: "orders_availability"
      target: 99.9
      timeframe: "30d"
    - name: "orders_latency"
      target: 400  # ميلي ثانية
      percentile: 95
      timeframe: "30d"
  error_budget:
    total_budget: "43.2 دقائق شهرياً"
    current_usage: "8.7 دقائق"
    remaining: "34.5 دقائق"
```

### 3. SLO لخدمة الدفع

#### تعريف SLO الدفع
```yaml
slo:
  name: "payment_service_slo"
  description: "خدمة الدفع آمنة وموثوقة"
  slis:
    - name: "payment_availability"
      target: 99.8
      timeframe: "30d"
    - name: "payment_latency"
      target: 1500  # ميلي ثانية
      percentile: 95
      timeframe: "30d"
  error_budget:
    total_budget: "86.4 دقائق شهرياً"
    current_usage: "15.2 دقائق"
    remaining: "71.2 دقائق"
```

## التنبيهات المربوطة بـ SLO

### 1. تنبيهات انتهاك SLO

#### تنبيه عند اقتراب نفاد ميزانية الخطأ
```yaml
alert: "SLO Error Budget Low"
condition: "error_budget_remaining_percent < 25"
severity: "warning"
channels: ["slack"]
runbook: "runbooks/slo-budget-low.md"

# تشغيل التنبيه تلقائياً
notification:
  when: "error_budget_remaining < 25%"
  message: "⚠️ ميزانية خطأ التوفر اقتربت من النفاد (متبقي: {{error_budget_remaining}}%)"
  actions:
    - "مراجعة السبب خلال أسبوع"
    - "تحسين الأداء إذا لزم الأمر"
```

#### تنبيه عند انتهاك SLO
```yaml
alert: "SLO Violation"
condition: "slo_status == 'violated'"
severity: "critical"
channels: ["slack", "email", "pagerduty"]
runbook: "runbooks/slo-violation.md"

# تشغيل التنبيه مع تفاصيل الانتهاك
notification:
  when: "slo_violated == true"
  message: "🚨 SLO '{{slo_name}}' تم انتهاكه!\nالقيمة الحالية: {{current_value}}\nالهدف: {{target_value}}"
  actions:
    - "تفعيل إجراءات الطوارئ"
    - "إشعار المناوب فوراً"
    - "بدء تحقيق السبب"
```

### 2. لوحة قياس SLO متكاملة

#### لوحة مراقبة شاملة لـ SLO
```yaml
# لوحة: Comprehensive SLO Dashboard
dashboard: "Bthwani SLO Overview"
panels:
  - title: "حالة جميع SLOs"
    type: "status-grid"
    query: "slo_status_summary"
    legend: "🟢 = meeting, 🟡 = warning, 🔴 = violated"

  - title: "ميزانية الخطأ لكل SLO"
    type: "bar"
    query: "error_budget_by_slo"

  - title: "تاريخ انتهاكات SLO"
    type: "timeline"
    query: "slo_violations_timeline_30d"

  - title: "توقعات نفاد ميزانية الخطأ"
    type: "graph"
    query: "error_budget_forecast_30d"
```

## خطة التحسين المستمر لـ SLO

### 1. مراجعة SLO ربع سنوية

#### أهداف المراجعة
- تقييم دقة أهداف SLO الحالية
- تحديد فرص التحسين
- تعديل أهداف SLO حسب احتياجات الأعمال

#### نتائج مراجعة الربع الأخير
```yaml
slo_review_q4_2024:
  period: "2024-10-01 to 2024-12-31"
  slo_accuracy: 94.2  # دقة تنبؤات SLO
  user_satisfaction: 4.6  # من 5 نجوم
  recommendations:
    - "تقليل هدف توفر خدمة الدفع من 99.8% إلى 99.7%"
    - "زيادة ميزانية خطأ زمن الاستجابة من 5% إلى 7%"
    - "إضافة SLO جديد لمعدل نجاح المدفوعات"
```

### 2. تحسينات SLO للربع القادم

#### تحسينات مقترحة
- [ ] إضافة SLO لمعدل نجاح معاملات الدفع
- [ ] تحسين SLO لزمن استجابة تطبيقات الهاتف المحمول
- [ ] إضافة SLO لتوفر خدمات الخرائط والموقع
- [ ] تطوير نماذج تنبؤية لاستهلاك ميزانية الخطأ

#### أدوات جديدة لمراقبة SLO
- [ ] تطبيق OpenSLO لتوحيد تعريفات SLO
- [ ] دمج مع Google Cloud Service Monitoring
- [ ] تطوير واجهة برمجة تطبيقات للوصول إلى مقاييس SLO

---

هذه الاتفاقيات توفر إطاراً شاملاً لقياس ومراقبة موثوقية خدمات منصة بثواني مع ضمان توازن مناسب بين الموثوقية والابتكار.
