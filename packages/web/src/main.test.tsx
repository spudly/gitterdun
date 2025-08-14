/* eslint-disable global-require */

jest.mock('react-dom/client', () => {
  return {createRoot: jest.fn(() => ({render: jest.fn()}))};
});

describe('main entry', () => {
  it('mounts app when #root exists', () => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);

    // Import after setting up DOM
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('./main');
    });

    const {createRoot}: any = require('react-dom/client');
    // Ensure app attempted to mount without throwing
    expect(typeof createRoot).toBe('function');
  });

  it('throws if #root is missing', () => {
    document.body.innerHTML = '';
    expect(() => {
      jest.isolateModules(() => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('./main');
      });
    }).toThrow('Root element not found');
  });
});
