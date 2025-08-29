import { listQuery, executeQuery } from '../utilities/db-queries';
import {CreateApplicationParams, ListQueryParams, UpdateApplicationParams } from '../interfaces';

export const getApplications = async (params: ListQueryParams): Promise<{ data: any[]; totalCount: number }> => {
  return await listQuery({
    tableName: 'xapps.applications_vw',
    searchableColumns: [
      'application_name',
      'description',
      'slug'
    ],
    ...params
  });
};

export const createApplication = async (params: CreateApplicationParams) => {
  const {
    applicationName,
    status,
    logo,
    sortOrder,
    slug,
    userId,
    description = '',
  } = params;

  if (!(applicationName && status && logo && slug && userId)) {
    throw new Error('Missing required parameters.');
  }

  const query = `
    SELECT * FROM xapps.upsert_application(
      p_user_id := $1,
      p_application_name := $2,
      p_description := $3,
      p_slug := $4,
      p_logo := $5,
      p_status := $6::xapps.app_stage_enum,
      p_sort_order := $7
    );
  `;

  const placeHolders = [userId, applicationName, description, slug, logo, status, sortOrder];


  try {
    const result = await executeQuery(query, placeHolders);
    console.log('Application created or updated successfully:', result.rows[0]);
    return result.rows[0]?.upsert_application;
  } catch (error) {
    console.error('Error creating application:', error);
    throw error;
  }
};

export const updateApplication = async (params: UpdateApplicationParams) => {
  const {
    id,
    applicationName,
    status,
    logo,
    sortOrder,
    userId,
    description = '',
    isActive = null
  } = params;

  if (!(applicationName && status && logo && userId)) {
    throw new Error('Missing required parameters.');
  }

  const query = `
    SELECT * FROM xapps.upsert_application(
      p_user_id := $1,
      p_id := $2,
      p_application_name := $3,
      p_description := $4,
      p_logo := $5,
      p_status := $6::xapps.app_stage_enum,
      p_sort_order := $7,
      p_is_active := $8
    );
  `;
  const placeHolders = [userId, id, applicationName, description, logo, status, sortOrder, isActive];

  try {
    const result = await executeQuery(query, placeHolders);
    console.log(`Application updated successfully:`);
    console.log("result.rows[0]?.upsert_application==", result.rows[0]?.upsert_application);
    return result.rows[0]?.upsert_application;
  } catch (error) {
    console.error('Error in upsert_application:', error);
    throw error;
  }
};

export const deleteApplication = async (id: number, userId: number) => {
  const query = `
    SELECT * FROM xapps.upsert_application(
      p_user_id := $1,
      p_id := $2,
      p_is_deleted := TRUE
    );
  `;
  const placeHolders = [userId, id];
  const result = await executeQuery(query, placeHolders);
  console.log(`Application deleted successfully!`, result.rows[0]?.upsert_application);
  return result.rows[0]?.upsert_application;
};


export const getApplicationById = async (id: number): Promise<any> => {
  const query = `SELECT * FROM xapps.applications_vw WHERE id = $1`;
  const result = await executeQuery(query, [id]);

  if(!result?.rows?.length) {
    throw new Error(`User not found.`);
  }

  return result.rows[0];
};