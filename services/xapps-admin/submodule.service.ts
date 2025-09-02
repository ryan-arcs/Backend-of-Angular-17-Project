import { CreateSubModuleParams, Submodule, UpdateSubModuleParams } from '../../interfaces';
import { executeQuery, listQuery } from '../../utilities/db-queries';
import { ListQueryParams } from '../../interfaces';

export const getSubmodules = async (params: ListQueryParams): Promise<{ data: Submodule[]; totalCount: number }> => {
  return await listQuery({
    tableName: 'xapps.submodules_vw',
    searchableColumns: [
      'app_name',
      'app_slug',
      'module_name',
      'description',
      'slug',
      'sub_module_name'
    ],
    ...params
  });
};

export const createSubmodule = async (params: CreateSubModuleParams) => {
  const {
    moduleId,
    subModuleName,
    slug,
    userId,
    description = ''
  } = params;

  if (!(moduleId && subModuleName && slug && userId)) {
    throw new Error('Missing required fields for submodule creation.');
  }

  const query = `
    SELECT * FROM xapps.upsert_sub_module(
      p_module_id := $1,
      p_sub_module_name := $2,
      p_description := $3,
      p_slug := $4,
      p_user_id := $5
    );
  `;

  const placeHolders = [moduleId, subModuleName, description, slug, userId];
  const result = await executeQuery(query, placeHolders);
  console.log('Submodule created successfully:', result.rows[0]);
  return result.rows[0]?.upsert_sub_module;
};

export const updateSubmodule = async (params: UpdateSubModuleParams) => {
  const {
    id,
    moduleId,
    subModuleName,
    userId,
    description = '',
    isActive = null
  } = params;

  if (!(id && moduleId && subModuleName && userId)) {
    throw new Error('Missing required fields for submodule update.');
  }

  const query = `
    SELECT * FROM xapps.upsert_sub_module(
      p_id := $1,
      p_module_id := $2,
      p_sub_module_name := $3,
      p_description := $4,
      p_user_id := $5,
      p_is_active := $6
    );
  `;
  const placeHolders = [id, moduleId, subModuleName, description, userId, isActive];
  const result = await executeQuery(query, placeHolders);
  console.log('Submodule updated successfully:', result.rows[0]);
  return result.rows[0]?.upsert_sub_module;
};

export const deleteSubModule = async (id: number, userId: number) => {
  const query = `
    SELECT * FROM xapps.upsert_sub_module(
      p_id := $1,
      p_is_deleted := TRUE,
      p_user_id := $2
    );
  `;
  const placeHolders = [id, userId];
  const result = await executeQuery(query, placeHolders);
  console.log(`Module deleted successfully!`, result.rows[0]?.upsert_sub_module);
  return result.rows[0]?.upsert_sub_module;
};


export const getSubmoduleById = async (id: number): Promise<any> => {
  const query = `SELECT * FROM xapps.submodules_vw WHERE id = $1`;
  const result = await executeQuery(query, [id]);

  if(!result?.rows?.length) {
    throw new Error(`User not found.`);
  }

  return result.rows[0];
};