import { DashboardRepository } from "../repositories/dashboard.repository";

const dashboardRepo = new DashboardRepository();

export class DashboardService {
  async getStats() {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const activeBorrowings = await dashboardRepo.getActiveBorrowings(firstDayOfMonth);
    const completedBorrowings = await dashboardRepo.getCompletedBorrowings(firstDayOfMonth);
    const popularFacilitiesRaw = await dashboardRepo.getPopularFacilities();
    
    const facilityIds = popularFacilitiesRaw.map((f: any) => f.barangId);
    const facilities = await dashboardRepo.getFacilitiesByIds(facilityIds);

    const popularFacilities = popularFacilitiesRaw.map((p: any) => {
      const facility = facilities.find(f => f.id === p.barangId);
      return {
        namaFasilitas: facility?.nama || "Unknown",
        jumlahPinjam: p._count.barangId
      };
    });

    const totalKerusakan = await dashboardRepo.getTotalKerusakan(firstDayOfMonth);

    return {
      activeBorrowings,
      completedBorrowings,
      popularFacilities,
      totalKerusakan
    };
  }
}
