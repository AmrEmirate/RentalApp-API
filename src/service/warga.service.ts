import { WargaRepository } from "../repositories/warga.repository";
import { Role } from "@prisma/client";
import bcrypt from "bcrypt";

const wargaRepo = new WargaRepository();

export class WargaService {
  async getAllWarga() {
    return await wargaRepo.getAllWarga();
  }

  async createWarga(data: any) {
    const { noKK, kepalaKeluarga, jumlahAnggota, noTelepon, noRumah, statusRumah } = data;

    if (!noKK || !kepalaKeluarga || !noTelepon || !noRumah || !statusRumah) {
      throw new Error("Semua field wajib diisi");
    }

    // Default password is the phone number
    const hashedPassword = await bcrypt.hash(noTelepon, 10);

    const userData = {
      name: kepalaKeluarga,
      noTelepon,
      password: hashedPassword,
      role: Role.WARGA
    };

    const wargaData = {
      noKK,
      kepalaKeluarga,
      jumlahAnggota: parseInt(jumlahAnggota) || 1,
      noTelepon,
      noRumah,
      statusRumah
    };

    return await wargaRepo.createWarga(userData, wargaData);
  }

  async updateWarga(id: number, data: any) {
    return await wargaRepo.updateWarga(id, data);
  }

  async deleteWarga(id: number) {
    return await wargaRepo.deleteWarga(id);
  }
}
