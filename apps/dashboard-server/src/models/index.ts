import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { ConnectionManager } from './connectionManager';
import config from '@/config';

const { DASHBOARD_PG_HOST, DASHBOARD_PG_PORT } = config;

export const createUrl = ({
  db_username,
  db_password,
  db_name
}: {
  db_username: string;
  db_password: string;
  db_name: string;
}): string => `postgresql://${db_username}:${db_password}@${DASHBOARD_PG_HOST}:${DASHBOARD_PG_PORT}/${db_name}`;

export const createClient = <T extends Record<string, unknown>>(
  tenantId: string,
  URL: string,
  schema: T,
): { client: PostgresJsDatabase<T>; connection: postgres.Sql } => {
  const connectionManager = ConnectionManager.getInstance();
  return connectionManager.getOrCreateConnection(tenantId, URL, schema);
};
