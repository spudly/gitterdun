import { APIRequestContext, expect } from '@playwright/test';

export async function loginAs(request: APIRequestContext, creds: { email: string; password: string }) {
  const res = await request.post('http://localhost:3000/api/auth/login', {
    data: creds,
  });
  expect(res.ok()).toBeTruthy();
}

export const seedUser = async (
  request: APIRequestContext,
  user: { username: string; email: string; password: string; role?: string }
) => {
  const unique = Date.now();
  const payload = {
    ...user,
    username: `${user.username}-${unique}`,
  };
  const res = await request.post('http://localhost:3000/api/auth/register', { data: payload });
  if (!res.ok()) {
    const text = await res.text();
    throw new Error(`Failed to seed user: ${res.status()} ${text}`);
  }
  const body = await res.json();
  return body.data as { id: number; username: string; email: string; role: string };
};

