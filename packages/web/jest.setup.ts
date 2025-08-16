/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom';

// Provide a minimal WHATWG Response polyfill for tests that construct `new Response(...)`
if (typeof global.Response === 'undefined') {
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
  Object.defineProperty(global, 'Response', {
    value: SimpleResponse,
    writable: true,
    configurable: true,
  });
}
