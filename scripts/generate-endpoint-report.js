#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const mappingPath = path.join('backend', 'docs', 'api', 'backend-frontend-map.json');
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

function formatUsage(usage) {
  if (!usage || usage.length === 0) return '—';
  return usage
    .map((item) => `${item.project} (${item.rawPath})`)
    .join('<br />');
}

const lines = [];
lines.push('# Backend Endpoint Coverage Report');
lines.push('');
lines.push(`Generated at: ${mapping.summary.generatedAt}`);
lines.push('');
lines.push('## Coverage Summary');
lines.push('');
lines.push(`- Total endpoints: **${mapping.summary.totalEndpoints}**`);
lines.push(`- Linked to frontend: **${mapping.summary.linkedCount}**`);
lines.push(`- Unlinked: **${mapping.summary.unlinkedCount}**`);
lines.push(`- Link ratio: **${(mapping.summary.linkRatio * 100).toFixed(2)}%**`);
lines.push('');
lines.push('## Endpoint Inventory');
lines.push('');
lines.push('| Method | Path | Source File | Linked | Frontend Usage |');
lines.push('|--------|------|-------------|--------|----------------|');
for (const endpoint of mapping.backendResults) {
  const usage = formatUsage(endpoint.usage);
  const linked = endpoint.linked ? '✅' : '❌';
  const source = endpoint.filePath.replace(/\/+/g, '/');
  lines.push(`| ${endpoint.method} | ${endpoint.path} | ${source} | ${linked} | ${usage} |`);
}
lines.push('');
lines.push('## Frontend Calls Without Matching Backend Endpoint');
lines.push('');
if (mapping.unmatchedFrontend.length === 0) {
  lines.push('All frontend calls matched backend endpoints.');
} else {
  lines.push('| Method | Path | Usage |');
  lines.push('|--------|------|-------|');
  for (const item of mapping.unmatchedFrontend) {
    const usage = item.usage
      .map((u) => `${u.project} (${u.rawPath})`)
      .join('<br />');
    lines.push(`| ${item.method} | ${item.path} | ${usage} |`);
  }
}

const reportPath = path.join('backend', 'docs', 'api', 'backend-endpoint-report.md');
fs.writeFileSync(reportPath, lines.join('\n'));
console.log(`Report written to ${reportPath}`);
