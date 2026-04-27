import { Request, Response } from "express";
import { PeminjamanService } from "../service/peminjaman.service";
import { generateReceiptPdf } from "../utils/pdf.util";
import prisma from "../config/prisma"; // only for receipt generation if needed, but let's keep it simple

const peminjamanService = new PeminjamanService();

export const getPeminjaman = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    if (user.role === "RT") {
      // RT sees all peminjaman
      const data = await peminjamanService.getAllPeminjaman();
      return res.json({ data });
    } else {
      // WARGA: find their own wargaId first, then filter
      const warga = await prisma.warga.findUnique({ where: { userId: user.id } });
      if (!warga) return res.json({ data: [] }); // No warga profile yet
      const data = await peminjamanService.getPeminjamanByWarga(warga.id);
      return res.json({ data });
    }
  } catch (error) {
    return res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

export const createPeminjaman = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    
    // Resolve wargaId from userId if provided
    if (data.userId) {
      const warga = await prisma.warga.findUnique({ where: { userId: parseInt(data.userId) } });
      if (!warga) {
        return res.status(400).json({ error: "Data warga tidak ditemukan untuk user ini." });
      }
      data.wargaId = warga.id;
    }

    const result = await peminjamanService.createPeminjaman(data);
    return res.status(201).json({ data: result });
  } catch (error: any) {
    return res.status(400).json({ error: error.message || "Terjadi kesalahan" });
  }
};

export const updateStatusPeminjaman = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await peminjamanService.updateStatus(parseInt(id), req.body);
    return res.json({ data });
  } catch (error) {
    return res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

export const generateReceipt = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const peminjaman = await prisma.peminjaman.findUnique({
      where: { id: parseInt(id) },
      include: { warga: true, barang: true }
    });

    if (!peminjaman) return res.status(404).json({ error: "Data peminjaman tidak ditemukan" });

    generateReceiptPdf(res, parseInt(id), peminjaman);
  } catch (error) {
    return res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};
