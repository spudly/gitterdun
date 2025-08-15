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

  it('performs GET with params', async () => {
    const fetchSpy = jest.fn<
      ReturnType<typeof fetch>,
      Parameters<typeof fetch>
    >(
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

  it('handles non-ok response', async () => {
    const fetchSpy = jest.fn<
      ReturnType<typeof fetch>,
      Parameters<typeof fetch>
    >(
      async () =>
        new Response(JSON.stringify({error: 'bad'}), {
          status: 500,
          headers: {'Content-Type': 'application/json'},
        }),
    );
    global.fetch = fetchSpy;
    await expect(api.get('/x', z.object())).rejects.toBeInstanceOf(ApiError);
  });

  it('authApi routes', async () => {
    const fetchSpy = jest.fn<
      ReturnType<typeof fetch>,
      Parameters<typeof fetch>
    >(
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

  it('skips undefined/null params in URL and supports all verbs', async () => {
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
      z.object({a: z.number(), b: z.undefined(), c: z.null()}),
      {a: 1, b: undefined, c: null},
    );
    expect(calls[calls.length - 1]).toMatch(/a=1/);
    expect(calls[calls.length - 1]).not.toMatch(/b=/);
    expect(calls[calls.length - 1]).not.toMatch(/c=/);

    await api.post('/x', z.object({y: z.number()}));
    await api.put('/x', z.object({y: z.number()}));
    await api.patch('/x', z.object({y: z.number()}));
    await api.delete('/x', z.object({}));
  });

  it('exercises all API endpoint wrappers (happy paths)', async () => {
    const fetchSpy = jest.fn<
      ReturnType<typeof fetch>,
      Parameters<typeof fetch>
    >(
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

  it('handleResponse catch branch when error json fails', async () => {
    const failingJson = async () => {
      throw new Error('bad json');
    };
    const fetchSpy = jest.fn<
      ReturnType<typeof fetch>,
      Parameters<typeof fetch>
    >(async () => new Response('', {status: 400}));
    // Override to simulate json() throwing while preserving Response shape
    const throwing = new Response('', {status: 400});
    jest.spyOn(throwing, 'json').mockImplementation(failingJson);
    jest.mocked(fetchSpy).mockImplementationOnce(async () => throwing);
    global.fetch = fetchSpy;
    await expect(api.post('/x', z.object({}))).rejects.toBeInstanceOf(ApiError);
  });

  it('posts to auth/reset and evaluates choresApi export (covers 154-157)', async () => {
    const fetchSpy = jest.fn<
      ReturnType<typeof fetch>,
      Parameters<typeof fetch>
    >(
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
      expect.stringMatching(/\/api\/auth\/reset$/),
      expect.objectContaining({method: 'POST'}),
    );

    // Touch choresApi to ensure export is evaluated
    await choresApi.getAll();
  });

  it('posts to auth/forgot (covers line 151)', async () => {
    const fetchSpy = jest.fn<
      ReturnType<typeof fetch>,
      Parameters<typeof fetch>
    >(
      async (_url, _init) =>
        new Response(JSON.stringify({success: true}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        }),
    );
    global.fetch = fetchSpy;
    await authApi.forgotPassword({email: 'test@example.com'});
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/auth\/forgot$/),
      expect.objectContaining({method: 'POST'}),
    );
  });

  it('uses null body when PUT data is falsy (covers line 83)', async () => {
    const fetchSpy = jest.fn<
      ReturnType<typeof fetch>,
      Parameters<typeof fetch>
    >(
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

  it('uses null body when PATCH data is falsy (covers line 106)', async () => {
    const fetchSpy = jest.fn<
      ReturnType<typeof fetch>,
      Parameters<typeof fetch>
    >(
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
