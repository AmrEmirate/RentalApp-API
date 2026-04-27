import prisma from "../config/prisma";

export class DashboardRepository {
  async getActiveBorrowings(since: Date) {
    return await prisma.peminjaman.count({
      where: {
        createdAt: { gte: since },
        status: { in: ["PENDING", "DISETUJUI", "DIAMBIL"] }
      }
    });
  }

  async getCompletedBorrowings(since: Date) {
    return await prisma.peminjaman.count({
      where: {
        createdAt: { gte: since },
        status: "SELESAI"
      }
    });
  }

  async getPopularFacilities() {
    return await prisma.peminjaman.groupBy({
      by: ['barangId'],
      _count: { barangId: true },
      orderBy: { _count: { barangId: 'desc' } },
      take: 5
    });
  }

  async getFacilitiesByIds(ids: number[]) {
    return await prisma.barang.findMany({
      where: { id: { in: ids } },
      select: { id: true, nama: true }
    });
  }

  async getTotalKerusakan(since: Date) {
    return await prisma.kerusakan.count({
      where: { createdAt: { gte: since } }
    });
  }
}
