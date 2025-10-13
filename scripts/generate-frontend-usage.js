#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const backendNodeModules = path.join(__dirname, '..', 'backend', 'node_modules');
if (!module.paths.includes(backendNodeModules)) {
  module.paths.push(backendNodeModules);
}

const ts = require('typescript');

const projects = [
  { name: 'admin-dashboard', src: 'admin-dashboard/src', basePath: '/api/v1' },
  { name: 'vendor-app', src: 'vendor-app/src', basePath: '/api/v1' },
  { name: 'rider-app', src: 'rider-app/src', basePath: '/api/v1' },
  { name: 'app-user', src: 'app-user/src', basePath: '/api/v1' },
  { name: 'field-marketers', src: 'field-marketers/src', basePath: '/api/v1' },
  { name: 'bthwani-web', src: 'bthwani-web/src', basePath: '/api/v1' },
];

function parseSource(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const ext = path.extname(filePath);
  const scriptKind =
    ext === '.tsx'
      ? ts.ScriptKind.TSX
      : ext === '.ts'
      ? ts.ScriptKind.TS
      : ext === '.jsx'
      ? ts.ScriptKind.JSX
      : ts.ScriptKind.JS;
  return ts.createSourceFile(filePath, content, ts.ScriptTarget.ES2022, true, scriptKind);
}

function extractStringPattern(expr, replacements = {}) {
  if (!expr) return null;
  if (ts.isStringLiteralLike(expr)) {
    return expr.text;
  }
  if (ts.isTemplateExpression(expr)) {
    let result = expr.head.text;
    for (const span of expr.templateSpans) {
      const placeholder = expressionToPlaceholder(span.expression, replacements);
      result += placeholder;
      result += span.literal.text;
    }
    return result;
  }
  if (ts.isNoSubstitutionTemplateLiteral(expr)) {
    return expr.text;
  }
  if (ts.isIdentifier(expr)) {
    const key = expr.text;
    return replacements[key] ?? null;
  }
  return null;
}

function expressionToPlaceholder(expression, replacements = {}) {
  if (ts.isIdentifier(expression)) {
    return `:${expression.text}`;
  }
  if (ts.isPropertyAccessExpression(expression) && ts.isIdentifier(expression.name)) {
    return `:${expression.name.text}`;
  }
  if (ts.isNumericLiteral(expression)) {
    return expression.text;
  }
  return ':param';
}

function collectExportsFromFile(sourceFile, valueMap) {
  sourceFile.forEachChild((node) => {
    if (
      ts.isVariableStatement(node) &&
      node.declarationList.flags & ts.NodeFlags.Const
    ) {
      for (const decl of node.declarationList.declarations) {
        if (!ts.isIdentifier(decl.name) || !decl.initializer) continue;
        const name = decl.name.text;
        const value = extractValue(decl.initializer, valueMap);
        if (value && isNodeExported(node)) {
          valueMap.set(name, value);
        }
      }
    }
    if (ts.isExportAssignment(node) && node.expression) {
      const value = extractValue(node.expression, valueMap);
      if (value) {
        valueMap.set('default', value);
      }
    }
  });
}

