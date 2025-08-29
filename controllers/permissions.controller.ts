import { Request, Response } from 'express';
import { commmonResponse } from '../utilities';
import { createPermission, deletePermission, getPermissionById, getPermissions, updatePermission } from '../services';
import { getListQueryParams } from '../utilities';
import { getUserInfoFromHeader } from '../utilities/db-queries';

export const listPermissionsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const queryParams = getListQueryParams(req, { defaultSortColumn: 'updated_at' });
    const { data, totalCount } = await getPermissions(queryParams);
 
    commmonResponse({
      res,
      statusDescription: data?.length ? "Permissions are listed" : "Permission list is empty",
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

export const createPermissionHandler = async (req: Request, res: Response) => {
  try {
    const result = await createPermission(req.body);

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

export const updatePermissionHandler = async (req: Request, res: Response) => {
  try {
    const result = await updatePermission(req.body);
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

export const getPermissionHandler = async (req: Request, res: Response): Promise<void> => {
  
  const { id } = req.params;
  if (!id) {
    throw new Error("Invalid permission id.");
  }

  try {
    const Permission = await getPermissionById(Number(id));

    commmonResponse({
      res,
      statusMessage: "Permission is fetched successfully",
      data: Permission
    })
  } catch (err: any) {
    commmonResponse({
      res,
      statusCode: err?.statusCode || 520,
      statusMessage: err?.toString() || err?.message || 'Unknown error!'
    })
  }
};

export const deletePermissionHandler = async (req: Request, res: Response): Promise<void> => {
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
    const result = await deletePermission(Number(id), userId);

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