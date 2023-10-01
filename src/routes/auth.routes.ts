// auth.routes.ts
import { Router } from 'express';
import { register, login } from '../controllers/auth/auth.controller';

const router = Router();

// Registration route
router.post('/register', register);

// Login route
router.post('/login', login);

module.exports = router;
