export interface Permission {
  id: number;
  module_id: number;
  module_name: string;
  sub_module_id: number;
  sub_module_name: string;
  app_id: number;
  application_name: string;
  permission_name: string;
  description: string;
  slug: string;
  is_active: boolean;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

export interface CreatePermissionParams {
  moduleId: number;
  permissionName: string;
  slug: string;
  userId: number;
  description?: string;
  submoduleId?: number;
}

export interface UpdatePermissionParams extends CreatePermissionParams {
  id: number;
  isActive: boolean;
}