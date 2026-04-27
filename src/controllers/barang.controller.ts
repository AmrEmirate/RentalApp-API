import { Request, Response } from "express";
import { BarangService } from "../service/barang.service";

const barangService = new BarangService();

export const getBarang = async (req: Request, res: Response) => {
  try {
    const barang = await barangService.getAllBarang();
    return res.json({ data: barang });
  } catch (error) {
    return res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

export const createBarang = async (req: Request, res: Response) => {
  try {
    const newBarang = await barangService.createBarang(req.body);
    return res.status(201).json({ data: newBarang });
  } catch (error) {
    return res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

export const updateBarang = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedBarang = await barangService.updateBarang(parseInt(id), req.body);
    return res.json({ data: updatedBarang });
  } catch (error) {
    return res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

export const deleteBarang = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await barangService.deleteBarang(parseInt(id));
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};
