/**
 * Backend API base URL — Railway deploy injects VITE_API_URL at build time.
 * Preview-safe: avoids bare import.meta (Babel sandbox strips env access).
 */
function resolveApiBase(): string {
  try {
    const env = (import.meta as { env?: { VITE_API_URL?: string } }).env;
    const fromEnv = env?.VITE_API_URL;
    if (fromEnv) return String(fromEnv).replace(/\/$/, '');
  } catch {
    /* preview sandbox */
  }
  return 'http://localhost:8080';
}

const API_BASE = resolveApiBase();

export function apiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${normalized}`;
}

export default API_BASE;
