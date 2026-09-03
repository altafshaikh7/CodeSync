import express from 'express'
import passport from 'passport' // direct passport import (already configured)
import { authCookieOptions } from '../config/auth.js'

const router = express.Router()

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))

router.get('/google/callback',
    passport.authenticate('google', { 
        session: false, 
        failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_failed` 
    }),
    async (req, res) => {
        try {
            const token = req.user.generateJWT()
            res.cookie('token', token, authCookieOptions)
            res.redirect(`${process.env.FRONTEND_URL}/auth/callback`)
        } catch (err) {
            res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`)
        }
    }
)

export default router