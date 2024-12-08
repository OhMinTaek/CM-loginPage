import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

(async () => {
  for (let i = 0; i < 100; i++) {
    await prisma.tweet.create({
      data: {
        tweet: faker.commerce.productDescription(),
        created_at: new Date(),
        user: {
          connect: {
            id: 1,
          },
        },
      },
    });
  }
})();