import { PeminjamanRepository } from "../repositories/peminjaman.repository";
import { BarangRepository } from "../repositories/barang.repository";
import { KerusakanRepository } from "../repositories/kerusakan.repository";
import { sendWaNotification } from "../utils/wa.util";

const peminjamanRepo = new PeminjamanRepository();
const barangRepo = new BarangRepository();
const kerusakanRepo = new KerusakanRepository();

export class PeminjamanService {
  async getAllPeminjaman() {
    return await peminjamanRepo.findAll();
  }

  async getPeminjamanByWarga(wargaId: number) {
    return await peminjamanRepo.findByWargaId(wargaId);
  }

  async createPeminjaman(data: any) {
    const start = new Date(data.tanggalMulai);
    const end = new Date(data.tanggalSelesai);

    const existing = await peminjamanRepo.findOverlapping(parseInt(data.barangId), start, end);
    const barang = await barangRepo.findById(parseInt(data.barangId));
    
    if (!barang) throw new Error("Barang tidak ditemukan");

    const totalBorrowed = existing.reduce((sum, b) => sum + b.jumlah, 0);
    const reqJumlah = parseInt(data.jumlah) || 1;

    if (totalBorrowed + reqJumlah > barang.stok) {
      throw new Error("Stok fasilitas tidak cukup untuk tanggal tersebut. Silakan pilih tanggal lain.");
    }

    const newPeminjaman = await peminjamanRepo.create({
      wargaId: parseInt(data.wargaId),
      barangId: parseInt(data.barangId),
      tanggalMulai: start,
      tanggalSelesai: end,
      tujuan: data.tujuan,
      jumlah: reqJumlah,
      status: "PENDING"
    });

    await sendWaNotification(`Peminjaman baru dibuat: Fasilitas ${barang.nama} oleh Warga ID ${data.wargaId}. Mohon segera diverifikasi.`, "Admin");

    return newPeminjaman;
  }

  async updateStatus(id: number, data: any) {
    const updated = await peminjamanRepo.update(id, {
      status: data.status,
      alasanPenolakan: data.alasanPenolakan,
      kondisiKeluar: data.kondisiKeluar,
      kondisiKembali: data.kondisiKembali
    });

    if (data.status === "SELESAI" && data.kondisiKembali === "RUSAK") {
      await kerusakanRepo.create({
        peminjamanId: updated.id,
        deskripsi: "Barang rusak saat dikembalikan",
        nominalDenda: 0
      });
      await sendWaNotification(`Kepada Yth Warga, terdapat kerusakan pada pengembalian barang. Silakan cek aplikasi untuk invoice ganti rugi.`, updated.wargaId.toString());
    } else if (data.status === "DISETUJUI") {
      await peminjamanRepo.update(id, { buktiUrl: `/peminjaman/${id}/receipt.pdf` });
    }

    return updated;
  }
}
