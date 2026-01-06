import { HTTP_TRANSFER_CACHE_ORIGIN_MAP } from '@angular/common/http';
import { ApplicationConfig, mergeApplicationConfig, REQUEST } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';

import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const port = process.env['PORT'] || 4000;
const internalOrigin = `http://localhost:${port}`;

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),

    // Map internal server origin to client origin for transfer cache.
    // This ensures that HTTP responses cached during SSR (using the internal port)
    // can be matched by the browser (using the external/mapped port).
    {
      provide: HTTP_TRANSFER_CACHE_ORIGIN_MAP,
      useFactory: (request: Request | null) => {
        if (request?.url) {
          const clientOrigin = new URL(request.url).origin;
          return { [internalOrigin]: clientOrigin };
        }
        return {};
      },
      deps: [[REQUEST]],
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
