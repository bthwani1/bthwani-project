#!/usr/bin/env node

/**
 * Runtime vs FE Static Analysis Comparison Script
 *
 * Compares runtime endpoint calls (24h) with FE static analysis report
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Runtime vs FE Static Analysis Comparison\n');

const reportsDir = path.join(__dirname, '..', 'backend-nest', 'reports');

// Load runtime tap data
const runtimeTapPath = path.join(reportsDir, 'runtime-tap-24h.json');
const comparisonReportPath = path.join(reportsDir, 'runtime-fe-comparison.json');

function loadRuntimeData() {
  if (!fs.existsSync(runtimeTapPath)) {
    console.error('❌ Runtime tap data not found. Make sure the backend is running and collecting data.');
    return null;
  }

  try {
    const data = JSON.parse(fs.readFileSync(runtimeTapPath, 'utf8'));
    return data.endpoints || [];
  } catch (error) {
    console.error('❌ Failed to load runtime tap data:', error.message);
    return null;
  }
}

function loadFEStaticData() {
  const feStaticPath = path.join(reportsDir, 'fe-static-endpoints.json');

  if (!fs.existsSync(feStaticPath)) {
    console.error('❌ FE static analysis report not found. Run FE static analysis first.');
    return null;
  }

  try {
    const data = JSON.parse(fs.readFileSync(feStaticPath, 'utf8'));
    return data.endpoints || [];
  } catch (error) {
    console.error('❌ Failed to load FE static analysis report:', error.message);
    return null;
  }
}

function analyzeRuntimeData(runtimeEndpoints) {
  const endpoints = [];

  for (const endpoint of runtimeEndpoints) {
    const [method, path] = endpoint.endpoint.split(':');
    const calls = endpoint.calls || [];

    // Filter calls from last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentCalls = calls.filter(c => new Date(c.timestamp) >= oneDayAgo);

    if (recentCalls.length > 0) {
      endpoints.push({
        method,
        path,
        callCount: recentCalls.length,
        lastCall: recentCalls[recentCalls.length - 1].timestamp,
        statusCodes: [...new Set(recentCalls.map(c => c.statusCode))],
        hasErrors: recentCalls.some(c => c.statusCode >= 400),
      });
    }
  }

  return endpoints.sort((a, b) => b.callCount - a.callCount);
}

function compareEndpoints(runtimeEndpoints, feEndpoints) {
  const runtimePaths = new Set(runtimeEndpoints.map(e => `${e.method} ${e.path}`));

  const matched = [];
  const unmatched = [];
  const feOnly = [];

  // Check runtime endpoints against FE
  for (const runtimeEndpoint of runtimeEndpoints) {
    const fullPath = `${runtimeEndpoint.method} ${runtimeEndpoint.path}`;
    if (feEndpoints.includes(fullPath)) {
      matched.push(runtimeEndpoint);
    } else {
      unmatched.push(runtimeEndpoint);
    }
  }

  // Find FE-only endpoints
  for (const feEndpoint of feEndpoints) {
    if (!runtimePaths.has(feEndpoint)) {
      feOnly.push(feEndpoint);
    }
  }

  return { matched, unmatched, feOnly };
}

function generateReport(runtimeEndpoints, comparison) {
  const totalRuntime = runtimeEndpoints.length;
  const totalFE = comparison.matched.length + comparison.feOnly.length;
  const coverage = totalFE > 0 ? (comparison.matched.length / totalFE * 100).toFixed(2) : 0;

  const report = {
    generatedAt: new Date().toISOString(),
    period: '24 hours',
    summary: {
      runtimeEndpoints: {
        total: totalRuntime,
        matched: comparison.matched.length,
        unmatched: comparison.unmatched.length,
      },
      feEndpoints: {
        total: totalFE,
        matched: comparison.matched.length,
        unused: comparison.feOnly.length,
      },
      coverage: `${coverage}%`,
      status: coverage >= 95 ? 'PASS' : coverage >= 80 ? 'WARNING' : 'FAIL',
    },
    details: {
      matched: comparison.matched.slice(0, 50), // Top 50
      unmatched: comparison.unmatched.slice(0, 50), // Top 50
      feOnly: comparison.feOnly.slice(0, 50), // Top 50
    },
    recommendations: [
      ...(comparison.unmatched.length > 0 ? [
        `Found ${comparison.unmatched.length} runtime endpoints not in FE static analysis`
      ] : []),
      ...(comparison.feOnly.length > 0 ? [
        `Found ${comparison.feOnly.length} FE endpoints not called in runtime`
      ] : []),
      ...(parseFloat(coverage) < 95 ? [
        `Coverage is ${coverage}%. Target is 95%+.`
      ] : []),
    ],
  };

  // Save detailed report
  fs.writeFileSync(comparisonReportPath, JSON.stringify(report, null, 2));

  return report;
}

function printReport(report) {
  console.log('📊 Runtime vs FE Static Analysis Report\n');

  console.log('📈 Summary:');
  console.log(`  Runtime Endpoints: ${report.summary.runtimeEndpoints.total}`);
  console.log(`  FE Endpoints: ${report.summary.feEndpoints.total}`);
  console.log(`  Matched: ${report.summary.runtimeEndpoints.matched}`);
  console.log(`  Runtime Only: ${report.summary.runtimeEndpoints.unmatched}`);
  console.log(`  FE Only: ${report.summary.feEndpoints.unused}`);
  console.log(`  Coverage: ${report.summary.coverage}`);
  console.log(`  Status: ${report.summary.status}\n`);

  if (report.details.unmatched.length > 0) {
    console.log('🚨 Runtime Endpoints Not in FE Analysis:');
    report.details.unmatched.slice(0, 10).forEach(endpoint => {
      console.log(`  ${endpoint.method} ${endpoint.path} (${endpoint.callCount} calls)`);
    });
    if (report.details.unmatched.length > 10) {
      console.log(`  ... and ${report.details.unmatched.length - 10} more`);
    }
    console.log('');
  }

  if (report.details.feOnly.length > 0) {
    console.log('⚠️  FE Endpoints Not Called in Runtime:');
    report.details.feOnly.slice(0, 10).forEach(endpoint => {
      console.log(`  ${endpoint}`);
    });
    if (report.details.feOnly.length > 10) {
      console.log(`  ... and ${report.details.feOnly.length - 10} more`);
    }
    console.log('');
  }

  console.log('💾 Detailed report saved to:', comparisonReportPath);
  console.log('');

  if (report.recommendations.length > 0) {
    console.log('📋 Recommendations:');
    report.recommendations.forEach(rec => console.log(`  • ${rec}`));
    console.log('');
  }
}

// Main execution
const runtimeData = loadRuntimeData();
if (!runtimeData) {
  process.exit(1);
}

const feData = loadFEStaticData();
if (!feData) {
  process.exit(1);
}

const runtimeEndpoints = analyzeRuntimeData(runtimeData);
const comparison = compareEndpoints(runtimeEndpoints, feData);
const report = generateReport(runtimeEndpoints, comparison);

printReport(report);

// Exit with appropriate code based on coverage
const coverage = parseFloat(report.summary.coverage);
if (coverage < 80) {
  console.log('❌ Critical: Coverage below 80%');
  process.exit(1);
} else if (coverage < 95) {
  console.log('⚠️  Warning: Coverage below 95%');
  process.exit(0);
} else {
  console.log('✅ Coverage meets target (95%+)');
  process.exit(0);
}
