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
  const originalFetch = global.fetch as any;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('performs GET with params', async () => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({success: true, data: {ok: true}}),
    })) as any;
    const res = await api.get('/x', {a: 1});
    expect(res.success).toBe(true);
  });

  it('handles non-ok response', async () => {
    global.fetch = jest.fn(async () => ({
      ok: false,
      status: 500,
      json: async () => ({error: 'bad'}),
    })) as any;
    await expect(api.get('/x')).rejects.toBeInstanceOf(ApiError);
  });

  it('authApi routes', async () => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({success: true, data: {id: 1}}),
    })) as any;
    await authApi.login({email: 'a', password: 'b'});
    await authApi.register({username: 'u', email: 'a', password: 'b'});
    await authApi.logout();
    await authApi.me();
  });

  it('skips undefined/null params in URL and supports all verbs', async () => {
    const calls: Array<string> = [];
    global.fetch = jest.fn(async (url: string) => {
      calls.push(url);
      return {
        ok: true,
        json: async () => ({success: true, data: {ok: true}}),
      } as any;
    }) as any;
    await api.get('/x', {a: 1, b: undefined as any, c: null as any});
    expect(calls[calls.length - 1]).toMatch(/a=1/);
    expect(calls[calls.length - 1]).not.toMatch(/b=/);
    expect(calls[calls.length - 1]).not.toMatch(/c=/);

    await api.post('/x', {y: 1});
    await api.put('/x', {y: 2});
    await api.patch('/x', {y: 3});
    await api.delete('/x');
  });

  it('exercises all API endpoint wrappers (happy paths)', async () => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({success: true, data: []}),
    })) as any;
    await choresApi.getAll({status: 'completed'});
    await choresApi.getById(1);
    await choresApi.create({
      title: 't',
      point_reward: 1,
      chore_type: 'regular',
    } as any);
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
    global.fetch = jest.fn(async () => ({
      ok: false,
      status: 400,
      json: async () => {
        throw new Error('bad json');
      },
    })) as any;
    await expect(api.post('/x')).rejects.toBeInstanceOf(ApiError);
  });

  it('posts to auth/reset and evaluates choresApi export (covers 154-157)', async () => {
    const fetchSpy = jest.fn(async (_url: string, _init?: any) => ({
      ok: true,
      json: async () => ({success: true, data: {ok: true}}),
    })) as any;
    global.fetch = fetchSpy;

    // Call resetPassword → exercises the tail of authApi block
    await authApi.resetPassword({token: 't', password: 'p'});
    expect(fetchSpy).toHaveBeenCalled();
    const [calledUrl, calledInit] = (fetchSpy as any).mock.calls[0];
    expect(String(calledUrl)).toMatch(/\/api\/auth\/reset$/);
    expect(calledInit.method).toBe('POST');

    // Touch choresApi to ensure export is evaluated
    await choresApi.getAll();
  });

  it('posts to auth/forgot (covers line 151)', async () => {
    const fetchSpy = jest.fn(async (_url: string, _init?: any) => ({
      ok: true,
      json: async () => ({success: true}),
    })) as any;
    global.fetch = fetchSpy;
    await authApi.forgotPassword({email: 'test@example.com'});
    const [calledUrl, calledInit] = (fetchSpy as any).mock.calls[0];
    expect(String(calledUrl)).toMatch(/\/api\/auth\/forgot$/);
    expect(calledInit.method).toBe('POST');
  });

  it('uses null body when PUT data is falsy (covers line 83)', async () => {
    const fetchSpy = jest.fn(async (_url: string, _init?: any) => ({
      ok: true,
      json: async () => ({success: true}),
    })) as any;
    global.fetch = fetchSpy;
    await api.put('/x');
    const [, init] = (fetchSpy as any).mock.calls[0];
    expect(init.method).toBe('PUT');
    expect(init.body).toBeNull();
  });

  it('uses null body when PATCH data is falsy (covers line 106)', async () => {
    const fetchSpy = jest.fn(async (_url: string, _init?: any) => ({
      ok: true,
      json: async () => ({success: true}),
    })) as any;
    global.fetch = fetchSpy;
    await api.patch('/x');
    const [, init] = (fetchSpy as any).mock.calls[0];
    expect(init.method).toBe('PATCH');
    expect(init.body).toBeNull();
  });
});
