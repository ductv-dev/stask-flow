import { cookies } from 'next/headers';
export const baseUrl = process.env.NEXT_PUBLIC_EXPRESS_API_URL  || 'http://localhost:8000';
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  

  return fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });
};