import { Permission, PermittedApplication, UserProfile, UserProfileSyncRequest } from '../interfaces/user-profile.interface';
import { executeQuery } from '../utilities/db-queries';

export const syncUserProfile = async (req: UserProfileSyncRequest): Promise<{ userProfile: UserProfile | null; permissions: Permission[]; applications: PermittedApplication[] }> => {
  
  if(!(req.firstName && req.lastName && req.email)) {
    throw new Error('Missing required parameters!');
  }

  const query = `SELECT * FROM xapps.get_login_user_info($1, $2, $3);`;

  const placeHolders = [req.firstName, req.lastName, req.email];

  const { rows } = await executeQuery(query, placeHolders);

  if (!rows.length) {
    return {
      userProfile: null,
      permissions: [],
      applications: [] 
    }
  }

  const user = rows[0];

  const userProfile: UserProfile = {
    id: Number(user.user_id),
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    fullName: user.full_name,
    theme: user.theme,
    config: user.config,
    isActive: user.is_active,
  };

  const appMap = new Map<string, PermittedApplication>();

  const permissions: Permission[] = [];
  const applications: PermittedApplication[] = [];
  for (const row of rows) {
    if (!row.a_slug) continue;
   
    if(!applications?.some((application) => application.id === row.a_id)){
      applications.push({
        id: row.a_id,
        slug: row.a_slug,
        name: row.application_name,
        logo: row.logo,
        sortOrder: row.a_order
      });
    }
    
    permissions.push({
      aSlug: row.a_slug,
      mSlug: row.m_slug,
      smSlug: row.sm_slug,
      pSlug: row.p_slug,
    });
  }

  return {
    userProfile,
    permissions,
    applications 
  }
};


export const updateTheme = async(userId: number,theme: string) => {
  if (!theme) {
      throw new Error("Invalid theme!");
  }

  if(!userId) {
    throw new Error("Invalid user.");
  }

  const query = `SELECT * FROM xapps.update_user_theme(
      p_user_id := $1,
      p_theme := $2::xapps.theme_enum
    );`;
  const placeHolders = [userId, theme];
  const result = await executeQuery(query, placeHolders);

  return result.rows[0];
}

export const updateConfig = async(userId: string, config: any) => {
  if (!config) {
      throw new Error("Invalid config!");
  }

  if(!userId) {
    throw new Error("Invalid user.");
  }

  const query = `SELECT *
    FROM xapps.upsert_user_config(
        p_user_id := $1,
        p_config := $2::jsonb
    );
`;
  const placeHolders = [userId, JSON.stringify(config)];
  const result = await executeQuery(query, placeHolders);
  return result.rows[0];
}