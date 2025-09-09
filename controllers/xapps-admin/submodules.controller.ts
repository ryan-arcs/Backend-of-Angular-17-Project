import { Request, Response } from 'express';
import { commmonResponse } from '../../utilities';
import { createSubmodule, deleteSubModule, getSubmoduleById, getSubmodules, updateSubmodule} from '../../services';
import { getListQueryParams } from '../../utilities';
import { getUserInfoFromHeader } from '../../utilities/db-queries';

export const listSubmodulesHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const queryParams = getListQueryParams(req, { defaultSortColumn: 'updated_at' });
    const { data, totalCount } = await getSubmodules(queryParams);
 
    commmonResponse({
      res,
      statusDescription: data?.length ? "Submodules are listed" : "Submodule list is empty",
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

export const createSubmoduleHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await createSubmodule(req.body);

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

export const updateSubmoduleHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await updateSubmodule(req.body);
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

export const deleteSubModuleHandler = async (req: Request, res: Response): Promise<void> => {
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
    const result = await deleteSubModule(Number(id), userId);

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

export const getSubmoduleHandler = async (req: Request, res: Response): Promise<void> => {
  
  const { id } = req.params;
  if (!id) {
    throw new Error("Invalid submodule Id.");
  }

  try {
    const submodule = await getSubmoduleById(Number(id));

    commmonResponse({
      res,
      statusMessage: "Submodule is fetched successfully",
      data: submodule
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