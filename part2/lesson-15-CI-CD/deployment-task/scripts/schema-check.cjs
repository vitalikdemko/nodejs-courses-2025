const { execSync } = require('child_process');

try {
  const output = execSync('pnpm run schema:log', { encoding: 'utf8' });
  if (output.trim()) {
    console.error('Schema differences detected:', output);
    process.exit(1);
  } else {
    console.log('Schema is in sync');
    process.exit(0);
  }
} catch (e) {
  console.error('Error during schema check:', e.message);
  process.exit(1);
}
