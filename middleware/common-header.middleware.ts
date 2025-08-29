import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface TableauReuest extends Request {
  tableauConfig?: any;
}

export async function commonHeaders(req: TableauReuest, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
    
      if (!token) {
        throw new Error("No token provided" );
      }
    
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        const email = typeof decoded === 'object' ? decoded?.['email'] as string : undefined;
        if (!email) {
          throw Error('No email address provided!');
        }
        req.headers['x-user-email'] = email;
        next();
    } catch (err: any) {
        console.log('tableau app error ===', err);
        res.status(err?.statusCode || 520).json({ success: false, message: err?.toString() || err?.message || 'Unknown error!' }); 
    }
}