import { CreateModuleParams, Module, UpdateModuleParams } from '../interfaces';
import { executeQuery, listQuery } from '../utilities/db-queries';
import { ListQueryParams } from '../interfaces';

export const getModules = async (params: ListQueryParams): Promise<{ data: Module[]; totalCount: number }> => {
  return await listQuery({
    tableName: 'xapps.modules_vw',
    searchableColumns: [
      'module_name',
      'app_name',
      'slug',
      'description',
    ],
    ...params
  });
};

export const createModule = async (params: CreateModuleParams) => {
  const {
    applicationId,
    moduleName,
    slug,
    userId,
    description = ''
  } = params;

  if (!(applicationId && moduleName && slug && userId)) {
    throw new Error('Missing required fields for module creation.');
  }

  const query = `SELECT * FROM xapps.upsert_module(
      p_application_id := $1,
      p_module_name := $2,
      p_description := $3,
      p_slug := $4,
      p_user_id := $5
    );
  `;

  const placeHolders = [applicationId, moduleName, description, slug, userId];
  const result = await executeQuery(query, placeHolders);
  console.log("result.rows[0]?====module create =====", result.rows[0]);
  return result.rows[0]?.upsert_module;
};

export const updateModule = async (params: UpdateModuleParams) => {
  const {
    id, // module id
    applicationId,
    moduleName,
    userId,
    description = '',
    isActive = null
  } = params;

  if (!(id && applicationId && moduleName&& userId)) {
    throw new Error('Missing required fields for module update.');
  }

  const query = `
    SELECT * FROM xapps.upsert_module(
      p_id := $1,
      p_application_id := $2,
      p_module_name := $3,
      p_description := $4,
      p_user_id := $5,
      p_is_active := $6
    );
  `;
  const placeHolders = [id, applicationId, moduleName, description, userId, isActive];
  const result = await executeQuery(query, placeHolders);
  return result.rows[0]?.upsert_module;
};

export const deleteModule = async (id: number, userId: number) => {
  const query = `
    SELECT * FROM xapps.upsert_module(
      p_id := $1,
      p_is_deleted := TRUE,
      p_user_id := $2
    );
  `;
  const placeHolders = [id, userId];
  const result = await executeQuery(query, placeHolders);
  return result.rows[0]?.upsert_module;
};


export const getModuleById = async (id: number): Promise<any> => {
  const query = `SELECT * FROM xapps.modules_vw WHERE id = $1`;
  const result = await executeQuery(query, [id]);

  if(!result?.rows?.length) {
    throw new Error(`User not found.`);
  }

  return result.rows[0];
};