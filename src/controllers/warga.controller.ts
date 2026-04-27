import { Request, Response } from "express";
import { WargaService } from "../service/warga.service";
import prisma from "../config/prisma";

const wargaService = new WargaService();

export const getAllWarga = async (req: Request, res: Response) => {
  try {
    const data = await wargaService.getAllWarga();
    return res.json({ data });
  } catch (error) {
    console.error("GetAllWarga error:", error);
    return res.status(500).json({ error: "Terjadi kesalahan saat mengambil data warga" });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const data = await wargaService.createWarga(req.body);
    return res.status(201).json({ message: "Warga berhasil ditambahkan", data });
  } catch (error: any) {
    console.error("CreateWarga error:", error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "Nomor Telepon atau No KK sudah terdaftar" });
    }
    return res.status(400).json({ error: error.message || "Terjadi kesalahan saat menambahkan warga" });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await wargaService.updateWarga(parseInt(id), req.body);
    return res.json({ message: "Warga berhasil diupdate", data });
  } catch (error: any) {
    console.error("UpdateWarga error:", error);
    return res.status(400).json({ error: error.message || "Gagal mengupdate warga" });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await wargaService.deleteWarga(parseInt(id));
    return res.json({ message: "Warga berhasil dihapus" });
  } catch (error: any) {
    console.error("DeleteWarga error:", error);
    if (error.code === 'P2003') {
      return res.status(400).json({ error: "Tidak dapat menghapus warga yang memiliki data peminjaman aktif." });
    }
    return res.status(400).json({ error: error.message || "Gagal menghapus warga" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { name, email, phone, address, nik } = req.body;

    const updatedUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: userId },
        data: {
          name,
          email,
          noTelepon: phone,
        }
      });

      const warga = await tx.warga.findUnique({ where: { userId } });
      if (warga) {
        await tx.warga.update({
          where: { userId },
          data: {
            kepalaKeluarga: name,
            noTelepon: phone,
            noRumah: address,
            noKK: nik
          }
        });
      }

      return user;
    });

    return res.json({ message: "Profil berhasil diperbarui", data: updatedUser });
  } catch (error: any) {
    console.error("UpdateProfile error:", error);
    return res.status(400).json({ error: "Gagal memperbarui profil" });
  }
};
