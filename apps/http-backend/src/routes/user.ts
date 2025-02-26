import { Request, Response, Router } from "express";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "@repo/be-common/config";
import { userMiddleware } from "../middleware";
import {CreateRoomSchema, CreateUserSchema, SignInSchema} from "@repo/common/types";
import prisma from '@repo/db/db';
import  bcrypt from 'bcrypt';
import { saltRounds } from "@repo/be-common/config";


const userRouter: Router = Router();


userRouter.post('/signup' , async(req: Request , res: Response) => {

    const parsedData = CreateUserSchema.safeParse(req.body);
    if(!parsedData.success){
        res.json({
            message : "Incorrect inputs"
        });
        return;
    }

    const password = parsedData.data.password;

    const hashedPassword = await bcrypt.hash(password, saltRounds);


    try{
        const response = await prisma.user.create({
            data : {
                username : parsedData.data.username,
                email : parsedData.data.email,
                password: hashedPassword
            }
        })
        res.json({
            message : "User signed up" , data : response
        })
    }catch(err){
        res.json({
            message : "User already exists, use another email"
        })
    }
        

});

userRouter.post('/signin' , async (req: Request , res: Response) => {

    const parsedData = SignInSchema.safeParse(req.body);
    if(!parsedData.success){
        res.json({
            message : "Incorrect inputs"
        });
        return;
    }

    try {
        const response = await prisma.user.findFirst({
            where : {
                email : req.body.email
            }
        })
        if(response){
            const userId = response.id;
            const password = parsedData.data.password
            const hashedPass = response.password;
            const verify = await bcrypt.compare(password , hashedPass);

            if(verify){

                const token = jwt.sign({
                    userId    
                }, JWT_SECRET as string);
                
                res.json({
                    token
                });
            } else {
                res.json({
                    message : "Wrong password"
                })
            }
        } else{
            res.json({
                message : "User doesn't exist"
            })
        }

    } catch(err){
        res.json({
            message: "Error catched" , error : err
        })
    }
});


userRouter.post('/create-room' , userMiddleware, async(req: Request , res: Response) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);

    if(!parsedData.success){
        res.json({
            message : "Incorrect inputs",
            error : parsedData.error
        });
        return;
    };

    try {
        const response = await prisma.room.create({
            data : {
                slug : parsedData.data.name,
                adminId: req.userId
            }
        });
        res.json({
            message : "Room created" , 
            roomId :  response.id
        })
    } catch(err){
        res.json({
            message: "Catched error" , error: err
        })
    }
})


export default userRouter;
