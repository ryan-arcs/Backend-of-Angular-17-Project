import { getClient } from '../../configs/db-config';

export const executeQuery = async (query: string, params: any[] = []) => {
  const client = await getClient();

  try {
    const result = await client.query(query, params);
    return result;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};