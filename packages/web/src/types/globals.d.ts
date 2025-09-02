declare global {
  // eslint-disable-next-line ts/consistent-type-definitions -- not my interface
  interface GlobalThis {
    __TEST__: boolean;
    __ENV__: 'development' | 'test' | 'production';
    __DEV__: boolean;
    __PROD__: boolean;
  }

  /* eslint-disable ts/naming-convention, vars-on-top -- globals */
  var __TEST__: boolean;
  var __ENV__: 'development' | 'test' | 'production';
  var __DEV__: boolean;
  var __PROD__: boolean;
  /* eslint-enable ts/naming-convention, vars-on-top */
}

export {};
