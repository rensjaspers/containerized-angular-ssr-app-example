import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';

/**
 * Ensures API requests hit the same server instance and share cache keys between SSR and browser.
 */
export const apiUrlAlignmentInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const normalizedReq = normalizeUrlForSsrAndTransferCache(req, platformId);
  return next(normalizedReq);
};

function normalizeUrlForSsrAndTransferCache(req: HttpRequest<unknown>, platformId: object) {
  const serverReq = routeRelativeRequestsToInternalSsrServer(req, platformId);
  return normalizeBrowserApiUrlForTransferCache(serverReq, platformId);
}

function routeRelativeRequestsToInternalSsrServer(req: HttpRequest<unknown>, platformId: object) {
  if (!isPlatformServer(platformId) || !req.url.startsWith('/')) {
    return req;
  }

  const port = process.env['PORT'] || 4000;
  const internalUrl = `http://localhost:${port}${req.url}`;
  return req.clone({ url: internalUrl });
}

function normalizeBrowserApiUrlForTransferCache(req: HttpRequest<unknown>, platformId: object) {
  if (!isPlatformBrowser(platformId) || !req.url.startsWith('/api')) {
    return req;
  }

  const absoluteUrl = `${window.location.origin}${req.url}`;
  return req.clone({ url: absoluteUrl });
}
