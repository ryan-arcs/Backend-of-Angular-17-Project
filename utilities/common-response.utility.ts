import { Response } from 'express';

interface ApiResponse {
    res: Response,
    statusCode?: number;
    statusMessage?: string;
    statusDescription?: string;
    data?: any;
    totalCount?: number
}

interface CommonResponse {
    statusCode: number;
    statusMessage: string;
    statusDescription?: string;
    dateTime: string;
    data: any;
    totalCount?: number;
}

export const commmonResponse = (response: ApiResponse) => {
    let statusCode = response?.statusCode;
    console.log({
        'statusCode':response?.statusCode,
        'statusMessage':response?.statusMessage,
        'desc':response.statusDescription
    })
    
    let commonResponse: CommonResponse = {
        statusCode: statusCode || (Array.isArray(response?.data) && !response?.data?.length ? 204 : 200),
        statusDescription: response?.statusDescription,
        statusMessage: response?.statusMessage || 'Success',
        dateTime: new Date().toISOString(),
        data: response?.data,
    };
    if(response.totalCount) {
        commonResponse.totalCount = response.totalCount
    }
    
    response.res.status(statusCode || 200).json(commonResponse);
}