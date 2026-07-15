import { authClient } from './auth-client';

const API = process.env.NEXT_PUBLIC_API_URL;

async function getHeaders() {
  const { data: session } = await authClient.getSession();
  const token = session?.session?.token;

  return {
    'Content-Type': 'application/json',
    ...(token && {
      Authorization: `Bearer ${token}`,
    }),
  };
}

// GET
export async function getData(url: string) {
  console.log(url, "url")
  const res = await fetch(`${API}${url}`, {
    credentials: 'include',
    headers: await getHeaders(),
  });

  if (!res.ok) throw new Error('Request failed');
  return res.json();
}

// POST
export async function postData(url: string, body: unknown) {
  const res = await fetch(`${API}${url}`, {
    method: 'POST',
    credentials: 'include',
    headers: await getHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error('Request failed');
  return res.json();
}

// PATCH
export async function patchData(url: string, body: unknown) {
  const res = await fetch(`${API}${url}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: await getHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    // সার্ভারের পাঠানো আসল মেসেজ (যেমন: "Only Master Admin...") থ্রো করবে
    throw new Error(errorData.message || 'Request failed');
  }
  return res.json();
}

// DELETE
export async function deleteData(url: string) {
  const res = await fetch(`${API}${url}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: await getHeaders(),
  });

  if (!res.ok) throw new Error('Request failed');
  return res.json();
}
