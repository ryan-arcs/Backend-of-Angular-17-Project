import { ListQueryParams } from "../../interfaces";
import { executeQuery, listQuery } from "../../utilities/db-queries";


export const getAsherApplications = async (params: ListQueryParams): Promise<{ data: any[]; totalCount: number }> => {
  return await listQuery({
    tableName: 'xapps.asher_applications_vw',
    searchableColumns: [
      // Application identifiers 
      'app_id::text', 
      'app_name', 
      'aliases', 
      'app_desc', 
      // Codes references 
      'ucoa_code', 
      'io_code', 
      // Location & hosting 
      'location', 
      'hosting_location', 
      'deployment_type', 
      // Versioning & CI/CD 
      'version', 
      'ci_cd', 
      // Classification / license 
      'license', 
      'classification', 
      'business_criticality', 
      // DR / docs 
      'dr_location', 
      'doc_location', 
      'sop_location', 
      // Vendor / lifecycle / department
      'vendor_name', 
      'lc_name', 
      'funding_department_name', 
      // Approvers 
      'approver1_preferred_name', 
      'approver1_email', 
      'approver2_preferred_name', 
      'approver2_email', 
      // Admin users (audit trail) 
      'created_by_preferred_name', 
      'last_modified_by_preferred_name', 
      // Owners & contacts → cast to text for search 
      "business_owners::text",
      "system_owners::text",
      "product_owners::text",
      "product_managers::text",
      "it_contacts::text"
    ],
    ...params
  });
};

export const getAuthorityUsers = async (params: ListQueryParams): Promise<{ data: any[]; totalCount: number }> => {
  return await listQuery({
    tableName: 'xapps.asher_authority_users_vw',
    searchableColumns: [
      'first_name',
      'last_name',
      'email',
      'full_name',
      'fullname_preferred',
      'empl_status',
      'cost_center_code',
      'cost_center_description',
      'employee_type'
    ],
    ...params
  });
};

export const getItContactUsers = async (params: ListQueryParams): Promise<{ data: any[]; totalCount: number }> => {
  return await listQuery({
    tableName: 'xapps.asher_it_users_vw',
    searchableColumns: [
      'first_name',
      'last_name',
      'email',
      'full_name',
      'fullname_preferred',
      'empl_status',
      'cost_center_code',
      'cost_center_description',
      'employee_type'
    ],
    ...params
  });
};

export const getAsherApplicationById = async (id: number): Promise<any> => {
  const query = `SELECT * FROM xapps.asher_applications_vw WHERE id = $1`;
  const result = await executeQuery(query, [id]);
  if(!result?.rows?.length) {
    throw new Error(`Application not found.`);
  }

  return result.rows[0];
};