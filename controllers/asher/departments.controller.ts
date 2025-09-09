import { Request, Response } from "express";
import { getDepartments } from "../../services";
import { commmonResponse, getListQueryParams } from "../../utilities";


export const listDepartmentsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const queryParams = getListQueryParams(req, { defaultSortColumn: 'last_modified_at' });
    const { data, totalCount } = await getDepartments(queryParams);
 
    commmonResponse({
      res,
      statusDescription: data?.length ? "Departments are listed" : "Department list is empty",
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