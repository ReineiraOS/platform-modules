import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const API_DIR = join(__dirname, '..', 'api');

interface Route {
  pattern: RegExp;
  paramNames: string[];
  filePath: string;
  displayPath: string;
}

function scanRoutes(dir: string, base = ''): Route[] {
  const routes: Route[] = [];

  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      routes.push(...scanRoutes(fullPath, `${base}/${entry}`));
      continue;
    }

    if (!entry.endsWith('.ts')) continue;

    const routePath = entry === 'index.ts' ? base || '/' : `${base}/${entry.replace('.ts', '')}`;

    const paramNames: string[] = [];
    const patternStr = routePath
      .split('/')
      .map((seg) => {
        const match = seg.match(/^\[(.+)]$/);
        if (match) {
          paramNames.push(match[1]);
          return '([^/]+)';
        }
        return seg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      })
      .join('/');

    routes.push({
      pattern: new RegExp(`^/api${patternStr}$`),
      paramNames,
      filePath: fullPath,
      displayPath: `/api${routePath}`,
    });
  }

  return routes;
}

function sortRoutes(routes: Route[]): Route[] {
  return routes.sort((a, b) => {
    const aSegments = a.displayPath.split('/').length;
    const bSegments = b.displayPath.split('/').length;
    if (bSegments !== aSegments) return bSegments - aSegments;
    return a.paramNames.length - b.paramNames.length;
  });
}

function parseBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString();
      if (!raw) {
        resolve(undefined);
        return;
      }
      const ct = req.headers['content-type'] ?? '';
      if (ct.includes('application/json')) {
        try {
          resolve(JSON.parse(raw));
        } catch {
          resolve(raw);
        }
      } else {
        resolve(raw);
      }
    });
  });
}

function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) return {};
  const cookies: Record<string, string> = {};
  for (const pair of header.split(';')) {
    const [key, ...rest] = pair.split('=');
    if (key) cookies[key.trim()] = rest.join('=').trim();
  }
  return cookies;
}

function createVercelResponse(res: ServerResponse): any {
  let statusCode = 200;

  const vercelRes: any = res;

  vercelRes.status = (code: number) => {
    statusCode = code;
    res.statusCode = code;
    return vercelRes;
  };

  vercelRes.json = (body: unknown) => {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(body));
    return vercelRes;
  };

  vercelRes.send = (body: unknown) => {
    res.statusCode = statusCode;
    if (typeof body === 'object' && body !== null) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(body));
    } else {
      res.end(body == null ? '' : String(body));
    }
    return vercelRes;
  };

  vercelRes.redirect = (statusOrUrl: string | number, url?: string) => {
    if (typeof statusOrUrl === 'string') {
      res.statusCode = 302;
      res.setHeader('Location', statusOrUrl);
    } else {
      res.statusCode = statusOrUrl;
      res.setHeader('Location', url!);
    }
    res.end();
    return vercelRes;
  };

  return vercelRes;
}

async function main() {
  const routes = sortRoutes(scanRoutes(API_DIR));
  const port = Number(process.env.PORT) || 3000;

  const server = createServer(async (rawReq: IncomingMessage, rawRes: ServerResponse) => {
    const parsed = new URL(rawReq.url ?? '/', `http://localhost:${port}`);
    const pathname = parsed.pathname;
    const searchParams = parsed.searchParams;

    const matched = routes.find((r) => r.pattern.test(pathname));

    if (!matched) {
      rawRes.statusCode = 404;
      rawRes.setHeader('Content-Type', 'application/json');
      rawRes.end(JSON.stringify({ error: 'Not found' }));
      return;
    }

    const paramValues = pathname.match(matched.pattern)!.slice(1);
    const pathParams: Record<string, string> = {};
    matched.paramNames.forEach((name, i) => {
      pathParams[name] = paramValues[i];
    });

    const query: Record<string, string | string[]> = { ...pathParams };
    for (const [key, value] of searchParams) {
      const existing = query[key];
      if (existing !== undefined) {
        query[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
      } else {
        query[key] = value;
      }
    }

    const body = await parseBody(rawReq);
    const cookies = parseCookies(rawReq.headers.cookie);

    const req: any = rawReq;
    req.query = query;
    req.cookies = cookies;
    req.body = body;

    const res = createVercelResponse(rawRes);

    try {
      const mod = await import(matched.filePath);
      const handler = mod.default;
      if (typeof handler !== 'function') {
        rawRes.statusCode = 500;
        rawRes.end(JSON.stringify({ error: `No default export in ${matched.displayPath}` }));
        return;
      }
      await handler(req, res);
    } catch (err) {
      console.error(`[ERROR] ${rawReq.method} ${pathname}`, err);
      if (!rawRes.headersSent) {
        rawRes.statusCode = 500;
        rawRes.setHeader('Content-Type', 'application/json');
        rawRes.end(JSON.stringify({ error: 'Internal server error' }));
      }
    }
  });

  server.listen(port, () => {
    console.log(`\nBackend running at http://localhost:${port}\n`);
    console.log('Routes:');
    for (const route of routes) {
      console.log(`  ${route.displayPath}`);
    }
    console.log('');
  });
}

main();
