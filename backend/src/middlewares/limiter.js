import { rateLimit, ipKeyGenerator } from 'express-rate-limit';

// General API rate limiter - generous limit to prevent legitimate UI actions, rapid attendance marking, or page switching from getting throttled
export const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    limit: 1000, // Up to 1000 requests per 5 minutes per IP
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    skip: (req) => req.method === 'OPTIONS',

    keyGenerator: (req) => {
        const ip =
            req.headers['x-forwarded-for']?.split(',')[0] ||
            req.ip;

        return ipKeyGenerator(ip);
    },

    message: {
        success: false,
        message: 'Too many requests from this IP, please try again in a few minutes.'
    }
});

// Stricter rate limiter for auth endpoints (login, forgot password, register) to protect against brute force
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 50, // 50 attempts per 15 minutes
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    skip: (req) => req.method === 'OPTIONS',

    keyGenerator: (req) => {
        const ip =
            req.headers['x-forwarded-for']?.split(',')[0] ||
            req.ip;

        return ipKeyGenerator(ip);
    },

    message: {
        success: false,
        message: 'Too many login or verification attempts, please try again later.'
    }
});