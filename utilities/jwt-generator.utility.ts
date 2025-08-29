import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export const generateJwt = (tableauConfig: any, email: string) => {
    const { tableauAppClientId, tableauAppSecretId, tableauAppSecretValue } = tableauConfig;
    if(!tableauAppClientId || !tableauAppSecretId || !tableauAppSecretValue){
      throw Error('Invalid configuration!');
    }

    const secret = tableauAppSecretValue as string;
    const secretId = tableauAppSecretId as string;
    const clientId = tableauAppClientId as string;
    const tokenExpiryInMinutes = 10; // Max of 10 minutes.

    const scopes = ["tableau:views:embed", "tableau:views:embed_authoring", "tableau:insights:embed", "tableau:content:read"];
  
  
    const header = {
      alg: "HS256",
      typ: "JWT",
      kid: secretId,
      iss: clientId,
    };
  
    const data = {
      jti: uuidv4(),
      aud: "tableau",
      sub: email,
      scp: scopes,
      exp: Math.floor(Date.now() / 1000) + tokenExpiryInMinutes * 60,
    };
  
    const token = jwt.sign(data, secret, { header });
    return token;
  }
