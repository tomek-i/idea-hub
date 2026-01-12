const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const sqlitePath = path.join(
  __dirname,
  '..',
  'node_modules',
  '.pnpm',
  'better-sqlite3@12.6.0',
  'node_modules',
  'better-sqlite3'
);

if (fs.existsSync(sqlitePath)) {
  const bindingsPath = path.join(sqlitePath, 'build', 'Release', 'better_sqlite3.node');
  if (!fs.existsSync(bindingsPath)) {
    console.log('Building better-sqlite3 native bindings...');
    try {
      process.chdir(sqlitePath);
      execSync('npm run build-release', { stdio: 'inherit' });
      console.log('✓ better-sqlite3 built successfully');
    } catch (error) {
      console.warn('⚠ Failed to build better-sqlite3:', error.message);
    }
  } else {
    console.log('✓ better-sqlite3 bindings already exist');
  }
}
