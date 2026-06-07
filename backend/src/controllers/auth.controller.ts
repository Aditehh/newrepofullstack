import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import jwt from "jsonwebtoken";
import { registerSchema } from "../validators/auth.validator";
import { asyncHandler } from "../utils/asyncHandler";
import { logger } from "../utils/logger";


export const registerUser = async (req: Request, res: Response) => {

    try {
        logger.info({
            body: req.body
        }, "Register request received");

        const parsed = registerSchema.parse(req.body);

        logger.info({
            email: parsed.email,
        }, "Validation successful",);

        const user = await authService.register(parsed.email, parsed.password);

        logger.info({
            userId: user.id,
            email: user.email
        }, "User registered successfully",
        );

        return res.status(201).json(user);

    } catch (error: any) {

        logger.error({
            error: error.message,
            body: req.body,
        }, "Register failed",)

        res.status(400).json({
            error: error.message
        })
    }
}

// export const registerUser =
//     asyncHandler(
//         async (req: Request, res: Response) => {

//             const parsed =
//                 registerSchema.parse(
//                     req.body
//                 );

//             const user =
//                 await authService.register(
//                     parsed.email,
//                     parsed.password
//                 );

//             res.json(user);

//         }
//     );


export const loginUser = async (req: Request, res: Response) => {
    try {

        logger.info({
            email: req.body.email
        }, "login request received");

        const { email, password } = req.body;


        const result = await authService.login(email, password);

        logger.info({
            email: result.email
        }, "User loggedin successfully",
        );

        res.json(result);

    } catch (error) {
        logger.error({
            error
        },
            "Login failed"
        );

        // res.status(401).json({
        //     message: "Login failed"
        // })
        throw error;
    }

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