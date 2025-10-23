#!/usr/bin/env bash
set -euo pipefail
BASE="${1:-https://staging.example.tld}"
urls=("$BASE/" "$BASE/checkout" "$BASE/api/v1/profile")
jq -n '[]' > reports/headers/staging.json
for u in "${urls[@]}"; do
  out=$(curl -s -D - -o /dev/null "$u" | tr -d '\r')
  csp=$(echo "$out" | awk -F': ' 'tolower($1)=="content-security-policy"{print $2}' | tail -n1)
  cors=$(echo "$out" | awk -F': ' 'tolower($1)=="access-control-allow-origin"{print $2}' | tail -n1)
  hsts=$(echo "$out" | awk -F': ' 'tolower($1)=="strict-transport-security"{print $2}' | tail -n1)
  jq --arg url "$u" --arg csp "$csp" --arg cors "$cors" --arg hsts "$hsts"      '. += [{"url":$url,"headers":{"content-security-policy":$csp,"access-control-allow-origin":$cors,"strict-transport-security":$hsts}}]'      reports/headers/staging.json > reports/headers/tmp.json
  mv reports/headers/tmp.json reports/headers/staging.json
done
echo "OK → reports/headers/staging.json"
