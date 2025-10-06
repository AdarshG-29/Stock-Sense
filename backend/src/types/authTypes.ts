import { Request } from 'express';

export interface JwtPayload{
    userId: string;
    email: string;
    name: string;
}

export interface CustomRequest extends Request {
    user: JwtPayload;
}