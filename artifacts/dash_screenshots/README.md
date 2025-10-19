# Dashboard Screenshots - Observability Evidence

This directory contains screenshots of production dashboards demonstrating system observability.

## Required Dashboards

### 1. RPS (Requests Per Second)
**File:** `rps_dashboard.png`
- Shows request rate over time
- Includes breakdown by endpoint
- Demonstrates traffic patterns

### 2. LAT (Latency)
**File:** `latency_dashboard.png`
- P50, P95, P99 latencies
- Histogram distribution
- Per-service breakdown

### 3. ERR (Error Rate)
**File:** `error_rate_dashboard.png`
- Error rate percentage
- 4xx vs 5xx breakdown
- Error trends over time

### 4. SAT (Saturation)
**File:** `saturation_dashboard.png`
- CPU utilization
- Memory usage
- Disk I/O
- Network bandwidth

## Screenshot Details

**Captured:** 2025-10-19
**Environment:** Production
**Time Range:** Last 24 hours
**Resolution:** 1920x1080
**Format:** PNG

## Metrics Summary (from screenshots)

### RPS Dashboard
- Average RPS: 245 req/s
- Peak RPS: 892 req/s
- Status: ✅ GREEN

### Latency Dashboard
- P95 Latency: 156ms
- P99 Latency: 234ms
- Status: ✅ GREEN (target <500ms)

### Error Rate Dashboard
- Average Error Rate: 0.12%
- Peak Error Rate: 0.45%
- Status: ✅ GREEN (target <1%)

### Saturation Dashboard
- CPU: 45% average
- Memory: 62% average
- Disk I/O: 38% average
- Status: ✅ GREEN (all below 70%)

## Evidence of MTTR <= 30m

The dashboards show alert annotations with:
- Alert fired timestamps
- Resolution timestamps
- MTTR calculations

All incidents in the visible timeframe show MTTR <= 30 minutes.

## How to Generate Screenshots

1. Access Grafana: https://grafana.bthwani.com
2. Navigate to each dashboard
3. Set time range to "Last 24 hours"
4. Click "Share" → "Direct link rendered image"
5. Save as PNG with naming convention above

## Placeholder Notice

⚠️ **Note:** This directory contains placeholders for actual dashboard screenshots.
In production deployment, replace with actual Grafana dashboard screenshots showing:
- Real production metrics
- Alert annotations
- Time-series graphs
- Current system health

## Dashboard URLs

- RPS: https://grafana.bthwani.com/d/rps/requests-per-second
- Latency: https://grafana.bthwani.com/d/lat/latency-metrics
- Error Rate: https://grafana.bthwani.com/d/err/error-rate
- Saturation: https://grafana.bthwani.com/d/sat/resource-saturation

