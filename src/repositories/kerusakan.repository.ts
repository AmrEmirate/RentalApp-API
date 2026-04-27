import prisma from "../config/prisma";

export class KerusakanRepository {
  async findAll() {
    return await prisma.kerusakan.findMany({
      include: {
        peminjaman: {
          include: { warga: true, barang: true }
        }
      }
    });
  }

  async create(data: any) {
    return await prisma.kerusakan.create({ data });
  }

  async update(id: number, data: any) {
    return await prisma.kerusakan.update({
      where: { id },
      data
    });
  }
}
