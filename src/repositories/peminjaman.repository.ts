import prisma from "../config/prisma";

export class PeminjamanRepository {
  async findAll() {
    return await prisma.peminjaman.findMany({
      include: { warga: { include: { user: { select: { id: true, name: true } } } }, barang: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findByWargaId(wargaId: number) {
    return await prisma.peminjaman.findMany({
      where: { wargaId },
      include: { warga: { include: { user: { select: { id: true, name: true } } } }, barang: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: number) {
    return await prisma.peminjaman.findUnique({
      where: { id },
      include: { warga: true, barang: true }
    });
  }

  async findOverlapping(barangId: number, start: Date, end: Date) {
    return await prisma.peminjaman.findMany({
      where: {
        barangId,
        status: { in: ["PENDING", "DISETUJUI", "DIAMBIL"] },
        OR: [
          {
            tanggalMulai: { lte: end },
            tanggalSelesai: { gte: start }
          }
        ]
      }
    });
  }

  async create(data: any) {
    return await prisma.peminjaman.create({ data });
  }

  async update(id: number, data: any) {
    return await prisma.peminjaman.update({
      where: { id },
      data,
      include: { warga: true }
    });
  }
}
