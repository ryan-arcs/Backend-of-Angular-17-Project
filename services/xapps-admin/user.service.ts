import { CreateUserParams, ManageRolesRequest, ManageUserSpecialPermissionsRequest, UpdateUserParams, User, UserRole, UserRoleListRequest, UserSpecialPermission, UserSpecialPermissionListRequest } from '../../interfaces';
import { executeQuery, listQuery } from '../../utilities/db-queries';
import { ListQueryParams } from '../../interfaces';
import { isValidEmail } from '../../utilities/email-format-validator.utility';

export const getUsers = async (params: ListQueryParams): Promise<{ data: User[]; totalCount: number }> => {
  return await listQuery({
    tableName: 'xapps.users_vw',
    searchableColumns: [
      'first_name',
      'last_name',
      'email',
      'worker_id',
      'network_id',
      'empl_status',
      'manager_email',
      'manager_network_id'
    ],
    ...params
  });
};

export const createUser = async (params: CreateUserParams) => {
  const {
    firstName,
    lastName,
    email,
    createdByUserId, // this is the userID who creates the user
  } = params;

  if (!(firstName && lastName && email && createdByUserId)) {
    throw new Error("Missing required parameters.");
  }

  // Validate email format
  if (!isValidEmail(email)) {
    throw new Error("Invalid email format.");
  }

  await checkUserExists(email); // Check if user already exists

  const query = `
    SELECT * from xapps.upsert_user(
      p_first_name := $1,
      p_last_name := $2,
      p_email := $3,
      p_user_id := $4
    );
  `;

  const placeHolders = [firstName, lastName, email, createdByUserId];

  const result = await executeQuery(query, placeHolders);
  console.log("User created successfully:", result.rows[0]?.upsert_user);
  return result.rows[0]?.upsert_user;

};

export const updateUser = async (params: UpdateUserParams) => {
  const {
    firstName,
    lastName,
    email,
    isActive,
    updatedByUserId, // this is the userID who updates the user
  } = params;
  if (!(firstName && lastName && email && updatedByUserId)) {
    throw new Error("Missing required parameters.");
  }

  // Validate email format
  if (!isValidEmail(email)) {
    throw new Error("Invalid email format.");
  }

  const query = `
    SELECT * from xapps.upsert_user(
      p_first_name := $1,
      p_last_name := $2,
      p_email := $3,
      p_user_id := $4,
      p_is_active := $5
    );`;

  const placeHolders = [firstName, lastName, email, updatedByUserId, isActive];
  const result = await executeQuery(query, placeHolders);
  console.log("result.rows[0]====", result.rows[0]);
  return result.rows[0]?.upsert_user;

};

export const manageRoles = async (req: ManageRolesRequest): Promise<boolean> => {
  
  if (!req.rUserId) {
    throw new Error("Missing required parameters!");
  }
  if (!req?.assignedRoles) {
    req.assignedRoles = [];
  }

  const roleIds = req.assignedRoles?.map((assignedRole) => assignedRole.id) || [];
  console.log(roleIds)
  const result = await executeQuery(
    `SELECT * FROM xapps.assign_roles_to_user(
      p_r_user_id := $1,
      p_role_ids := $2::integer[],
      p_user_id := $3
    );`,
    [req.rUserId, roleIds, req.userId]
  );
  return result?.rows[0]?.assign_users_to_role?.rows;
};

export const roleList = async (req: UserRoleListRequest): Promise<{ data: UserRole[]; totalCount: number }> => {
  
  if(!req.userId) {
    throw new Error('Missing required parameters!');
  }

  const result = await executeQuery(
    `SELECT * FROM xapps.get_roles_by_user_id($1);`,
    [req?.userId]
  );

  return { data: result.rows[0]?.get_roles_by_user_id?.rows, totalCount: Number(result.rows[0]?.get_roles_by_user_id?.totalCount)};
};

export const manageSpecialPermissions = async (req: ManageUserSpecialPermissionsRequest): Promise<boolean> => {
  
  if (!req.sUserId) {
    throw new Error("Missing required parameters!");
  }
  if (!req?.assignedSpecialPermissions) {
    req.assignedSpecialPermissions = [];
  }

  const permissionIds = req.assignedSpecialPermissions?.map((assignedSpecialPermission) => assignedSpecialPermission.id) || [];

  await executeQuery(
    `SELECT * FROM xapps.assign_permissions_to_user(
      p_p_user_id := $1,
      p_permission_ids := $2::integer[],
      p_user_id := $3
    );`,
    [req.sUserId, permissionIds, req.userId]
  );
  return true;
};

export const specialPermissionList = async (req: UserSpecialPermissionListRequest): Promise<{ data: UserSpecialPermission[]; totalCount: number }> => {
  
  if(!req.userId) {
    throw new Error('Missing required parameters!');
  }

  const result = await executeQuery(
    `SELECT * FROM xapps.get_permissions_by_user_id($1);`,
    [req?.userId]
  );
  return { data: result.rows[0]?.get_permissions_by_user_id?.rows, totalCount: Number(result.rows[0]?.get_permissions_by_user_id?.totalCount) };
};

export const getUserById = async (id: number): Promise<User> => {
  const query = `SELECT * FROM xapps.users_vw WHERE id = $1`;
  const result = await executeQuery(query, [id]);

  if(!result?.rows?.length) {
    throw new Error(`User not found.`);
  }

  return result.rows[0];
};

const checkUserExists = async (email: string) => {
  const query = `SELECT * FROM xapps.users where email= $1`;
  const result = await executeQuery(query, [email]);
  if (result.rows.length > 0) {
    throw new Error(`Email already exists.`);
  }
};