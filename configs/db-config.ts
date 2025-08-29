// This file is used to create a PostgreSQL connection pool using environment variables.
import { Pool, PoolClient } from 'pg';
import { xAppsRdsSecrets } from '../utilities';

export const pool = async () => {
  const { user, host, database, password, port } = await xAppsRdsSecrets();

  // Check if the required environment variables are set
  if (!user || !host || !database || !password || !port) {
    console.log('Database connection parameters are not properly set.', {
      user,
      host,
      database,
      password,
      port,
    });

    throw new Error('Database connection parameters are not properly set.');
  }

  return new Pool({
    user: user,
    host: host,
    database: database,
    password: password,
    port: port,
  });
};

export const getClient = async (): Promise<PoolClient> => {
  const dbPool = await pool();
  return dbPool.connect();
};
