import ratelimit from "express-rate-limit";

export const globalLimiter = ratelimit({
    windowMs:
        15 * 60 * 1000, // this shit means that request history resets every 15 minutes
    max:
        4, // inside that 15 mins only 100 requests are allowed 

    message: {
        success: false,
        message:
            "Too many requests. Try again later."
    },
    standardHeaders: true,

    legacyHeaders: false
})

export const authLimiter = ratelimit({
    windowMs: 15 * 60 * 1000,
    max: 2,
    message: {
        success: false,
        message: "Too many login attempts"
    }

});

export const refreshLimiter = ratelimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
        success: false,
        message: "Refresh limit exceeded"
    }
});

export const notesLimiter = ratelimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: {
        success: false,
        message: "Notes API overloaded"
    }
})
