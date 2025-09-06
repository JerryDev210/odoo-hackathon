import express from 'express';
import authService from '../services/authService.js';
import authMiddleware from '../middleware/auth.js';
import { validateRequest, userRegistrationSchema, userLoginSchema } from '../middleware/validation.js';

const router = express.Router();

// Register
router.post('/register', validateRequest(userRegistrationSchema), async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({
      message: 'User registered successfully',
      ...result
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', validateRequest(userLoginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json({
      message: 'Login successful',
      ...result
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Get current user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await authService.getUserProfile(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default router;
