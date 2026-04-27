import PDFDocument from "pdfkit";
import { Response } from "express";

export const generateReceiptPdf = (res: Response, id: number, data: any) => {
  const doc = new PDFDocument();
  
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=receipt-${id}.pdf`);
  
  doc.pipe(res);

  doc.fontSize(20).text("E-Receipt Peminjaman Fasilitas RT", { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`ID Peminjaman: BRW-${data.id}`);
  doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString()}`);
  doc.moveDown();
  
  doc.text(`Data Warga:`);
  doc.text(`- Nama / Kepala Keluarga: ${data.warga.kepalaKeluarga}`);
  doc.text(`- No Telepon: ${data.warga.noTelepon || '-'}`);
  doc.moveDown();
  
  doc.text(`Data Fasilitas:`);
  doc.text(`- Barang: ${data.barang.nama}`);
  doc.text(`- Jumlah: ${data.jumlah}`);
  doc.text(`- Tanggal Mulai: ${new Date(data.tanggalMulai).toLocaleDateString('id-ID')}`);
  doc.text(`- Tanggal Selesai: ${new Date(data.tanggalSelesai).toLocaleDateString('id-ID')}`);
  doc.text(`- Tujuan: ${data.tujuan}`);
  doc.moveDown();
  
  doc.text(`Status: ${data.status}`);
  doc.moveDown();
  doc.text("Dokumen ini adalah bukti sah pengambilan barang di gudang RT.", { align: 'center' });
  
  doc.end();
};
