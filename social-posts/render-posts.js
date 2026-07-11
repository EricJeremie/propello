#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

function loadPlaywright() {
  try {
    return require('playwright');
  } catch {
    return require('/Users/ericjeremierotaquio/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
  }
}

const { chromium } = loadPlaywright();

const ROOT = __dirname;
const OUT = path.join(ROOT, 'output');
const HTML = path.join(ROOT, 'index.html');
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  const launchOptions = fs.existsSync(CHROME_PATH)
    ? { headless: true, executablePath: CHROME_PATH }
    : { headless: true };
  const browser = await chromium.launch(launchOptions);
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1080 },
    deviceScaleFactor: 1,
  });

  await page.goto(`file://${HTML}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts && document.fonts.ready);

  const posts = await page.locator('.post').evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute('data-name')).filter(Boolean)
  );

  for (const name of posts) {
    const target = page.locator(`.post[data-name="${name}"]`);
    const file = path.join(OUT, `${name}.png`);
    await target.screenshot({ path: file, type: 'png' });
    console.log(file);
  }

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
