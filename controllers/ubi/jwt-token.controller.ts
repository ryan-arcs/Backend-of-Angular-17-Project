import { Request, Response } from 'express';
import { commmonResponse, errorResponse, generateJwt } from '../../utilities';

interface TableauReuest extends Request {
  tableauConfig?: any;
}

export const jwtTokenResponse = (req: TableauReuest, res: Response) => {
  try{
    const userEmail = req?.headers?.['x-user-email'] as string || '';
    if(!userEmail){
      throw Error('Invalid access!');
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Expose-Headers', 'X-JWT-Token');
    
    const jwtToken = generateJwt(req.tableauConfig, userEmail);
    res.setHeader('X-JWT-Token', jwtToken);

    const { tableauAppApiUrl } = req.tableauConfig;
    if(!tableauAppApiUrl){
      throw Error('Invalid tableau configuration!');
    }

    commmonResponse({
      res,
      data: {
        success: true,
        viewBaseUrl: tableauAppApiUrl
      },
      statusCode: 200,
      statusMessage: "Success",
      statusDescription: "Data retrieved successfully"
    })
  } catch (err: any) {    
    errorResponse({ 
      err,
      res
    });
  }
}