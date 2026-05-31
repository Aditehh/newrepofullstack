import ratelimit from "express-rate-limit";

export const globalLimiter = ratelimit({
    windowMs:
        15 * 60 * 1000,
    max:
        100,

    message: {
        success: false,
        message:
            "Too many requests. Try again later."
    },
    standardHeaders: true,

    legacyHeaders: false
})