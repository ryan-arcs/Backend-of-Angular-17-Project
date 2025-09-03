import { ColumnFilter } from '../../interfaces';
import { buildColumnFilterWhereClause } from '../build-column-filter.utility';
import { executeQuery } from './db-query-executor.utility';

interface PaginateOptions {
  tableName: string;
  searchableColumns: string[];
  pageIndex: number;
  pageSize: number;
  sortColumn: string;
  sortDirection: "asc" | "desc";
  globalSearch?: string;
  appId?: number;
  moduleId?: number;
  submoduleId?: number;
  skipLimit?: boolean;
  applicationSlug?: string;
  columnFilters?: ColumnFilter[];
}

export const listQuery = async ({
  tableName,
  searchableColumns,
  pageIndex,
  pageSize,
  sortColumn,
  sortDirection,
  globalSearch,
  columnFilters,
  appId,
  moduleId,
  submoduleId,
  skipLimit,
  applicationSlug
}: PaginateOptions): Promise<{ data: any; totalCount: number }> => {
  const offset = pageIndex * pageSize;
  const placeHolders: any[] = [];
  const whereConditions: string[] = [];

  // Global search condition
  if (globalSearch && searchableColumns.length) {
    const searchConditions = searchableColumns.map((col) => {
      placeHolders.push(`%${globalSearch}%`);
      return `${col} ILIKE $${placeHolders.length}`;
    });
    whereConditions.push(`(${searchConditions.join(' OR ')})`);
  }

  // Column filters condition
  if (columnFilters && columnFilters.length > 0) {
    const columnFilterSQL = buildColumnFilterWhereClause(columnFilters, placeHolders);
    if (columnFilterSQL) {
      whereConditions.push(columnFilterSQL);
    }
  }

  // appId condition
  if (appId) {
    placeHolders.push(appId);
    whereConditions.push(`app_id = $${placeHolders.length}`);
  }

  // applicationSlug condition
  if (applicationSlug) {
    placeHolders.push(applicationSlug);
    whereConditions.push(`app_slug = $${placeHolders.length}`);
  }

  // moduleId condition
  if (moduleId) {
    placeHolders.push(moduleId);
    whereConditions.push(`module_id = $${placeHolders.length}`);
  }

  // subModuleId condition
  if (submoduleId) {
    placeHolders.push(submoduleId);
    whereConditions.push(`sub_module_id = $${placeHolders.length}`);
  }

  // Build final where clause string
  const whereClause = whereConditions.length ? `WHERE ${whereConditions.join(' AND ')}` : '';

  // Total count query
  const countResult = await executeQuery(
    `SELECT COUNT(*) FROM ${tableName} ${whereClause}`,
    placeHolders
  );

  const totalCount = parseInt(countResult.rows[0].count, 10);

  // Paginated data query
  let paginationQueryOption = '';
  if(!skipLimit){
    placeHolders.push(pageSize, offset);
    paginationQueryOption = `LIMIT $${placeHolders.length - 1}
    OFFSET $${placeHolders.length}`;
  }

  const dataResult = await executeQuery(
    `SELECT * FROM ${tableName}
     ${whereClause}
     ORDER BY ${sortColumn} ${sortDirection}
     ${paginationQueryOption}`,
    placeHolders
  );

  return { data: dataResult.rows, totalCount };
};
