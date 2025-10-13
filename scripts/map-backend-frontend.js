#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const backendInventoryPath = path.join('backend', 'docs', 'api', 'endpoint-inventory.json');
const frontendUsagePath = path.join('backend', 'docs', 'api', 'frontend-usage.json');

const backendInventory = JSON.parse(fs.readFileSync(backendInventoryPath, 'utf8'));
const frontendUsage = JSON.parse(fs.readFileSync(frontendUsagePath, 'utf8'));

function normalizePath(p) {
  if (!p) return p;
  let pathStr = p.replace(/\/+/g, '/');
  if (pathStr.length > 1 && pathStr.endsWith('/')) {
    pathStr = pathStr.slice(0, -1);
  }
  return pathStr;
}

function normalizeMethod(method) {
  if (!method) return 'GET';
  if (method.toLowerCase() === 'fetch') return 'GET';
  return method.toUpperCase();
}

const frontendMap = new Map();
for (const usage of frontendUsage.usage) {
  const method = normalizeMethod(usage.method);
  const pathNormalized = normalizePath(usage.path);
  const key = `${method}|${pathNormalized}`;
  if (!frontendMap.has(key)) {
    frontendMap.set(key, []);
  }
  frontendMap.get(key).push(usage);
}

const backendResults = backendInventory.endpoints.map((endpoint) => {
  const method = normalizeMethod(endpoint.method);
  const pathNormalized = normalizePath(endpoint.path);
  const key = `${method}|${pathNormalized}`;
  const usages = frontendMap.get(key) || [];
  return {
    method,
    path: pathNormalized,
    filePath: path.relative(process.cwd(), endpoint.filePath),
    linked: usages.length > 0,
    usage: usages.map((u) => ({
      project: u.project,
      filePath: u.filePath,
      rawPath: u.rawPath,
    })),
  };
});

const linkedCount = backendResults.filter((r) => r.linked).length;
const totalEndpoints = backendResults.length;

const summary = {
  generatedAt: new Date().toISOString(),
  totalEndpoints,
  linkedCount,
  unlinkedCount: totalEndpoints - linkedCount,
  linkRatio: totalEndpoints === 0 ? 0 : linkedCount / totalEndpoints,
};

const output = {
  summary,
  backendResults,
  unmatchedFrontend: Array.from(frontendMap.entries())
    .filter(([key]) => {
      const [method, pathValue] = key.split('|');
      return !backendResults.some((r) => r.method === method && r.path === pathValue);
    })
    .map(([key, usages]) => ({
      method: key.split('|')[0],
      path: key.split('|')[1],
      usage: usages.map((u) => ({ project: u.project, filePath: u.filePath, rawPath: u.rawPath })),
    })),
};

const outputPath = path.join('backend', 'docs', 'api', 'backend-frontend-map.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
console.log(`Mapping generated at ${outputPath}`);
