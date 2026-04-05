import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/infrastructure/repository/postgres/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
