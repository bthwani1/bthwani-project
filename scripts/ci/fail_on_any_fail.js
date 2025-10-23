#!/usr/bin/env node
import fs from "node:fs";
const path = process.argv[2] || "reports/gates/aggregate.json";
const o = JSON.parse(fs.readFileSync(path, "utf8"));
if (o.violations && o.violations.length) { console.error("BLOCK: some required gates failed"); process.exit(1); }
console.log("All required gates passed");
