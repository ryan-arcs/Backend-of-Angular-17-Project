import { Response } from 'express';

interface ApiResponse {
    res: Response,
    statusCode?: number;
    statusMessage?: string;
    statusDescription?: string;
    data?: any;
    id?: number;
    totalCount?: number;
    lifecycle?: string;
}

interface CommonResponse {
    statusCode: number;
    statusMessage: string;
    statusDescription?: string;
    dateTime: string;
    data: any;
    totalCount?: number;
    id?: number;
    lifecycle?: string;
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
        lifecycle: response?.lifecycle
    };
    if(response.totalCount) {
        commonResponse.totalCount = response.totalCount
    }
    if(response.id) {
        commonResponse.id = response.id;
    }

    response.res.status(statusCode || 200).json(commonResponse);
}