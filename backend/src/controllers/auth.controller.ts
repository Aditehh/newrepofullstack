import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import jwt from "jsonwebtoken";
import { registerSchema } from "../validators/auth.validator";


export const registerUser = async (req: Request, res: Response) => {

    try {
        const parsed = registerSchema.parse(req.body)

        const user = await authService.register(parsed.email, parsed.password);
        res.json(user);
    } catch (error: any) {

        res.status(400).json({
            error: error.message
        })

    }
}


export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    res.json(result);
}

export const refreshAccessToken = async (
    req: Request,
    res: Response
) => {

    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({
            message: "No refresh token",
        })
    }

    try {

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET!
        ) as any;


        const newAccessToken = jwt.sign(
            { userId: decoded.userId },
            process.env.JWT_SECRET!,
            { expiresIn: "15m" }
        );

        res.json({
            accessToken: newAccessToken,
        });
    } catch {
        res.status(401).json({
            message: "Invalid refresh token",
        })
    }
}