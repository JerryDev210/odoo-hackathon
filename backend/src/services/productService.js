import { prisma } from '../config/database.js';

class ProductService {
  async createProduct(productData, userId) {
    const product = await prisma.product.create({
      data: {
        ...productData,
        userId
      },
      include: {
        user: {
          select: { id: true, username: true }
        },
        category: true
      }
    });

    return product;
  }

  async getAllProducts(filters = {}) {
    const { category, search, userId, condition, minPrice, maxPrice } = filters;
    
    const where = {
      isActive: true,
      ...(category && { categoryId: parseInt(category) }),
      ...(userId && { userId: parseInt(userId) }),
      ...(condition && { condition }),
      ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
      ...(maxPrice && { price: { ...where.price, lte: parseFloat(maxPrice) } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { brand: { contains: search, mode: 'insensitive' } },
          { model: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const products = await prisma.product.findMany({
      where,
      include: {
        user: {
          select: { id: true, username: true }
        },
        category: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return products;
  }

  async getProductById(id) {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: { id: true, username: true, fullName: true, phone: true }
        },
        category: true
      }
    });

    if (!product || !product.isActive) {
      throw new Error('Product not found');
    }

    return product;
  }

  async updateProduct(id, updateData, userId) {
    // Check if product exists and belongs to user
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: parseInt(id),
        userId: userId
      }
    });

    if (!existingProduct) {
      throw new Error('Product not found or unauthorized');
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        user: {
          select: { id: true, username: true }
        },
        category: true
      }
    });

    return product;
  }

  async deleteProduct(id, userId) {
    // Check if product exists and belongs to user
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: parseInt(id),
        userId: userId
      }
    });

    if (!existingProduct) {
      throw new Error('Product not found or unauthorized');
    }

    await prisma.product.update({
      where: { id: parseInt(id) },
      data: { isActive: false }
    });

    return { message: 'Product deleted successfully' };
  }

  async getUserProducts(userId) {
    const products = await prisma.product.findMany({
      where: {
        userId: userId,
        isActive: true
      },
      include: {
        category: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return products;
  }
}

export default new ProductService();
