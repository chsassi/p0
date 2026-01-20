import fs from 'fs/promises';
import path from 'path';
import postcss from 'postcss';
import cssnano from 'cssnano';
import prettier from 'prettier';
import * as sass from 'sass';

const SCSS_SOURCE_DIR = 'src/scss/main';
const CSS_SOURCE_DIR = 'src/styles';
const OUTPUT_DIR = 'public/styles';

/**
 * Beautify CSS for extended version
 */
async function beautifyCSS(css) {
  return await prettier.format(css, { parser: 'css', tabWidth: 2 });
}

/**
 * Minify CSS for compact version
 */
async function minifyCSS(css) {
  const result = await postcss([cssnano({ preset: 'default' })]).process(css, { from: undefined });
  return result.css;
}

/**
 * Compile SCSS to CSS
 */
function compileSCSS(inputPath) {
  const result = sass.compile(inputPath, {
    loadPaths: ['src/scss'],
    style: 'expanded',
    sourceMap: false
  });
  return result.css;
}

/**
 * Process a single SCSS file
 */
async function processSCSSFile(filename) {
  const inputPath = path.join(SCSS_SOURCE_DIR, filename);
  const outputFilename = filename.replace('.scss', '.css');
  const outputPath = path.join(OUTPUT_DIR, outputFilename);

  try {
    // Compile SCSS to CSS
    const compiled = compileSCSS(inputPath);
    // Minify the compiled CSS
    const minified = await minifyCSS(compiled);

    await fs.writeFile(outputPath, minified);
    console.log(`[SCSS] ${filename} -> ${outputFilename}`);
  } catch (error) {
    console.error(`[SCSS ERROR] ${filename}:`, error.message);
    throw error;
  }
}

/**
 * Process a single CSS file (extended -> compact)
 */
async function processCSSFile(filename) {
  const inputPath = path.join(CSS_SOURCE_DIR, filename);
  const outputFilename = filename.replace('.extended.css', '.css');
  const outputPath = path.join(OUTPUT_DIR, outputFilename);

  const source = await fs.readFile(inputPath, 'utf8');
  const minified = await minifyCSS(source);

  await fs.writeFile(outputPath, minified);
  console.log(`[CSS] ${filename} -> ${outputFilename}`);
}

/**
 * Build all styles (SCSS and CSS)
 */
async function buildAll() {
  // Ensure output directory exists
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  let totalFiles = 0;

  // Process SCSS files
  try {
    const scssFiles = await fs.readdir(SCSS_SOURCE_DIR);
    const mainScssFiles = scssFiles.filter(f => f.endsWith('.scss') && !f.startsWith('_'));

    for (const file of mainScssFiles) {
      await processSCSSFile(file);
      totalFiles++;
    }
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }

  // Process extended CSS files (for backward compatibility during migration)
  try {
    const cssFiles = await fs.readdir(CSS_SOURCE_DIR);
    const extendedCssFiles = cssFiles.filter(f => f.endsWith('.extended.css'));

    for (const file of extendedCssFiles) {
      await processCSSFile(file);
      totalFiles++;
    }
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }

  if (totalFiles === 0) {
    console.log('[STYLES] No source files found.');
  } else {
    console.log(`[STYLES] Built ${totalFiles} file(s)`);
  }
}

/**
 * Create extended version from existing minified CSS
 */
async function createExtended(minifiedPath) {
  const css = await fs.readFile(minifiedPath, 'utf8');
  const beautified = await beautifyCSS(css);

  const basename = path.basename(minifiedPath, '.css');
  const filename = `${basename}.extended.css`;
  const outputPath = path.join(CSS_SOURCE_DIR, filename);

  await fs.writeFile(outputPath, beautified);
  console.log(`[INIT] Created ${filename}`);
}

/**
 * Initialize extended files from existing compact CSS
 */
async function initExtended() {
  await fs.mkdir(CSS_SOURCE_DIR, { recursive: true });

  const files = await fs.readdir(OUTPUT_DIR);
  const cssFiles = files.filter(f => f.endsWith('.css'));

  for (const file of cssFiles) {
    await createExtended(path.join(OUTPUT_DIR, file));
  }
  console.log(`[INIT] Created ${cssFiles.length} extended CSS file(s) in ${CSS_SOURCE_DIR}`);
}

// CLI handling
const args = process.argv.slice(2);

if (args.includes('--init')) {
  await initExtended();
} else if (args.length > 0 && !args[0].startsWith('--')) {
  const filename = args[0];
  // Check if it's SCSS or CSS
  if (filename.endsWith('.scss')) {
    await processSCSSFile(filename);
  } else {
    await processCSSFile(filename);
  }
} else {
  // Build all files
  await buildAll();
}
