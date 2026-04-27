import { AuthRepository } from "../repositories/auth.repository";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const authRepo = new AuthRepository();

export class AuthService {
  async login(noTelepon: string, password: string) {
    if (!noTelepon || !password) {
      throw new Error("Nomor Telepon dan Password harus diisi");
    }

    const user = await authRepo.findUserByNoTelepon(noTelepon);

    if (!user) {
      throw new Error("Pengguna tidak ditemukan");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Password salah");
    }

    const userData = {
      id: user.id,
      name: user.name,
      noTelepon: user.noTelepon,
      role: user.role,
    };

    const token = jwt.sign(userData, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "1d" });
    return { token, user: userData };
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    if (!oldPassword || !newPassword) {
      throw new Error("Password lama dan baru harus diisi");
    }

    const user = await authRepo.findUserById(userId);
    if (!user) {
      throw new Error("Pengguna tidak ditemukan");
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new Error("Password lama salah");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
    await authRepo.updatePassword(userId, hashedNewPassword);
    
    return true;
  }
}
