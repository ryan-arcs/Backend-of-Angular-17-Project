export interface Role {
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

interface Permission {
  id: string;
}

interface User extends Permission {}

export interface RolePermission extends Permission{
  is_assigned?: boolean;
}

export interface RoleUser extends RolePermission {}

export interface ManagePermissionsRequest {
  userId: string;
  roleId: number;
  assignedPermissions: Permission[];
}

export interface RolePermissionListRequest {
  roleId: number;
}

export interface ManageUsersRequest {
  userId: string;
  roleId: number;
  assignedUsers: User[];
}

export interface RoleUserListRequest {
  roleId: number;
}

export interface CreateRoleParams {
  roleName: string;
  description?: string;
  slug: string;
  appId?: number;  // Optional
  userId: string;
}

export interface UpdateRoleParams extends CreateRoleParams {
  id: number
  isActive: boolean;
}