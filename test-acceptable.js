const fs = require('fs');

console.log('Testing acceptable-orphans.json loading...');

try {
  const acceptableConfig = JSON.parse(fs.readFileSync('scripts/acceptable-orphans.json', 'utf-8'));
  const acceptableOrphans = acceptableConfig.acceptable_orphans || [];
  console.log(`✅ Successfully loaded ${acceptableOrphans.length} acceptable orphans`);
} catch (e) {
  console.log('❌ Failed to load acceptable orphans:', e.message);
}
