import { CreatePermissionParams, Permission, UpdatePermissionParams } from '../../interfaces';
import { executeQuery, listQuery } from '../../utilities/db-queries';
import { ListQueryParams } from '../../interfaces';

export const getPermissions = async (params: ListQueryParams): Promise<{ data: Permission[]; totalCount: number }> => {
  return await listQuery({
    tableName: 'xapps.permissions_vw',
    searchableColumns: [
      'module_name',
      'sub_module_name',
      'application_name',
      'description',
      'permission_name',
    ],
    ...params
  });
};

export const createPermission = async (params: CreatePermissionParams) => {
  const {
    moduleId,
    permissionName,
    slug,
    userId,
    description = '',
    submoduleId
  } = params;

  if (!(moduleId && permissionName && slug && userId)) {
    throw new Error('Missing required fields for permission creation.');
  }

  const query = `
    SELECT * FROM xapps.upsert_permission(
      p_module_id := $1,
      p_sub_module_id := $2,
      p_permission_name := $3,
      p_description := $4,
      p_slug := $5,
      p_user_id := $6
    );
  `;

  const placeHolders = [moduleId, submoduleId ?? null, permissionName, description, slug, userId];
  const result = await executeQuery(query, placeHolders);
  console.log('Permission created successfully:', result.rows[0]);
  return result.rows[0]?.upsert_permission;
};

export const updatePermission = async (params: UpdatePermissionParams) => {
  const {
    id,
    moduleId,
    permissionName,
    userId,
    description = '',
    submoduleId,
    isActive = null
  } = params;

  if (!(id && moduleId && permissionName && userId)) {
    throw new Error('Missing required fields for permission update.');
  }

  const query = `
    SELECT * FROM xapps.upsert_permission(
      p_id := $1,
      p_module_id := $2,
      p_sub_module_id:= $3 ,
      p_permission_name := $4,
      p_description := $5,
      p_user_id := $6,
      p_is_active := $7
    );
  `;
  const placeHolders = [id, moduleId, submoduleId ?? null, permissionName, description, userId, isActive];
  const result = await executeQuery(query, placeHolders);
  console.log('Permission updated successfully:', result.rows[0]);
  return result.rows[0]?.upsert_permission;
};

export const deletePermission = async (id: number, userId: number) => {
  const query = `
    SELECT * FROM xapps.upsert_permission(
      p_id := $1,
      p_is_deleted := TRUE,
      p_user_id := $2
    );
  `;
  const placeHolders = [id, userId];
  const result = await executeQuery(query, placeHolders);
  console.log(`Module deleted successfully!`, result);
  return result.rows[0]?.upsert_permission;
};

export const getPermissionById = async (id: number): Promise<any> => {
  const query = `SELECT * FROM xapps.permissions_vw WHERE id = $1`;
  const result = await executeQuery(query, [id]);

  if(!result?.rows?.length) {
    throw new Error(`User not found.`);
  }

  return result.rows[0];
};