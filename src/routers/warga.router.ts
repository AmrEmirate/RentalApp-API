import { Router } from "express";
import { getAllWarga, create, update, remove, updateProfile } from "../controllers/warga.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";

const wargaRouter = Router();

// Profile update for any authenticated user
wargaRouter.put("/profile/me", authenticate, updateProfile);

// Only RT can view and manage Warga
wargaRouter.get("/", authenticate, requireAdmin, getAllWarga);
wargaRouter.post("/", authenticate, requireAdmin, create);
wargaRouter.put("/:id", authenticate, requireAdmin, update);
wargaRouter.delete("/:id", authenticate, requireAdmin, remove);

export default wargaRouter;
