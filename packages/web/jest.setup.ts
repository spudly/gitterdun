import '@testing-library/jest-dom';
import {TextEncoder, TextDecoder} from 'node:util';

// Ensure vite-like env for tests that reference import.meta.env.MODE
declare global {
  type ImportMetaEnvShim = {readonly MODE: string};
  type ImportMetaShim = {readonly env: ImportMetaEnvShim};
}
// Provide a typed shim for import.meta
// @ts-expect-error: define import.meta for Jest environment
globalThis.import = {meta: {env: {MODE: 'test'}}} as unknown as ImportMetaShim;

// Polyfill TextEncoder/TextDecoder for jsdom environment (needed by react-router v7)

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
