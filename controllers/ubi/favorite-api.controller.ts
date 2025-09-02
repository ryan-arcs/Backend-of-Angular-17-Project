import { Request, Response } from 'express';
import axios from 'axios';
import { errorResponse } from '../../utilities';
import { TableauRequest } from '../../interfaces';
import { tableauSecrets } from '../../services';

interface TableauReuest extends Request {
  tableauConfig?: any;
}

let getAuthCounter = 0;
export const addFavoriteApiResponse = async (req: TableauReuest, res: Response) => {
  try {
    const { tableauAppApiUrl, tableauAppAdminAuthToken } = req?.tableauConfig;
    const userEmail = req?.headers?.['x-user-email'];
    const siteId = req?.headers?.['x-tableau-site-id'];
    const { viewId, addToFavorites = true } = req.body;

    if (!viewId || !siteId || !userEmail || !tableauAppApiUrl) {
      throw new Error('Invalid access!');
    }

    const userId = await getUserId(req);
    if (!userId) {
      throw new Error('User not found in this site!');
    }

    if (addToFavorites) {
      const response = await axios.put(
        `${tableauAppApiUrl}/api/3.1/sites/${siteId}/favorites/${userId}`,
        { favorite: { label: "test-label", view: { id: viewId } } },
        { headers: { 'X-Tableau-Auth': tableauAppAdminAuthToken } }
      );
      return res.status(200).json(response?.data);
    }

    res.status(200).json({ message: 'No addition performed.' });
  } catch (err: any) {
    handleAuthError(err, req, res);
  }
};

export const deleteFavoriteApiResponse = async (req: TableauReuest, res: Response) => {
  try {

    const { tableauAppApiUrl, tableauAppAdminAuthToken } = req?.tableauConfig;
    const userEmail = req?.headers?.['x-user-email'];
    const siteId = req?.headers?.['x-tableau-site-id'];
    const { viewId } = req.params;

    if (!viewId || !siteId || !userEmail || !tableauAppApiUrl) {
      throw new Error('Invalid access!');
    }

    const userId = await getUserId(req);
    if (!userId) {
      throw new Error('User not found in this site!');
    }

    if (viewId) {
      const response = await axios.delete(
        `${tableauAppApiUrl}/api/3.1/sites/${siteId}/favorites/${userId}/views/${viewId}`,
        { headers: { 'X-Tableau-Auth': tableauAppAdminAuthToken } }
      );
      return res.status(200).json(response?.data);
    }

    res.status(200).json({ message: 'No deletion performed.' });
  } catch (err: any) {
    handleAuthError(err, req, res);
  }
};

export const listFavoriteApiResponse = async (req: TableauReuest, res: Response) => {
  try {
    const { tableauAppApiUrl } = req.tableauConfig;
    if (!tableauAppApiUrl) {
      throw Error('Invalid configuration!');
    }
    
    const tableauAuthToken = req?.headers?.['x-tableau-auth-token'] || '';
    const siteId = req?.headers?.['x-tableau-site-id'] || '';
    const userId = req?.headers?.['x-tableau-user-id'] || '';

    if (!siteId || !tableauAuthToken) {
      throw Error('Invalid access!');
    }
    
    let allFavorites: any[] = [];
    let response: any = undefined;
    let pageNumber = 1;
    do {
      response = await axios.get(
        `${tableauAppApiUrl}/api/3.22/sites/${siteId}/favorites/${userId}?pageNumber=${pageNumber}&pageSize=1000`,
        {
          headers: {
            'X-Tableau-Auth': tableauAuthToken
          }
        });
        
      allFavorites = allFavorites?.concat(response?.data?.favorites?.favorite);
      pageNumber++;
    } while (
      response?.data?.pagination?.totalAvailable &&
      allFavorites?.length < response?.data?.pagination?.totalAvailable
    );
    const favoriteViewIds = allFavorites?.filter(favorite => favorite?.view)?.map(favorite => favorite.view.id) || [];
    
    res.status(200).json(favoriteViewIds);
  } catch (err: any) {
    errorResponse({
      res,
      err
    });
  }
}

const handleAuthError = async (err: any, req: TableauRequest, res: Response) => {
  if (getAuthCounter < 2 && err?.response?.status === 401 && err?.response?.data?.error?.code === "401002") {
    setTimeout(async () => {
      await fetchAuthCredentials(req);
      getAuthCounter++;
      req.body.addToFavorites ? addFavoriteApiResponse(req, res) : deleteFavoriteApiResponse(req, res);
    }, 1000);
  } else {
    errorResponse({ res, err });
  }
};



const getUserId = async (req: TableauRequest): Promise<string> => {
  const userEmail = req?.headers?.['x-user-email'] || '';
  const siteId = req?.headers?.['x-tableau-site-id'] || '';
  const { tableauAppApiUrl, tableauAppAdminAuthToken } = req?.tableauConfig || {};

  const userApiResponse = await axios.get(`${tableauAppApiUrl as string}/api/3.22/sites/${siteId}/users?filter=name:eq:${userEmail}`,
  { 
    headers: { 
      'X-Tableau-Auth': tableauAppAdminAuthToken 
    } 
  });

  return userApiResponse?.data?.users?.user?.[0]?.id || '';  
}

const fetchAuthCredentials = async (req: TableauRequest) => {
  const secrets = await tableauSecrets();
  if(req?.tableauConfig){
    req.tableauConfig.tableauAppAdminAuthToken = secrets.tableauAppAdminAuthToken || '';
  }
  return true;
}