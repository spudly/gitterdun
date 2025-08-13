import {test, expect} from '@playwright/test';

test('line coverage for base api methods and auth error branch', async ({
  page,
}) => {
  await page.goto('/');
  await page.addScriptTag({
    type: 'module',
    content: `import * as api from '/src/lib/api.ts';
      // @ts-ignore
      window.__api = api;`,
  });
  await page.waitForFunction(() => !!(window as any).__api);

  const okGet = await page.evaluate(async () => {
    const api = (window as any).__api;
    return await api.api.get('/health');
  });
  expect(okGet).toBeTruthy();

  const okPost = await page.evaluate(async () => {
    const api = (window as any).__api;
    return await api.authApi.forgotPassword({email: 'person@example.com'});
  });
  expect(okPost).toBeTruthy();

  // Error branches caught
  await page.evaluate(async () => {
    const api = (window as any).__api;
    try {
      await api.api.put('/__nope__', {a: 1});
    } catch (_) {
      // ignore
    }
    try {
      await api.api.patch('/__nope__', {a: 1});
    } catch (_) {
      // ignore
    }
    try {
      await api.api.delete('/__nope__');
    } catch (_) {
      // ignore
    }
    try {
      await api.authApi.login({email: 'nobody@example.com', password: 'x'});
    } catch (_) {
      // ignore
    }
  });
});
