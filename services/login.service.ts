import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { executeQuery } from "../utilities/db-queries";
import { LoginParams } from "../interfaces";
import { isValidEmail } from "../utilities/email-format-validator.utility";
import { Request } from "express";

dotenv.config();
export const loginUser = async (params: LoginParams) => {
    const { email, password } = params;
    if (!(email && password)) {
        throw new Error('Missing required fields for login.');
    }
    // Validate email format
    if (!isValidEmail(email)) {
        throw new Error("Invalid email format.");
    }
    
    // find user
    const query = `SELECT * FROM xapps.authenticate_user(p_email := $1);`;

    const placeHolders = [email];
    const result = await executeQuery(query, placeHolders);
    const user = result.rows[0];
    if (!user || user.status_code !== 200 || !user.data) {
        return user;
    }
    // check password
    const isMatch = await bcrypt.compare(password, user.data.password_hash);
    if (!isMatch) {
        return {
            status_code: 401,
            message: "Invalid email or password",
            data: null
        };
    }
    
    // create JWT
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT secret is not defined in environment variables.");
    }

    const token = jwt.sign(
        {   sub: user.data.user.id, 
            email: user.data.user.email,
            given_name: user.data.user.given_name,
            family_name: user.data.user.family_name
        },
        process.env.JWT_SECRET!,
        { expiresIn: "30m" }
    );

    return {
        status_code: 200,
        message: "Login successfull",
        data: {
            token
        } 
    };
}

export const getUserProfile = async (user: any) => {
    try {
        const { sub: userId } = user;

        if (!userId) {
            throw new Error("Unauthorized");
        }
        
        const query = `SELECT * FROM xapps.admin_users WHERE id = $1`;

        const placeHolders = [userId];
        const result = await executeQuery(query, placeHolders);

        if (result.rows.length === 0) {
            throw new Error("User not found" );
        }
        return {
            status_code: 200,
            message: "Profile fetched successfully",
            data: result.rows[0]
        };
            
    } catch (error) {
        return {
            status_code: 500,
            message: error || "Something went wrong"
        };
    }
}

export const getUserTheme = async (req: Request) => {
    const {theme} = req.body;
    if (!theme) {
        throw new Error('Missing required fields for theme update.');
    }
    if (!['light', 'dark'].includes(theme)) {
        throw new Error("Invalid theme type.");
    }

    const userEmail = req?.headers?.['x-user-info'] ? JSON.parse(req.headers['x-user-info'] as string)?.email : '';
    
    if(!userEmail){
      throw Error('Invalid access!');
    }
    const query = `SELECT xapps.update_admin_user_theme(p_email := $1, p_theme := $2);`;
    const placeHolders = [userEmail, theme];
    const result = await executeQuery(query, placeHolders);
    return result?.rows[0]?.update_admin_user_theme;
}