import express from 'express';
import { prisma } from '../config/database.js';
import authMiddleware from '../middleware/auth.js';
import { validateRequest, categorySchema } from '../middleware/validation.js';

const router = express.Router();

// Get all categories (public route)
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create category (protected route - admin only for now)
router.post('/', authMiddleware, validateRequest(categorySchema), async (req, res) => {
  try {
    const category = await prisma.category.create({
      data: req.body
    });
    res.status(201).json({
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Category name already exists' });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

export default router;
