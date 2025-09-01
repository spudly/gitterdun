import type {ConsoleMessage, Response} from '@playwright/test';
import {test as base, expect} from '@playwright/test';

type FailureCollector = {consoleFailures: string[]; responseFailures: string[]};

const createFailureCollector = (): FailureCollector => ({
  consoleFailures: [],
  responseFailures: [],
});

export const test = base.extend({
  page: async ({page}, runWithPage) => {
    const failures = createFailureCollector();

    const onConsole = (msg: ConsoleMessage) => {
      const type = msg.type();
      if (type === 'warning' || type === 'error') {
        const text = msg.text();
        if (
          (text.includes('Failed to load resource') && text.includes('401'))
          || text.includes('API Error: 401')
        ) {
          return;
        }
        failures.consoleFailures.push(`${type.toUpperCase()}: ${text}`);
      }
    };

    const onResponse = (resp: Response) => {
      const status = resp.status();
      if (status >= 500) {
        failures.responseFailures.push(`${status} ${resp.url()}`);
      }
    };

    page.on('console', onConsole);
    page.on('response', onResponse);

    await runWithPage(page);

    page.off('console', onConsole);
    page.off('response', onResponse);

    if (
      failures.consoleFailures.length > 0
      || failures.responseFailures.length > 0
    ) {
      const parts: string[] = [];
      if (failures.consoleFailures.length > 0) {
        parts.push(
          `Console warnings/errors (count=${failures.consoleFailures.length}):\n${failures.consoleFailures.join('\n')}`,
        );
      }
      if (failures.responseFailures.length > 0) {
        parts.push(
          `5xx network responses (count=${failures.responseFailures.length}):\n${failures.responseFailures.join('\n')}`,
        );
      }
      throw new Error(parts.join('\n\n'));
    }
  },
});

export {expect};
