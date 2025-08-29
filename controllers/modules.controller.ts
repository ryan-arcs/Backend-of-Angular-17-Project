import { Request, Response } from 'express';
import { commmonResponse } from '../utilities';
import { getListQueryParams } from '../utilities';
import { createModule, deleteModule, getModuleById, getModules, updateModule } from '../services';
import { getUserInfoFromHeader } from '../utilities/db-queries';

export const listModulesHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const queryParams = getListQueryParams(req, { defaultSortColumn: 'updated_at' });
    const { data, totalCount } = await getModules(queryParams);
 
    commmonResponse({
      res,
      statusMessage: "Success",
      statusDescription: data?.length ? "Modules are listed" : "Module list is empty",
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
export const createModuleHandler = async (req: Request, res: Response) => {
  try {
    const result = await createModule(req.body);

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

export const updateModuleHandler = async (req: Request, res: Response) => {
  try {
    const result = await updateModule(req.body);

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

export const getModuleHandler = async (req: Request, res: Response): Promise<void> => {
  
  const { id } = req.params;
  if (!id) {
    throw new Error("Invalid Module Id.");
  }

  try {
    const module = await getModuleById(Number(id));

    commmonResponse({
      res,
      statusMessage: "module is fetched successfully",
      data: module
    })
  } catch (err: any) {
    commmonResponse({
      res,
      statusCode: err?.statusCode || 520,
      statusMessage: err?.toString() || err?.message || 'Unknown error!'
    })
  }
};

export const deleteModuleHandler = async (req: Request, res: Response): Promise<void> => {
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
    const result = await deleteModule(Number(id), userId);

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