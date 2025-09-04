import { Request, Response } from "express";
import { getAsherUsers, getAsherUserByEmail } from "../../services";
import { commmonResponse, getListQueryParams } from "../../utilities";


export const listAsherUsersHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const queryParams = getListQueryParams(req, { defaultSortColumn: 'last_modified_at' });
    const { data, totalCount } = await getAsherUsers(queryParams);

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
      statusDescription: err?.toString() || err?.message || 'Unknown error!',
      statusMessage: "Error"
    })
  }
};

export const getAsherUserHandler = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.params;
  if (!email) {
    throw new Error("Invalid user email.");
  }

  try {
    const user = await getAsherUserByEmail(email);

    commmonResponse({
      res,
      statusMessage: "Success",
      statusDescription: "User is fetched successfully!",
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