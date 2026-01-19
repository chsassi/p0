import chokidar from 'chokidar';
import { spawn } from 'child_process';
import path from 'path';

const CSS_SOURCE = 'src/styles';
const SCRIPT_SOURCE = 'src/scripts';

/**
 * Run a build script
 */
function runBuild(script, args = []) {
  return new Promise((resolve, reject) => {
    const proc = spawn('node', [script, ...args], { stdio: 'inherit', shell: true });
    proc.on('close', code => (code === 0 ? resolve() : reject(new Error(`Exit ${code}`))));
    proc.on('error', reject);
  });
}

/**
 * Debounce function to prevent rapid rebuilds
 */
function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

console.log('[WATCH] Starting file watcher...');
console.log(`  CSS: ${CSS_SOURCE}/*.extended.css`);
console.log(`  Scripts: ${SCRIPT_SOURCE}/*.extended.ts`);
console.log('\nPress Ctrl+C to stop.\n');

// Watch CSS files
const cssWatcher = chokidar.watch(`${CSS_SOURCE}/*.extended.css`, {
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 100,
    pollInterval: 50
  }
});

const handleCSSChange = debounce(async (filepath) => {
  const filename = path.basename(filepath);
  console.log(`\n[WATCH] CSS changed: ${filename}`);
  try {
    await runBuild('scripts/build-styles.js', [filename]);
  } catch (error) {
    console.error('[ERROR]', error.message);
  }
}, 150);

cssWatcher.on('change', handleCSSChange);
cssWatcher.on('add', handleCSSChange);

// Watch TypeScript files
const scriptWatcher = chokidar.watch(`${SCRIPT_SOURCE}/*.extended.ts`, {
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 100,
    pollInterval: 50
  }
});

const handleScriptChange = debounce(async (filepath) => {
  const filename = path.basename(filepath);
  console.log(`\n[WATCH] Script changed: ${filename}`);
  try {
    await runBuild('scripts/build-scripts.js', [filename]);
  } catch (error) {
    console.error('[ERROR]', error.message);
  }
}, 150);

scriptWatcher.on('change', handleScriptChange);
scriptWatcher.on('add', handleScriptChange);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n[WATCH] Stopping...');
  cssWatcher.close();
  scriptWatcher.close();
  process.exit(0);
});
