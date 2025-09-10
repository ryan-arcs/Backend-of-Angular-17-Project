import { Request, Response } from "express";
import { getAsherApplicationById, getAsherApplications, getAuthorityUsers, getItContactUsers } from "../../services";
import { commmonResponse, getListQueryParams } from "../../utilities";

export const listAsherApplicationsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const queryParams = getListQueryParams(req, { defaultSortColumn: 'last_modified_at' });
    const { data, totalCount } = await getAsherApplications(queryParams);
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

export const getAsherApplicationHandler = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!id) {
    throw new Error("Invalid application Id.");
  }

  try {
    const application = await getAsherApplicationById(Number(id));

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

export const listAuthorityUsersHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const queryParams = getListQueryParams(req, { defaultSortColumn: 'fullname_preferred' });
    const { data, totalCount } = await getAuthorityUsers(queryParams);
    commmonResponse({
      res,
      statusDescription: data?.length ? "Authority users are listed" : "Authority user list is empty",
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

export const listItContactUsersHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const queryParams = getListQueryParams(req, { defaultSortColumn: 'fullname_preferred' });
    const { data, totalCount } = await getItContactUsers(queryParams);
    commmonResponse({
      res,
      statusDescription: data?.length ? "IT contact users are listed" : "IT contact user list is empty",
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