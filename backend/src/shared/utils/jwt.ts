import jwt, { Secret } from "jsonwebtoken";
import dotenv from 'dotenv';
import { IUser } from "../../types/index.js";
dotenv.config();


if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET || !process.env.JWT_SECRET) {
    throw new Error('ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, JWT_SECRET must be defined in environment variables');
}
const ACCESS_TOKEN_SECRET: Secret = process.env.ACCESS_TOKEN_SECRET as Secret;
const REFRESH_TOKEN_SECRET: Secret = process.env.REFRESH_TOKEN_SECRET as Secret;
const JWT_SECRET: Secret = process.env.JWT_SECRET as Secret;


export const signVerificationToken = (email: string)=>{
    return jwt.sign({ email}, JWT_SECRET, {expiresIn: '24h'});
}

export function verifyJwtToken(token: string): {email: string}| null{

    try{
        return jwt.verify(token, JWT_SECRET) as {email: string};
    }catch{
        return null;
    }

  
}

export  function decodeToken(token: string){
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as {_id: string; role: string}

}

export const generateTokens = (user: IUser): { accessToken: string; refreshToken: string} => {
    const accessToken = jwt.sign(
        { _id: user._id, role: user.role },
        ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { _id: user._id, role: user.role },
        REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );
    

    return { accessToken, refreshToken };
};
