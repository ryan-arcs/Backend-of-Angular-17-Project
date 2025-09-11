import { ColumnFilter } from "./common-interfaces";

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
    columnFilters?: ColumnFilter[];
    globalColumnFilterOperator?: string;
  }
   
  export interface GetListQueryParamsOptions {
    defaultSortColumn: string;
  }