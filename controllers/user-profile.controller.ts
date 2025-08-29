import { Request, Response } from 'express';
import { commmonResponse } from '../utilities';
import { syncUserProfile, updateConfig, updateTheme } from '../services/user-profile.service';
import { getUserInfoFromHeader } from '../utilities/db-queries';

export const userProfileSyncHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email } = req.body;
    
    const data = await syncUserProfile({
      firstName, 
      lastName, 
      email
    });

    commmonResponse({
      res,
      statusDescription: data?.userProfile ? "User profile listed" : "User profile is empty",
      statusMessage: "Success",
      data
    })
 
  } catch (err: any) {
    commmonResponse({
      res,
      statusCode: err?.statusCode || 520,
      statusDescription: err?.toString() || err?.message || 'Unknown error!',
      statusMessage: 'Error'
    })
  }
};

export const updateThemeHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { theme } = req.body;
    const loggedInUser = getUserInfoFromHeader(req.headers);
    const userId = loggedInUser?.id;

    const result = await updateTheme(Number(userId), theme);

    commmonResponse({
      res,
      statusMessage: result?.message || "Theme updated successfully."
    })
 
  } catch (err: any) {
    commmonResponse({
      res,
      statusCode: err?.statusCode || 520,
      statusMessage: err?.toString() || err?.message || 'Unknown error!'
    })
  }
};

export const updateConfigHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { config } = req.body;
    const loggedInUser = getUserInfoFromHeader(req.headers);
    const userId = loggedInUser?.id;
    const result = await updateConfig(userId, config);

    commmonResponse({
      res,
      statusMessage: result?.message || "Config updated successfully."
    })
 
  } catch (err: any) {
    commmonResponse({
      res,
      statusCode: err?.statusCode || 520,
      statusMessage: err?.toString() || err?.message || 'Unknown error!'
    })
  }
};