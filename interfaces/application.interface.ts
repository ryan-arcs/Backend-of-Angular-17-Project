export interface CreateApplicationParams {
    applicationName: string;
    status: string;
    logo: string;
    sortOrder: number;
    slug: string;
    description: string;
    userId: number;
}


export interface UpdateApplicationParams extends CreateApplicationParams {
    id: number;
    isActive: boolean;
}