import type { ServerBuild } from '@remix-run/cloudflare';
import { createRequestHandler } from '@remix-run/cloudflare';

export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    try {
      // Import the server build
      const serverBuild = (await import('./build/server')) as unknown as ServerBuild;
      
      // Create the request handler
      const handler = createRequestHandler(serverBuild, process.env.NODE_ENV);

      // Handle the request with proper cloudflare context
      return handler(request, {
        cloudflare: {
          env,
          ctx,
          cf: request.cf as any,
          caches: (globalThis as any).caches,
        },
      });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};