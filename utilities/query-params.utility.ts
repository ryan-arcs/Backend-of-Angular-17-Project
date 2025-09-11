import { Request } from 'express';
import { GetListQueryParamsOptions, ListQueryParams } from '../interfaces/listing-query.interface';
 
export const getListQueryParams = (req: Request, options: GetListQueryParamsOptions): ListQueryParams => {
  const pageIndex = parseInt(req.query?.pageIndex as string, 10) || 0;
  const pageSize = parseInt(req.query?.pageSize as string, 10) || 50;
  const sortColumn = (req.query?.sortColumn as string) || options.defaultSortColumn;
  const sortDirection = (req.query?.sortDirection as string)?.toLowerCase() === 'asc' ? 'asc' : 'desc';
  const globalSearch = (req.query?.globalSearch as string) || undefined;
  const applicationSlug = (req.query?.application as string) || undefined;
  const appId =  parseInt(req.query?.appId as string, 10) || undefined;
  const moduleId = parseInt(req.query?.moduleId as string, 10) || undefined;
  const submoduleId = parseInt(req.query?.submoduleId as string, 10) || undefined;
  const columnFilters = (req.query?.columnFilters as string) ? JSON.parse(req.query.columnFilters as string) : undefined;
  const globalColumnFilterOperator = req.query?.globalColumnFilterOperator as string || undefined;
  const skipLimit = Boolean(req.query?.skipLimit);

  return { pageIndex, pageSize, sortColumn, sortDirection, globalSearch, appId, moduleId, submoduleId, skipLimit, applicationSlug, columnFilters, globalColumnFilterOperator };
};