import '@testing-library/jest-dom';
import {TextEncoder, TextDecoder} from 'node:util';

jest.mock('./src/globals', () => ({}));

beforeEach(() => {
  global.__TEST__ = true;
  global.__ENV__ = 'test';
  global.__DEV__ = false;
  global.__PROD__ = true;
});

// Provide a minimal WHATWG Response polyfill for tests that construct `new Response(...)`
if (typeof (globalThis as any).Response === 'undefined') {
  class SimpleResponse {
    readonly ok: boolean;
    readonly status: number;
    private readonly _bodyText: string;

    constructor(
      body = '',
      init: {status?: number; headers?: Record<string, string>} = {},
    ) {
      this.status = init.status ?? 200;
      this.ok = this.status >= 200 && this.status < 300;
      this._bodyText = body;
    }

    async json(): Promise<unknown> {
      if (!this._bodyText) {
        return {};
      }
      return JSON.parse(this._bodyText);
    }
  }
  Object.defineProperty(globalThis as any, 'Response', {
    value: SimpleResponse,
    writable: true,
    configurable: true,
  });
}
if (typeof (globalThis as any).TextEncoder === 'undefined') {
  (globalThis as any).TextEncoder = TextEncoder;
}
if (typeof (globalThis as any).TextDecoder === 'undefined') {
  (globalThis as any).TextDecoder =
    TextDecoder as unknown as typeof globalThis.TextDecoder;
}
