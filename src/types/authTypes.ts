import { Request } from 'express';

export interface JwtPayload{
    userId: string;
    email: string;
}

export interface CustomRequest extends Request {
    user: JwtPayload;
}