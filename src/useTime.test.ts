import test from 'node:test';
import assert from 'node:assert';
import * as react from 'react';
import { useTime } from './useTime.ts';

// The 'react' module is mocked in node_modules/react/index.js
const reactMock = react as any;

test('useTime hook logic', async (t) => {
  // Replace global setTimeout and clearTimeout
  const originalSetTimeout = global.setTimeout;
  const originalClearTimeout = global.clearTimeout;
  const originalDateNow = Date.now;

  let timeoutIdCounter = 0;
  const activeTimeouts = new Map<number, { callback: Function, delay: number }>();

  (global as any).setTimeout = (callback: Function, delay: number) => {
    const id = ++timeoutIdCounter;
    activeTimeouts.set(id, { callback, delay });
    return id;
  };

  (global as any).clearTimeout = (id: number) => {
    activeTimeouts.delete(id);
  };

  // Helper to "render" the hook
  const renderHook = (hook: Function, ...args: any[]) => {
    return hook(...args);
  };

  await t.test('initializes with current time', () => {
    Date.now = () => 12345;
    const time = renderHook(useTime, 1000);
    assert.strictEqual(time, 12345);
  });

  await t.test('sets up effect with correct dependencies', () => {
    Date.now = () => 12345;
    renderHook(useTime, 1000);
    assert.deepStrictEqual(reactMock.__getCapturedDeps(), [12345]);
  });

  await t.test('effect sets up timeout with correct interval', () => {
    activeTimeouts.clear();
    renderHook(useTime, 2000);
    const effect = reactMock.__getCapturedEffect();
    const cleanup = effect();

    assert.strictEqual(activeTimeouts.size, 1);
    const timeout = Array.from(activeTimeouts.values())[0];
    assert.strictEqual(timeout.delay, 2000);
    cleanup();
  });

  await t.test('timeout callback updates time', () => {
    let updatedTime: number = 0;
    reactMock.__setCapturedSetState((newTime: number) => {
      updatedTime = newTime;
    });

    activeTimeouts.clear();
    renderHook(useTime, 1000);
    const effect = reactMock.__getCapturedEffect();
    effect();
    const timeout = Array.from(activeTimeouts.values())[0];

    Date.now = () => 20000;
    timeout.callback();

    assert.strictEqual(updatedTime, 20000);
  });

  await t.test('cleanup clears timeout', () => {
    activeTimeouts.clear();
    renderHook(useTime, 1000);
    const effect = reactMock.__getCapturedEffect();
    const cleanup = effect();

    const timeoutId = Array.from(activeTimeouts.keys())[0];
    assert.ok(activeTimeouts.has(timeoutId));

    cleanup();
    assert.ok(!activeTimeouts.has(timeoutId));
  });

  // Restore globals
  global.setTimeout = originalSetTimeout;
  global.clearTimeout = originalClearTimeout;
  Date.now = originalDateNow;
});
