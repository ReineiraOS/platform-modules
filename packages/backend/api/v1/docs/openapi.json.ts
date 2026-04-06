import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendResponse } from '../../../src/interface/handler-factory.js';
import { withCors } from '../../../src/interface/middleware/with-cors.js';
import { Response } from '../../../src/interface/response.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const specPath = resolve(__dirname, '..', '..', 'openapi.json');

let spec: unknown;
try {
  spec = JSON.parse(readFileSync(specPath, 'utf-8'));
} catch {
  spec = { openapi: '3.1.0', info: { title: 'ReineiraOS Modules API', version: '0.1.0' }, paths: {} };
}

const handler = async (_req: VercelRequest, res: VercelResponse): Promise<void> => {
  sendResponse(res, Response.ok(spec));
};

export default withCors(handler);
