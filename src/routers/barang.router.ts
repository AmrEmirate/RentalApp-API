import { Router } from "express";
import { getBarang, createBarang, updateBarang, deleteBarang } from "../controllers/barang.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";

const barangRouter = Router();

// Warga can read, Admin can create/update/delete
barangRouter.get("/", getBarang);
barangRouter.post("/", authenticate, requireAdmin, createBarang);
barangRouter.put("/:id", authenticate, requireAdmin, updateBarang);
barangRouter.delete("/:id", authenticate, requireAdmin, deleteBarang);

export default barangRouter;
