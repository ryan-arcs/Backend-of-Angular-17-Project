import { ListQueryParams } from "../../interfaces";
import { executeQuery, listQuery } from "../../utilities/db-queries";


export const getAsherUsers = async (params: ListQueryParams): Promise<{ data: any[]; totalCount: number }> => {
  return await listQuery({
    tableName: 'xapps.asher_users_vw',
    searchableColumns: [
      'firstname',
      'lastname',
      'fullname',
      'email',
      'worker_id',
      'network_id',
      'empl_status',
      'manager_user_id',
      'manager_email',
      'costcenter_code',
      'costcenter_desc',
      'employeetype',
      'home_organization',
      'work_phone',
      'office',
      'empl_status_class',
      'building',
      'division',
      'pay_grade',
      'dept_corp_group',
      'work_state',
      'flsacode',
      'job_title',
      'home_address_line1',
      'home_address_line2',
      'work_city',
      'home_phone',
      'jobposition',
      'adp_employee_location',
      'local_remote',
      'employee_timetype',
      'employee_number',
      'siq_building',
      'home_zip',
      'work_address_line1',
      'work_address_line2',
      'nickname',
      'company_code',
      'work_country',
      'department',
      'division_corp_group',
      'middlename',
      'work_zip',
      'home_state',
      'home_city',
      'home_country',
      'location',
      'manager_name'
    ],
    ...params
  });
};

export const getAsherUserByEmail = async (email: string): Promise<any> => {
  const query = `SELECT * FROM xapps.asher_users_vw WHERE email = $1`;
  const result = await executeQuery(query, [email]);
  if(!result?.rows?.length) {
    throw new Error(`User not found.`);
  }
  return result.rows[0];
};