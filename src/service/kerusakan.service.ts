import { KerusakanRepository } from "../repositories/kerusakan.repository";

const kerusakanRepo = new KerusakanRepository();

export class KerusakanService {
  async getAllKerusakan() {
    return await kerusakanRepo.findAll();
  }

  async updateKerusakan(id: number, data: any) {
    return await kerusakanRepo.update(id, {
      nominalDenda: data.nominalDenda !== undefined ? parseFloat(data.nominalDenda) : undefined,
      statusPembayaran: data.statusPembayaran,
      buktiUrl: data.buktiUrl
    });
  }
}
