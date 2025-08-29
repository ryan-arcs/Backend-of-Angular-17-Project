export interface ListQueryParams {
    pageIndex: number;
    pageSize: number;
    sortColumn: string;
    sortDirection: 'asc' | 'desc';
    globalSearch?: string;
    appId?: number;
    moduleId?: number;
    submoduleId?: number;
    skipLimit?: boolean;
    applicationSlug?: string;
  }
   
  export interface GetListQueryParamsOptions {
    defaultSortColumn: string;
  }