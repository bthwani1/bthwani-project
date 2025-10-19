#!/usr/bin/env node
/**
 * Block raw fetch/axios usage
 * منع استخدام fetch/axios المباشر
 */

const fs = require('fs');
const path = require('path');

// Allowed wrappers (typed clients)
const ALLOW_PATTERN = /(httpClient|apiClient|typedClient|axiosInstance|useAdminAPI|useAdminQuery|useAdminMutation)/;

// Directories to scan
const DIRS = [
  'admin-dashboard',
  'bthwani-web',
  'app-user',
  'vendor-app',
  'rider-app',
  'field-marketers'
];

// Files/dirs to exclude  
const EXCLUDE = /node_modules|[\/\\]dist[\/\\]|[\/\\]build[\/\\]|__tests__|__mocks__|[\/\\]coverage[\/\\]|[\/\\]public[\/\\]sw\.js|service-worker|axios-instance|httpClient\.ts|apiClient\.ts|axiosInstance\.ts|authService\.ts|uploadFileToCloudinary|mapUtils\.ts|[\/\\]examples[\/\\]|TestOtpPage|triggerSOS|upload\.ts/;

function findFiles(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  const results = [];
  
  if (!fs.existsSync(dir)) {
    return results;
  }

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    
    if (EXCLUDE.test(fullPath)) {
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

function checkFile(filePath) {
  const violations = [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  // Check if file imports axios from a wrapper (not from 'axios' package directly)
  const hasWrapperImport = /import\s+.*axios.*\s+from\s+['"](?!\baxios\b)/.test(content);
  
  // If file imports from wrapper like '../utils/axios' or './axios-instance', skip it
  if (hasWrapperImport) {
    return violations;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNumber = i + 1;

    // Skip comment lines and TODO lines
    if (line.trim().startsWith('//') || line.trim().startsWith('*') || line.trim().startsWith('/*')) {
      continue;
    }

    // Skip lines with axios.create (creating instances is allowed)
    if (/axios\.create/.test(line)) {
      continue;
    }

    // Skip function declarations named 'fetch'
    if (/\b(async\s+)?function\s+fetch\(/.test(line)) {
      continue;
    }

    // Skip local function calls to 'fetch' (not global fetch)
    if (/\bfetch\(/.test(line) && !line.includes('await fetch(') && !line.includes('= fetch(')) {
      continue;
    }

    // Skip external API calls (Google Maps, Firebase, etc.)
    if (/identitytoolkit\.googleapis\.com|securetoken\.googleapis\.com|maps\.googleapis\.com|googleapis\.com|cloudinary\.com/.test(line)) {
      continue;
    }

    // Skip React Native NetInfo.fetch()
    if (/NetInfo\.fetch\(\)/.test(line)) {
      continue;
    }

    // Check for fetch( or axios.
    if (/\bfetch\(|\baxios\./.test(line)) {
      // If it doesn't match allowed wrapper, it's a violation
      if (!ALLOW_PATTERN.test(line)) {
        violations.push({
          file: filePath,
          line: lineNumber,
          code: line.trim()
        });
      }
    }
  }

  return violations;
}

function main() {
  console.log('🔍 Searching for raw fetch/axios usage...\n');

  const allViolations = [];
  
  for (const dir of DIRS) {
    if (!fs.existsSync(dir)) {
      continue;
    }

    console.log(`  Scanning ${dir}...`);
    const files = findFiles(dir);
    console.log(`    Found ${files.length} files`);

    for (const file of files) {
      const violations = checkFile(file);
      allViolations.push(...violations);
    }
  }

  // Create artifacts directory
  if (!fs.existsSync('artifacts')) {
    fs.mkdirSync('artifacts', { recursive: true });
  }

  // Write results
  if (allViolations.length > 0) {
    const output = allViolations
      .map(v => `${v.file}:${v.line}:${v.code}`)
      .join('\n');
    
    fs.writeFileSync('artifacts/grep_raw_fetch.txt', output);

    console.log('');
    console.log(`❌ Raw fetch/axios detected!`);
    console.log('');
    console.log(`Found ${allViolations.length} violations:`);
    
    allViolations.slice(0, 10).forEach(v => {
      console.log(`  ${v.file}:${v.line}`);
      console.log(`    ${v.code}`);
    });

    if (allViolations.length > 10) {
      console.log(`  ... and ${allViolations.length - 10} more`);
    }

    console.log('');
    console.log('Full report: artifacts/grep_raw_fetch.txt');
    process.exit(1);
  } else {
    fs.writeFileSync('artifacts/grep_raw_fetch.txt', '');
    console.log('');
    console.log('✅ No raw fetch/axios usage detected!');
    process.exit(0);
  }
}

main();

