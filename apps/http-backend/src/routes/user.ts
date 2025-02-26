import { Request, Response, Router } from "express";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "@repo/be-common/config";
import { userMiddleware } from "../middleware";
import {CreateRoomSchema, CreateUserSchema, SinginSchema} from "@repo/common/types"


const userRouter: Router = Router();



userRouter.post('/signup' , (req: Request , res: Response) => {

    const data = CreateUserSchema.safeParse(req.body);
    if(!data.success){
        res.json({
            message : "Incorrect inputs"
        });
        return;
    }

    res.json({
        userId : 123
    })

});

userRouter.post('/signin' , (req: Request , res: Response) => {

    const data = SinginSchema.safeParse(req.body);
    if(!data.success){
        res.json({
            message : "Incorrect inputs"
        });
        return;
    }
    const userId = 1;
    const token = jwt.sign({
        userId 
    }, JWT_SECRET as string);

    res.json({
        token
    });
});


userRouter.post('/create-room' , userMiddleware, (req: Request , res: Response) => {
    const data = CreateRoomSchema.safeParse(req.body);
    if(!data.success){
        res.json({
            message : "Incorrect inputs"
        });
        return;
    }
    res.json({
        roomId: 123
    })
})


export default userRouter;
