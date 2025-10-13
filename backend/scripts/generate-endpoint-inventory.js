#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const projectRoot = path.resolve(__dirname, '..');
const srcRoot = path.join(projectRoot, 'src');
const routesRoot = path.join(srcRoot, 'routes');
const indexPath = path.join(srcRoot, 'index.ts');

function parseSource(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return ts.createSourceFile(filePath, content, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TS);
}

function resolveModule(specifier, fromFile) {
  const baseDir = path.dirname(fromFile);
  const resolved = path.resolve(baseDir, specifier);
  const candidates = [
    `${resolved}.ts`,
    `${resolved}.tsx`,
    `${resolved}.js`,
    `${resolved}.mjs`,
    `${resolved}.cjs`,
    path.join(resolved, 'index.ts'),
    path.join(resolved, 'index.tsx'),
    path.join(resolved, 'index.js'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return path.resolve(candidate);
    }
  }
  return null;
}

function gatherImports(sourceFile) {
  const map = new Map();
  sourceFile.forEachChild((node) => {
    if (ts.isImportDeclaration(node) && node.importClause && node.moduleSpecifier) {
      const moduleText = node.moduleSpecifier.text;
      if (node.importClause.name) {
        const importName = node.importClause.name.text;
        const resolved = resolveModule(moduleText, sourceFile.fileName);
        if (resolved) {
          map.set(importName, resolved);
        }
      }
    }
  });
  return map;
}

function gatherConstants(sourceFile) {
  const constants = new Map();
  sourceFile.forEachChild(function visit(node) {
    if (
      ts.isVariableStatement(node) &&
      node.declarationList.flags & ts.NodeFlags.Const
    ) {
      for (const decl of node.declarationList.declarations) {
        if (ts.isIdentifier(decl.name) && decl.initializer) {
          const value = evaluateExpression(decl.initializer, constants);
          if (typeof value === 'string') {
            constants.set(decl.name.text, value);
          }
        }
      }
    }
    node.forEachChild(visit);
  });
  return constants;
}

function evaluateExpression(expr, constants) {
  if (!expr) return null;
  if (ts.isStringLiteralLike(expr)) {
    return expr.text;
  }
  if (ts.isTemplateExpression(expr)) {
    let result = expr.head.text;
    for (const span of expr.templateSpans) {
      const spanValue = evaluateExpression(span.expression, constants);
      if (spanValue == null) {
        return null;
      }
      result += spanValue;
      result += span.literal.text;
    }
    return result;
  }
  if (ts.isNoSubstitutionTemplateLiteral(expr)) {
    return expr.text;
  }
  if (ts.isIdentifier(expr)) {
    return constants.get(expr.text) ?? null;
  }
  if (ts.isBinaryExpression(expr) && expr.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    const left = evaluateExpression(expr.left, constants);
    const right = evaluateExpression(expr.right, constants);
    if (typeof left === 'string' && typeof right === 'string') {
      return left + right;
    }
    return null;
  }
  return null;
}

function collectAppUses(sourceFile, constants, importMap) {
  const uses = [];
  function visit(node) {
    if (ts.isCallExpression(node) && node.expression) {
      if (
        ts.isPropertyAccessExpression(node.expression) &&
        ts.isIdentifier(node.expression.expression) &&
        node.expression.expression.text === 'app' &&
        node.expression.name.text === 'use'
      ) {
        const args = node.arguments;
        if (args.length >= 2) {
          const pathArg = evaluateExpression(args[0], constants);
          const handler = args[1];
          if (typeof pathArg === 'string') {
            if (ts.isIdentifier(handler)) {
              const routerName = handler.text;
              const filePath = importMap.get(routerName);
              uses.push({ basePath: pathArg, routerName, filePath });
            }
          }
        }
      }
    }
    node.forEachChild(visit);
  }
  sourceFile.forEachChild(visit);
  return uses;
}

function isRouterCreation(node) {
  return (
    ts.isVariableDeclaration(node) &&
    ts.isIdentifier(node.name) &&
    node.initializer &&
    (ts.isCallExpression(node.initializer) || ts.isAwaitExpression(node.initializer))
  );
}

function collectRouterNames(sourceFile) {
  const routers = new Set();
  sourceFile.forEachChild(function visit(node) {
    if (ts.isVariableStatement(node)) {
      node.declarationList.forEachChild((decl) => {
        if (
          ts.isVariableDeclaration(decl) &&
          ts.isIdentifier(decl.name) &&
          decl.initializer &&
          ts.isCallExpression(decl.initializer) &&
          ts.isIdentifier(decl.initializer.expression) &&
          decl.initializer.expression.text.toLowerCase() === 'router'
        ) {
          routers.add(decl.name.text);
        }
      });
    }
    node.forEachChild(visit);
  });
  if (routers.size === 0) {
    routers.add('router');
  }
  return routers;
}

