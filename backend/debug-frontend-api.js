const fs = require('fs');
const path = require('path');

// Simple test to see what API calls look like in frontend
function debugFrontendApiCalls() {
  const testFiles = [
    '../admin-dashboard/src/api/drivers.ts',
    '../bthwani-web/src/api/delivery.ts',
    '../app-user/src/api/userApi.ts'
  ];

  console.log('🔍 Debugging frontend API calls...\n');

  for (const file of testFiles) {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
      console.log(`📁 Checking: ${file}`);

      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Look for various API call patterns
        if (line.includes('axiosInstance') || line.includes('axios')) {
          console.log(`  Line ${i + 1}: ${line.trim()}`);

          // Try to extract URL from axios calls
          const axiosMatch = line.match(/(?:axiosInstance|axios)\.(get|post|patch|put|delete)\s*\(\s*["']([^"']+)["']/);
          if (axiosMatch) {
            console.log(`    -> Method: ${axiosMatch[1].toUpperCase()}, URL: ${axiosMatch[2]}`);
          }
        }
      }

      console.log('');
    }
  }
}

debugFrontendApiCalls();

