import { Request, Response } from 'express';
import { commmonResponse } from '../utilities';
import { createUser, getUserById, getUsers, manageRoles, manageSpecialPermissions, roleList, specialPermissionList, updateUser } from '../services';
import { getListQueryParams } from '../utilities';

export const listUsersHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const queryParams = getListQueryParams(req, { defaultSortColumn: 'updated_at' });
    const { data, totalCount } = await getUsers(queryParams);
 
    commmonResponse({
      res,
      statusDescription: data?.length ? "Users are listed" : "User list is empty",
      data,
      totalCount
    })
 
  } catch (err: any) {
    commmonResponse({
      res,
      statusCode: err?.statusCode || 520,
      statusMessage: err?.toString() || err?.message || 'Unknown error!'
    })
  }
};

export const getUserHandler = async (req: Request, res: Response): Promise<void> => {
  
  const { id } = req.params;
  if (!id) {
    throw new Error("Invalid user id.");
  }

  try {
    const user = await getUserById(Number(id));

    commmonResponse({
      res,
      statusDescription: "User is fetched successfully",
      statusMessage: "Success",
      data: user
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

export const createUserHandler = async (req: Request, res: Response) => {
  try {
    const result = await createUser(req.body);

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
      statusMessage: 'Error'
    })
  }
};

export const updateUserHandler = async (req: Request, res: Response) => {
  try {
    const result = await updateUser(req.body);
    commmonResponse({
      res,
      statusCode: result?.status_code,
      statusMessage: "Success",
      statusDescription: result?.message
    })
  } catch (err: any) {
    console.log("err====", err);
    commmonResponse({
      res,
      statusCode: err?.status_code || 520,
      statusDescription: err?.toString() || err?.message || 'Unknown error!',
      statusMessage: "Error"
    })
  }
};

export const userRolesHandler = async (req: Request, res: Response) => {
  try {
    const rUserId = Number(req.params.id);
    const assignedRoles = req.body.assignedRoles || '';
    const loggedInUserInfo = typeof(req?.headers?.['x-user-info']) === 'string'
        ? JSON.parse(req.headers['x-user-info'] as string)
        : req?.headers?.['x-user-info'];

    const result = await manageRoles({
      rUserId,
      assignedRoles,
      userId: loggedInUserInfo?.id
    });

    commmonResponse({
      res,
      statusCode: 200,
      statusDescription: 'User roles updated successfully!',
      statusMessage: 'Success'
    });
  } catch (err: any) {
    commmonResponse({
      res,
      statusCode: err?.statusCode || 520,
      statusDescription: err?.toString() || err?.message || 'Unknown error!',
      statusMessage: 'Error',
    });
  }
};

export const userRoleListHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = Number(req.params.id);
    const { data, totalCount } = await roleList({
      userId,
    });

    commmonResponse({
      res,
      statusDescription: data?.length
        ? 'User roles are listed'
        : 'User role list is empty',
      data,
      totalCount,
    });
  } catch (err: any) {
    commmonResponse({
      res,
      statusCode: err?.statusCode || 520,
      statusDescription: err?.toString() || err?.message || 'Unknown error!',
      statusMessage: 'Error',
    });
  }
};

export const userSpecialPermissionHandler = async (req: Request, res: Response) => {
  try {
    const sUserId = Number(req.params?.id);
    const assignedSpecialPermissions = req.body.assignedSpecialPermissions || '';
    const loggedInUserInfo = typeof(req?.headers?.['x-user-info']) === 'string'
        ? JSON.parse(req.headers['x-user-info'] as string)
        : req?.headers?.['x-user-info'];

    await manageSpecialPermissions({
      sUserId,
      assignedSpecialPermissions,
      userId: loggedInUserInfo?.id
    });

    commmonResponse({
      res,
      statusCode: 200,
      statusDescription: 'User special permissions updated successfully!',
      statusMessage: "Success"
    });
  } catch (err: any) {
    commmonResponse({
      res,
      statusCode: err?.statusCode || 520,
      statusDescription: err?.toString() || err?.message || 'Unknown error!',
      statusMessage: "Error"
    });
  }
};

export const userSpecialPermissionListHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = Number(req.params?.id);
    const { data, totalCount } = await specialPermissionList({
      userId,
    });

    commmonResponse({
      res,
      statusDescription: data?.length
        ? 'User special permissions are listed'
        : 'User special permission list is empty',
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