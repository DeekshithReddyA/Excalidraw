import {z} from "zod";


export const CreateUserSchema = z.object({
    username : z.string().min(3).max(20),
    password: z.string().min(3),
    email: z.string().email()
});


export const SignInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(3)
});


export const CreateRoomSchema = z.object({
    name : z.string().min(3).max(40)
})