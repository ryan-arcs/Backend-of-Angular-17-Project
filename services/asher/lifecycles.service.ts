import { CreateLifecycleParams, ListQueryParams, UpdateLifecycleParams } from "../../interfaces";
import { executeQuery, listQuery } from "../../utilities/db-queries";


export const getLifecycles = async (params: ListQueryParams): Promise<{ data: any[]; totalCount: number }> => {
  return await listQuery({
    tableName: 'xapps.lifecycles_vw',
    searchableColumns: [
      'code',
      'name',
      'description'
    ],
    ...params
  });
};

export const createLifecycle = async (params: CreateLifecycleParams) => {
  const {
    name,
    description,
    user_info
  } = params;

  if (!(name && user_info?.email && user_info?.id)) {
    throw new Error('Missing required parameters.');
  }

  const query = `
    SELECT * FROM xapps.upsert_lifecycle(
      p_user_id := $1,
      p_name := $2,
      p_description := $3
    );
  `;

  const placeHolders = [user_info?.id, name, description];

  try {
    const result = await executeQuery(query, placeHolders);
    console.log('Lifecycle created successfully:', result.rows[0]);
    return result.rows[0]?.upsert_lifecycle;
  } catch (error) {
    console.error('Error creating lifecycle:', error);
    throw error;
  }
};

export const updateLifecycle = async (params: UpdateLifecycleParams) => {
  const {
    id,
    name,
    description,
    user_info
  } = params;

  if (!(id && name && user_info?.email && user_info?.id)) {
    throw new Error('Missing required parameters.');
  }

  const query = `
    SELECT * FROM xapps.upsert_lifecycle(
      p_user_id := $1,
      p_id := $2,
      p_name := $3,
      p_description := $4
    );
  `;
  const placeHolders = [user_info?.id, id, name, description];

  try {
    const result = await executeQuery(query, placeHolders);
    console.log("result.rows[0]?.upsert_lifecycle==", result.rows[0]?.upsert_lifecycle);
    return result.rows[0]?.upsert_lifecycle;
  } catch (error) {
    console.error('Error in upsert_lifecycle:', error);
    throw error;
  }
};

export const deleteLifecycle = async (id: number, userId: string) => {
  const query = `
    SELECT * FROM xapps.upsert_lifecycle(
      p_user_id := $1,
      p_id := $2,
      p_is_deleted := TRUE
    );
  `;
  const placeHolders = [userId, id];
  const result = await executeQuery(query, placeHolders);
  console.log(`Lifecycle deleted successfully!`, result.rows[0]?.upsert_lifecycle);
  return result.rows[0]?.upsert_lifecycle;
};

export const getLifecycleById = async (code: string): Promise<any> => {
  const query = `SELECT * FROM xapps.lifecycles_vw WHERE code = $1`;
  const result = await executeQuery(query, [code]);
  if(!result?.rows?.length) {
    throw new Error(`Lifecycle not found.`);
  }

  return result.rows[0];
};