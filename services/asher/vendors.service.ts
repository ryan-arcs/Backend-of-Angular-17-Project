import { CreateVendorParams, ListQueryParams, UpdateVendorParams } from "../../interfaces";
import { executeQuery, listQuery } from "../../utilities/db-queries";


export const getVendors = async (params: ListQueryParams): Promise<{ data: any[]; totalCount: number }> => {
  return await listQuery({
    tableName: 'xapps.vendors_vw',
    searchableColumns: [
      'vendor_name',
    ],
    ...params
  });
};

export const createVendor = async (params: CreateVendorParams) => {
  const {
    vendor_name,
    user_info
  } = params;

  if (!(vendor_name && user_info?.email && user_info?.id)) {
    throw new Error('Missing required parameters.');
  }

  await checkVendorExists(vendor_name);

  const query = `
    SELECT * FROM xapps.upsert_vendor(
      p_user_id := $1,
      p_vendor_name := $2
    );
  `;

  const placeHolders = [user_info?.id, vendor_name];

  try {
    const result = await executeQuery(query, placeHolders);
    console.log('Vendor created successfully:', result.rows[0]);
    return result.rows[0]?.upsert_vendor;
  } catch (error) {
    console.error('Error creating vendor:', error);
    throw error;
  }
};

export const updateVendor = async (params: UpdateVendorParams) => {
  const {
    id,
    vendor_name,
    user_info
  } = params;

  if (!(id && vendor_name && user_info?.email && user_info?.id)) {
    throw new Error('Missing required parameters.');
  }

  await checkVendorExists(vendor_name, id);

  const query = `
    SELECT * FROM xapps.upsert_vendor(
      p_user_id := $1,
      p_id := $2,
      p_vendor_name := $3
    );
  `;
  const placeHolders = [user_info?.id, id, vendor_name];

  try {
    const result = await executeQuery(query, placeHolders);
    console.log("result.rows[0]?.upsert_vendor==", result.rows[0]?.upsert_vendor);
    return result.rows[0]?.upsert_vendor;
  } catch (error) {
    console.error('Error in upsert_vendor:', error);
    throw error;
  }
};

export const deleteVendor = async (id: number, userId: string) => {
  const query = `
    SELECT * FROM xapps.upsert_vendor(
      p_user_id := $1,
      p_id := $2,
      p_is_deleted := TRUE
    );
  `;
  const placeHolders = [userId, id];
  const result = await executeQuery(query, placeHolders);
  console.log(`Vendor deleted successfully!`, result.rows[0]?.upsert_vendor);
  return result.rows[0]?.upsert_vendor;
};

export const getVendorById = async (id: number): Promise<any> => {
  const query = `SELECT * FROM xapps.vendors_vw WHERE vendor_id = $1`;
  const result = await executeQuery(query, [id]);
  if(!result?.rows?.length) {
    throw new Error(`Vendor not found.`);
  }

  return result.rows[0];
};

const checkVendorExists = async (vendorName: string, vendorId?: number) => {
  let query = `SELECT 1 FROM xapps.vendors WHERE LOWER(vendor_name) = LOWER($1) AND is_deleted = FALSE`;
  const params:any = [vendorName.trim()];

  if (vendorId !== undefined) {
    query += ` AND id != $2`;
    params.push(vendorId);
  }

  const result = await executeQuery(query, params);
  if (result.rows.length > 0) {
    throw new Error(`Vendor name '${vendorName}' already exists.`);
  }
};