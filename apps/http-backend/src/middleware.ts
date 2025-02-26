import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from "@repo/be-common/config";


export const userMiddleware = (req: Request, res: Response , next: NextFunction) => {
    const token = req.headers['authorization'] ??  "";
    try {
        const decoded = jwt.verify(token, JWT_SECRET as string);
        
        if((decoded as JwtPayload).userId){
            req.userId = (decoded as JwtPayload).userId;
            next();
        } else {
            res.json({
                message : "Token is not available"
            });
            return;
        }
    }
    catch(err){
        res.json({
            error : err
        })
    }
}