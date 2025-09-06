import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedProducts() {
  console.log('🛍️ Starting product seeding...');

  try {
    // Check if we have categories and users
    const categories = await prisma.category.findMany();
    const users = await prisma.user.findMany();

    if (categories.length === 0) {
      console.log('❌ No categories found. Please run main seed first.');
      return;
    }

    if (users.length === 0) {
      console.log('❌ No users found. Please run main seed first.');
      return;
    }

    console.log(`📂 Found ${categories.length} categories`);
    console.log(`👥 Found ${users.length} users`);

    // Find specific categories
    const electronicsCategory = categories.find(cat => cat.name === 'Electronics');
    const clothingCategory = categories.find(cat => cat.name === 'Clothing');
    const booksCategory = categories.find(cat => cat.name === 'Books');
    const homeCategory = categories.find(cat => cat.name === 'Home & Garden');

    // Use first user as default seller
    const defaultUser = users[0];

    // Sample products data
    const sampleProducts = [
      {
        title: 'iPhone 12 - Space Gray',
        description: 'Good condition iPhone 12 with 64GB storage. Minor scratches on back, screen protector applied. Fast performance and great camera quality.',
        price: 450.00,
        quantity: 1,
        condition: 'good',
        yearOfManufacture: 2020,
        brand: 'Apple',
        model: 'iPhone 12',
        material: 'Aluminum and Glass',
        color: 'Space Gray',
        originalPackaging: false,
        manualIncluded: true,
        workingConditionDesc: 'Works perfectly, battery health at 85%, no functional issues',
        length: 14.67,
        width: 7.15,
        height: 0.74,
        weight: 0.164,
        images: ['https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500'],
        categoryId: electronicsCategory?.id,
        userId: defaultUser.id,
      },
      {
        title: 'Nike Running Shoes - Size 9',
        description: 'Comfortable running shoes in good condition. Perfect for daily runs, gym workouts, and casual wear. Lightweight and breathable.',
        price: 60.00,
        quantity: 1,
        condition: 'good',
        yearOfManufacture: 2022,
        brand: 'Nike',
        model: 'Air Zoom Pegasus 38',
        material: 'Mesh and Rubber',
        color: 'Black and White',
        originalPackaging: false,
        manualIncluded: false,
        workingConditionDesc: 'Good condition with normal wear, soles still have excellent grip and cushioning',
        length: 30.0,
        width: 11.0,
        height: 10.0,
        weight: 0.8,
        images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500'],
        categoryId: clothingCategory?.id,
        userId: defaultUser.id,
      },
      {
        title: 'Programming Books Collection',
        description: 'Set of 3 programming books: "JavaScript: The Definitive Guide", "Learning Python", and "React Up & Running". Excellent for beginners and intermediate developers.',
        price: 40.00,
        quantity: 1,
        condition: 'like-new',
        yearOfManufacture: 2021,
        brand: 'O\'Reilly Media',
        model: 'Programming Collection',
        material: 'Paper and Hardcover',
        color: 'Various',
        originalPackaging: false,
        manualIncluded: false,
        workingConditionDesc: 'Like new condition, no markings, highlighting, or damage. Pages are crisp and clean.',
        length: 23.0,
        width: 18.0,
        height: 8.0,
        weight: 1.5,
        images: ['https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500'],
        categoryId: booksCategory?.id,
        userId: defaultUser.id,
      },
      {
        title: 'Solid Wood Coffee Table',
        description: 'Beautiful handcrafted oak coffee table perfect for living room. Rectangular design with smooth finish. Shows minor wear from normal use but very sturdy.',
        price: 150.00,
        quantity: 1,
        condition: 'good',
        yearOfManufacture: 2020,
        brand: 'Handcrafted',
        model: 'Classic Rectangle',
        material: 'Solid Oak Wood',
        color: 'Natural Brown',
        originalPackaging: false,
        manualIncluded: false,
        workingConditionDesc: 'Very sturdy and functional, minor surface scratches from normal use, no structural damage',
        length: 120.0,
        width: 60.0,
        height: 45.0,
        weight: 25.0,
        images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500'],
        categoryId: homeCategory?.id,
        userId: defaultUser.id,
      }
    ];

    // Delete existing products (optional - remove this if you want to keep existing products)
    console.log('🗑️ Clearing existing products...');
    await prisma.product.deleteMany({});

    // Create products
    console.log('📱 Creating sample products...');
    const createdProducts = [];

    for (const [index, product] of sampleProducts.entries()) {
      try {
        if (!product.categoryId) {
          console.log(`⚠️ Skipping product ${product.title} - category not found`);
          continue;
        }

        const createdProduct = await prisma.product.create({
          data: product,
          include: {
            category: true,
            user: true
          }
        });

        createdProducts.push(createdProduct);
        console.log(`✅ Created product ${index + 1}: ${product.title} - $${product.price}`);
      } catch (error) {
        console.error(`❌ Failed to create product: ${product.title}`, error.message);
      }
    }

    console.log('\n🎉 Product seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Products created: ${createdProducts.length}`);
    console.log(`   - Total value: $${createdProducts.reduce((sum, p) => sum + p.price, 0)}`);
    
    // Display created products
    console.log('\n📋 Created Products:');
    createdProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.title} - $${product.price} (${product.category.name})`);
    });

  } catch (error) {
    console.error('❌ Product seeding failed:', error);
    throw error;
  }
}

// Run the seeding function
async function main() {
  try {
    await seedProducts();
  } catch (error) {
    console.error('❌ Seeding process failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
