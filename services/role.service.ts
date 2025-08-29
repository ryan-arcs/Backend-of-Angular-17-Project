import { ManagePermissionsRequest, RolePermissionListRequest, Role, RolePermission, CreateRoleParams, UpdateRoleParams, ManageUsersRequest, RoleUserListRequest, User } from '../interfaces';
import { executeQuery, listQuery } from '../utilities/db-queries';
import { ListQueryParams } from '../interfaces';

export const getRoles = async (params: ListQueryParams): Promise<{ data: Role[]; totalCount: number }> => {
  return await listQuery({
    tableName: 'xapps.roles_vw',
    searchableColumns: [
      'role_name',
      'description',
      'app_name',
    ],
    ...params
  });
};

export const managePermissions = async (req: ManagePermissionsRequest) => {
  
  if(!req?.roleId) {
    throw new Error('Missing required parameters!');
  }

  if(!req?.assignedPermissions){
    req.assignedPermissions = [];
  }
  
  const permissionIds = req.assignedPermissions?.map((assignedPermission) => assignedPermission.id) || [];
  const result = await executeQuery(
    `SELECT * FROM xapps.assign_permissions_to_role(
     p_role_id := $1,
     p_permission_ids := $2::integer[],
     p_user_id := $3
    )`,
    [req.roleId, permissionIds, req.userId]
  );

  return result.rows[0];
};

export const permissionList = async (req: RolePermissionListRequest): Promise<{ data: RolePermission[]; totalCount: number }> => {
  
  if(!req.roleId) {
    throw new Error('Missing required parameters!');
  }

  const result = await executeQuery(
    `SELECT * FROM xapps.get_permissions_by_role_id($1);`,
    [req?.roleId]
  );
  
  return { data: result.rows, totalCount: Number(result?.rowCount)};
};

export const manageUsers = async (req: ManageUsersRequest) => {
  
  if(!req?.roleId) {
    throw new Error('Missing required parameters!');
  }

  if(!req?.assignedUsers){
    req.assignedUsers = [];
  }
  
  const userIds = req.assignedUsers?.map((assignedUser) => assignedUser.id) || [];
  const result = await executeQuery(
    `SELECT * FROM xapps.assign_users_to_role(
     p_role_id := $1,
     p_user_ids := $2::integer[],
     p_user_id := $3
    )`,
    [req.roleId, userIds, req.userId]
  );

  return result.rows[0];
};

export const userList = async (req: RoleUserListRequest): Promise<{ data: User[]; totalCount: number }> => {
  
  if(!req.roleId) {
    throw new Error('Missing required parameters!');
  }

  const result = await executeQuery(
    `SELECT * FROM xapps.get_users_by_role_id($1);`,
    [req?.roleId]
  );
  
  return { data: result.rows, totalCount: Number(result?.rowCount)};
};

export const createRole = async (params: CreateRoleParams) => {
  const {
    roleName,
    slug,
    appId = null,
    userId,
    description = '',
  } = params;

  if (!(roleName && slug && userId)) {
    throw new Error('Missing required fields for role creation.');
  }

  const query = `
    SELECT * FROM xapps.upsert_role(
      p_role_name := $1,
      p_description := $2,
      p_slug := $3,
      p_app_id := $4,
      p_user_id := $5
    );
  `;

  const placeHolders = [roleName, description, slug, appId, userId];
  const result = await executeQuery(query, placeHolders);
  console.log('Role created successfully:', result.rows[0]);
  return result.rows[0]?.upsert_role;
};

export const updateRole = async (params: UpdateRoleParams) => {
  const {
    id,
    roleName,
    description = '',
    appId,
    userId,
    isActive
  } = params;

  if (!(id && roleName && userId)) {
    throw new Error('Missing required fields for role update.');
  }

  const query = `
    SELECT * FROM xapps.upsert_role(
      p_id := $1,
      p_role_name := $2,
      p_description := $3,
      p_app_id := $4,
      p_user_id := $5,
      p_is_active := $6
    );
  `;
  const placeHolders = [id, roleName, description, appId, userId, isActive];
  const result = await executeQuery(query, placeHolders);
  console.log('Role updated successfully:', result.rows[0]);
  return result.rows[0]?.upsert_role;
};

export const deleteRole = async (id: number, userId: number) => {
  const query = `
    SELECT * FROM xapps.upsert_role(
      p_id := $1,
      p_is_deleted := TRUE,
      p_user_id := $2
    );
  `;
  const placeHolders = [id, userId];
  const result = await executeQuery(query, placeHolders);
  console.log(`Module deleted successfully!`, result);
  return result.rows[0]?.upsert_role;
};


export const getRoleById = async (id: number): Promise<any> => {
  const query = `SELECT * FROM xapps.roles_vw WHERE id = $1`;
  const result = await executeQuery(query, [id]);

  if(!result?.rows?.length) {
    throw new Error(`Role not found.`);
  }

  return result.rows[0];
};