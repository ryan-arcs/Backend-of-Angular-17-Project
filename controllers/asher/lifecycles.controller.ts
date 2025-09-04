import { Request, Response } from "express";
import { commmonResponse, getListQueryParams } from "../../utilities";
import { getUserInfoFromHeader } from "../../utilities/db-queries";
import { createLifecycle, deleteLifecycle, getLifecycleById, getLifecycles, updateLifecycle } from "../../services";


export const listLifecyclesHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const queryParams = getListQueryParams(req, { defaultSortColumn: 'last_modified_at' });
    const { data, totalCount } = await getLifecycles(queryParams);

    commmonResponse({
      res,
      statusDescription: data?.length ? "Lifecycles are listed" : "Lifecycle list is empty",
      data,
      totalCount
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

export const getLifecycleHandler = async (req: Request, res: Response): Promise<void> => {
  const { code } = req.params;
  if (!code) {
    throw new Error("Invalid lifecycle code.");
  }

  try {
    const lifecycle = await getLifecycleById(code);

    commmonResponse({
      res,
      statusMessage: "Success",
      statusDescription: "Lifecycle is fetched successfully!",
      data: lifecycle
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

export const createLifecycleHandler = async (req: Request, res: Response) => {
  try {
    const result = await createLifecycle(req.body?.data);
    console.log('Lifecycle created successfully:', result);
    commmonResponse({
      res,
      lifecycle: result?.data?.code,
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

export const updateLifecycleHandler = async (req: Request, res: Response) => {
  try {
    const result = await updateLifecycle(req.body?.data);
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

export const deleteLifecycleHandler = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!id) {
    throw new Error("Invalid lifecycle Id.");
  }

  const loggedInUser = getUserInfoFromHeader(req.headers);
  const userId = loggedInUser?.id;
  if(!userId) {
    throw new Error("Invalid user.");
  }

  try {
    const result = await deleteLifecycle(Number(id), userId);

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