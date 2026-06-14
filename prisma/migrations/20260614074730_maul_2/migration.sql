-- CreateEnum
CREATE TYPE "Role" AS ENUM ('RT', 'WARGA');

-- CreateEnum
CREATE TYPE "StatusPeminjaman" AS ENUM ('PENDING', 'DISETUJUI', 'DITOLAK', 'DIAMBIL', 'SELESAI');

-- CreateEnum
CREATE TYPE "KondisiBarang" AS ENUM ('BAIK', 'RUSAK');

-- CreateEnum
CREATE TYPE "StatusPembayaran" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "noTelepon" TEXT,
    "email" TEXT,
    "name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'WARGA',
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Warga" (
    "id" SERIAL NOT NULL,
    "noRumah" TEXT,
    "noKK" TEXT NOT NULL,
    "kepalaKeluarga" TEXT NOT NULL,
    "jumlahAnggota" INTEGER NOT NULL DEFAULT 1,
    "noTelepon" TEXT,
    "statusRumah" TEXT NOT NULL DEFAULT 'MILIK_SENDIRI',
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Warga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Barang" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "stok" INTEGER NOT NULL DEFAULT 0,
    "fotoUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'TERSEDIA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Barang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Peminjaman" (
    "id" SERIAL NOT NULL,
    "wargaId" INTEGER NOT NULL,
    "barangId" INTEGER NOT NULL,
    "tanggalMulai" TIMESTAMP(3) NOT NULL,
    "tanggalSelesai" TIMESTAMP(3) NOT NULL,
    "tujuan" TEXT NOT NULL,
    "jumlah" INTEGER NOT NULL DEFAULT 1,
    "status" "StatusPeminjaman" NOT NULL DEFAULT 'PENDING',
    "alasanPenolakan" TEXT,
    "kondisiKeluar" "KondisiBarang",
    "kondisiKembali" "KondisiBarang",
    "buktiUrl" TEXT,
    "tandaTanganUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Peminjaman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kerusakan" (
    "id" SERIAL NOT NULL,
    "peminjamanId" INTEGER NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "nominalDenda" DOUBLE PRECISION NOT NULL,
    "statusPembayaran" "StatusPembayaran" NOT NULL DEFAULT 'PENDING',
    "buktiUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kerusakan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_noTelepon_key" ON "User"("noTelepon");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Warga_noKK_key" ON "Warga"("noKK");

-- CreateIndex
CREATE UNIQUE INDEX "Warga_userId_key" ON "Warga"("userId");

-- AddForeignKey
ALTER TABLE "Warga" ADD CONSTRAINT "Warga_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peminjaman" ADD CONSTRAINT "Peminjaman_wargaId_fkey" FOREIGN KEY ("wargaId") REFERENCES "Warga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peminjaman" ADD CONSTRAINT "Peminjaman_barangId_fkey" FOREIGN KEY ("barangId") REFERENCES "Barang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kerusakan" ADD CONSTRAINT "Kerusakan_peminjamanId_fkey" FOREIGN KEY ("peminjamanId") REFERENCES "Peminjaman"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
