import { Router } from 'express';
import passport from 'passport';
import { generateToken } from '../services/authService.js';
import { AuthController } from '../controllers/authController.js';
import { authRateLimit } from '../middlewares/rateLimitMiddleware.js';
import { z } from 'zod';

const router = Router();

export const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  organizationId: z.string().uuid('Invalid organization ID').optional(),
});

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain uppercase, lowercase, and number'
  ),
  walletAddress: z.string().startsWith('G', 'Invalid Stellar wallet address'),
  organizationName: z.string().min(2, 'Organization name required').max(100),
  displayName: z.string().min(2, 'Display name required').max(50).optional(),
});

export const RefreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token required'),
});

const loginRateLimit = authRateLimit({
  identifier: (req) => {
    const walletAddress =
      typeof req.body?.walletAddress === 'string' ? req.body.walletAddress.trim() : '';
    const ip =
      req.ip ||
      req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() ||
      req.headers['x-real-ip']?.toString() ||
      'unknown';

    return walletAddress ? `login:${ip}:${walletAddress}` : `login:${ip}`;
  },
});

router.post('/register', authRateLimit(), (req, res, next) => {
  const result = RegisterSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: result.error.flatten() 
    });
  }
  req.body = result.data;
  next();
}, AuthController.register);

router.post('/login', loginRateLimit, (req, res, next) => {
  const result = LoginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: result.error.flatten() 
    });
  }
  req.body = result.data;
  next();
}, AuthController.login);

router.post('/refresh', authRateLimit(), (req, res, next) => {
  const result = RefreshSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: result.error.flatten() 
    });
  }
  req.body = result.data;
  next();
}, AuthController.refresh);

router.post('/2fa/setup', authRateLimit(), AuthController.setup2fa);
router.post('/2fa/verify', authRateLimit(), AuthController.verify2fa);
router.post('/2fa/disable', authRateLimit(), AuthController.disable2fa);

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
