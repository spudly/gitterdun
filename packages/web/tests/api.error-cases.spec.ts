import { test, expect } from './fixtures';

test.describe('Client API error branches', () => {
  test('creating an invitation without auth errors', async ({ page }) => {
    await page.goto('/');
    await page.addScriptTag({ type: 'module', content: `import * as api from '/src/lib/api.ts'; window.__api = api;` });
    await page.waitForFunction(() => !!(window as any).__api);
    const res = await page.evaluate(async () => {
      try {
        await (window as any).__api.invitationsApi.create(123456, { email: 'x@example.com', role: 'child' });
        return 'ok';
      } catch (e: any) {
        return e?.name || 'error';
      }
    });
    expect(res).toBe('ApiError');
  });
});

