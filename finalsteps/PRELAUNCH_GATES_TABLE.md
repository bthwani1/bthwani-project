| ID | Gate | DoD | Evidence | Owner |
|---|---|---|---|---|
| G-API | Contracts Green | JUnit failures=0 • Parity active=100% | artifacts/contract_tests.junit.xml • artifacts/openapi_contracts.csv • artifacts/route_inventory_backend.csv | @BE |
| G-ROUTE | Route Uniqueness | route_duplicates=0 rows | artifacts/route_duplicates.csv | @BE/@DevOps |
| G-FE | FE Typed & Orphans | grep_raw_fetch.txt empty • fe_orphans=0 • typed_clients_report=✅ | artifacts/grep_raw_fetch.txt • artifacts/fe_orphans.csv • artifacts/typed_clients_report.json | @FE |
| G-SEC | Secrets/SBOM/Signing | gitleaks=0 • sbom present • cosign verified | artifacts/gitleaks.sarif • artifacts/sbom.cdx.json • artifacts/cosign.verify.txt | @Sec/@DevOps |
| G-OBS | Observability | MTTR_p50≤30m • alerts fired • 4 PNG dashboards | artifacts/incidents.csv • artifacts/alert_fire_log.txt • artifacts/dash_screenshots/*.png | @Ops |
| G-DR | DR Proof | RPO≤15m • RTO≤30m | artifacts/dr_report.md • artifacts/backup_restore_logs.txt | @Ops |
| G-ERR | Error Taxonomy | coverage≥95% | artifacts/error_taxonomy_report.json | @BE/@FE |
| G-PERF | Performance | LCP p75≤2.5s • INP≤200ms • API p95≤target | artifacts/web_vitals.json • artifacts/api_perf_report.json | @Perf |
| G-COMP | Compliance | DSR test≤30d • Privacy URL valid | artifacts/privacy_evidence.md • artifacts/dsr_test_log.txt | @Legal |
