import { Request, Response } from "express";
import { DashboardService } from "../service/dashboard.service";

const dashboardService = new DashboardService();

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const data = await dashboardService.getStats();
    return res.json({ data });
  } catch (error) {
    console.error("Dashboard Stats error:", error);
    return res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};
