import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create default categories
  const categories = [
    { name: 'Electronics', description: 'Phones, laptops, gadgets' },
    { name: 'Clothing', description: 'Shirts, pants, shoes' },
    { name: 'Books', description: 'Novels, textbooks, magazines' },
    { name: 'Home & Garden', description: 'Furniture, tools, decor' },
    { name: 'Sports', description: 'Equipment, clothing, accessories' },
    { name: 'Automotive', description: 'Car parts, accessories' },
    { name: 'Toys', description: 'Games, collectibles, kids toys' },
    { name: 'Health & Beauty', description: 'Cosmetics, supplements' }
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category
    });
  }

  console.log('✅ Categories seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
