/** Auto-generated public API allowlist — auth middleware skips these routes. */

export interface PublicApiRoute {
  method: string;
  path: string;
}

export const PUBLIC_API_ROUTES: PublicApiRoute[] = [
  {
    "method": "GET",
    "path": "/api/health"
  }
];

export function isPublicApiRoute(method: string, urlPath: string): boolean {
  const m = method.toUpperCase();
  const p = urlPath.split('?')[0] || '/';
  return PUBLIC_API_ROUTES.some((r) => r.method === m && r.path === p);
}
