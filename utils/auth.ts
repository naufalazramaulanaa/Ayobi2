export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null; // guard for SSR
  return localStorage.getItem('access_token');
};