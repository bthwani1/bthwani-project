const fs = require('fs');
const path = require('path');

// Simple test to see if we can find axiosInstance usage
function debugSearch() {
  const testFiles = [
    '../admin-dashboard/src/api/drivers.ts',
    '../bthwani-web/src/api/delivery.ts',
    '../app-user/src/api/userApi.ts'
  ];

  console.log('🔍 Debugging endpoint search patterns...\n');

  for (const file of testFiles) {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
      console.log(`📁 Checking: ${file}`);

      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');

      // Look for axiosInstance calls
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.includes('axiosInstance.get') ||
            line.includes('axiosInstance.post') ||
            line.includes('axiosInstance.patch') ||
            line.includes('axiosInstance.delete')) {

          console.log(`  ✅ Line ${i + 1}: ${line.trim()}`);
        }
      }

      // Look for admin/drivers patterns
      const adminDriversPattern = /admin\/drivers/;
      if (adminDriversPattern.test(content)) {
        console.log('  ✅ Found "admin/drivers" pattern');
      }

      console.log('');
    }
  }
}

debugSearch();

