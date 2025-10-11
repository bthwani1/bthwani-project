const https = require('https');

// Test script for bThwani API staging endpoints
const testEndpoints = [
  {
    name: 'Root Endpoint',
    method: 'GET',
    path: '/',
    expectedStatus: 200
  },
  {
    name: 'API Documentation',
    method: 'GET',
    path: '/api-docs',
    expectedStatus: 200
  },
  {
    name: 'API v1 Root',
    method: 'GET',
    path: '/api/v1/',
    expectedStatus: 200
  },
  {
    name: 'User Routes (should require auth)',
    method: 'GET',
    path: '/api/v1/users/me',
    expectedStatus: 401
  },
  {
    name: 'Delivery Categories',
    method: 'GET',
    path: '/api/v1/delivery/categories',
    expectedStatus: 401
  }
];

async function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const url = `https://staging-api.bthwani.com${endpoint.path}`;

    const options = {
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'bThwani-API-Test/1.0'
      }
    };

    const req = https.request(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const result = {
          name: endpoint.name,
          status: res.statusCode,
          expected: endpoint.expectedStatus,
          success: res.statusCode === endpoint.expectedStatus,
          responseTime: res.headers['x-response-time'] || 'unknown',
          contentType: res.headers['content-type'] || 'unknown'
        };

        if (res.statusCode === 200 && data) {
          try {
            result.body = JSON.parse(data);
          } catch (e) {
            result.body = data.substring(0, 200) + '...';
          }
        }

        resolve(result);
      });
    });

    req.on('error', (error) => {
      resolve({
        name: endpoint.name,
        error: error.message,
        success: false
      });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        name: endpoint.name,
        error: 'Timeout after 10 seconds',
        success: false
      });
    });

    req.end();
  });
}

async function runTests() {
  console.log('🚀 Starting bThwani API Staging Tests...\n');
  console.log('=' .repeat(60));

  const results = [];

  for (const endpoint of testEndpoints) {
    console.log(`Testing: ${endpoint.name}`);
    console.log(`Method: ${endpoint.method} ${endpoint.path}`);

    try {
      const result = await testEndpoint(endpoint);
      results.push(result);

      if (result.success) {
        console.log(`✅ Status: ${result.status} (Expected: ${result.expected})`);
      } else if (result.error) {
        console.log(`❌ Error: ${result.error}`);
      } else {
        console.log(`⚠️  Status: ${result.status} (Expected: ${result.expected})`);
      }

      if (result.responseTime !== 'unknown') {
        console.log(`⏱️  Response Time: ${result.responseTime}ms`);
      }

      console.log('-'.repeat(40));
    } catch (error) {
      console.log(`❌ Test failed: ${error.message}`);
      console.log('-'.repeat(40));
    }
  }

  // Summary
  console.log('\n📊 Test Summary:');
  console.log('='.repeat(60));

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((successful / results.length) * 100).toFixed(1)}%`);

  console.log('\n📋 Detailed Results:');
  results.forEach(result => {
    const icon = result.success ? '✅' : '❌';
    console.log(`${icon} ${result.name}: ${result.status || result.error}`);
  });

  // Recommendations
  console.log('\n💡 Recommendations:');
  if (successful === results.length) {
    console.log('🎉 All tests passed! The staging API is working correctly.');
  } else if (successful > 0) {
    console.log('⚠️  Some tests failed. Please check:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.name}: ${r.error || `Status ${r.status} (expected ${r.expected})`}`);
    });
  } else {
    console.log('🚨 All tests failed. Possible issues:');
    console.log('   - Staging server is not running');
    console.log('   - Domain DNS is not configured');
    console.log('   - SSL certificate issues');
    console.log('   - Network connectivity problems');
  }

  console.log('\n🔗 Useful URLs:');
  console.log('   - Swagger Docs: https://staging-api.bthwani.com/api-docs');
  console.log('   - API Base URL: https://staging-api.bthwani.com/api/v1');
  console.log('   - Production URL: https://api.bthwani.com/api/v1');

  return results;
}

// Run the tests
runTests().catch(console.error);
