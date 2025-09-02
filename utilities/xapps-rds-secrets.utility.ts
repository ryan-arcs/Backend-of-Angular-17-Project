import dotenv from 'dotenv';
import { XAppsRdsSecrets } from '../interfaces';
dotenv.config();

export const xAppsRdsSecrets = async (): Promise<XAppsRdsSecrets> => {
    return {
      user: process.env.DB_USER || '',
      host: process.env.DB_HOST || '',
      database: process.env.DB_DATABASE || '',
      password: process.env.DB_PASSWORD || '',
      port: Number(process.env.DB_PORT)
    }
}