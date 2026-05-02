import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export const registerUser = async (req: Request, res: Response) => {
    
    const { email, password } = req.body;

    const user = await authService.register(email,password);
    res.json(user);
}


export const loginUser = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    const result = await authService.login(email, password);

    res.json(result);
}