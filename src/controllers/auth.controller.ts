import { Request, Response } from "express";
import { AuthService } from "../service/auth.service";

const authService = new AuthService();

export const login = async (req: Request, res: Response) => {
  try {
    const { noTelepon, password } = req.body;
    const result = await authService.login(noTelepon, password);
    return res.json(result);
  } catch (error: any) {
    console.error("Login error:", error);
    return res.status(401).json({ error: error.message || "Terjadi kesalahan server" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { oldPassword, newPassword } = req.body;
    await authService.changePassword(userId, oldPassword, newPassword);
    
    return res.json({ message: "Password berhasil diubah" });
  } catch (error: any) {
    console.error("Change password error:", error);
    return res.status(400).json({ error: error.message || "Gagal mengubah password" });
  }
};
