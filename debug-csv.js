const fs = require('fs');

function debugCsv(p) {
  console.log(`\n=== Debugging file: ${p} ===`);

  if (!fs.existsSync(p)) {
    console.log(`File does not exist`);
    return;
  }

  const content = fs.readFileSync(p, 'utf-8');
  console.log(`Raw content length: ${content.length}`);
  console.log(`Raw content (first 200 chars): ${content.substring(0, 200)}`);

  const trimmed = content.trim();
  console.log(`Trimmed content length: ${trimmed.length}`);
  console.log(`Trimmed content (first 200 chars): ${trimmed.substring(0, 200)}`);

  if (!trimmed) {
    console.log(`File is considered empty after trim!`);
    return;
  }

  const lines = trimmed.split('\n');
  console.log(`Number of lines: ${lines.length}`);
  console.log(`First line: ${lines[0]}`);
  console.log(`Second line: ${lines[1]}`);
}

// Test all CSV files
debugCsv('artifacts/fe_calls_admin.csv');
debugCsv('artifacts/fe_calls_web.csv');
debugCsv('artifacts/fe_calls_app.csv');
