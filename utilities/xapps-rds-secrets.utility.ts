import { XAppsRdsSecrets } from "../interfaces/common-interfaces";
import dotenv from 'dotenv';
dotenv.config();
export const xAppsRdsSecrets = async (): Promise<XAppsRdsSecrets> => {
    
    return {
      user: 'postgres',
      host: 'localhost',
      database: 'shivam',
      password: 'password',
      port: 5432,
    }
}