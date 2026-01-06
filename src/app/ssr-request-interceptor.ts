import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';

/**
 * HTTP interceptor that ensures API requests work correctly in both SSR and browser contexts,
 * and that transfer cache entries match between server and client.
 *
 * On the server:
 *   - Rewrites relative URLs to target the internal Express server port.
 *
 * In the browser:
 *   - Converts relative API URLs to absolute URLs so they match the transfer cache keys
 *     that were created during SSR (after origin mapping).
 */
export const ssrRequestInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  // Server-side: rewrite to internal Express server
  if (isPlatformServer(platformId) && req.url.startsWith('/')) {
    const port = process.env['PORT'] || 4000;
    const internalUrl = `http://localhost:${port}${req.url}`;
    return next(req.clone({ url: internalUrl }));
  }

  // Browser: convert relative API URLs to absolute for transfer cache matching
  if (isPlatformBrowser(platformId) && req.url.startsWith('/api')) {
    const absoluteUrl = `${window.location.origin}${req.url}`;
    return next(req.clone({ url: absoluteUrl }));
  }

  return next(req);
};
