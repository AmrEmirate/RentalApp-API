import { BarangRepository } from "../repositories/barang.repository";

const barangRepo = new BarangRepository();

export class BarangService {
  async getAllBarang() {
    return await barangRepo.findAll();
  }

  async createBarang(data: any) {
    return await barangRepo.create({
      ...data,
      stok: parseInt(data.stok) || 0,
      status: data.status || "TERSEDIA"
    });
  }

  async updateBarang(id: number, data: any) {
    return await barangRepo.update(id, {
      ...data,
      stok: data.stok !== undefined ? parseInt(data.stok) : undefined
    });
  }

  async deleteBarang(id: number) {
    return await barangRepo.delete(id);
  }
}
