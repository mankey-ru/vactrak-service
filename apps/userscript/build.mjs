// @ts-check
import { build } from 'esbuild';
import { readFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dev = process.argv.includes('--devbuild');
const distDir = join(__dirname, dev ? 'dist-dev' : 'dist');
const input = join(__dirname, 'src', 'vactrak.user.ts');
const output = join(distDir, 'vactrak.user.js');

mkdirSync(distDir, { recursive: true });

/**
 * @param {string} code
 */
function extractUserscriptHeader(code) {
	const match = code.match(/\/\/\s*==UserScript==[\s\S]*?\/\/\s*==\/UserScript==/);
	return match ? match[0] + '\n\n' : '';
}

const source = readFileSync(input, 'utf8');
const header = extractUserscriptHeader(source);

await build({
	entryPoints: [input],
	outfile: output,
	bundle: true,
	minify: false,
	sourcemap: false,
	target: 'es2022',
	format: 'iife',
	platform: 'browser',
	banner: {
		js: header,
	},
});

console.log(`✓ ${dev ? 'dist-dev' : 'dist'}/vactrak.user.js`);