function collectRoutesFromFile(filePath, basePath, visited = new Set()) {
  const results = [];
  if (!filePath || visited.has(filePath)) {
    return results;
  }
  visited.add(filePath);
  const sourceFile = parseSource(filePath);
  const routerNames = collectRouterNames(sourceFile);

  function visit(node) {
    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
      const resolved = resolveRouteCall(
        node.expression,
        node,
        routerNames,
        sourceFile,
        filePath,
        basePath,
        visited
      );
      if (resolved) {
        if (Array.isArray(resolved)) {
          results.push(...resolved);
        } else {
          results.push(resolved);
        }
      }
    }
    node.forEachChild(visit);
  }
  sourceFile.forEachChild(visit);
  return results;
}

function resolveRouteCall(expr, node, routerNames, sourceFile, filePath, basePath, visited) {
  if (ts.isIdentifier(expr.expression) && routerNames.has(expr.expression.text)) {
    const method = expr.name.text.toLowerCase();
    if (['get', 'post', 'put', 'delete', 'patch', 'options', 'head'].includes(method)) {
      const subPath = evaluateExpression(node.arguments[0], new Map());
      const fullPath = combinePaths(basePath, subPath ?? '');
      return { method, path: fullPath, filePath };
    }
    if (expr.name.text === 'use' && node.arguments.length >= 2) {
      const subPath = evaluateExpression(node.arguments[0], new Map());
      const handler = node.arguments[1];
      const nestedBase = combinePaths(basePath, subPath ?? '');

      const requireCall =
        ts.isCallExpression(handler) &&
        ts.isIdentifier(handler.expression) &&
        handler.expression.text === 'require'
          ? handler
          : ts.isPropertyAccessExpression(handler) &&
              ts.isCallExpression(handler.expression) &&
              ts.isIdentifier(handler.expression.expression) &&
              handler.expression.expression.text === 'require'
            ? handler.expression
            : null;

      if (requireCall && requireCall.arguments.length >= 1) {
        const moduleSpecifier = evaluateExpression(requireCall.arguments[0], new Map());
        if (moduleSpecifier) {
          const resolved = resolveModule(moduleSpecifier, filePath);
          if (resolved) {
            return collectRoutesFromFile(resolved, nestedBase, visited);
          }
        }
        return null;
      }

      if (ts.isIdentifier(handler)) {
        const specifier = findLocalImport(sourceFile, handler.text);
        const resolved = specifier ? resolveModule(specifier, filePath) : null;
        if (resolved) {
          return collectRoutesFromFile(resolved, nestedBase, visited);
        }
      }
    }
    return null;
  }

  if (
    ts.isCallExpression(expr.expression) &&
    ts.isPropertyAccessExpression(expr.expression.expression)
  ) {
    const baseCall = expr.expression;
    const innerExpr = baseCall.expression;
    if (
      ts.isIdentifier(innerExpr.expression) &&
      routerNames.has(innerExpr.expression.text) &&
      innerExpr.name.text === 'route'
    ) {
      const subPath = evaluateExpression(baseCall.arguments[0], new Map());
      const method = expr.name.text.toLowerCase();
      if (['get', 'post', 'put', 'delete', 'patch', 'options', 'head'].includes(method)) {
        const fullPath = combinePaths(basePath, subPath ?? '');
        return { method, path: fullPath, filePath };
      }
    }
  }

  return null;
}

function combinePaths(base, sub) {
  if (!sub || sub === '/') return base;
  if (sub.startsWith('/')) {
    if (base.endsWith('/')) {
      return `${base.replace(/\/$/, '')}${sub}`;
    }
    return `${base}${sub}`;
  }
  if (base.endsWith('/')) {
    return `${base}${sub}`;
  }
  return `${base}/${sub}`;
}

function findLocalImport(sourceFile, identifier) {
  let result = null;
  sourceFile.forEachChild((node) => {
    if (ts.isImportDeclaration(node) && node.importClause && node.moduleSpecifier) {
      const clause = node.importClause;
      if (clause.namedBindings && ts.isNamedImports(clause.namedBindings)) {
        for (const element of clause.namedBindings.elements) {
          if (element.name.text === identifier) {
            result = node.moduleSpecifier.text;
          }
        }
      }
      if (clause.name && clause.name.text === identifier) {
        result = node.moduleSpecifier.text;
      }
    }
  });
  return result;
}

function main() {
  const indexSource = parseSource(indexPath);
  const importMap = gatherImports(indexSource);
  const constants = gatherConstants(indexSource);
  const appUses = collectAppUses(indexSource, constants, importMap);

  const inventory = [];
  for (const use of appUses) {
    if (!use.filePath) continue;
    const routes = collectRoutesFromFile(use.filePath, use.basePath);
    for (const route of routes) {
      inventory.push(route);
    }
  }

  inventory.sort((a, b) => {
    if (a.basePath === b.basePath) {
      if (a.path === b.path) {
        return a.method.localeCompare(b.method);
      }
      return (a.path || '').localeCompare(b.path || '');
    }
    return a.basePath.localeCompare(b.basePath);
  });

  console.log(JSON.stringify({ generatedAt: new Date().toISOString(), endpoints: inventory }, null, 2));
}

main();
