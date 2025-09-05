import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import { signup, login } from '../controllers/auth.controller';

const router = Router();

// Rate limiting for auth routes for 15 mins and 5 attempts max
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: {
    error: 'Too many authentication attempts, please try again later',
  },
});

router.post('/signup', authLimiter, signup);

router.post('/login', authLimiter, login);

export default router;
