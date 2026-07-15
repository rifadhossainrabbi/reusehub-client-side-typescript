import { authClient } from './auth-client';

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
).replace(/\/$/, '');

async function getHeaders() {
  const session = await authClient.getSession();
  const token =
    session?.data?.session?.token || (session as any)?.session?.token;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

async function request(url: string, options: RequestInit) {
  try {
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    const fullUrl = `${API_BASE}${cleanUrl}`;

    console.log(`🌐 Calling: ${fullUrl}`);

    const res = await fetch(fullUrl, {
      ...options,
      credentials: 'include',
      headers: await getHeaders(),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Server Error: ${res.status}`);
    }

    return res.json();
  } catch (error: any) {
    console.error('❌ API Request Failed:', error.message);
    throw error;
  }
}

export const getData = (url: string) => request(url, { method: 'GET' });
export const postData = (url: string, body: unknown) =>
  request(url, { method: 'POST', body: JSON.stringify(body) });
export const patchData = (url: string, body: unknown) =>
  request(url, { method: 'PATCH', body: JSON.stringify(body) });
export const deleteData = (url: string) => request(url, { method: 'DELETE' });
