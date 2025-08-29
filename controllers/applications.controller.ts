import { Request, Response } from 'express';
import { commmonResponse } from '../utilities';
import { createApplication, deleteApplication, getApplicationById, getApplications, updateApplication } from '../services';
import { getListQueryParams } from '../utilities';
import { getUserInfoFromHeader } from '../utilities/db-queries';

export const listApplicationsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const queryParams = getListQueryParams(req, { defaultSortColumn: 'updated_at' });
    const { data, totalCount } = await getApplications(queryParams);
 
    commmonResponse({
      res,
      statusDescription: data?.length ? "Applications are listed" : "Application list is empty",
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


export const createApplicationHandler = async (req: Request, res: Response) => {
  try {
    const result = await createApplication(req.body);

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

export const updateApplicationHandler = async (req: Request, res: Response) => {
  try {
    const result = await updateApplication(req.body);
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

export const getApplicationHandler = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!id) {
    throw new Error("Invalid application Id.");
  }

  try {
    const application = await getApplicationById(Number(id));

    commmonResponse({
      res,
      statusMessage: "Success",
      statusDescription: "Application is fetched successfully!",
      data: application
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

export const deleteApplicationHandler = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!id) {
    throw new Error("Invalid application Id.");
  }

  const loggedInUser = getUserInfoFromHeader(req.headers);
  console.log("loggedInUser==", loggedInUser);
  const userId = loggedInUser?.id;
  if(!userId) {
    throw new Error("Invalid user.");
  }

  try {
    const result = await deleteApplication(Number(id), userId);

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