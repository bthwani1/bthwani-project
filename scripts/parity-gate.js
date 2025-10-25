#!/usr/bin/env node

/**
 * Parity Gate - يتحقق من تطابق FE-BE APIs
 * يقارن بين النهايات في OpenAPI spec والنهايات المستخدمة في الواجهات الأمامية
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// إعدادات
const CONFIG = {
  openapiPath: path.join(__dirname, '..', 'openapi.yaml'),
  frontends: [
    { name: 'admin-dashboard', path: 'admin-dashboard/src' },
    { name: 'app-user', path: 'app-user/src' },
    { name: 'bthwani-web', path: 'bthwani-web/src' },
    { name: 'field-marketers', path: 'field-marketers/src' },
    { name: 'rider-app', path: 'rider-app/src' },
    { name: 'vendor-app', path: 'vendor-app/src' },
  ],
  allowedGapPercentage: 5, // نسبة الفجوات المسموحة
  excludedPatterns: [
    /^\/api\/.*$/, // Next.js API routes
    /^\/_next\/.*$/, // Next.js internal
    /^\/static\/.*$/, // Static files
    /^\/.*\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/, // Assets
  ],
};

// تحليل OpenAPI spec
function parseOpenAPISpec() {
  try {
    const spec = yaml.load(fs.readFileSync(CONFIG.openapiPath, 'utf8'));
    const endpoints = new Set();

    if (spec.paths) {
      Object.keys(spec.paths).forEach(path => {
        const methods = spec.paths[path];
        Object.keys(methods).forEach(method => {
          if (['get', 'post', 'put', 'patch', 'delete'].includes(method.toLowerCase())) {
            endpoints.add(`${method.toUpperCase()} ${normalizePath(path)}`);
          }
        });
      });
    }

    return endpoints;
  } catch (error) {
    console.error('خطأ في قراءة OpenAPI spec:', error.message);
    process.exit(1);
  }
}

// تطبيع المسارات
function normalizePath(path) {
  return path.replace(/\{[^}]+\}/g, ':param'); // تحويل {id} إلى :param
}

// استخراج النهايات المستخدمة من الواجهة الأمامية
function extractFrontendEndpoints(frontend) {
  const endpoints = new Set();
  const frontendPath = path.join(__dirname, '..', frontend.path);

  if (!fs.existsSync(frontendPath)) {
    console.warn(`تحذير: مجلد ${frontend.path} غير موجود`);
    return endpoints;
  }

  // البحث عن ملفات API والمكونات التي تستخدم API
  const apiFiles = findApiUsageFiles(frontendPath);

  apiFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const foundEndpoints = extractEndpointsFromUsage(content);
      foundEndpoints.forEach(endpoint => endpoints.add(endpoint));
    } catch (error) {
      console.warn(`تحذير: خطأ في قراءة ${file}:`, error.message);
    }
  });

  return endpoints;
}

// البحث عن ملفات تستخدم API
function findApiUsageFiles(dir) {
  const files = [];

  function traverse(currentDir, depth = 0) {
    // لا نبحث بعمق كبير لتجنب ملفات node_modules والمجلدات العميقة
    if (depth > 3) return;

    try {
      const items = fs.readdirSync(currentDir);

      items.forEach(item => {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== 'generated') {
          traverse(fullPath, depth + 1);
        } else if (stat.isFile() && isApiUsageFile(item, fullPath)) {
          files.push(fullPath);
        }
      });
    } catch (error) {
      // تجاهل الأخطاء في القراءة
    }
  }

  traverse(dir);
  return files;
}

// التحقق من أن الملف يحتوي على استخدام API
function isApiUsageFile(filename, fullPath) {
  const extensions = ['.ts', '.tsx', '.js', '.jsx'];
  if (!extensions.some(ext => filename.endsWith(ext))) return false;

  // استبعاد ملفات معينة
  if (['config', 'setup', 'test', 'spec'].some(pattern => filename.includes(pattern))) return false;

  // التحقق السريع من وجود API calls
  try {
    const content = fs.readFileSync(fullPath, 'utf8').substring(0, 1000);
    return /\b(api|fetch|axios|http)\b/i.test(content) ||
           /\/api\//.test(content) ||
           /['"`]\/[^'"`]+['"`]/.test(content);
  } catch {
    return false;
  }
}

// استخراج النهايات من ملفات الاستخدام
function extractEndpointsFromUsage(content) {
  const endpoints = new Set();

  // أنماط مختلفة لاستخراج API endpoints من الكود
  const patterns = [
    // Direct API calls: api.get('/endpoint'), axios.get('/endpoint')
    /\b(api|axios|fetch)\.(get|post|put|patch|delete|head|options)\s*\(\s*['"`]([^'"`]+)['"`]/gi,
    // SDK calls: AdminApi.adminControllerGetUsers()
    /\b\w+Api\.\w+(get|post|put|patch|delete|head|options)\w*\s*\(/gi,
    // String literals that look like API paths
    /(?:['"`])\/(?:api|admin|auth|users|drivers|orders|payments|wallet)[^'"`\s]*/g,
  ];

  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      let endpoint = '';
      let method = 'GET'; // default

      if (match[3]) {
        // Direct API call with method and path
        method = match[2].toUpperCase();
        endpoint = match[3];
      } else if (match[4]) {
        // SDK call - extract method from function name
        const funcName = match[4];
        method = extractMethodFromFunctionName(funcName);
        // Extract path from context around the match
        const context = content.substr(Math.max(0, match.index - 100), 200);
        const pathMatch = context.match(/['"`](\/[^'"`]+)['"`]/);
        if (pathMatch) {
          endpoint = pathMatch[1];
        }
      } else if (match[5]) {
        // String literal that looks like API path
        endpoint = match[5];
      }

      if (endpoint && isValidEndpoint(endpoint)) {
        endpoints.add(`${method} ${normalizePath(endpoint)}`);
      }
    }
  });

  return endpoints;
}

// استخراج HTTP method من اسم الدالة
function extractMethodFromFunctionName(funcName) {
  const methodMap = {
    'get': 'GET',
    'post': 'POST',
    'put': 'PUT',
    'patch': 'PATCH',
    'delete': 'DELETE',
    'head': 'HEAD',
    'options': 'OPTIONS',
  };

  for (const [key, value] of Object.entries(methodMap)) {
    if (funcName.toLowerCase().startsWith(key)) {
      return value;
    }
  }

  return 'GET'; // default
}

// التحقق من صحة النهاية
function isValidEndpoint(endpoint) {
  // استبعاد النهايات المحظورة
  return CONFIG.excludedPatterns.every(pattern => !pattern.test(endpoint)) &&
         endpoint.startsWith('/') &&
         !endpoint.includes('*') &&
         endpoint.length > 1;
}

// حساب التطابق
function calculateParity(backendEndpoints, frontendEndpoints) {
  const matched = new Set();
  const unmatched = new Set();

  frontendEndpoints.forEach(feEndpoint => {
    if (backendEndpoints.has(feEndpoint)) {
      matched.add(feEndpoint);
    } else {
      unmatched.add(feEndpoint);
    }
  });

  const coverage = frontendEndpoints.size > 0 ?
    (matched.size / frontendEndpoints.size) * 100 : 100;

  return {
    total: frontendEndpoints.size,
    matched: matched.size,
    unmatched: unmatched.size,
    coverage: coverage,
    matchedEndpoints: Array.from(matched),
    unmatchedEndpoints: Array.from(unmatched),
  };
}

// التقرير الرئيسي
function generateReport(results) {
  console.log('🔍 تقرير Parity Gate - تطابق FE-BE APIs\n');
  console.log('=' .repeat(50));

  let totalGaps = 0;
  let totalEndpoints = 0;

  results.forEach(result => {
    console.log(`📱 ${result.frontend}:`);
    console.log(`   تغطية: ${result.parity.coverage.toFixed(1)}%`);
    console.log(`   إجمالي النهايات: ${result.parity.total}`);
    console.log(`   متطابقة: ${result.parity.matched}`);
    console.log(`   غير متطابقة: ${result.parity.unmatched}`);

    if (result.parity.unmatched > 0) {
      console.log(`   ❌ فجوات:`);
      result.parity.unmatchedEndpoints.forEach(endpoint => {
        console.log(`      - ${endpoint}`);
      });
    }

    console.log('');

    totalGaps += result.parity.unmatched;
    totalEndpoints += result.parity.total;
  });

  const overallCoverage = totalEndpoints > 0 ?
    ((totalEndpoints - totalGaps) / totalEndpoints) * 100 : 100;

  console.log('📊 الملخص العام:');
  console.log(`   إجمالي النهايات: ${totalEndpoints}`);
  console.log(`   إجمالي الفجوات: ${totalGaps}`);
  console.log(`   التغطية العامة: ${overallCoverage.toFixed(1)}%`);

  // التحقق من الحد الأقصى المسموح
  const allowedGaps = (CONFIG.allowedGapPercentage / 100) * totalEndpoints;
  if (totalGaps > allowedGaps) {
    console.log(`\n❌ فشل: عدد الفجوات (${totalGaps}) يتجاوز الحد المسموح (${Math.round(allowedGaps)})`);
    console.log(`   نسبة الفجوات: ${((totalGaps / totalEndpoints) * 100).toFixed(1)}% (الحد: ${CONFIG.allowedGapPercentage}%)`);
    return false;
  } else {
    console.log(`\n✅ نجح: التطابق ضمن الحدود المسموحة`);
    console.log(`   نسبة الفجوات: ${((totalGaps / totalEndpoints) * 100).toFixed(1)}% (الحد: ${CONFIG.allowedGapPercentage}%)`);
    return true;
  }
}

// الدالة الرئيسية
async function main() {
  console.log('🚀 بدء فحص Parity Gate...\n');

  // تحليل BE APIs
  console.log('📋 تحليل OpenAPI spec...');
  const backendEndpoints = parseOpenAPISpec();
  console.log(`   تم العثور على ${backendEndpoints.size} نهاية BE\n`);

  // تحليل FE APIs
  console.log('📱 تحليل الواجهات الأمامية...');
  const results = CONFIG.frontends.map(frontend => {
    console.log(`   تحليل ${frontend.name}...`);
    const frontendEndpoints = extractFrontendEndpoints(frontend);
    const parity = calculateParity(backendEndpoints, frontendEndpoints);

    return {
      frontend: frontend.name,
      parity,
      frontendEndpoints: Array.from(frontendEndpoints),
    };
  });

  console.log('');

  // إنشاء التقرير
  const success = generateReport(results);

  // حفظ التقرير
  const report = {
    timestamp: new Date().toISOString(),
    config: CONFIG,
    results,
    success,
  };

  fs.writeFileSync(
    path.join(__dirname, '..', 'parity-gate-report.json'),
    JSON.stringify(report, null, 2)
  );

  console.log('\n💾 تم حفظ التقرير في: parity-gate-report.json');

  // Exit code
  process.exit(success ? 0 : 1);
}

// تشغيل البرنامج
if (require.main === module) {
  main().catch(error => {
    console.error('خطأ في تشغيل Parity Gate:', error);
    process.exit(1);
  });
}

module.exports = { main, parseOpenAPISpec, extractFrontendEndpoints, calculateParity };
