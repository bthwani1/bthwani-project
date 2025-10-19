#!/usr/bin/env ts-node
/**
 * Extract Frontend API Calls
 * استخراج استدعاءات الـ API من الـ Frontend
 */

import * as fs from 'fs';
import * as path from 'path';

interface ApiCall {
  method: string;
  path: string;
  file: string;
  line: number;
}

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

function findFiles(dir: string, extensions: string[] = ['.ts', '.tsx', '.js', '.jsx']): string[] {
  const results: string[] = [];
  
  if (!fs.existsSync(dir)) {
    return results;
  }

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    
    // Skip certain directories
    if (item === 'node_modules' || item === 'dist' || item === 'build' || 
        item === '__tests__' || item === '__mocks__' || item === 'coverage') {
      continue;
    }

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results.push(...findFiles(fullPath, extensions));
    } else if (extensions.some(ext => fullPath.endsWith(ext))) {
      results.push(fullPath);
    }
  }

  return results;
}

function extractApiCalls(filePath: string): ApiCall[] {
  const calls: ApiCall[] = [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Match patterns like:
    // axiosInstance.get("/api/users")
    // axiosInstance.post(`/api/users/${id}`)
    // fetch("/api/users")
    // httpClient.delete("/api/users/123")
    
    const patterns = [
      // axiosInstance.METHOD("path")
      /(?:axiosInstance|apiClient|httpClient|typedClient)\.(?<method>get|post|put|patch|delete)\s*\(\s*["'`](?<path>[^"'`]+)["'`]/gi,
      
      // fetch("path", { method: "POST" })
      /fetch\s*\(\s*["'`](?<path>[^"'`]+)["'`]\s*,\s*\{[^}]*method\s*:\s*["'](?<method>[^"']+)["']/gi,
      
      // fetch("path") - defaults to GET
      /fetch\s*\(\s*["'`](?<path>[^"'`]+)["'`]\s*\)/gi,
      
      // useAdminQuery/useAdminAPI patterns
      /use(?:Admin)?(?:Query|Mutation|API)\s*<[^>]+>\s*\(\s*getEndpoint\s*\(\s*["']([^"']+)["']\s*\)/gi,
    ];

    for (const pattern of patterns) {
      let match: RegExpExecArray | null;
      
      while ((match = pattern.exec(line)) !== null) {
        let method = match.groups?.method || 'GET';
        let urlPath = match.groups?.path || match[1] || '';

        method = method.toUpperCase();
        
        // Clean up the path
        urlPath = urlPath
          .replace(/\$\{[^}]+\}/g, '{id}')      // Template literals ${...} -> {id}
          .replace(/:\w+/g, '{id}')              // :id style params -> {id}
          .replace(/\?.*$/, '')                  // Remove query parameters
          .replace(/\{param\}/g, '{id}')         // Normalize {param} to {id}
          .trim();

        if (urlPath && urlPath.startsWith('/')) {
          calls.push({
            method,
            path: urlPath,
            file: filePath,
            line: i + 1
          });
        }
      }
    }
  }

  return calls;
}

function main() {
  const targetDir = process.argv[2] || 'src';
  
  if (!fs.existsSync(targetDir)) {
    console.error(`Directory not found: ${targetDir}`);
    process.exit(1);
  }

  const files = findFiles(targetDir);
  const allCalls: ApiCall[] = [];

  for (const file of files) {
    const calls = extractApiCalls(file);
    allCalls.push(...calls);
  }

  // Output CSV
  console.log('method,path,file,line');
  for (const call of allCalls) {
    console.log(`${call.method},${call.path},${call.file},${call.line}`);
  }

  process.stderr.write(`Extracted ${allCalls.length} API calls from ${files.length} files\n`);
}

main();

