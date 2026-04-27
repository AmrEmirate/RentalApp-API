import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Clearing database...');
  // Delete in reverse order to avoid foreign key constraint errors
  await prisma.kerusakan.deleteMany();
  await prisma.peminjaman.deleteMany();
  await prisma.warga.deleteMany();
  await prisma.barang.deleteMany();
  await prisma.user.deleteMany();

  console.log('👤 Seeding RT Admin...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  await prisma.user.create({
    data: {
      noTelepon: '081111111111',
      name: 'Ketua RT',
      role: Role.RT,
      password: hashedPassword,
    }
  });

  console.log('✅ Seeding selesai!');
  console.log('');
  console.log('📋 Akun Login:');
  console.log('   Role     : RT (Admin)');
  console.log('   No. Tlp  : 081111111111');
  console.log('   Password : password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
