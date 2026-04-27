import { Router } from "express";
import { getPeminjaman, createPeminjaman, updateStatusPeminjaman, generateReceipt } from "../controllers/peminjaman.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";

const peminjamanRouter = Router();

peminjamanRouter.use(authenticate); // Require login for all borrowing operations

peminjamanRouter.get("/", getPeminjaman);
peminjamanRouter.post("/", createPeminjaman);
peminjamanRouter.patch("/:id/status", requireAdmin, updateStatusPeminjaman); // Only admin updates status
peminjamanRouter.get("/:id/receipt.pdf", generateReceipt);

export default peminjamanRouter;
