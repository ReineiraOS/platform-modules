import { neon } from '@neondatabase/serverless';
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';
import { getEnv } from '../../../core/config.js';

export type Db = NeonHttpDatabase<typeof schema>;

let _db: Db | null = null;

export function getDb(): Db {
  if (!_db) {
    const url = getEnv().DATABASE_URL;
    if (!url)
      throw new Error('DATABASE_URL is required when DB_PROVIDER is postgres');
    const sql = neon(url);
    _db = drizzle(sql, { schema });
  }
  return _db;
}
