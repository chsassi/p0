import fs from 'fs/promises';
import path from 'path';
import postcss from 'postcss';
import cssnano from 'cssnano';
import prettier from 'prettier';

const SOURCE_DIR = 'src/styles';
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
 * Process a single CSS file (extended -> compact)
 */
async function processFile(filename) {
  const inputPath = path.join(SOURCE_DIR, filename);
  const outputFilename = filename.replace('.extended.css', '.css');
  const outputPath = path.join(OUTPUT_DIR, outputFilename);

  const source = await fs.readFile(inputPath, 'utf8');
  const minified = await minifyCSS(source);

  await fs.writeFile(outputPath, minified);
  console.log(`[CSS] ${filename} -> ${outputFilename}`);
}

/**
 * Process all CSS files
 */
async function buildAll() {
  try {
    const files = await fs.readdir(SOURCE_DIR);
    const cssFiles = files.filter(f => f.endsWith('.extended.css'));

    if (cssFiles.length === 0) {
      console.log('[CSS] No extended CSS files found. Run with --init to create them.');
      return;
    }

    for (const file of cssFiles) {
      await processFile(file);
    }
    console.log(`[CSS] Built ${cssFiles.length} file(s)`);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(`[CSS] Source directory ${SOURCE_DIR} not found. Run with --init to create it.`);
    } else {
      throw err;
    }
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
  const outputPath = path.join(SOURCE_DIR, filename);

  await fs.writeFile(outputPath, beautified);
  console.log(`[INIT] Created ${filename}`);
}

/**
 * Initialize extended files from existing compact CSS
 */
async function initExtended() {
  await fs.mkdir(SOURCE_DIR, { recursive: true });

  const files = await fs.readdir(OUTPUT_DIR);
  const cssFiles = files.filter(f => f.endsWith('.css'));

  for (const file of cssFiles) {
    await createExtended(path.join(OUTPUT_DIR, file));
  }
  console.log(`[INIT] Created ${cssFiles.length} extended CSS file(s) in ${SOURCE_DIR}`);
}

// CLI handling
const args = process.argv.slice(2);

if (args.includes('--init')) {
  await initExtended();
} else if (args.length > 0 && !args[0].startsWith('--')) {
  // Process single file
  await processFile(args[0]);
} else {
  // Process all files
  await buildAll();
}
