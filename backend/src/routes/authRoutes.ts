import { Router } from 'express';
import passport from 'passport';
import { generateToken } from '../services/authService.js';

const router = Router();

// Google Auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user);
    // Redirect to frontend with token (adjust URL as needed)
    res.redirect(
      `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth-callback?token=${token}`
    );
  }
);

// GitHub Auth
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(
      `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth-callback?token=${token}`
    );
  }
);

export default router;
