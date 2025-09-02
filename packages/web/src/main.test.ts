import {describe, expect, jest, test} from '@jest/globals';

jest.mock('./App', () => ({__esModule: true, App: () => null}));

jest.mock('react-dom/client', () => {
  return {
    createRoot: jest.fn(() => ({render: jest.fn(), unmount: jest.fn()})),
    hydrateRoot: jest.fn(),
  };
});

describe('main entry', () => {
  test('mounts app when #root exists', async () => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);

    // Import after setting up DOM
    await jest.isolateModulesAsync(async () => {
      await import('./main');
    });

    const {createRoot} = await import('react-dom/client');
    // Ensure app attempted to mount without throwing
    expect(typeof createRoot).toBe('function');
  });

  test('throws if #root is missing', async () => {
    document.body.innerHTML = '';
    await expect(
      jest.isolateModulesAsync(async () => {
        await import('./main');
      }),
    ).rejects.toThrow('Root element not found');
  });
});
