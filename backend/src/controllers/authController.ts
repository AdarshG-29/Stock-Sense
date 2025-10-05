import {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {pool} from '../db';
import { CustomRequest } from '../types/authTypes';

export const registerUser = async (req: Request, res: Response) => {
 const SALT_ROUNDS = 10;

    const {name, email, password} = req.body;
    try{
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const result =  await pool.query(
            'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, email',
            [name, email, hashedPassword]
        )

        res.status(201).json({message: 'User registered successfully', user: result.rows[0]});
    }
    catch(err: any){
        if(err.code === '23505'){
            return res.status(400).json({message: 'Email already exists'}); // Unique violation
        } 
        res.status(500).json({error: err.message || 'Internal server error'});
    }
}


export const loginUser = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    try{
        const result = await pool.query(" SELECT * FROM users WHERE email = $1", [email]);
        if(result.rows.length === 0){
            return res.status(400).json({error: "User not found"});
        }
        const user = result.rows[0];
        const matchPassword = await bcrypt.compare(password, user.password_hash);
        if(!matchPassword){
            return res.status(400).json({error: "Wrong password"});
        }

        const token = jwt.sign({userId: user.id, email: user.email}, process.env.JWT_SECRET!, {expiresIn: '1h'});

        //store token in httpOnly cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // set secure flag in production
            sameSite: 'lax', // CSRF protection
            maxAge: 60 * 60 * 1000 // 1 hour
        })

        res.json({message: "Login successful", token});

    } catch(err: any){
        res.status(500).json({error: err.message || 'Internal server error'});
    }
}


export const logoutUser = (req: Request, res: Response) => {
    res.clearCookie('token');
    res.json({message: "Logout successful"});
}


export const getUser = (req: Request, res: Response) => {
const user = (req as CustomRequest).user;
res.json({user: {userId: user.userId, email: user.email}});
}   