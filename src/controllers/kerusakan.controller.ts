import { Request, Response } from "express";
import { KerusakanService } from "../service/kerusakan.service";

const kerusakanService = new KerusakanService();

export const getKerusakan = async (req: Request, res: Response) => {
  try {
    const data = await kerusakanService.getAllKerusakan();
    return res.json({ data });
  } catch (error) {
    return res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

export const updateKerusakan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await kerusakanService.updateKerusakan(parseInt(id), req.body);
    return res.json({ data });
  } catch (error) {
    return res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};
