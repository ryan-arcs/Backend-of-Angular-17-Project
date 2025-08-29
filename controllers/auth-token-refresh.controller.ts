import { Request, Response } from 'express';
import axios from 'axios';
import { tableauSecrets, updateTableauSecrets } from '../services';


export const authTokenRefreshHandler = async (req: Request, res: Response) => {
  try {
    const token = await refreshTableauAuthToken();

    if (!token) {
      return res.status(500).json({ error: 'Failed to refresh Tableau token' });
    }

    res.status(200).json({ message: 'Token refreshed successfully' });
  } catch (error: any) {
    console.error('Error refreshing Tableau token:', error?.message || error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


export const refreshTableauAuthToken = async (): Promise<string | null> => {
  try {
    const secrets = await tableauSecrets();

    const response = await axios.post(
      `${secrets.tableauAppApiUrl}/api/3.22/auth/signin`,
      {
        credentials: {
          personalAccessTokenName: secrets.tableauAppAdminPatName,
          personalAccessTokenSecret: secrets.tableauAppAdminPatToken,
          site: { contentUrl: secrets.tableauAppSiteUrl }
        }
      },
    );

    const token = response?.data?.credentials?.token || null;

    if (token) {
      await updateTableauSecrets(token, 10800); //3h TTL
      return token;
    }

    return null;
  } catch (err: any) {
    console.error('Failed to get Tableau auth token:', err?.message || err);
    return null;
  }
};

