import express from 'express';
import { prisma } from '../config/database.js';
import authMiddleware from '../middleware/auth.js';
import { validateRequest, cartItemSchema } from '../middleware/validation.js';

const router = express.Router();

// Get user's cart
router.get('/', authMiddleware, async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: {
        product: {
          include: {
            category: true,
            user: {
              select: { id: true, username: true }
            }
          }
        }
      }
    });

    const total = cartItems.reduce((sum, item) => 
      sum + (item.product.price * item.quantity), 0
    );

    res.json({
      items: cartItems,
      total: total,
      itemCount: cartItems.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add item to cart
router.post('/', authMiddleware, validateRequest(cartItemSchema), async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product || !product.isActive) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if user is trying to add their own product
    if (product.userId === req.user.id) {
      return res.status(400).json({ error: 'Cannot add your own product to cart' });
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId: productId
        }
      }
    });

    let cartItem;

    if (existingItem) {
      // Update quantity
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: {
          product: {
            include: {
              category: true
            }
          }
        }
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          userId: req.user.id,
          productId: productId,
          quantity: quantity
        },
        include: {
          product: {
            include: {
              category: true
            }
          }
        }
      });
    }

    res.status(201).json({
      message: 'Item added to cart',
      cartItem
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update cart item quantity
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const cartItem = await prisma.cartItem.updateMany({
      where: {
        id: parseInt(req.params.id),
        userId: req.user.id
      },
      data: { quantity: parseInt(quantity) }
    });

    if (cartItem.count === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ message: 'Cart item updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Remove item from cart
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedItem = await prisma.cartItem.deleteMany({
      where: {
        id: parseInt(req.params.id),
        userId: req.user.id
      }
    });

    if (deletedItem.count === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Clear cart
router.delete('/', authMiddleware, async (req, res) => {
  try {
    await prisma.cartItem.deleteMany({
      where: { userId: req.user.id }
    });

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
