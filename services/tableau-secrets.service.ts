import dotenv from 'dotenv';
import { TableauSecretResponse, TableauSecrets } from "../interfaces";
import { redisClient } from './redis-client.service';


// Load env only in dev (not needed in prod containers if envs are passed directly)
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const TABLEAU_TOKEN_KEY = "TABLEAU_APP_ADMIN_AUTH_TOKEN";

export const tableauSecrets = async () => {

  const response: TableauSecretResponse = {
    tableauAppApiUrl: process.env.TABLEAU_APP_API_URL || '',
    tableauAppSiteUrl: process.env.TABLEAU_APP_SITE_URL || '',
    tableauAppClientId: process.env.TABLEAU_APP_CLIENT_ID || '',
    tableauAppSecretId: process.env.TABLEAU_APP_SECRET_ID || '',
    tableauAppSecretValue: process.env.TABLEAU_APP_SECRET_VALUE || '',
    tableauAppEnvironments: process.env.TABLEAU_APP_ENVIRONMENTS || '',
    tableauAppAdminPatToken: process.env.TABLEAU_APP_ADMIN_PAT_TOKEN || '',
    tableauAppAdminAuthToken: await getTableauAuthToken() || '',
    tableauAppAdminPatName: process.env.TABLEAU_APP_ADMIN_PAT_NAME || '',
  }

  return response;
}

export const updateTableauSecrets = async (token: string, ttlSeconds = 10800) => {
  try {
    // Store token with TTL (e.g., 3 hours = 10800 seconds)
    await redisClient.set(TABLEAU_TOKEN_KEY, token, "EX", ttlSeconds);

    console.log(`Tableau token updated in Redis (expires in ${ttlSeconds}s)`);
    return true;
  } catch (err) {
    console.error("Failed to update Tableau token in Redis:", err);
    return false;
  }
};

export const getTableauAuthToken = async (): Promise<string | null> => {
  try {
    const token = await redisClient.get(TABLEAU_TOKEN_KEY);
    console.log("token====>", token);
    return token;
  } catch (err) {
    console.error("Failed to get Tableau token from Redis:", err);
    return null;
  }
};
