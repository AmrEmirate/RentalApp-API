import prisma from "../config/prisma";

export class WargaRepository {
  async getAllWarga() {
    return await prisma.warga.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            noTelepon: true,
            role: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async createWarga(userData: any, wargaData: any) {
    return await prisma.user.create({
      data: {
        ...userData,
        warga: {
          create: wargaData
        }
      },
      include: {
        warga: true
      }
    });
  }

  async updateWarga(id: number, data: any) {
    return await prisma.warga.update({
      where: { id },
      data,
      include: {
        user: {
          select: { name: true, noTelepon: true }
        }
      }
    });
  }

  async deleteWarga(id: number) {
    const warga = await prisma.warga.findUnique({ where: { id } });
    if (!warga) throw new Error("Warga tidak ditemukan");

    // To prevent foreign key issues, we delete Warga first then User.
    // However if there are Peminjaman records, this will throw constraint error.
    await prisma.warga.delete({ where: { id } });
    await prisma.user.delete({ where: { id: warga.userId } });
    return true;
  }
}
