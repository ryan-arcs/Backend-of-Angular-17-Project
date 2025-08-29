import { Request } from 'express';
export interface XAppsRdsSecrets {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
}

