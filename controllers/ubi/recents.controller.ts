import { Request, Response } from 'express';
import axios from 'axios';
import { commmonResponse, errorResponse } from '../../utilities';

interface TableauReuest extends Request {
  tableauConfig?: any;
}

export const recentsResponse = async (req: TableauReuest, res: Response) => {
  try {
    const { tableauAppApiUrl } = req.tableauConfig;
    if (!tableauAppApiUrl) {
      throw Error('Invalid configuration!');
    }
    
    const tableauAuthToken = req?.headers?.['x-tableau-auth-token'] || '';
    const siteId = req?.headers?.['x-tableau-site-id'] || '';

    if (!siteId || !tableauAuthToken) {
      throw Error('Invalid access!');
    }
    
    let allRecents: any[] = [];
    let response: any = undefined;
    let pageNumber = 1;
    do {
      response = await axios.get(
        `${tableauAppApiUrl}/api/3.22/sites/${siteId}/content/recent?pageNumber=${pageNumber}&pageSize=1000`,
        {
          headers: {
            'X-Tableau-Auth': tableauAuthToken
          }
        });
        
      allRecents = allRecents?.concat(response?.data?.recents?.recent);
      pageNumber++;
    } while (
      response?.data?.pagination?.totalAvailable &&
      allRecents?.length < response?.data?.pagination?.totalAvailable
    );
    
    commmonResponse({
      res,
      data: allRecents,
      statusCode: 200,
      statusMessage: "Success",
      statusDescription: "Recents fetched successfully"
    })
  } catch (err: any) {
    errorResponse({
      res,
      err
    });
  }
}
