import { AddApplicationPayload, ListQueryParams, UpdateApplicationPayload } from "../../interfaces";
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

export const createAsherApplication = async (params: AddApplicationPayload) => {
  const { user_info, ...rest } = params;
  
  if (!(rest.app_name && user_info?.id && user_info?.email)) {
    throw new Error("Missing required parameters.");
  }

  const query = `SELECT * FROM xapps.upsert_asher_application( p_user_id := $1, p_app_name := $2, p_aliases := $3, p_app_desc := $4, p_business_owner := $5, p_system_owner := $6, p_product_owner := $7, p_product_manager := $8, p_it_contact := $9, p_vendor_id := $10, p_lifecycle := $11, p_sponsor := $12, p_hosting_location := $13, p_version := $14, p_is_gxp := $15, p_is_sox := $16, p_record_status := $17);`;

  const placeholders = [ user_info?.id, rest.app_name, rest.aliases, rest.app_desc, rest.business_owner, rest.system_owner, rest.product_owner, rest.product_manager, rest.it_contact, rest.vendor_id, rest.life_cycle, rest.sponsor, rest.hosting_location, rest.version, rest.is_gxp, rest.is_sox, rest.record_status || "active"];

  const result = await executeQuery(query, placeholders);

  console.log("Create application result:", result?.rows[0]);

  return result.rows[0]?.upsert_asher_application;
};

export const updateAsherApplication = async (params: UpdateApplicationPayload) => {
  const { user_info, id, ...rest } = params;

  if (!(id && rest.app_name && user_info?.id && user_info?.email)) {
    throw new Error("Missing required parameters.");
  }

  const query = ` SELECT * FROM xapps.upsert_asher_application( p_user_id := $1, p_id := $2, p_app_name := $3, p_aliases := $4, p_app_desc := $5, p_business_owner := $6, p_system_owner := $7, p_product_owner := $8, p_product_manager := $9, p_it_contact := $10, p_vendor_id := $11, p_lifecycle := $12, p_sponsor := $13, p_hosting_location := $14, p_version := $15, p_is_gxp := $16, p_is_sox := $17, p_record_status := $18);`;

  const placeholders = [  user_info.id,  id,  rest.app_name,  rest.aliases,  rest.app_desc,  rest.business_owner,  rest.system_owner,  rest.product_owner,  rest.product_manager,  rest.it_contact,  rest.vendor_id,  rest.life_cycle,  rest.sponsor,  rest.hosting_location,  rest.version,  rest.is_gxp,  rest.is_sox,  rest.record_status || "active"];

  const result = await executeQuery(query, placeholders);

  console.log("Update application result:", result?.rows[0]);

  return result.rows[0]?.upsert_asher_application;
};

export const deleteAsherApplication = async (id: number, userId: string) => {
  const query = `SELECT * FROM xapps.upsert_asher_application( p_user_id := $1, p_id := $2, p_is_deleted := TRUE);`;
  const placeholders = [userId, id];

  const result = await executeQuery(query, placeholders);

  console.log("Delete application result:", result?.rows[0]);

  return result.rows[0]?.upsert_asher_application;
};