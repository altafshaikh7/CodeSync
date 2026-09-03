import jwt from 'jsonwebtoken';
import redisClient from '../services/redis.service.js';

export const authUser = async (req, res, next) => {
    try {
        // ✅ Get token from cookies or Authorization header
        let token = req.cookies.token;
        
        if (!token && req.headers.authorization) {
            const parts = req.headers.authorization.split(' ');
            if (parts.length === 2 && parts[0] === 'Bearer') {
                token = parts[1];
            }
        }

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                error: 'Unauthorized: No token provided' 
            });
        }

        // ✅ Check if token is blacklisted (Redis)
        try {
            const isBlackListed = redisClient && await redisClient.get(token);
            if (isBlackListed) {
                res.clearCookie('token');
                return res.status(401).json({ 
                    success: false, 
                    error: 'Unauthorized: Token has been revoked' 
                });
            }
        } catch (redisError) {
            // ✅ Redis not available - continue without blacklist check
            console.warn('⚠️ Redis not available, skipping blacklist check:', redisError.message);
        }

        // ✅ Verify JWT
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (jwtError) {
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    success: false, 
                    error: 'Unauthorized: Token expired' 
                });
            }
            if (jwtError.name === 'JsonWebTokenError') {
                return res.status(401).json({ 
                    success: false, 
                    error: 'Unauthorized: Invalid token' 
                });
            }
            throw jwtError;
        }

        if (!decoded || !decoded._id) {
            return res.status(401).json({ 
                success: false, 
                error: 'Unauthorized: Invalid token payload' 
            });
        }

        // ✅ Attach user to request
        req.user = decoded;
        next();

    } catch (error) {
        console.error('❌ Auth middleware error:', error.message);
        return res.status(401).json({ 
            success: false, 
            error: 'Unauthorized: Authentication failed' 
        });
    }
};