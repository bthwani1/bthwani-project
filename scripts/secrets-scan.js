const fs = require('fs');
const path = require('path');

// Patterns for detecting secrets
const SECRET_PATTERNS = [
  // Private keys
  /-----BEGIN PRIVATE KEY-----[\s\S]*?-----END PRIVATE KEY-----/g,
  /-----BEGIN RSA PRIVATE KEY-----[\s\S]*?-----END RSA PRIVATE KEY-----/g,

  // API Keys (generic)
  /api[_-]?key\s*[:=]\s*['"]?([a-zA-Z0-9_\-]{20,})['"]?/gi,
  /apikey\s*[:=]\s*['"]?([a-zA-Z0-9_\-]{20,})['"]?/gi,

  // JWT Secrets
  /jwt[_-]?secret\s*[:=]\s*['"]?([a-zA-Z0-9_\-]{20,})['"]?/gi,

  // MongoDB URIs with credentials
  /mongodb\+srv:\/\/([^:]+):([^@]+)@/g,
  /mongodb:\/\/([^:]+):([^@]+)@/g,

  // Generic tokens
  /token\s*[:=]\s*['"]?([a-zA-Z0-9_\-]{30,})['"]?/gi,
  /secret\s*[:=]\s*['"]?([a-zA-Z0-9_\-]{20,})['"]?/gi,

  // Passwords
  /password\s*[:=]\s*['"]?([^'"\s]{8,})['"]?/gi,
  /pwd\s*[:=]\s*['"]?([^'"\s]{8,})['"]?/gi,
];

const IGNORE_PATTERNS = [
  /\.git/,
  /node_modules/,
  /\.env$/,
  /\.env\./,
  /secrets-scan\.js$/,
];

function shouldIgnore(filePath) {
  return IGNORE_PATTERNS.some(pattern => pattern.test(filePath));
}

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const findings = [];

    SECRET_PATTERNS.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          // Redact sensitive data
          const redacted = match.length > 50 ?
            match.substring(0, 20) + '...' + match.substring(match.length - 10) :
            match;

          findings.push({
            file: filePath,
            pattern: index,
            match: redacted,
            line: getLineNumber(content, match)
          });
        });
      }
    });

    return findings;
  } catch (error) {
    return [];
  }
}

function getLineNumber(content, searchString) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(searchString.substring(0, 50))) {
      return i + 1;
    }
  }
  return 0;
}

function scanDirectory(dirPath) {
  const findings = [];

  function walk(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        if (!shouldIgnore(filePath)) {
          walk(filePath);
        }
      } else if (stat.isFile() && !shouldIgnore(filePath)) {
        const fileFindings = scanFile(filePath);
        findings.push(...fileFindings);
      }
    });
  }

  walk(dirPath);
  return findings;
}

// Main execution
const projectRoot = process.cwd();
console.log('🔍 Scanning for secrets in:', projectRoot);
console.log('='.repeat(60));

const findings = scanDirectory(projectRoot);

if (findings.length === 0) {
  console.log('✅ No secrets found!');
} else {
  console.log(`⚠️  Found ${findings.length} potential secrets:`);
  console.log('');

  findings.forEach((finding, index) => {
    console.log(`${index + 1}. File: ${finding.file}`);
    console.log(`   Line: ${finding.line}`);
    console.log(`   Match: ${finding.match}`);
    console.log('');
  });
}

console.log('='.repeat(60));
console.log('Note: This is a basic scan. Consider using specialized tools like gitleaks for comprehensive analysis.');
