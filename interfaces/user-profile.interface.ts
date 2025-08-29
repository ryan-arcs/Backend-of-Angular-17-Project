export interface UserProfileSyncRequest {
  firstName: string;
  lastName: string;
  email: string;
}

export type ThemeType = 'default' | 'light' | 'dark' | 'classic';

export interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  theme: ThemeType;
  config?: any;
  isActive: boolean;
}

export interface Permission {
  aSlug: string;
  mSlug: string;
  smSlug: string;
  pSlug: string;
}

export interface PermittedApplication {
  id: number;
  slug: string;
  name: string;
  logo: string;
  sortOrder: number;
}

export interface UserData {
  userProfile: UserProfile;
  permittedApplications: PermittedApplication[];
}