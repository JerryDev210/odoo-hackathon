# Marketplace Backend

A Node.js/Express backend for an ecommerce marketplace application.

## Features

- User authentication (register/login)
- Product CRUD operations
- Category management
- Shopping cart functionality
- Order history
- Image upload support
- Search and filtering

## Installation

1. Install dependencies:
```bash
npm install
```

2. Setup environment variables:
   - Copy `.env.example` to `.env`
   - Update database URL and JWT secret

3. Setup database:
```bash
npx prisma migrate dev
npx prisma generate
```

4. Seed initial categories (optional):
```bash
npx prisma db seed
```

5. Start development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get current user profile

### Products
- GET `/api/products` - Get all products (with filters)
- GET `/api/products/:id` - Get single product
- POST `/api/products` - Create product (auth required)
- PUT `/api/products/:id` - Update product (auth required)
- DELETE `/api/products/:id` - Delete product (auth required)
- GET `/api/products/user/my-products` - Get user's products

### Categories
- GET `/api/categories` - Get all categories
- POST `/api/categories` - Create category (auth required)

### Cart
- GET `/api/cart` - Get user's cart
- POST `/api/cart` - Add item to cart
- PUT `/api/cart/:id` - Update cart item
- DELETE `/api/cart/:id` - Remove cart item
- DELETE `/api/cart` - Clear cart

### Users
- GET `/api/users/profile` - Get user profile
- PUT `/api/users/profile` - Update user profile
- GET `/api/users/orders` - Get purchase history

## Environment Variables

```
DATABASE_URL="postgresql://username:password@localhost:5432/marketplace_db"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
```
