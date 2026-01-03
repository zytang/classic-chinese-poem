import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema';

// Use the Vercel Postgres pool
export const db = drizzle(sql, { schema });
