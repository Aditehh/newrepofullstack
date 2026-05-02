import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!;

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;

        (req as any).userId = decoded.userId;
        next();
    } catch {
        res.status(401).json({ message: "invalid token" })
    }
}