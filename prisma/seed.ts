import { PrismaClient, Role, StatusPeminjaman, KondisiBarang, StatusPembayaran } from '@prisma/client';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Clearing database...');
  await prisma.kerusakan.deleteMany();
  await prisma.peminjaman.deleteMany();
  await prisma.barang.deleteMany();
  await prisma.warga.deleteMany();
  await prisma.user.deleteMany();

  console.log('👤 Seeding RT Admin...');
  const hashedAdminPassword = await bcrypt.hash('password123', 10);
  await prisma.user.create({
    data: {
      noTelepon: '081111111111',
      name: 'Ketua RT',
      role: Role.RT,
      password: hashedAdminPassword,
    }
  });

  console.log('👤 Seeding Warga (10 Data)...');
  const focusedPhone = '081284525304';
  const hashedFocusedPassword = await bcrypt.hash(focusedPhone, 10);
  
  // 1. Focused Warga (Target Utama)
  const focusedUserWarga = await prisma.user.create({
    data: {
      noTelepon: focusedPhone,
      name: 'Amr Emirate',
      role: Role.WARGA,
      password: hashedFocusedPassword,
      warga: {
        create: {
          noRumah: 'Blok A1 No 10',
          noKK: '3201234567890101',
          kepalaKeluarga: 'Amr Emirate',
          jumlahAnggota: 4,
          noTelepon: focusedPhone,
          statusRumah: 'MILIK_SENDIRI'
        }
      }
    },
    include: { warga: true }
  });

  // 2. Warga Lainnya (9 Warga untuk memenuhi syarat 10 data)
  const otherWargas = [];
  for (let i = 2; i <= 10; i++) {
    const phone = `08123456780${i}`;
    const hash = await bcrypt.hash(phone, 10);
    const user = await prisma.user.create({
      data: {
        noTelepon: phone,
        name: `Warga Tetangga ${i}`,
        role: Role.WARGA,
        password: hash,
        warga: {
          create: {
            noRumah: `Blok B2 No ${i}`,
            noKK: `320123456789010${i}`,
            kepalaKeluarga: `Keluarga Tetangga ${i}`,
            jumlahAnggota: Math.floor(Math.random() * 5) + 1,
            noTelepon: phone,
            statusRumah: 'MILIK_SENDIRI'
          }
        }
      },
      include: { warga: true }
    });
    otherWargas.push(user);
  }

  console.log('📦 Seeding Barang (10 Data)...');
  const barangData = [
    { nama: 'Tenda Hajatan (Besar)', deskripsi: 'Tenda ukuran 6x8 meter', stok: 2 },
    { nama: 'Tenda Hajatan (Kecil)', deskripsi: 'Tenda ukuran 4x4 meter', stok: 3 },
    { nama: 'Kursi Lipat Besi', deskripsi: 'Kursi besi lipat warna biru', stok: 100 },
    { nama: 'Kursi Plastik', deskripsi: 'Kursi plastik merk Lion Star', stok: 200 },
    { nama: 'Meja Prasmanan', deskripsi: 'Meja panjang lipat untuk prasmanan', stok: 10 },
    { nama: 'Sound System (Speaker)', deskripsi: 'Speaker aktif + 2 Mic Wireless', stok: 4 },
    { nama: 'Piring Kaca', deskripsi: 'Piring beling bening 1 lusin', stok: 30 },
    { nama: 'Sendok & Garpu', deskripsi: 'Set sendok garpu stainless 1 lusin', stok: 30 },
    { nama: 'Gelas Kaca', deskripsi: 'Gelas minum standar hajatan 1 lusin', stok: 30 },
    { nama: 'Terpal Biru', deskripsi: 'Terpal plastik tebal 6x8 meter', stok: 5 },
  ];

  const barangRecords = [];
  for (const item of barangData) {
    const b = await prisma.barang.create({
      data: { ...item, status: 'TERSEDIA' }
    });
    barangRecords.push(b);
  }

  console.log('📝 Seeding Peminjaman (10 Data Fokus ke 081284525304)...');
  const peminjamanRecords = [];
  
  // Membuat 10 data peminjaman KHUSUS untuk akun 081284525304
  const statuses = [
    StatusPeminjaman.PENDING, 
    StatusPeminjaman.DISETUJUI, 
    StatusPeminjaman.DITOLAK, 
    StatusPeminjaman.DIAMBIL, 
    StatusPeminjaman.SELESAI
  ];
  
  for (let i = 0; i < 10; i++) {
    const currentStatus = statuses[i % statuses.length];
    const isSelesai = currentStatus === StatusPeminjaman.SELESAI;
    
    const p = await prisma.peminjaman.create({
      data: {
        wargaId: focusedUserWarga.warga!.id,
        barangId: barangRecords[i % barangRecords.length].id,
        tanggalMulai: new Date(new Date().setDate(new Date().getDate() - (i * 2))), 
        tanggalSelesai: new Date(new Date().setDate(new Date().getDate() - (i * 2) + 1)),
        tujuan: `Acara Keluarga Sesi ${i + 1}`,
        jumlah: Math.floor(Math.random() * 3) + 1,
        status: currentStatus,
        alasanPenolakan: currentStatus === StatusPeminjaman.DITOLAK ? 'Sedang dipakai warga lain' : null,
        kondisiKeluar: (currentStatus === StatusPeminjaman.PENDING || currentStatus === StatusPeminjaman.DISETUJUI || currentStatus === StatusPeminjaman.DITOLAK) ? null : KondisiBarang.BAIK,
        kondisiKembali: isSelesai ? (i % 2 === 0 ? KondisiBarang.RUSAK : KondisiBarang.BAIK) : null,
      }
    });
    peminjamanRecords.push(p);
  }

  console.log('⚠️ Seeding Kerusakan (10 Data Fokus ke 081284525304)...');
  // Membuat 10 data kerusakan yang terhubung dengan 10 peminjaman di atas
  for (let i = 0; i < 10; i++) {
    await prisma.kerusakan.create({
      data: {
        peminjamanId: peminjamanRecords[i].id,
        deskripsi: `Laporan kerusakan / lecet pada barang peminjaman sesi ${i + 1}`,
        nominalDenda: (Math.floor(Math.random() * 5) + 1) * 15000,
        statusPembayaran: i % 2 === 0 ? StatusPembayaran.PENDING : StatusPembayaran.SUCCESS
      }
    });
  }

  console.log('✅ Seeding selesai secara keseluruhan!');
  console.log('==============================================');
  console.log('📋 Akun Login RT (Admin):');
  console.log('   Username : 081111111111');
  console.log('   Password : password123');
  console.log('==============================================');
  console.log('📋 Akun Login Warga Fokus:');
  console.log(`   Username : ${focusedPhone}`);
  console.log(`   Password : ${focusedPhone}`);
  console.log('==============================================');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
