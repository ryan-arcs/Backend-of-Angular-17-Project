import { Request, Response } from "express";
import { createAsherApplication, deleteAsherApplication, getAsherApplicationById, getAsherApplications, getAuthorityUsers, getItContactUsers, updateAsherApplication } from "../../services";
import { commmonResponse, exportToExcel, getListQueryParams } from "../../utilities";
import { getUserInfoFromHeader } from "../../utilities/db-queries";

export const listAsherApplicationsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const queryParams = getListQueryParams(req, { defaultSortColumn: 'last_modified_at' });
    const { data, totalCount } = await getAsherApplications(queryParams);

    if (req.query?.download === "true") {
      const orderedColumns = (req.query?.orderedColumns as string) || "";
      const fileBuffer = await exportToExcel(data, orderedColumns, queryParams);

      res.setHeader("Content-Disposition", `attachment; filename="applications.xlsx"`);
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.end(fileBuffer);
      return;
    }

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

export const createAsherApplicationHandler = async (req: Request, res: Response) => {
  try {
    const result = await createAsherApplication(req.body?.data);
    console.log('Application created successfully:', result);
    commmonResponse({
      res,
      id: result?.data?.id,
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

export const updateAsherApplicationHandler = async (req: Request, res: Response) => {
  try {
    console.log("Update application request body:", req.body);
    const result = await updateAsherApplication(req.body?.data);
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

export const deleteAsherApplicationHandler = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  if (!id) {
    throw new Error("Invalid vendor Id.");
  }

  const loggedInUser = getUserInfoFromHeader(req.headers);
  console.log("loggedInUser==", loggedInUser);
  const userId = loggedInUser?.id;
  if(!userId) {
    throw new Error("Invalid user.");
  }

  try {
    const result = await deleteAsherApplication(Number(id), userId);

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