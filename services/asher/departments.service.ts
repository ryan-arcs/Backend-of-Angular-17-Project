import { ListQueryParams } from "../../interfaces";
import { listQuery } from "../../utilities/db-queries";


export const getDepartments = async (params: ListQueryParams): Promise<{ data: any[]; totalCount: number }> => {
  return await listQuery({
    tableName: 'xapps.departments_vw',
    searchableColumns: [
      'department_name',
    ],
    ...params
  });
};