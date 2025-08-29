import { UserRequest } from "../middleware/auth.middleware";
import { getUserProfile, getUserTheme, loginUser } from "../services";
import { commmonResponse } from "../utilities";
import { Request, Response } from "express";

export const loginHandler = async (req: Request, res: Response) => {
  try {
    const result = await loginUser(req.body);
    commmonResponse({
      res,
      data: result?.data,
      statusCode: result?.status_code,
      statusMessage: result.status_code === 200 ? "Success" : "Error",
      statusDescription: result?.message
    })

  } catch (err: any) {
    console.log("Login error:", err);
    commmonResponse({
      res,
      statusCode: err?.statusCode || 520,
      statusDescription: err?.toString() || err?.message || 'Unknown error!',
      statusMessage: "Error"
    })
  }
};

export const profileHandler = async (req: UserRequest, res: Response) => {
  try {
    const result = await getUserProfile(req.user);

    commmonResponse({
      res,
      data: result?.data,
      statusCode: result?.status_code,
      statusMessage: result.status_code === 200 ? "Success" : "Error",
      statusDescription: result?.message as string
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

export const themeHandler = async (req: Request, res: Response) => {
  try {

    const result = await getUserTheme(req);

    commmonResponse({
      res,
      data: result?.data,
      statusCode: result?.status_code,
      statusMessage: result.status_code === 200 ? "Success" : "Error",
      statusDescription: result?.message as string
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