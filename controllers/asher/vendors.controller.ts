import { Request, Response } from "express";
import { commmonResponse, getListQueryParams } from "../../utilities";
import { createVendor, deleteVendor, getVendorById, getVendors, updateVendor } from "../../services";
import { getUserInfoFromHeader } from "../../utilities/db-queries";


export const listVendorsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const queryParams = getListQueryParams(req, { defaultSortColumn: 'last_modified_at' });
    const { data, totalCount } = await getVendors(queryParams);

    commmonResponse({
      res,
      statusDescription: data?.length ? "Vendors are listed" : "Vendor list is empty",
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

export const getVendorHandler = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  console.log("id===", id);
  if (!id) {
    throw new Error("Invalid vendor Id.");
  }

  try {
    const vendor = await getVendorById(Number(id));

    commmonResponse({
      res,
      statusMessage: "Success",
      statusDescription: "Vendor is fetched successfully!",
      data: vendor
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

export const createVendorHandler = async (req: Request, res: Response) => {
  try {
    const result = await createVendor(req.body?.data);
    console.log('Vendor created successfully:', result);
    commmonResponse({
      res,
      id: result?.rows?.vendor_id,
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

export const updateVendorHandler = async (req: Request, res: Response) => {
  try {
    const result = await updateVendor(req.body?.data);
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

export const deleteVendorHandler = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  if (!id) {
    throw new Error("Invalid vendor Id.");
  }

  const loggedInUser = getUserInfoFromHeader(req.headers);
  const userId = loggedInUser?.id;
  if(!userId) {
    throw new Error("Invalid user.");
  }

  try {
    const result = await deleteVendor(Number(id), userId);

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