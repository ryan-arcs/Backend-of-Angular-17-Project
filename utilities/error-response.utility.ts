import { Response } from 'express';

interface ErrorResponseRequest {
  err: any;
  res?: Response; 
  throwExeceptionOnly?: boolean;
}

export const errorResponse = async (request: ErrorResponseRequest) => {
  const errorResponse = request.err?.response?.data || { success: false, message: request.err?.response?.statusText || request.err?.message || 'Unknown error!' };

  if(request.throwExeceptionOnly){
    throw Error(errorResponse);
  }else{
    request?.res?.status(request.err?.response?.status || 520).json(errorResponse); 
  }
}