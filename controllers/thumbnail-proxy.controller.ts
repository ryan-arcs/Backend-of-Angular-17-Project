import { Request, Response } from 'express';
import axios from 'axios';

interface TableauReuest extends Request {
  tableauConfig?: any;
}

export const thumbnailProxyResponse = async (req: TableauReuest, res: Response) => {
  try {
    const {tableauAppApiUrl} = req.tableauConfig;
    const requestView = req?.body?.['view'] || {};
    
    const tableauAuthToken = req?.headers?.['x-tableau-auth-token'] || '';
    const siteId = req?.headers?.['x-tableau-site-id'] || '';
    
    if(!requestView?.id && !requestView?.workbookId && siteId && tableauAuthToken){
      throw Error('Invalid access!');
    }
    
    const response = await axios.get(`${tableauAppApiUrl as string}/api/3.10/sites/${siteId}/workbooks/${requestView.workbookId}/views/${requestView.id}/previewImage`, { headers: { 'X-Tableau-Auth': tableauAuthToken }, responseType: 'arraybuffer' });

    res.status(200).json({
      thumbnail: response?.data || ''
    });
  } catch (err: any) {                
    res.status(err?.statusCode || 520).json({ success: false, message: err?.toString() || err?.message || 'Unknown error!' }); 
  }
}