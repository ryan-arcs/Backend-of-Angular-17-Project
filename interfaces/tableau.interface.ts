import { Request } from 'express';
export interface TableauSecrets {
  tableauAppApiUrl: string;
  tableauAppSiteUrl: string;
  tableauAppClientId: string;
  tableauAppSecretId: string;
  tableauAppSecretValue: string;
  tableauAppEnvironments: string;
  tableauAppAdminPatToken: string;
  tableauAppAdminAuthToken: string;
  tableauAppAdminPatName: string;
}
export interface TableauRequest extends Request {
  tableauConfig?: TableauSecrets;
}

export interface TableauSecretResponse extends TableauSecrets {}
