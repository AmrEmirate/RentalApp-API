import prisma from "../config/prisma";

export class AuthRepository {
  async findUserByNoTelepon(noTelepon: string) {
    return await prisma.user.findUnique({
      where: { noTelepon },
      include: { warga: true }
    });
  }

  async findUserById(id: number) {
    return await prisma.user.findUnique({
      where: { id }
    });
  }

  async updatePassword(id: number, passwordHash: string) {
    return await prisma.user.update({
      where: { id },
      data: { password: passwordHash }
    });
  }
}
