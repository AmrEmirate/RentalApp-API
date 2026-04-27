import prisma from "../config/prisma";

export class BarangRepository {
  async findAll() {
    return await prisma.barang.findMany({
      include: {
        _count: { select: { peminjaman: true } }
      },
      orderBy: { nama: 'asc' }
    });
  }

  async findById(id: number) {
    return await prisma.barang.findUnique({ where: { id } });
  }

  async create(data: any) {
    return await prisma.barang.create({ data });
  }

  async update(id: number, data: any) {
    return await prisma.barang.update({ where: { id }, data });
  }

  async delete(id: number) {
    return await prisma.barang.delete({ where: { id } });
  }
}
