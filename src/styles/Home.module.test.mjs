import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('./Home.module.css', import.meta.url), 'utf8');

test('timer slot does not force an extra viewport height', () => {
  assert.match(css, /\.main\s*\{[\s\S]*min-height:\s*100vh;/);
  assert.doesNotMatch(css, /\.main\s*\{[\s\S]*padding:\s*2rem;/);
  assert.match(css, /\.timerSlot\s*\{[\s\S]*min-height:\s*100vh;/);
  assert.doesNotMatch(css, /\.timerSlot\s*\{[\s\S]*min-height:\s*calc\(100vh - /);
});
