export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  full_name: string;
  worker_id: string | null;
  network_id: string | null;
  empl_status: string | null;
  manager_worker_id: string | null;
  manager_network_id: string | null;
  manager_email: string | null;
  cost_center_code: string | null;
  cost_center_description: string | null;
  employee_type: string | null;
  theme: string | null;
  tableau: any;
  last_login: string | null;
  is_active: boolean;
  is_deleted: boolean;
  deleted_at: string | null;
  deleted_by: number | null;
  created_at: string;
  created_by: number | null;
  updated_at: string;
  updated_by: number | null;
}

interface BaseUserParams {
  firstName: string;
  lastName: string;
  email: string;
}

export interface CreateUserParams extends BaseUserParams {
  createdByUserId: number;
}

export interface UpdateUserParams extends BaseUserParams {
  updatedByUserId: number;
  isActive?: string;
}

interface Role {
  id: string;
}

interface SpecalPermission extends Role {}

export interface UserRole extends Role{
  is_assigned?: boolean;
}

export interface UserSpecialPermission extends UserRole {}

export interface ManageRolesRequest {
  rUserId: number;
  assignedRoles: Role[];
  userId: number;
}

export interface ManageUserSpecialPermissionsRequest {
  sUserId: number;
  assignedSpecialPermissions: SpecalPermission[];
  userId: number;
}

export interface UserRoleListRequest {
  userId: number;
}

export interface UserSpecialPermissionListRequest extends UserRoleListRequest {}