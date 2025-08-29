import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { commmonResponse } from "../utilities";
dotenv.config();

export interface UserRequest extends Request {
    user?: any;
}

export const auth = async (req:UserRequest, res:Response, next:NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    throw new Error("No token provided" );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    
    req.user = decoded;
    next();
  } catch (err) {
    commmonResponse({
        res,
        statusCode: 403,
        statusMessage: "Unauthorized",
        statusDescription: err?.toString() ||"Invalid or expired token"
    })
  }
}