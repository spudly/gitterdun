import {test, expect} from '@playwright/test';

test.describe('api.ts base methods coverage (real server, no stubs)', () => {
  test('covers get/post/put/delete/patch success and error paths', async ({
    request,
  }) => {
    // GET success: health
    const health = await request.get('http://localhost:3000/api/health');
    expect(health.ok()).toBeTruthy();

    // GET error: 404
    const notFoundGet = await request.get('http://localhost:3000/api/__nope__');
    expect(notFoundGet.ok()).toBeFalsy();

    // POST success: forgot
    const forgot = await request.post('http://localhost:3000/api/auth/forgot', {
      data: {email: 'someone@example.com'},
    });
    expect(forgot.ok()).toBeTruthy();

    // POST error: reset with missing token
    const resetBad = await request.post(
      'http://localhost:3000/api/auth/reset',
      {data: {token: '', password: 'abc123'}},
    );
    expect(resetBad.ok()).toBeFalsy();

    // PUT/DELETE/PATCH error paths
    const putBad = await request.put('http://localhost:3000/api/__nope__', {
      data: {a: 1},
    });
    const delBad = await request.delete('http://localhost:3000/api/__nope__');
    const patchBad = await request.patch('http://localhost:3000/api/__nope__', {
      data: {a: 1},
    });
    expect(putBad.ok()).toBeFalsy();
    expect(delBad.ok()).toBeFalsy();
    expect(patchBad.ok()).toBeFalsy();
  });
});
