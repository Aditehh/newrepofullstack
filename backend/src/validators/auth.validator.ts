import { email, z } from "zod";


export const registerSchema = z.object({

    email: z
        .string()
        .trim()
        .email("Invalid email format"),


    password: z
        .string()
        .trim()
        .min(6,
            "Password must be at least 6 characters"
        )
        .max(15)
})

export const loginSchema = z.object({

    email: z
        .string()
        .trim()
        .email("Invalid email format"),

    password: z
        .string()
        .trim()
        .min(6, "Password must be at least 6 chars")
        .max(15)
})