function isNodeExported(node) {
  return (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0;
}

function extractValue(initializer, valueMap) {
  if (ts.isStringLiteralLike(initializer)) {
    return { type: 'string', value: initializer.text };
  }
  if (ts.isNoSubstitutionTemplateLiteral(initializer)) {
    return { type: 'string', value: initializer.text };
  }
  if (ts.isTemplateExpression(initializer)) {
    const pattern = extractStringPattern(initializer);
    if (pattern != null) {
      return { type: 'string', value: pattern };
    }
  }
  if (ts.isObjectLiteralExpression(initializer)) {
    const map = new Map();
    for (const prop of initializer.properties) {
      if (ts.isPropertyAssignment(prop) && prop.initializer) {
        const key = getPropertyName(prop.name);
        if (!key) continue;
        if (ts.isArrowFunction(prop.initializer) && prop.initializer.body) {
          const body = prop.initializer.body;
          if (
            ts.isTemplateExpression(body) ||
            ts.isNoSubstitutionTemplateLiteral(body) ||
            ts.isStringLiteralLike(body)
          ) {
            const pattern = extractStringPattern(body, {});
            if (pattern) {
              map.set(key, {
                type: 'function',
                params: prop.initializer.parameters.map((p) =>
                  ts.isIdentifier(p.name) ? p.name.text : 'param'
                ),
                pattern,
              });
            }
          }
        } else {
          const value = extractValue(prop.initializer, valueMap);
          if (value) {
            map.set(key, value);
          }
        }
      }
    }
    return { type: 'object', value: map };
  }
  if (ts.isArrowFunction(initializer) && initializer.body) {
    if (
      ts.isTemplateExpression(initializer.body) ||
      ts.isNoSubstitutionTemplateLiteral(initializer.body) ||
      ts.isStringLiteralLike(initializer.body)
    ) {
      const pattern = extractStringPattern(initializer.body);
      if (pattern) {
        return {
          type: 'function',
          params: initializer.parameters.map((p) =>
            ts.isIdentifier(p.name) ? p.name.text : 'param'
          ),
          pattern,
        };
      }
    }
  }
  return null;
}

function getPropertyName(name) {
  if (!name) return null;
  if (ts.isIdentifier(name) || ts.isStringLiteralLike(name)) {
    return name.text;
  }
  if (ts.isNumericLiteral(name)) {
    return name.text;
  }
  return null;
}

function resolveValue(identifier, localMap, projectMap) {
  if (localMap.has(identifier)) {
    return localMap.get(identifier);
  }
  if (projectMap.has(identifier)) {
    return projectMap.get(identifier);
  }
  return null;
}

function resolvePropertyAccess(node, localMap, projectMap) {
  const parts = [];
  let current = node;
  while (ts.isPropertyAccessExpression(current)) {
    parts.unshift(current.name.text);
    current = current.expression;
  }
  if (ts.isIdentifier(current)) {
    const base = resolveValue(current.text, localMap, projectMap);
    if (!base || base.type !== 'object') return null;
    let currentValue = base.value;
    for (const part of parts) {
      const value = currentValue.get(part);
      if (!value) return null;
      if (value.type === 'object') {
        currentValue = value.value;
      } else {
        return value;
      }
    }
  }
  return null;
}

function evaluateArgument(arg, localMap, projectMap) {
  if (ts.isStringLiteralLike(arg) || ts.isTemplateExpression(arg)) {
    return extractStringPattern(arg);
  }
  if (ts.isIdentifier(arg)) {
    const value = resolveValue(arg.text, localMap, projectMap);
    if (!value) return null;
    if (value.type === 'string') {
      return value.value;
    }
    if (value.type === 'function') {
      return value.pattern;
    }
    return null;
  }
  if (ts.isPropertyAccessExpression(arg)) {
    const value = resolvePropertyAccess(arg, localMap, projectMap);
    if (!value) return null;
    if (value.type === 'string') return value.value;
    if (value.type === 'function') return value.pattern;
    return null;
  }
  if (ts.isCallExpression(arg) && ts.isPropertyAccessExpression(arg.expression)) {
    const value = resolvePropertyAccess(arg.expression, localMap, projectMap);
    if (!value) return null;
    if (value.type === 'function') {
      return value.pattern;
    }
  }
  return null;
}

function scanFileForCalls(sourceFile, filePath, projectMap) {
  const localMap = new Map();
  const results = [];

  sourceFile.forEachChild((node) => {
    if (
      ts.isVariableStatement(node) &&
      node.declarationList.flags & ts.NodeFlags.Const
    ) {
      for (const decl of node.declarationList.declarations) {
        if (ts.isIdentifier(decl.name) && decl.initializer) {
          const value = extractValue(decl.initializer, projectMap);
          if (value) {
            localMap.set(decl.name.text, value);
          }
        }
      }
    }
  });

  function visit(node) {
    if (ts.isCallExpression(node)) {
      if (ts.isPropertyAccessExpression(node.expression)) {
        const method = node.expression.name.text.toLowerCase();
        if (['get', 'post', 'put', 'delete', 'patch', 'options', 'head'].includes(method)) {
          const arg = node.arguments[0];
          const pathValue = arg ? evaluateArgument(arg, localMap, projectMap) : null;
          if (pathValue && pathValue.includes('/')) {
            results.push({
              method,
              path: pathValue,
              filePath,
            });
          }
        }
      } else if (
        ts.isIdentifier(node.expression) &&
        node.expression.text === 'fetch'
      ) {
        const arg = node.arguments[0];
        const pathValue = arg ? evaluateArgument(arg, localMap, projectMap) : null;
        if (pathValue && pathValue.includes('/')) {
          results.push({ method: 'fetch', path: pathValue, filePath });
        }
      }
    }
    node.forEachChild(visit);
  }
  sourceFile.forEachChild(visit);
  return results;
}

function walkFiles(dir, extensions = new Set(['.ts', '.tsx', '.js', '.jsx'])) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      files.push(...walkFiles(fullPath, extensions));
    } else if (extensions.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

function buildProjectMap(project) {
  const valueMap = new Map();
  const files = walkFiles(project.src);
  for (const file of files) {
    const sourceFile = parseSource(file);
    collectExportsFromFile(sourceFile, valueMap);
  }
  return valueMap;
}

function normalizePath(base, pathValue) {
  if (!pathValue) return null;
  if (pathValue.startsWith('http://') || pathValue.startsWith('https://')) {
    try {
      const url = new URL(pathValue);
      return url.pathname;
    } catch {
      return pathValue;
    }
  }
  if (pathValue.startsWith('/')) {
    if (base.endsWith('/')) {
      return base.replace(/\/$/, '') + pathValue;
    }
    return `${base}${pathValue}`;
  }
  return `${base}/${pathValue}`;
}

function main() {
  const usage = [];
  for (const project of projects) {
    if (!fs.existsSync(project.src)) continue;
    const projectMap = buildProjectMap(project);
    const files = walkFiles(project.src);
    const projectUsage = [];
    for (const file of files) {
      const sourceFile = parseSource(file);
      const calls = scanFileForCalls(sourceFile, file, projectMap);
      for (const call of calls) {
        const normalized = normalizePath(project.basePath, call.path);
        projectUsage.push({
          project: project.name,
          method: call.method,
          path: normalized ?? call.path,
          rawPath: call.path,
          filePath: call.filePath,
        });
      }
    }
    usage.push(...projectUsage);
  }

  const deduped = [];
  const seen = new Set();
  for (const item of usage) {
    const key = `${item.project}|${item.method}|${item.path}|${item.rawPath}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(item);
    }
  }

  console.log(JSON.stringify({ generatedAt: new Date().toISOString(), usage: deduped }, null, 2));
}

main();
