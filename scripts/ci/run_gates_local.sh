#!/usr/bin/env bash
set -euo pipefail
echo "▶ Running local gates..."
node scripts/api/routes_uniqueness.ts || true
npx spectral lint openapi/*.yaml --fail-severity=warn --format json > reports/openapi/spectral.json || true
semgrep --config .semgrep.yml --error --json > reports/sec/semgrep.json || true
gitleaks detect -c gitleaks.toml --report-path reports/secrets/scan.json || true
npx lhci autorun --config=perf/lhci.json || true
npx pa11y-ci --config perf/pa11y.json --json > reports/a11y/pa11y.json || true
opa test -v policy/opa || true
echo "✅ Local gates finished (see reports/gates/**)"
