import { useState, useEffect, useCallback } from 'react';

export type Route = 'home' | 'about' | 'services' | 'pricing' | 'how-it-works' | 'track' | 'contact' | 'apply' | 'privacy' | 'terms' | 'customer-login' | 'dashboard';

const VALID_ROUTES: Route[] = ['home', 'about', 'services', 'pricing', 'how-it-works', 'track', 'contact', 'apply', 'privacy', 'terms', 'customer-login', 'dashboard'];

function getRouteFromHash(): Route {
  const hash = window.location.hash.replace('#/', '').replace('#', '');
  if (!hash) return 'home';
  const route = hash as Route;
  return VALID_ROUTES.includes(route) ? route : 'home';
}

export function useRouter() {
  const [route, setRoute] = useState<Route>(getRouteFromHash());

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRouteFromHash());
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = useCallback((to: Route) => {
    window.location.hash = `/${to}`;
  }, []);

  return { route, navigate };
}

export function navigateTo(route: Route) {
  window.location.hash = `/${route}`;
}
