import type {
  ComponentProps,
  FC,
  JSXElementConstructor,
  PropsWithChildren,
  ReactElement,
} from 'react';
import {MemoryRouter} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {I18nProvider} from '../i18n/I18nProvider.js';
import {ToastProvider} from '../widgets/ToastProvider.js';

const PROVIDERS = {
  router: MemoryRouter,
  queryClient: QueryClientProvider,
  i18n: I18nProvider,
  toast: ToastProvider,
} as const satisfies Record<string, JSXElementConstructor<any>>;

const DEFAULTS = {
  router: {initialEntries: ['/']},
  queryClient: {client: new QueryClient()},
  i18n: {},
  toast: {},
} as const satisfies {
  [KEY in keyof typeof PROVIDERS]: Omit<
    ComponentProps<(typeof PROVIDERS)[KEY]>,
    'children'
  >;
};

type CreateWrapperOptions = {
  [KEY in keyof typeof PROVIDERS]?:
    | Partial<ComponentProps<(typeof PROVIDERS)[KEY]>>
    | true;
};

type CreateWrapper = (opts?: CreateWrapperOptions) => FC<PropsWithChildren>;

export const createWrapper: CreateWrapper = (options = {}) => {
  const Wrapper: FC<PropsWithChildren> = ({children}) =>
    Object.entries(PROVIDERS).reduce(
      (content, [key, Provider]): ReactElement => {
        // @ts-expect-error -- ts is not smart enough to figure out these types
        const config = options[key];
        // @ts-expect-error -- ts is not smart enough to figure out these types
        const defaults = DEFAULTS[key];
        if (config === true) {
          return <Provider {...defaults}>{content}</Provider>;
        }
        if (config != null) {
          return (
            <Provider {...defaults} {...config}>
              {content}
            </Provider>
          );
        }
        return content;
      },
      // eslint-disable-next-line react/jsx-no-useless-fragment -- typescript expects a ReactElement, not a ReactNode
      <>{children}</>,
    );
  return Wrapper;
};

// Legacy TestProviders shim removed. Use createWrapper directly in tests.
