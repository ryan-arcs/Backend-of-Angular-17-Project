import { Request, Response } from 'express';
import axios from 'axios';
import { commmonResponse, errorResponse, generateJwt } from '../../utilities';


interface TableauReuest extends Request {
  tableauConfig?: any;
}

export const authTokenResponse = async (req: TableauReuest, res: Response) => {
  try {
    const { tableauAppSiteUrl, tableauAppApiUrl } = req.tableauConfig;
    if(!tableauAppSiteUrl || !tableauAppApiUrl){
      throw Error('Invalid configuration!');
    }

    const userEmail = req?.headers?.['x-user-email'] as string || '';
    if(!userEmail){
      throw Error('Invalid access!');
    }

    //get jwt token for logged in user
    const jwtToken = generateJwt(req.tableauConfig, userEmail);
    //get authentication token of the user through jwt
    
    const response = await axios.post(`${tableauAppApiUrl}/api/3.22/auth/signin`, 
      {
        credentials: {
          jwt: jwtToken,
          site: { contentUrl: tableauAppSiteUrl }
        }
      });
    res.status(200).json(response?.data);
  } catch (err: any) {    
    errorResponse({ 
      err,
      res
    });
  }
};