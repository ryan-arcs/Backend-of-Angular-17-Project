import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { executeQuery } from "../utilities/db-queries";
import { LoginParams } from "../interfaces";
import { isValidEmail } from "../utilities/email-format-validator.utility";
import { Request } from "express";
import { Permission, PermittedApplication, UserProfile } from "../interfaces/user-profile.interface";

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
        { expiresIn: "3h" }
    );

    return {
        status_code: 200,
        message: "Login successfull",
        data: {
            token
        } 
    };
}

export const getUserProfile = async (user: any): Promise<{ userProfile: UserProfile | null; permissions: Permission[]; applications: PermittedApplication[] }> => {
    const { email } = user;
    if (!email) {
        throw new Error("Unauthorized");
    }

    const query = `SELECT * FROM xapps.get_login_user_info($1);`;
    const placeHolders = [email];
    const result = await executeQuery(query, placeHolders);

    const userInfo = result?.rows[0]?.get_login_user_info;

    // if no rows
    if (!userInfo?.rows?.length) {
        return {
            userProfile: null,
            permissions: [],
            applications: [] 
        };
    }

    const baseRow = userInfo.rows[0];

    const userProfile: UserProfile = {
        id: baseRow.id,
        email: baseRow.email,
        firstName: baseRow.given_name,
        lastName: baseRow.family_name,
        fullName: baseRow.full_name,
        theme: baseRow.theme,
        isActive: baseRow.is_active,
    };

    const permissions: Permission[] = [];
    const applications: PermittedApplication[] = [];

    for (const row of userInfo.rows) {
        if (!row.app_slug) continue;
    
        if (!applications.some((application) => application.id === row.app_id)) {
            applications.push({
                id: row.app_id,
                slug: row.app_slug,
                name: row.app_name,
                logo: row.app_logo,
                sortOrder: row.sort_order
            });
        }
        
        permissions.push({
            aSlug: row.app_slug,
            mSlug: row.p_m_slug,
            smSlug: row.sm_slug,
            pSlug: row.p_slug,
        });
    }
    
    return {
        userProfile,
        permissions,
        applications 
    }
};


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