import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import { CustomRequest, JwtPayload } from '../types/authTypes';



const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try{
        // 1. check cookie
        const tokenFromCookie = req.cookies?.token;

        // 2. check authorization header
        const authHeader = req.headers['authorization'];
        const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

        // Pick whichever is available
        const token = tokenFromCookie || tokenFromHeader;
        if(!token){
            return res.status(401).json({error: "unauthorized"});
        }
        // 3. verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        // 4. attach user to request
        (req as CustomRequest).user = decoded;
        next();
    } catch(err){
        res.status(401).json({error: "Invalid or expired token"});
    }
}

export default authMiddleware;