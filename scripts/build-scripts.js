import fs from 'fs/promises';
import path from 'path';
import { minify } from 'terser';
import prettier from 'prettier';
import esbuild from 'esbuild';

const SOURCE_DIR = 'src/scripts';
const OUTPUT_DIR = 'public/scripts';

// Script mapping: extended filename -> inline script source info
const SCRIPT_MAPPING = {
  'index-slideshow.extended.ts': {
    source: 'src/pages/index.astro',
    scriptIndex: 0,
    description: 'Slideshow and scroll indicator logic'
  },
  'index-loader.extended.ts': {
    source: 'src/pages/index.astro',
    scriptIndex: 1,
    description: 'Page loader animation'
  },
  'header-menu.extended.ts': {
    source: 'src/layouts/HeaderLayout.astro',
    scriptIndex: 0,
    description: 'Header scroll visibility and dropdown menu'
  },
  'footer-scramble.extended.ts': {
    source: 'src/layouts/FooterLayout.astro',
    scriptIndex: 0,
    description: 'Footer text scramble animation'
  }
};

/**
 * Beautify JavaScript/TypeScript code
 */
async function beautifyCode(code) {
  return await prettier.format(code, {
    parser: 'typescript',
    tabWidth: 2,
    singleQuote: true,
    semi: true,
    trailingComma: 'es5'
  });
}

/**
 * Transpile TypeScript to JavaScript using esbuild
 */
async function transpileTS(code) {
  const result = await esbuild.transform(code, {
    loader: 'ts',
    target: 'es2020',
    minify: false
  });
  return result.code;
}

/**
 * Minify JavaScript code
 */
async function minifyCode(code) {
  const result = await minify(code, {
    compress: { passes: 2 },
    mangle: true,
    format: { comments: false }
  });
  return result.code;
}

/**
 * Extract inline script from Astro file
 */
async function extractInlineScript(filePath, scriptIndex) {
  const content = await fs.readFile(filePath, 'utf8');

  // Find all <script> tags (not <script src="...">)
  const scriptRegex = /<script>[\s\S]*?<\/script>/g;
  const matches = content.match(scriptRegex) || [];

  if (scriptIndex >= matches.length) {
    throw new Error(`Script index ${scriptIndex} not found in ${filePath} (found ${matches.length} scripts)`);
  }

  // Extract content between <script> and </script>
  const scriptTag = matches[scriptIndex];
  const scriptContent = scriptTag.replace(/^<script>/, '').replace(/<\/script>$/, '').trim();

  return scriptContent;
}

/**
 * Process a single script file (extended -> compact)
 */
async function processFile(filename) {
  const inputPath = path.join(SOURCE_DIR, filename);
  const outputFilename = filename.replace('.extended.ts', '.min.js');
  const outputPath = path.join(OUTPUT_DIR, outputFilename);

  const source = await fs.readFile(inputPath, 'utf8');

  // Transpile TypeScript to JavaScript using esbuild
  const jsCode = await transpileTS(source);

  // Minify the JavaScript
  const minified = await minifyCode(jsCode);

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.writeFile(outputPath, minified);
  console.log(`[SCRIPT] ${filename} -> ${outputFilename}`);
}

/**
 * Process all script files
 */
async function buildAll() {
  try {
    const files = await fs.readdir(SOURCE_DIR);
    const tsFiles = files.filter(f => f.endsWith('.extended.ts'));

    if (tsFiles.length === 0) {
      console.log('[SCRIPT] No extended script files found. Run with --init to create them.');
      return;
    }

    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    for (const file of tsFiles) {
      await processFile(file);
    }
    console.log(`[SCRIPT] Built ${tsFiles.length} file(s)`);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(`[SCRIPT] Source directory ${SOURCE_DIR} not found. Run with --init to create it.`);
    } else {
      throw err;
    }
  }
}

/**
 * Create extended script from inline Astro script
 */
async function createExtended(extendedFilename, mapping) {
  const scriptContent = await extractInlineScript(mapping.source, mapping.scriptIndex);
  const beautified = await beautifyCode(scriptContent);

  const header = `/**
 * ${mapping.description}
 * Source: ${mapping.source}
 *
 * This is the EXTENDED (readable) version.
 * Edit this file and run the build to update the compact version.
 */

`;

  const outputPath = path.join(SOURCE_DIR, extendedFilename);
  await fs.writeFile(outputPath, header + beautified);
  console.log(`[INIT] Created ${extendedFilename} from ${mapping.source}`);
}

/**
 * Initialize extended files from inline Astro scripts
 */
async function initExtended() {
  await fs.mkdir(SOURCE_DIR, { recursive: true });
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  for (const [filename, mapping] of Object.entries(SCRIPT_MAPPING)) {
    try {
      await createExtended(filename, mapping);
    } catch (err) {
      console.error(`[ERROR] Failed to create ${filename}: ${err.message}`);
    }
  }
  console.log(`[INIT] Created extended script files in ${SOURCE_DIR}`);
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
