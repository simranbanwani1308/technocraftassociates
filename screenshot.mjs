import puppeteer from 'puppeteer';
import { readdir, mkdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const screenshotDir = join(__dirname, 'temporary screenshots');

const url   = process.argv[2] ?? 'http://localhost:3000';
const label = process.argv[3] ?? '';

await mkdir(screenshotDir, { recursive: true });

const files = await readdir(screenshotDir).catch(() => []);
const nums  = files
  .map(f => parseInt(f.match(/^screenshot-(\d+)/)?.[1] ?? '0'))
  .filter(Boolean);
const next  = nums.length ? Math.max(...nums) + 1 : 1;
const name  = label ? `screenshot-${next}-${label}.png` : `screenshot-${next}.png`;
const out   = join(screenshotDir, name);

const browser = await puppeteer.launch({ headless: true });
const page    = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 2000)); // let CSS animations finish
await page.screenshot({ path: out, fullPage: true });
await browser.close();

console.log(`Saved: temporary screenshots/${name}`);
