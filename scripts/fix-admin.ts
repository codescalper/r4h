import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashed = await bcrypt.hash('Admin@123', 12);
  await prisma.admin.upsert({
    where: { email: 'admin@gmail.com' },
    update: { password: hashed, name: 'Super Admin' },
    create: { email: 'admin@gmail.com', password: hashed, name: 'Super Admin' },
  });
  console.log('✅ Admin password fixed — login: admin@gmail.com / Admin@123');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
