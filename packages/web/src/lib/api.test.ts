import {afterEach, describe, expect, jest, test} from '@jest/globals';
import {z} from 'zod';
import {
  api,
  ApiError,
  authApi,
  choresApi,
  goalsApi,
  leaderboardApi,
  familiesApi,
  invitationsApi,
} from './api';

describe('api utils', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  test('performs GET with params', async () => {
    const fetchSpy = jest.fn<typeof fetch>(
      async () =>
        new Response(JSON.stringify({success: true, data: {ok: true}}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        }),
    );
    global.fetch = fetchSpy;
    const res = await api.get('/x', z.object());
    expect(res.success).toBe(true);
  });

  test('handles non-ok response', async () => {
    const fetchSpy = jest.fn<typeof fetch>(
      async () =>
        new Response(JSON.stringify({error: 'bad'}), {
          status: 500,
          headers: {'Content-Type': 'application/json'},
        }),
    );
    global.fetch = fetchSpy;
    await expect(api.get('/x', z.object())).rejects.toBeInstanceOf(ApiError);
  });

  test('authApi routes', async () => {
    const fetchSpy = jest.fn<typeof fetch>(
      async () =>
        new Response(JSON.stringify({success: true, data: {id: 1}}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        }),
    );
    global.fetch = fetchSpy;
    await authApi.login({email: 'a', password: 'b'});
    await authApi.register({username: 'u', email: 'a', password: 'b'});
    await authApi.logout();
    await authApi.me();
  });

  test('skips undefined/null params in URL and supports all verbs', async () => {
    const calls: Array<Parameters<typeof fetch>[0]> = [];
    const fetchSpy = jest.fn(async (input: RequestInfo | URL) => {
      calls.push(input);
      return new Response(JSON.stringify({success: true, data: {ok: true}}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    });
    global.fetch = fetchSpy;
    await api.get(
      '/x',
      z.object({field1: z.number(), field2: z.undefined(), field3: z.null()}),
      {field1: 1, field2: undefined, field3: null},
    );
    expect(calls[calls.length - 1]).toMatch(/field1=1/u);
    expect(calls[calls.length - 1]).not.toMatch(/field2=/u);
    expect(calls[calls.length - 1]).not.toMatch(/field3=/u);

    await api.post('/x', z.object({value: z.number()}));
    await api.put('/x', z.object({value: z.number()}));
    await api.patch('/x', z.object({value: z.number()}));
    await api.delete('/x', z.object({}));
  });

  test('exercises all API endpoint wrappers (happy paths)', async () => {
    const fetchSpy = jest.fn<typeof fetch>(
      async () =>
        new Response(JSON.stringify({success: true, data: []}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        }),
    );
    global.fetch = fetchSpy;
    await choresApi.getAll({status: 'completed'});
    await choresApi.getById(1);
    await choresApi.create({
      title: 't',
      point_reward: 1,
      chore_type: 'regular',
    });
    await choresApi.update(1, {title: 'n'});
    await choresApi.delete(1);
    await choresApi.complete(1, {userId: 1});

    await goalsApi.getAll({user_id: 1});
    await goalsApi.getById(1);
    await goalsApi.create({title: 'g', target_points: 1});
    await goalsApi.update(1, {title: 'x'});
    await goalsApi.delete(1);

    await leaderboardApi.get({sortBy: 'points'});

    await familiesApi.create({name: 'fam'});
    await familiesApi.myFamilies();
    await familiesApi.listMembers(1);
    await familiesApi.createChild(1, {
      username: 'c',
      email: 'e',
      password: 'p',
    });

    await invitationsApi.create(1, {email: 'e', role: 'parent'});
    await invitationsApi.accept({token: 't', username: 'u', password: 'p'});
  });

  test('handleResponse catch branch when error json fails', async () => {
    const failingJson = async () => {
      throw new Error('bad json');
    };
    const fetchSpy = jest.fn<typeof fetch>(
      async () => new Response('', {status: 400}),
    );
    // Override to simulate json() throwing while preserving Response shape
    const throwing = new Response('', {status: 400});
    jest.spyOn(throwing, 'json').mockImplementation(failingJson);
    jest.mocked(fetchSpy).mockImplementationOnce(async () => throwing);
    global.fetch = fetchSpy;
    await expect(api.post('/x', z.object({}))).rejects.toBeInstanceOf(ApiError);
  });

  test('posts to auth/reset and evaluates choresApi export (covers 154-157)', async () => {
    const fetchSpy = jest.fn<typeof fetch>(
      async (_url, _init) =>
        new Response(JSON.stringify({success: true, data: {ok: true}}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        }),
    );
    global.fetch = fetchSpy;
    // Call resetPassword → exercises the tail of authApi block
    await authApi.resetPassword({token: 't', password: 'p'});
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/auth\/reset$/u),
      expect.objectContaining({method: 'POST'}),
    );

    // Touch choresApi to ensure export is evaluated
    await choresApi.getAll();
  });

  test('posts to auth/forgot', async () => {
    const fetchSpy = jest.fn<typeof fetch>(
      async (_url, _init) =>
        new Response(JSON.stringify({success: true}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        }),
    );
    global.fetch = fetchSpy;
    await authApi.forgotPassword({email: 'test@example.com'});
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/auth\/forgot$/u),
      expect.objectContaining({method: 'POST'}),
    );
  });

  test('uses null body when PUT data is falsy', async () => {
    const fetchSpy = jest.fn<typeof fetch>(
      async (_url, _init) =>
        new Response(JSON.stringify({success: true}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        }),
    );
    global.fetch = fetchSpy;
    await api.put('/x', z.object({}));
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({method: 'PUT', body: null}),
    );
  });

  test('uses null body when PATCH data is falsy', async () => {
    const fetchSpy = jest.fn<typeof fetch>(
      async (_url, _init) =>
        new Response(JSON.stringify({success: true}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        }),
    );
    global.fetch = fetchSpy;
    await api.patch('/x', z.object({}));
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({method: 'PATCH', body: null}),
    );
  });
});
