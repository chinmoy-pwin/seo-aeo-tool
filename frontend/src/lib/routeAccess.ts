/** Auto-generated from architecture routeAccess — do not edit by hand in pipeline runs. */

export const AUTH_ENABLED = false;
export const INCLUDE_LANDING_PAGE = false;
export const SIGNUP_PATH = '/signup';
export const DEFAULT_AUTHENTICATED_HOME = '/dashboard';

export const PUBLIC_PAGE_PATHS = [
  "/",
  "/sites",
  "/indexing",
  "/audits",
  "/keywords",
  "/backlinks",
  "/content",
  "/ai-monitoring",
  "/integrations",
  "/alerts"
];

export const PROTECTED_PAGE_PATHS = [];

export const PUBLIC_NAV_WHEN_LOGGED_OUT = [];

export const AUTH_NAV = [];

export function isPublicPagePath(pathname) {
  const p = pathname.split('?')[0] || '/';
  return PUBLIC_PAGE_PATHS.some(
    (pub) => p === pub || (pub !== '/' && p.startsWith(pub + '/'))
  );
}

export function isProtectedPagePath(pathname) {
  const p = pathname.split('?')[0] || '/';
  return PROTECTED_PAGE_PATHS.some(
    (prot) => p === prot || p.startsWith(prot + '/')
  );
}

export function isAuthenticated() {
  if (typeof localStorage === 'undefined') return false;
  return !!localStorage.getItem('token');
}
