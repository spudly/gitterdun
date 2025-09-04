import {RuleTester} from 'eslint';
import tsParser from '@typescript-eslint/parser';
import {requirePromiseSuffixOnUnawaited} from './requirePromiseSuffixOnUnawaited.js';

// eslint-disable-next-line jest/require-hook -- RuleTester must declare tests at top-level
new RuleTester({
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      ecmaFeatures: {jsx: true},
    },
  },
}).run('require-promise-suffix-on-unawaited', requirePromiseSuffixOnUnawaited, {
  valid: [
    // awaited assignments are fine
    {
      code: 'const result = await fetchData();',
      languageOptions: {parserOptions: {ecmaVersion: 2022}},
    },
    {
      code: 'let result; result = await fetchData();',
      languageOptions: {parserOptions: {ecmaVersion: 2022}},
    },
    // promise-returning function assigned with proper suffix
    {code: 'const userPromise = fetchUser();'},
    {code: 'let userPromise; userPromise = fetchUser();'},
    {code: 'const getUserPromise = api.getUser();'},
    // non-promise assignment is fine
    {code: 'const value = 123;'},
    {code: 'const str = "hi";'},
    {code: 'const obj = { then: 1 };'},
    // awaited call in expression context
    {
      code: 'const data = await (async () => fetchUser())();',
      languageOptions: {parserOptions: {ecmaVersion: 2022}},
    },
    // chained then returns promise but variable name ends with Promise
    {code: 'const chainPromise = fetchUser().then(x => x);'},
    // Explicit Promise.resolve and new Promise with suffix
    {code: 'const thingPromise = Promise.resolve(1);'},
    {code: 'const makePromise = new Promise(res => res(1));'},
    // Capitalized suffix is allowed
    {code: 'const userPromise = Promise.resolve(1);'},
    {code: 'const userPromise = api.fetch();'},
    // "Promise" suffix with capital P allowed
    {code: 'const usersPromise = fetchUsers();'},
  ],
  invalid: [
    // basic unawaited promise assignment
    {
      code: 'const user = fetchUser();',
      errors: [{messageId: 'requirePromiseSuffix', data: {name: 'user'}}],
    },
    {
      code: 'let user; user = fetchUser();',
      errors: [{messageId: 'requirePromiseSuffix', data: {name: 'user'}}],
    },
    // chained then/catch finally returns a promise
    {
      code: 'const data = fetchUser().then(x => x);',
      errors: [{messageId: 'requirePromiseSuffix', data: {name: 'data'}}],
    },
    // Promise.resolve, new Promise
    {
      code: 'const task = Promise.resolve(1);',
      errors: [{messageId: 'requirePromiseSuffix', data: {name: 'task'}}],
    },
    {
      code: 'const op = new Promise(res => res(1));',
      errors: [{messageId: 'requirePromiseSuffix', data: {name: 'op'}}],
    },
    // Capital P suffix missing
    {
      code: 'const result = api.fetch();',
      errors: [{messageId: 'requirePromiseSuffix', data: {name: 'result'}}],
    },
    // also check reassignments
    {
      code: 'let v; v = Promise.resolve(2);',
      errors: [{messageId: 'requirePromiseSuffix', data: {name: 'v'}}],
    },
    // object property assignment should not be checked, but variable destructuring should
    {
      code: 'const {user} = {user: fetchUser()};',
      errors: [{messageId: 'requirePromiseSuffix', data: {name: 'user'}}],
    },
    // array destructuring
    {
      code: 'const [u] = [fetchUser()];',
      errors: [{messageId: 'requirePromiseSuffix', data: {name: 'u'}}],
    },
  ],
});
