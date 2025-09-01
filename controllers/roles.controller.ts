import { Request, Response } from 'express';
import { commmonResponse } from '../utilities';
import { getRoles, managePermissions, permissionList, createRole, getRoleById, updateRole, deleteRole, userList, manageUsers } from '../services';
import { getListQueryParams } from '../utilities';
import { getUserInfoFromHeader } from '../utilities/db-queries';

export const listRolesHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const queryParams = getListQueryParams(req, {
      defaultSortColumn: 'updated_at',
    });
    const { data, totalCount } = await getRoles(queryParams);

    commmonResponse({
      res,
      statusDescription: data?.length
        ? 'Roles are listed'
        : 'Role list is empty',
      data,
      totalCount,
    });
  } catch (err: any) {
    commmonResponse({
      res,
      statusCode: err?.statusCode || 520,
      statusMessage: err?.toString() || err?.message || 'Unknown error!',
    });
  }
};

export const createRoleHandler = async (req: Request, res: Response) => {
  try {
    const result = await createRole(req.body);

    commmonResponse({
      res,
      statusCode: result?.status_code,
      statusMessage: "Success",
      statusDescription: result?.message
    })

  } catch (err: any) {
    commmonResponse({
      res,
      statusCode: err?.statusCode || 520,
      statusDescription: err?.toString() || err?.message || 'Unknown error!',
      statusMessage: "Error"
    })
  }
};

export const updateRoleHandler = async (req: Request, res: Response) => {
  try {
    const result = await updateRole(req.body);
    commmonResponse({
      res,
      statusCode: result?.status_code,
      statusMessage: "Success",
      statusDescription: result?.message
    })

  } catch (err: any) {
    commmonResponse({
      res,
      statusCode: err?.statusCode || 520,
      statusDescription: err?.toString() || err?.message || 'Unknown error!',
      statusMessage: "Error"
    })
  }
};

export const getRoleHandler = async (req: Request, res: Response): Promise<any> => {
  
  const { id } = req.params;
  
  if (!id) {
    throw new Error("Invalid role id.");
  }

  try {
    const role = await getRoleById(Number(id));

    commmonResponse({
      res,
      statusMessage: "Role is fetched successfully",
      data: role
    })
  } catch (err: any) {
    commmonResponse({
      res,
      statusCode: err?.statusCode || 520,
      statusMessage: err?.toString() || err?.message || 'Unknown error!'
    })
  }
};

export const deleteRoleHandler = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!id) {
    throw new Error("Invalid application Id.");
  }

  const loggedInUser = getUserInfoFromHeader(req.headers);
  const userId = loggedInUser?.id;
  if(!userId) {
    throw new Error("Invalid user.");
  }

  try {
    const result = await deleteRole(Number(id), userId);

    commmonResponse({
      res,
      statusCode: result?.status_code,
      statusMessage: "Success",
      statusDescription: result?.message
    })

  } catch (err: any) {
    commmonResponse({
      res,
      statusCode: err?.statusCode || 520,
      statusDescription: err?.toString() || err?.message || 'Unknown error!',
      statusMessage: "Error"
    })
  }
};

export const rolePermissionsHandler = async (req: Request, res: Response) => {
  try {
    const roleId = Number(req.params.id);
    const assignedPermissions = req.body.assignedPermissions || '';
    const loggedInUserInfo = typeof(req?.headers?.['x-user-info']) === 'string'
        ? JSON.parse(req.headers['x-user-info'] as string)
        : req?.headers?.['x-user-info'];


    const result = await managePermissions({
      roleId,
      assignedPermissions,
      userId: loggedInUserInfo?.id
    });

    commmonResponse({
      res,
      statusCode: result?.status_code,
      statusMessage: "Success",
      statusDescription: result?.message
    })

  } catch (err: any) {
    commmonResponse({
      res,
      statusCode: err?.statusCode || 520,
      statusDescription: err?.toString() || err?.message || 'Unknown error!',
      statusMessage: "Error"
    })
  }
};

export const rolePermissionListHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const roleId = Number(req.params.id);
    const { data, totalCount } = await permissionList({
      roleId,
    });

    commmonResponse({
      res,
      statusDescription: data?.length
        ? 'Role permissions are listed'
        : 'Role permission list is empty',
      data,
      totalCount,
    });
  } catch (err: any) {
    commmonResponse({
      res,
      statusCode: err?.statusCode || 520,
      statusMessage: err?.toString() || err?.message || 'Unknown error!',
    });
  }
};


export const roleUsersHandler = async (req: Request, res: Response) => {
  try {
    const roleId = Number(req.params.id);
    const assignedUsers = req.body.assignedUsers || '';
    const loggedInUserInfo = typeof(req?.headers?.['x-user-info']) === 'string'
        ? JSON.parse(req.headers['x-user-info'] as string)
        : req?.headers?.['x-user-info'];


    const result = await manageUsers({
      roleId,
      assignedUsers,
      userId: loggedInUserInfo?.id
    });

    commmonResponse({
      res,
      statusCode: result?.status_code,
      statusMessage: "Success",
      statusDescription: result?.message
    })

  } catch (err: any) {
    commmonResponse({
      res,
      statusCode: err?.statusCode || 520,
      statusDescription: err?.toString() || err?.message || 'Unknown error!',
      statusMessage: "Error"
    })
  }
};

export const roleUserListHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const roleId = Number(req.params.id);
    const { data, totalCount } = await userList({
      roleId,
    });

    commmonResponse({
      res,
      statusDescription: data?.length
        ? 'Role users are listed'
        : 'Role user list is empty',
      data,
      totalCount,
    });
  } catch (err: any) {
    commmonResponse({
      res,
      statusCode: err?.statusCode || 520,
      statusMessage: err?.toString() || err?.message || 'Unknown error!',
    });
  }
};